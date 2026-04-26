'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

type Exercise = {
  id: string;
  name: string;
  sets: string | null;
  reps: string | null;
  tempo: string | null;
  rest: string | null;
  order_index: number;
};

type Session = {
  id: string;
  name: string;
  type: string;
  day_of_week: number | null;
  order_index: number;
  exercises: Exercise[];
};

type Week = {
  id: string;
  week_number: number;
  published_at: string | null;
  weekly_notes: string | null;
  sessions: Session[];
};

type Program = {
  id: string;
  name: string;
  status: string;
  start_date: string | null;
  welcome_message: string | null;
  program_weeks: Week[];
};

type Props = {
  clientId: string;
  programs: Program[];
};

const DAY_NAMES = ['', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

export function ProgramSection({ clientId, programs }: Props) {
  const router = useRouter();
  const supabase = createClient();
  const [selectedProgramId, setSelectedProgramId] = useState<string | null>(
    programs.find((p) => p.status === 'active')?.id || programs[0]?.id || null
  );
  const [selectedWeekId, setSelectedWeekId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showWelcomeEditor, setShowWelcomeEditor] = useState(false);
  const [welcomeMessage, setWelcomeMessage] = useState('');
  const [isSavingWelcome, setIsSavingWelcome] = useState(false);

  const selectedProgram = programs.find((p) => p.id === selectedProgramId);
  const weeks = selectedProgram?.program_weeks?.sort((a, b) => a.week_number - b.week_number) || [];
  const selectedWeek = weeks.find((w) => w.id === selectedWeekId) || weeks[weeks.length - 1];

  async function handleSaveWelcomeMessage() {
    if (!selectedProgramId) return;
    setIsSavingWelcome(true);
    const { error } = await supabase
      .from('programs')
      .update({ welcome_message: welcomeMessage || null })
      .eq('id', selectedProgramId);
    if (error) alert('Erreur: ' + error.message);
    else {
      setShowWelcomeEditor(false);
      router.refresh();
    }
    setIsSavingWelcome(false);
  }

  async function handleDeleteProgram(programId: string) {
    if (!confirm('Supprimer ce programme et toutes ses semaines/séances ?')) return;
    setIsDeleting(true);
    const { error } = await supabase.from('programs').delete().eq('id', programId);
    if (error) alert('Erreur: ' + error.message);
    else router.refresh();
    setIsDeleting(false);
  }

  async function handleDeleteWeek(weekId: string) {
    if (!confirm('Supprimer cette semaine et toutes ses séances ?')) return;
    setIsDeleting(true);
    const { error } = await supabase.from('program_weeks').delete().eq('id', weekId);
    if (error) alert('Erreur: ' + error.message);
    else {
      setSelectedWeekId(null);
      router.refresh();
    }
    setIsDeleting(false);
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold text-gray-800">Programme</h3>
        <Link
          href={`/clients/${clientId}/program/new`}
          className="rounded-lg bg-rose-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-rose-600"
        >
          + Nouveau programme
        </Link>
      </div>

      {programs.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center">
          <p className="mb-2 text-gray-500">Aucun programme</p>
          <Link
            href={`/clients/${clientId}/program/new`}
            className="text-sm text-rose-600 hover:text-rose-700"
          >
            Créer le premier programme →
          </Link>
        </div>
      ) : (
        <>
          {/* Sélecteur de programme */}
          {programs.length >= 1 && (
            <div className="mb-4 flex gap-2">
              <select
                value={selectedProgramId || ''}
                onChange={(e) => {
                  setSelectedProgramId(e.target.value);
                  setSelectedWeekId(null);
                }}
                className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm"
              >
                {programs.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} {p.status === 'active' ? '(actif)' : ''}
                  </option>
                ))}
              </select>
              <button
                onClick={() => selectedProgramId && handleDeleteProgram(selectedProgramId)}
                disabled={isDeleting}
                className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-100 disabled:opacity-50"
              >
                Supprimer
              </button>
            </div>
          )}

          {/* Message de bienvenue */}
          {selectedProgram && (
            <div className="mb-4 rounded-xl border border-gray-200 bg-gray-50 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg">👋</span>
                  <h4 className="font-medium text-gray-700">Message de bienvenue</h4>
                </div>
                <button
                  onClick={() => {
                    setWelcomeMessage(selectedProgram.welcome_message || '');
                    setShowWelcomeEditor(!showWelcomeEditor);
                  }}
                  className="text-sm text-rose-600 hover:text-rose-700"
                >
                  {showWelcomeEditor ? 'Annuler' : selectedProgram.welcome_message ? 'Modifier' : 'Ajouter'}
                </button>
              </div>
              
              {showWelcomeEditor ? (
                <div className="mt-3">
                  <textarea
                    value={welcomeMessage}
                    onChange={(e) => setWelcomeMessage(e.target.value)}
                    rows={6}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-100"
                    placeholder="Bienvenue dans ton accompagnement !&#10;&#10;Ton programme est construit sur mesure...&#10;&#10;TON PROFIL :&#10;- Taille : ...&#10;- Objectif : ..."
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Les sauts de ligne seront conservés dans l'app.
                  </p>
                  <button
                    onClick={handleSaveWelcomeMessage}
                    disabled={isSavingWelcome}
                    className="mt-2 rounded-lg bg-rose-500 px-4 py-2 text-sm font-medium text-white hover:bg-rose-600 disabled:opacity-50"
                  >
                    {isSavingWelcome ? 'Enregistrement...' : 'Enregistrer'}
                  </button>
                </div>
              ) : selectedProgram.welcome_message ? (
                <p className="mt-2 whitespace-pre-wrap text-sm text-gray-600">
                  {selectedProgram.welcome_message.length > 150
                    ? selectedProgram.welcome_message.slice(0, 150) + '...'
                    : selectedProgram.welcome_message}
                </p>
              ) : (
                <p className="mt-2 text-sm italic text-gray-400">
                  Aucun message de bienvenue configuré
                </p>
              )}
            </div>
          )}

          {/* Navigation semaines */}
          <div className="mb-4 flex gap-2 overflow-x-auto pb-2">
            {weeks.map((week) => (
              <button
                key={week.id}
                onClick={() => setSelectedWeekId(week.id)}
                className={`flex-shrink-0 rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                  selectedWeek?.id === week.id
                    ? 'bg-rose-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Sem. {week.week_number}
                {!week.published_at && (
                  <span className="ml-1 text-xs opacity-60">●</span>
                )}
              </button>
            ))}
            <Link
              href={`/clients/${clientId}/program/${selectedProgramId}/week/new`}
              className="flex-shrink-0 rounded-lg border border-dashed border-gray-300 px-3 py-1.5 text-sm text-gray-500 hover:border-gray-400 hover:text-gray-600"
            >
              + Semaine
            </Link>
          </div>

          {/* Message si pas de semaines */}
          {weeks.length === 0 && (
            <div className="rounded-xl border border-dashed border-gray-300 p-6 text-center">
              <p className="mb-2 text-gray-500">Ce programme n'a pas encore de semaines</p>
              <Link
                href={`/clients/${clientId}/program/${selectedProgramId}/week/new`}
                className="text-sm font-medium text-rose-600 hover:text-rose-700"
              >
                Créer la première semaine →
              </Link>
            </div>
          )}

          {/* Détail semaine */}
          {selectedWeek && (
            <div>
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-800">
                    Semaine {selectedWeek.week_number}
                  </h4>
                  {selectedWeek.published_at ? (
                    <p className="text-xs text-green-600">
                      Publiée le{' '}
                      {new Date(selectedWeek.published_at).toLocaleDateString('fr-FR')}
                    </p>
                  ) : (
                    <p className="text-xs text-amber-600">Brouillon</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Link
                    href={`/clients/${clientId}/program/${selectedProgramId}/week/${selectedWeek.id}`}
                    className="rounded-lg bg-rose-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-rose-600"
                  >
                    Modifier
                  </Link>
                  <button
                    onClick={() => handleDeleteWeek(selectedWeek.id)}
                    disabled={isDeleting}
                    className="rounded-lg bg-red-50 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-100 disabled:opacity-50"
                  >
                    Supprimer
                  </button>
                </div>
              </div>

              {selectedWeek.weekly_notes && (
                <div className="mb-4 rounded-lg bg-amber-50 p-3 text-sm text-amber-800">
                  {selectedWeek.weekly_notes}
                </div>
              )}

              {/* Séances */}
              <div className="space-y-3">
                {selectedWeek.sessions
                  ?.sort((a, b) => a.order_index - b.order_index)
                  .map((session) => (
                    <div
                      key={session.id}
                      className="rounded-xl border border-gray-100 bg-gray-50 p-4"
                    >
                      <div className="mb-2 flex items-center justify-between">
                        <div>
                          <h5 className="font-medium text-gray-800">{session.name}</h5>
                          <p className="text-xs text-gray-500">
                            {session.day_of_week
                              ? DAY_NAMES[session.day_of_week]
                              : `Séance ${session.order_index + 1}`}{' '}
                            · {session.type}
                          </p>
                        </div>
                        <span className="rounded-full bg-gray-200 px-2 py-0.5 text-xs text-gray-600">
                          {session.exercises?.length || 0} exos
                        </span>
                      </div>

                      {session.exercises?.length > 0 && (
                        <div className="mt-2 space-y-1">
                          {session.exercises
                            .sort((a, b) => a.order_index - b.order_index)
                            .slice(0, 3)
                            .map((ex) => (
                              <p key={ex.id} className="text-xs text-gray-600">
                                • {ex.name}{' '}
                                <span className="text-gray-400">
                                  {ex.sets && `${ex.sets}x`}
                                  {ex.reps}
                                </span>
                              </p>
                            ))}
                          {session.exercises.length > 3 && (
                            <p className="text-xs text-gray-400">
                              +{session.exercises.length - 3} autres
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  ))}

                {(!selectedWeek.sessions || selectedWeek.sessions.length === 0) && (
                  <p className="text-center text-sm text-gray-500">
                    Aucune séance pour cette semaine
                  </p>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
