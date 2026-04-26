'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

type Exercise = {
  id: string;
  name: string;
  sets: string | null;
  reps: string | null;
  tempo: string | null;
  rest: string | null;
  coaching_notes: string | null;
  video_url: string | null;
  order_index: number;
  superset_group: number | null;
  block_label: string | null;
};

type Session = {
  id: string;
  name: string;
  type: string;
  day_of_week: number | null;
  order_index: number;
  duration_minutes: number | null;
  focus: string | null;
  notes: string | null;
  exercises: Exercise[];
};

type Week = {
  id: string;
  week_number: number;
  weekly_notes: string | null;
  cardio_notes: string | null;
  published_at: string | null;
  sessions: Session[];
};

const DAY_OPTIONS = [
  { value: 1, label: 'Lundi' },
  { value: 2, label: 'Mardi' },
  { value: 3, label: 'Mercredi' },
  { value: 4, label: 'Jeudi' },
  { value: 5, label: 'Vendredi' },
  { value: 6, label: 'Samedi' },
  { value: 7, label: 'Dimanche' },
];

const TYPE_OPTIONS = [
  { value: 'muscu', label: 'Musculation' },
  { value: 'cardio', label: 'Cardio' },
  { value: 'recovery', label: 'Récupération' },
  { value: 'other', label: 'Autre' },
];

export default function WeekEditorPage() {
  const router = useRouter();
  const params = useParams();
  const clientId = params.id as string;
  const programId = params.programId as string;
  const weekId = params.weekId as string;

  const [week, setWeek] = useState<Week | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [exerciseLibrary, setExerciseLibrary] = useState<{ id: string; name: string; video_url: string }[]>([]);
  const [clientLogs, setClientLogs] = useState<Record<string, string>>({});
  const [showNewSession, setShowNewSession] = useState(false);
  const [newSession, setNewSession] = useState({
    name: '',
    type: 'muscu',
    day_of_week: 1,
    duration_minutes: 60,
    focus: '',
    notes: '',
  });

  const supabase = createClient();

  useEffect(() => {
    fetchWeek();
    fetchExerciseLibrary();
    fetchClientLogs();
  }, [weekId]);

  async function fetchExerciseLibrary() {
    // Récupérer exercices de la bibliothèque
    const { data: library } = await supabase
      .from('exercise_videos')
      .select('id, name, video_url')
      .order('name');

    // Récupérer aussi les exercices utilisés dans les séances
    const { data: used } = await supabase
      .from('exercises')
      .select('name, video_url')
      .not('video_url', 'is', null);

    const exerciseMap = new Map<string, { id: string; name: string; video_url: string }>();
    
    (library || []).forEach((ex) => {
      exerciseMap.set(ex.name.toLowerCase(), ex);
    });

    (used || []).forEach((ex, i) => {
      const key = ex.name.toLowerCase();
      if (!exerciseMap.has(key) && ex.video_url) {
        exerciseMap.set(key, { id: `used-${i}`, name: ex.name, video_url: ex.video_url });
      }
    });

    setExerciseLibrary(Array.from(exerciseMap.values()).sort((a, b) => a.name.localeCompare(b.name)));
  }

  async function fetchClientLogs() {
    // Récupérer les charges de la cliente pour cet exercice
    const { data } = await supabase
      .from('exercise_logs')
      .select('exercises(name), logged_value, program_weeks(week_number)')
      .eq('user_id', clientId)
      .order('program_weeks(week_number)', { ascending: false });

    if (data) {
      const logsMap: Record<string, string> = {};
      data.forEach((log: any) => {
        const name = log.exercises?.name?.toLowerCase();
        if (name && !logsMap[name]) {
          logsMap[name] = `Sem.${log.program_weeks?.week_number}: ${log.logged_value}`;
        }
      });
      setClientLogs(logsMap);
    }
  }

  async function fetchWeek() {
    const { data, error } = await supabase
      .from('program_weeks')
      .select(`
        *,
        sessions (
          *,
          exercises (*)
        )
      `)
      .eq('id', weekId)
      .single();

    if (error) {
      console.error('Erreur:', error);
      return;
    }

    // Trier les sessions et exercices
    if (data.sessions) {
      data.sessions.sort((a: Session, b: Session) => a.order_index - b.order_index);
      data.sessions.forEach((s: Session) => {
        if (s.exercises) {
          s.exercises.sort((a: Exercise, b: Exercise) => a.order_index - b.order_index);
        }
      });
    }

    setWeek(data);
    setIsLoading(false);
  }

  async function handlePublish() {
    if (!week) return;
    
    setIsSaving(true);
    const { error } = await supabase
      .from('program_weeks')
      .update({ published_at: new Date().toISOString() })
      .eq('id', weekId);

    if (error) {
      alert('Erreur lors de la publication');
    } else {
      fetchWeek();
    }
    setIsSaving(false);
  }

  async function handleUnpublish() {
    if (!week) return;
    
    setIsSaving(true);
    const { error } = await supabase
      .from('program_weeks')
      .update({ published_at: null })
      .eq('id', weekId);

    if (error) {
      alert('Erreur lors de la dépublication');
    } else {
      fetchWeek();
    }
    setIsSaving(false);
  }

  async function handleSaveWeekNotes(notes: string) {
    const { error } = await supabase
      .from('program_weeks')
      .update({ weekly_notes: notes || null })
      .eq('id', weekId);

    if (!error) fetchWeek();
  }

  async function handleCreateSession() {
    if (!newSession.name) return;

    setIsSaving(true);
    const orderIndex = week?.sessions?.length || 0;

    const { error } = await supabase.from('sessions').insert({
      week_id: weekId,
      name: newSession.name,
      type: newSession.type,
      day_of_week: newSession.day_of_week,
      duration_minutes: newSession.duration_minutes,
      focus: newSession.focus || null,
      notes: newSession.notes || null,
      order_index: orderIndex,
    });

    if (error) {
      alert('Erreur: ' + error.message);
    } else {
      setShowNewSession(false);
      setNewSession({
        name: '',
        type: 'muscu',
        day_of_week: 1,
        duration_minutes: 60,
        focus: '',
        notes: '',
      });
      fetchWeek();
    }
    setIsSaving(false);
  }

  async function handleDeleteSession(sessionId: string) {
    if (!confirm('Supprimer cette séance et tous ses exercices ?')) return;

    const { error } = await supabase.from('sessions').delete().eq('id', sessionId);
    if (!error) fetchWeek();
  }

  async function handleAddExercise(sessionId: string) {
    const session = week?.sessions.find((s) => s.id === sessionId);
    const orderIndex = session?.exercises?.length || 0;

    const { error } = await supabase.from('exercises').insert({
      session_id: sessionId,
      name: 'Nouvel exercice',
      order_index: orderIndex,
    });

    if (!error) fetchWeek();
  }

  async function handleUpdateExercise(exerciseId: string, updates: Partial<Exercise>) {
    const { error } = await supabase
      .from('exercises')
      .update(updates)
      .eq('id', exerciseId);

    if (!error) fetchWeek();
  }

  async function handleBatchUpdateExercises(updates: { id: string; data: Partial<Exercise> }[]) {
    await Promise.all(
      updates.map(({ id, data }) =>
        supabase.from('exercises').update(data).eq('id', id)
      )
    );
    fetchWeek();
  }

  async function handleDeleteExercise(exerciseId: string) {
    if (!confirm('Supprimer cet exercice ?')) return;

    const { error } = await supabase.from('exercises').delete().eq('id', exerciseId);
    if (!error) fetchWeek();
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-gray-500">Chargement...</p>
      </div>
    );
  }

  if (!week) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-gray-500">Semaine introuvable</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Link
              href={`/clients/${clientId}`}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200"
            >
              ←
            </Link>
            <div>
              <h1 className="text-xl font-semibold text-gray-800">
                Semaine {week.week_number}
              </h1>
              <p className="text-sm text-gray-500">
                {week.published_at ? (
                  <span className="text-green-600">
                    Publiée le {new Date(week.published_at).toLocaleDateString('fr-FR')}
                  </span>
                ) : (
                  <span className="text-amber-600">Brouillon</span>
                )}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            {week.published_at ? (
              <button
                onClick={handleUnpublish}
                disabled={isSaving}
                className="rounded-lg bg-amber-100 px-4 py-2 text-sm font-medium text-amber-700 hover:bg-amber-200"
              >
                Dépublier
              </button>
            ) : (
              <button
                onClick={handlePublish}
                disabled={isSaving}
                className="rounded-lg bg-green-500 px-4 py-2 text-sm font-medium text-white hover:bg-green-600"
              >
                Publier
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-8">
        {/* Notes de la semaine */}
        <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-4">
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Notes de la semaine
          </label>
          <textarea
            defaultValue={week.weekly_notes || ''}
            onBlur={(e) => handleSaveWeekNotes(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-100"
            placeholder="Consignes générales, échauffement, objectifs..."
            rows={2}
          />
        </div>

        {/* Séances */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800">
            Séances ({week.sessions?.length || 0})
          </h2>
          <button
            onClick={() => setShowNewSession(true)}
            className="rounded-lg bg-rose-500 px-4 py-2 text-sm font-medium text-white hover:bg-rose-600"
          >
            + Ajouter une séance
          </button>
        </div>

        {/* Formulaire nouvelle séance */}
        {showNewSession && (
          <div className="mb-6 rounded-2xl border border-rose-200 bg-rose-50 p-4">
            <h3 className="mb-4 font-medium text-gray-800">Nouvelle séance</h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">Nom *</label>
                <input
                  type="text"
                  value={newSession.name}
                  onChange={(e) => setNewSession({ ...newSession, name: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  placeholder="Ex: Haut du corps"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">Type</label>
                <select
                  value={newSession.type}
                  onChange={(e) => setNewSession({ ...newSession, type: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                >
                  {TYPE_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">Jour</label>
                <select
                  value={newSession.day_of_week}
                  onChange={(e) => setNewSession({ ...newSession, day_of_week: parseInt(e.target.value) })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                >
                  {DAY_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">Durée (min)</label>
                <input
                  type="number"
                  value={newSession.duration_minutes}
                  onChange={(e) => setNewSession({ ...newSession, duration_minutes: parseInt(e.target.value) })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">Focus</label>
                <input
                  type="text"
                  value={newSession.focus}
                  onChange={(e) => setNewSession({ ...newSession, focus: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  placeholder="Ex: Fessiers & Ischios"
                />
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <button
                onClick={handleCreateSession}
                disabled={isSaving || !newSession.name}
                className="rounded-lg bg-rose-500 px-4 py-2 text-sm font-medium text-white hover:bg-rose-600 disabled:opacity-50"
              >
                Créer
              </button>
              <button
                onClick={() => setShowNewSession(false)}
                className="rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-300"
              >
                Annuler
              </button>
            </div>
          </div>
        )}

        {/* Liste des séances */}
        <div className="space-y-4">
          {week.sessions?.map((session) => (
            <SessionCard
              key={session.id}
              session={session}
              exerciseLibrary={exerciseLibrary}
              clientLogs={clientLogs}
              onDelete={() => handleDeleteSession(session.id)}
              onAddExercise={() => handleAddExercise(session.id)}
              onUpdateExercise={handleUpdateExercise}
              onDeleteExercise={handleDeleteExercise}
              onBatchUpdateExercises={handleBatchUpdateExercises}
            />
          ))}

          {(!week.sessions || week.sessions.length === 0) && !showNewSession && (
            <div className="rounded-2xl border border-dashed border-gray-300 p-8 text-center">
              <p className="text-gray-500">Aucune séance</p>
              <button
                onClick={() => setShowNewSession(true)}
                className="mt-2 text-sm text-rose-600 hover:text-rose-700"
              >
                Ajouter la première séance →
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function SessionCard({
  session,
  exerciseLibrary,
  clientLogs,
  onDelete,
  onAddExercise,
  onUpdateExercise,
  onDeleteExercise,
  onBatchUpdateExercises,
}: {
  session: Session;
  exerciseLibrary: { id: string; name: string; video_url: string }[];
  clientLogs: Record<string, string>;
  onDelete: () => void;
  onAddExercise: () => void;
  onUpdateExercise: (id: string, updates: Partial<Exercise>) => void;
  onDeleteExercise: (id: string) => void;
  onBatchUpdateExercises: (updates: { id: string; data: Partial<Exercise> }[]) => void;
}) {
  const [isExpanded, setIsExpanded] = useState(true);
  const dayLabel = DAY_OPTIONS.find((d) => d.value === session.day_of_week)?.label || '';
  const typeLabel = TYPE_OPTIONS.find((t) => t.value === session.type)?.label || session.type;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 p-4">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex flex-1 items-center gap-3 text-left"
        >
          <span className="text-gray-400">{isExpanded ? '▼' : '▶'}</span>
          <div>
            <h3 className="font-semibold text-gray-800">{session.name}</h3>
            <p className="text-sm text-gray-500">
              {dayLabel} · {typeLabel}
              {session.focus && ` · ${session.focus}`}
              {session.duration_minutes && ` · ${session.duration_minutes}min`}
            </p>
          </div>
        </button>
        <div className="flex gap-2">
          <button
            onClick={onAddExercise}
            className="rounded-lg bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-200"
          >
            + Exercice
          </button>
          <button
            onClick={onDelete}
            className="rounded-lg bg-red-50 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-100"
          >
            Supprimer
          </button>
        </div>
      </div>

      {/* Exercices */}
      {isExpanded && (
        <div className="p-4">
          {session.exercises?.length === 0 && (
            <p className="py-4 text-center text-sm text-gray-400">
              Aucun exercice
            </p>
          )}

          <div className="space-y-3">
            {renderExercisesWithSupersets(
              session.exercises || [],
              exerciseLibrary,
              clientLogs,
              onUpdateExercise,
              onDeleteExercise,
              onBatchUpdateExercises
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function getGroupLabel(count: number): string {
  if (count === 2) return 'Superset';
  if (count === 3) return 'Triset';
  if (count >= 4) return `Giant set (${count})`;
  return 'Groupe';
}

const BLOCK_LABELS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

function SupersetBlock({
  groupNumber,
  groupExercises,
  blockLabel,
  exerciseLibrary,
  clientLogs,
  globalIndex,
  onUpdateExercise,
  onDeleteExercise,
  onBatchUpdateExercises,
  nextExerciseAfterGroup,
}: {
  groupNumber: number;
  groupExercises: Exercise[];
  blockLabel: string | null | undefined;
  exerciseLibrary: { id: string; name: string; video_url: string }[];
  clientLogs: Record<string, string>;
  globalIndex: number;
  onUpdateExercise: (id: string, updates: Partial<Exercise>) => void;
  onDeleteExercise: (id: string) => void;
  onBatchUpdateExercises: (updates: { id: string; data: Partial<Exercise> }[]) => void;
  nextExerciseAfterGroup: Exercise | undefined;
}) {
  const [showLabelPicker, setShowLabelPicker] = useState(false);
  const canAddToGroup = nextExerciseAfterGroup && nextExerciseAfterGroup.superset_group === null;

  function handleSetBlockLabel(label: string | null) {
    onBatchUpdateExercises(
      groupExercises.map((ex) => ({ id: ex.id, data: { block_label: label } }))
    );
    setShowLabelPicker(false);
  }

  return (
    <div className="rounded-xl border-2 border-purple-200 bg-purple-50 p-3">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative">
            <button
              onClick={() => setShowLabelPicker(!showLabelPicker)}
              className={`flex h-7 w-7 items-center justify-center rounded text-xs font-bold transition-colors ${
                blockLabel
                  ? 'bg-purple-600 text-white hover:bg-purple-700'
                  : 'border-2 border-dashed border-purple-300 text-purple-400 hover:border-purple-500 hover:text-purple-600'
              }`}
            >
              {blockLabel || '+'}
            </button>
            {showLabelPicker && (
              <div className="absolute left-0 top-full z-20 mt-1 flex gap-1 rounded-lg border bg-white p-2 shadow-lg">
                {BLOCK_LABELS.map((label) => (
                  <button
                    key={label}
                    onClick={() => handleSetBlockLabel(label)}
                    className={`flex h-7 w-7 items-center justify-center rounded text-xs font-bold ${
                      blockLabel === label
                        ? 'bg-purple-600 text-white'
                        : 'bg-purple-100 text-purple-600 hover:bg-purple-200'
                    }`}
                  >
                    {label}
                  </button>
                ))}
                {blockLabel && (
                  <button
                    onClick={() => handleSetBlockLabel(null)}
                    className="flex h-7 items-center justify-center rounded bg-gray-100 px-2 text-xs text-gray-500 hover:bg-gray-200"
                  >
                    ✕
                  </button>
                )}
              </div>
            )}
          </div>
          <span className="text-xs font-semibold uppercase text-purple-600">
            {blockLabel ? `Bloc ${blockLabel} — ` : ''}{getGroupLabel(groupExercises.length)}
          </span>
          <span className="text-[10px] text-purple-400">
            (enchaîne sans repos)
          </span>
        </div>
        <button
          onClick={() => {
            onBatchUpdateExercises(
              groupExercises.map((ex) => ({ id: ex.id, data: { superset_group: null, block_label: null } }))
            );
          }}
          className="text-xs text-purple-500 hover:text-purple-700"
        >
          Dissoudre
        </button>
      </div>
      <div className="space-y-2">
        {groupExercises.map((ex, idx) => {
          const isLast = idx === groupExercises.length - 1;
          return (
            <div key={ex.id} className="relative">
              <div className="flex items-start gap-1">
                <div className="flex-1">
                  <ExerciseRow
                    exercise={ex}
                    index={globalIndex + idx}
                    exerciseLibrary={exerciseLibrary}
                    clientLogs={clientLogs}
                    onUpdate={(updates) => onUpdateExercise(ex.id, updates)}
                    onDelete={() => onDeleteExercise(ex.id)}
                    inSuperset
                    supersetPosition={isLast ? 'last' : 'middle'}
                  />
                </div>
                {groupExercises.length > 2 && (
                  <button
                    onClick={() => {
                      onBatchUpdateExercises([
                        { id: ex.id, data: { superset_group: null, block_label: null } },
                      ]);
                    }}
                    className="mt-2 shrink-0 rounded bg-purple-100 px-1.5 py-1 text-[10px] text-purple-500 hover:bg-purple-200 hover:text-purple-700"
                    title="Retirer du groupe"
                  >
                    ↗
                  </button>
                )}
              </div>
              {!isLast && (
                <div className="my-1 flex items-center justify-center">
                  <span className="rounded bg-purple-200 px-2 py-0.5 text-[10px] font-semibold text-purple-700">
                    DIRECT →
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
      {canAddToGroup && (
        <button
          onClick={() => {
            onBatchUpdateExercises([
              { id: nextExerciseAfterGroup.id, data: { superset_group: groupNumber } },
            ]);
          }}
          className="mt-2 w-full rounded-lg border border-dashed border-purple-300 py-1 text-xs text-purple-500 hover:bg-purple-100"
        >
          + Ajouter au {getGroupLabel(groupExercises.length).toLowerCase()}
        </button>
      )}
    </div>
  );
}

function renderExercisesWithSupersets(
  exercises: Exercise[],
  exerciseLibrary: { id: string; name: string; video_url: string }[],
  clientLogs: Record<string, string>,
  onUpdateExercise: (id: string, updates: Partial<Exercise>) => void,
  onDeleteExercise: (id: string) => void,
  onBatchUpdateExercises: (updates: { id: string; data: Partial<Exercise> }[]) => void
) {
  const result: React.ReactNode[] = [];
  let i = 0;
  let globalIndex = 0;

  while (i < exercises.length) {
    const exercise = exercises[i];
    
    if (exercise.superset_group !== null) {
      const groupNumber = exercise.superset_group;
      const groupExercises: Exercise[] = [];
      
      while (i < exercises.length && exercises[i].superset_group === groupNumber) {
        groupExercises.push(exercises[i]);
        i++;
      }

      const nextExerciseAfterGroup = exercises[i];
      const canAddToGroup = nextExerciseAfterGroup && nextExerciseAfterGroup.superset_group === null;
      const blockLabel = groupExercises[0]?.block_label;

      result.push(
        <SupersetBlock
          key={`superset-${groupNumber}`}
          groupNumber={groupNumber}
          groupExercises={groupExercises}
          blockLabel={blockLabel}
          exerciseLibrary={exerciseLibrary}
          clientLogs={clientLogs}
          globalIndex={globalIndex}
          onUpdateExercise={onUpdateExercise}
          onDeleteExercise={onDeleteExercise}
          onBatchUpdateExercises={onBatchUpdateExercises}
          nextExerciseAfterGroup={nextExerciseAfterGroup}
        />
      );
      globalIndex += groupExercises.length;
    } else {
      const nextExercise = exercises[i + 1];
      const canCreateSuperset = nextExercise && nextExercise.superset_group === null;
      
      result.push(
        <div key={exercise.id} className="relative">
          <ExerciseRow
            exercise={exercise}
            index={globalIndex}
            exerciseLibrary={exerciseLibrary}
            clientLogs={clientLogs}
            onUpdate={(updates) => onUpdateExercise(exercise.id, updates)}
            onDelete={() => onDeleteExercise(exercise.id)}
          />
          {canCreateSuperset && (
            <button
              onClick={() => {
                const newGroup = Date.now();
                onBatchUpdateExercises([
                  { id: exercise.id, data: { superset_group: newGroup } },
                  { id: nextExercise.id, data: { superset_group: newGroup } },
                ]);
              }}
              className="absolute -bottom-2 left-1/2 z-10 -translate-x-1/2 rounded-full bg-purple-100 px-2 py-0.5 text-[10px] font-medium text-purple-600 hover:bg-purple-200"
            >
              + Créer superset ↓
            </button>
          )}
        </div>
      );
      globalIndex++;
      i++;
    }
  }

  return result;
}

function ExerciseRow({
  exercise,
  index,
  exerciseLibrary,
  clientLogs,
  onUpdate,
  onDelete,
  inSuperset = false,
  supersetPosition,
}: {
  exercise: Exercise;
  index: number;
  exerciseLibrary: { id: string; name: string; video_url: string }[];
  clientLogs: Record<string, string>;
  onUpdate: (updates: Partial<Exercise>) => void;
  onDelete: () => void;
  inSuperset?: boolean;
  supersetPosition?: 'middle' | 'last';
}) {
  const [showLibrary, setShowLibrary] = useState(false);
  const [localName, setLocalName] = useState(exercise.name);
  const [showBlockInput, setShowBlockInput] = useState(false);
  
  const clientLog = clientLogs[exercise.name.toLowerCase()];
  
  const filteredLibrary = exerciseLibrary.filter((ex) =>
    ex.name.toLowerCase().includes(localName.toLowerCase())
  );

  function selectFromLibrary(libExercise: { name: string; video_url: string }) {
    setLocalName(libExercise.name);
    onUpdate({ name: libExercise.name, video_url: libExercise.video_url });
    setShowLibrary(false);
  }

  function handleNameBlur() {
    setShowLibrary(false);
    if (localName !== exercise.name) {
      onUpdate({ name: localName });
    }
  }

  return (
    <div className={`rounded-xl border p-3 ${inSuperset ? 'border-purple-100 bg-white' : 'border-gray-100 bg-gray-50'}`}>
      <div className="mb-2 flex items-center gap-2">
        <span className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold ${inSuperset ? 'bg-purple-100 text-purple-600' : 'bg-rose-100 text-rose-600'}`}>
          {index + 1}
        </span>
        <div className="relative flex-1">
          <input
            type="text"
            value={localName}
            onChange={(e) => {
              setLocalName(e.target.value);
              setShowLibrary(true);
            }}
            onFocus={() => setShowLibrary(true)}
            onBlur={handleNameBlur}
            className="w-full rounded border border-transparent bg-transparent px-2 py-1 font-medium text-gray-800 hover:border-gray-300 focus:border-rose-400 focus:outline-none"
            placeholder="Nom de l'exercice"
          />
          {showLibrary && filteredLibrary.length > 0 && localName.length > 0 && (
            <div className="absolute left-0 top-full z-10 mt-1 max-h-48 w-full overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg">
              {filteredLibrary.slice(0, 10).map((ex) => (
                <button
                  key={ex.id}
                  onMouseDown={() => selectFromLibrary(ex)}
                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-gray-50"
                >
                  <span className="font-medium text-gray-800">{ex.name}</span>
                  {ex.video_url && <span className="text-xs text-red-500">▶</span>}
                </button>
              ))}
            </div>
          )}
        </div>
        {clientLog && (
          <span className="rounded bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
            {clientLog}
          </span>
        )}
        <button
          onClick={onDelete}
          className="text-sm text-red-500 hover:text-red-600"
        >
          ✕
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
        <div>
          <label className="mb-0.5 block text-xs text-gray-400">Séries</label>
          <input
            type="text"
            defaultValue={exercise.sets || ''}
            onBlur={(e) => onUpdate({ sets: e.target.value || null })}
            className="w-full rounded border border-gray-200 px-2 py-1 text-sm"
            placeholder="4"
          />
        </div>
        <div>
          <label className="mb-0.5 block text-xs text-gray-400">Reps</label>
          <input
            type="text"
            defaultValue={exercise.reps || ''}
            onBlur={(e) => onUpdate({ reps: e.target.value || null })}
            className="w-full rounded border border-gray-200 px-2 py-1 text-sm"
            placeholder="10-12"
          />
        </div>
        <div>
          <label className="mb-0.5 block text-xs text-gray-400">Tempo</label>
          <input
            type="text"
            defaultValue={exercise.tempo || ''}
            onBlur={(e) => onUpdate({ tempo: e.target.value || null })}
            className="w-full rounded border border-gray-200 px-2 py-1 text-sm"
            placeholder="2-0-2"
          />
        </div>
        <div>
          <label className="mb-0.5 block text-xs text-gray-400">Repos</label>
          {inSuperset && supersetPosition === 'middle' ? (
            <div className="flex h-[30px] items-center rounded border border-purple-200 bg-purple-50 px-2 text-xs font-semibold text-purple-600">
              DIRECT →
            </div>
          ) : (
            <input
              type="text"
              defaultValue={exercise.rest || ''}
              onBlur={(e) => onUpdate({ rest: e.target.value || null })}
              className="w-full rounded border border-gray-200 px-2 py-1 text-sm"
              placeholder={inSuperset ? "75s (repos final)" : "90s"}
            />
          )}
        </div>
        <div>
          <label className="mb-0.5 block text-xs text-gray-400">Vidéo</label>
          <input
            type="url"
            defaultValue={exercise.video_url || ''}
            onBlur={(e) => onUpdate({ video_url: e.target.value || null })}
            className="w-full rounded border border-gray-200 px-2 py-1 text-sm"
            placeholder="URL YouTube"
          />
        </div>
      </div>

      <div className="mt-2">
        <label className="mb-0.5 block text-xs text-gray-400">Notes coaching</label>
        <textarea
          defaultValue={exercise.coaching_notes || ''}
          onBlur={(e) => onUpdate({ coaching_notes: e.target.value || null })}
          className="w-full rounded border border-gray-200 px-2 py-1 text-sm"
          placeholder="Conseils d'exécution...&#10;Les sauts de ligne seront conservés dans l'app."
          rows={2}
        />
      </div>
    </div>
  );
}
