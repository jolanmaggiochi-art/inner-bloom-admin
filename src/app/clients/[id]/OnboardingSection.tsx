'use client';

import { useState } from 'react';

type Props = {
  onboarding: any;
};

const FIELD_LABELS: Record<string, string> = {
  age: 'Âge',
  height: 'Taille',
  weight: 'Poids',
  measurements: 'Mensurations',
  fitness_level: 'Niveau sportif',
  experience: 'Expérience',
  frequency: 'Fréquence actuelle',
  location: 'Lieu d\'entraînement',
  equipment: 'Matériel disponible',
  pain: 'Douleurs actuelles',
  injuries: 'Blessures passées',
  surgeries: 'Opérations',
  strengths: 'Points forts',
  weaknesses: 'Points faibles',
  target_zones: 'Zones à développer',
  main_goal: 'Objectif principal',
  secondary_goal: 'Objectif secondaire',
  goal_weight: 'Objectif poids',
  performance_goal: 'Objectif performance',
  sessions_wanted: 'Séances voulues/semaine',
  sessions_realistic: 'Séances réalistes',
  session_duration: 'Durée idéale',
  favorite_exercises: 'Exercices préférés',
  hated_exercises: 'Exercices détestés',
  meals_per_day: 'Repas/jour',
  has_breakfast: 'Petit-déjeuner',
  typical_day: 'Journée type',
  supplements: 'Compléments',
  water_intake: 'Eau/jour',
  intolerances: 'Intolérances',
  nutrition_problem: 'Problème alimentation',
  coaching_expectations: 'Attentes coaching',
  previous_coaching: 'Coaching précédent',
  motivation_level: 'Motivation (1-10)',
  quit_reasons: 'Ce qui pourrait faire abandonner',
  remarks: 'Remarques',
};

export function OnboardingSection({ onboarding }: Props) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!onboarding) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        <h3 className="mb-4 font-semibold text-gray-800">Questionnaire d'onboarding</h3>
        <p className="text-sm text-gray-500">Pas encore rempli</p>
      </div>
    );
  }

  const responses = onboarding.responses || {};
  const entries = Object.entries(responses).filter(([_, value]) => value);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold text-gray-800">Questionnaire d'onboarding</h3>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-sm text-rose-600 hover:text-rose-700"
        >
          {isExpanded ? 'Réduire' : 'Voir tout'}
        </button>
      </div>

      <div className="space-y-3">
        {(isExpanded ? entries : entries.slice(0, 6)).map(([key, value]) => (
          <div key={key} className="border-b border-gray-100 pb-3 last:border-0">
            <p className="mb-1 text-xs font-medium uppercase text-gray-400">
              {FIELD_LABELS[key] || key}
            </p>
            <p className="text-sm text-gray-700">
              {typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value)}
            </p>
          </div>
        ))}
      </div>

      {!isExpanded && entries.length > 6 && (
        <p className="mt-3 text-xs text-gray-400">
          +{entries.length - 6} autres réponses
        </p>
      )}
    </div>
  );
}
