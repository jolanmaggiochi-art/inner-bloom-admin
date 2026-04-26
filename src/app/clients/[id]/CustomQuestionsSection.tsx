'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

type Question = {
  id: string;
  question_type: 'weekly' | 'monthly';
  question_key: string;
  question_label: string;
  question_sublabel: string | null;
  field_type: 'text' | 'textarea' | 'score';
  is_required: boolean;
  is_active: boolean;
  order_index: number;
};

type Props = {
  clientId: string;
};

const DEFAULT_WEEKLY_QUESTIONS = [
  { key: 'feeling', label: 'Comment tu t\'es sentie cette semaine ?', sublabel: 'Énergie, motivation, fatigue...', type: 'textarea' },
  { key: 'sessions_completed', label: 'T\'as réussi à faire toutes les séances ?', sublabel: 'Si non, pourquoi ?', type: 'textarea' },
  { key: 'pain_notes', label: 'Des exercices où t\'as galéré / senti une gêne / douleur ?', type: 'textarea' },
  { key: 'injury_status', label: 'Comment va ta blessure cette semaine ?', sublabel: 'Si applicable', type: 'textarea' },
  { key: 'progressions', label: 'T\'as progressé en charge ou en reps sur quels exos ?', type: 'textarea' },
  { key: 'sleep_score', label: 'Ton sommeil cette semaine', type: 'score' },
  { key: 'nutrition_score', label: 'Ton alimentation cette semaine', type: 'score' },
  { key: 'self_talk', label: 'Comment tu te parles à toi-même cette semaine ?', sublabel: 'Positive ou négative ?', type: 'textarea' },
  { key: 'adjustments_requested', label: 'Quelque chose que tu veux ajuster pour la semaine prochaine ?', type: 'textarea' },
];

const DEFAULT_MONTHLY_QUESTIONS = [
  { key: 'overall_feeling', label: 'Comment tu t\'es sentie ce mois-ci ?', sublabel: 'Physiquement et mentalement', type: 'textarea' },
  { key: 'what_worked', label: 'Ce qui a bien fonctionné', type: 'textarea' },
  { key: 'what_was_hard', label: 'Ce qui a été difficile', type: 'textarea' },
  { key: 'injury_status', label: 'État de ta blessure ce mois', sublabel: 'Si applicable', type: 'textarea' },
  { key: 'best_progressions', label: 'Tes meilleures progressions en charges', sublabel: 'Quels exos, combien de kg gagnés ?', type: 'textarea' },
  { key: 'visual_satisfaction', label: 'Ta satisfaction sur les résultats visuels', type: 'textarea' },
  { key: 'energy_score', label: 'Ton énergie globale ce mois', type: 'score' },
  { key: 'sleep_score', label: 'Ton sommeil ce mois', type: 'score' },
  { key: 'nutrition_score', label: 'Ton alimentation ce mois', type: 'score' },
  { key: 'self_talk_progress', label: 'Comment évolue ton self-talk ?', sublabel: 'Tu te parles mieux qu\'avant ?', type: 'textarea' },
  { key: 'next_month_goal', label: 'Ton objectif pour le mois prochain', type: 'textarea' },
  { key: 'questions_for_coach', label: 'Des questions ou remarques pour moi ?', type: 'textarea' },
];

export function CustomQuestionsSection({ clientId }: Props) {
  const supabase = createClient();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'weekly' | 'monthly'>('weekly');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newQuestion, setNewQuestion] = useState({
    question_key: '',
    question_label: '',
    question_sublabel: '',
    field_type: 'textarea' as 'text' | 'textarea' | 'score',
    is_required: false,
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchQuestions();
  }, [clientId]);

  async function fetchQuestions() {
    const { data, error } = await supabase
      .from('custom_questions')
      .select('*')
      .eq('client_id', clientId)
      .order('order_index');

    if (!error && data) {
      setQuestions(data);
    }
    setIsLoading(false);
  }

  async function handleInitializeDefaults(type: 'weekly' | 'monthly') {
    const defaults = type === 'weekly' ? DEFAULT_WEEKLY_QUESTIONS : DEFAULT_MONTHLY_QUESTIONS;
    
    setIsSaving(true);
    for (let i = 0; i < defaults.length; i++) {
      const q = defaults[i];
      await supabase.from('custom_questions').insert({
        client_id: clientId,
        question_type: type,
        question_key: q.key,
        question_label: q.label,
        question_sublabel: q.sublabel || null,
        field_type: q.type,
        is_required: false,
        is_active: true,
        order_index: i,
      });
    }
    await fetchQuestions();
    setIsSaving(false);
  }

  async function handleToggleActive(question: Question) {
    const { error } = await supabase
      .from('custom_questions')
      .update({ is_active: !question.is_active })
      .eq('id', question.id);

    if (!error) fetchQuestions();
  }

  async function handleDeleteQuestion(id: string) {
    if (!confirm('Supprimer cette question ?')) return;

    const { error } = await supabase
      .from('custom_questions')
      .delete()
      .eq('id', id);

    if (!error) fetchQuestions();
  }

  async function handleDeleteAllQuestions() {
    const label = activeTab === 'weekly' ? 'hebdomadaire' : 'mensuel';
    if (!confirm(`Supprimer TOUTES les questions du bilan ${label} pour ce client ?`)) return;

    setIsSaving(true);
    const ids = filteredQuestions.map((q) => q.id);
    await supabase.from('custom_questions').delete().in('id', ids);
    await fetchQuestions();
    setIsSaving(false);
  }

  async function handleUpdateQuestion(id: string, field: string, value: string) {
    const { error } = await supabase
      .from('custom_questions')
      .update({ [field]: value })
      .eq('id', id);

    if (!error) fetchQuestions();
  }

  async function handleAddQuestion() {
    if (!newQuestion.question_key || !newQuestion.question_label) return;

    setIsSaving(true);
    const filteredQuestions = questions.filter((q) => q.question_type === activeTab);
    
    const { error } = await supabase.from('custom_questions').insert({
      client_id: clientId,
      question_type: activeTab,
      question_key: newQuestion.question_key,
      question_label: newQuestion.question_label,
      question_sublabel: newQuestion.question_sublabel || null,
      field_type: newQuestion.field_type,
      is_required: newQuestion.is_required,
      is_active: true,
      order_index: filteredQuestions.length,
    });

    if (!error) {
      setShowAddForm(false);
      setNewQuestion({
        question_key: '',
        question_label: '',
        question_sublabel: '',
        field_type: 'textarea',
        is_required: false,
      });
      fetchQuestions();
    }
    setIsSaving(false);
  }

  const filteredQuestions = questions.filter((q) => q.question_type === activeTab);
  const hasQuestions = filteredQuestions.length > 0;

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        <p className="text-center text-gray-500">Chargement...</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold text-gray-800">Questions personnalisées</h3>
      </div>

      {/* Tabs */}
      <div className="mb-4 flex gap-2 border-b border-gray-200 pb-2">
        <button
          onClick={() => setActiveTab('weekly')}
          className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
            activeTab === 'weekly'
              ? 'bg-rose-100 text-rose-700'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Bilan Hebdo
        </button>
        <button
          onClick={() => setActiveTab('monthly')}
          className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
            activeTab === 'monthly'
              ? 'bg-rose-100 text-rose-700'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Bilan Mensuel
        </button>
      </div>

      {!hasQuestions ? (
        <div className="rounded-xl border border-dashed border-gray-300 p-6 text-center">
          <p className="mb-3 text-gray-500">
            Aucune question personnalisée pour le bilan {activeTab === 'weekly' ? 'hebdomadaire' : 'mensuel'}.
          </p>
          <div className="flex justify-center gap-2">
            <button
              onClick={() => handleInitializeDefaults(activeTab)}
              disabled={isSaving}
              className="rounded-lg bg-rose-500 px-4 py-2 text-sm font-medium text-white hover:bg-rose-600 disabled:opacity-50"
            >
              {isSaving ? 'Création...' : 'Utiliser les questions par défaut'}
            </button>
            <button
              onClick={() => setShowAddForm(true)}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
            >
              Créer manuellement
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Liste des questions */}
          <div className="mb-4 space-y-2">
            {filteredQuestions.map((question) => (
              <div
                key={question.id}
                className={`rounded-lg border p-3 ${
                  question.is_active ? 'border-gray-200 bg-gray-50' : 'border-gray-100 bg-gray-100 opacity-60'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <input
                      type="text"
                      defaultValue={question.question_label}
                      onBlur={(e) => handleUpdateQuestion(question.id, 'question_label', e.target.value)}
                      className="w-full bg-transparent font-medium text-gray-800 focus:outline-none"
                    />
                    <input
                      type="text"
                      defaultValue={question.question_sublabel || ''}
                      onBlur={(e) => handleUpdateQuestion(question.id, 'question_sublabel', e.target.value)}
                      className="w-full bg-transparent text-sm text-gray-500 focus:outline-none"
                      placeholder="Sous-titre (optionnel)"
                    />
                    <div className="mt-1 flex items-center gap-2 text-xs text-gray-400">
                      <span className="rounded bg-gray-200 px-1.5 py-0.5">{question.field_type}</span>
                      <span className="text-gray-300">|</span>
                      <span>key: {question.question_key}</span>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleToggleActive(question)}
                      className={`rounded px-2 py-1 text-xs ${
                        question.is_active
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-200 text-gray-500'
                      }`}
                    >
                      {question.is_active ? 'Actif' : 'Inactif'}
                    </button>
                    <button
                      onClick={() => handleDeleteQuestion(question.id)}
                      className="rounded px-2 py-1 text-xs text-red-500 hover:bg-red-50"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Boutons ajouter / tout supprimer */}
          {!showAddForm && (
            <div className="flex gap-2">
              <button
                onClick={() => setShowAddForm(true)}
                className="flex-1 rounded-lg border border-dashed border-gray-300 py-2 text-sm text-gray-500 hover:border-gray-400 hover:text-gray-600"
              >
                + Ajouter une question
              </button>
              <button
                onClick={handleDeleteAllQuestions}
                disabled={isSaving}
                className="rounded-lg border border-red-200 px-4 py-2 text-sm text-red-500 hover:bg-red-50 disabled:opacity-50"
              >
                Tout supprimer
              </button>
            </div>
          )}
        </>
      )}

      {/* Formulaire ajout */}
      {showAddForm && (
        <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-4">
          <h4 className="mb-3 font-medium text-gray-800">Nouvelle question</h4>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-medium text-gray-600">Libellé *</label>
              <textarea
                value={newQuestion.question_label}
                onChange={(e) => setNewQuestion({ ...newQuestion, question_label: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                placeholder="Comment tu t'es sentie cette semaine ?"
                rows={2}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">Clé unique *</label>
              <input
                type="text"
                value={newQuestion.question_key}
                onChange={(e) => setNewQuestion({ ...newQuestion, question_key: e.target.value.toLowerCase().replace(/\s/g, '_') })}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                placeholder="custom_feeling"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">Type de champ</label>
              <select
                value={newQuestion.field_type}
                onChange={(e) => setNewQuestion({ ...newQuestion, field_type: e.target.value as 'text' | 'textarea' | 'score' })}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              >
                <option value="textarea">Texte long</option>
                <option value="text">Texte court</option>
                <option value="score">Score (1-10)</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-medium text-gray-600">Sous-titre (optionnel)</label>
              <input
                type="text"
                value={newQuestion.question_sublabel}
                onChange={(e) => setNewQuestion({ ...newQuestion, question_sublabel: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                placeholder="Énergie, motivation, fatigue..."
              />
            </div>
          </div>
          <div className="mt-3 flex gap-2">
            <button
              onClick={handleAddQuestion}
              disabled={isSaving || !newQuestion.question_key || !newQuestion.question_label}
              className="rounded-lg bg-rose-500 px-4 py-2 text-sm font-medium text-white hover:bg-rose-600 disabled:opacity-50"
            >
              {isSaving ? 'Création...' : 'Ajouter'}
            </button>
            <button
              onClick={() => setShowAddForm(false)}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
            >
              Annuler
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
