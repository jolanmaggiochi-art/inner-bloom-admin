'use client';

import { useState } from 'react';

type Props = {
  profile: any;
};

const FITNESS_LEVELS: Record<string, string> = {
  beginner: 'Débutante',
  intermediate: 'Intermédiaire',
  advanced: 'Avancée',
  competitor: 'Compétitrice',
};

const TRAINING_LOCATIONS: Record<string, string> = {
  crossfit_gym: 'Box de CrossFit',
  classic_gym: 'Salle classique',
  home: 'À la maison',
  outdoor: 'En extérieur',
};

type Entry = { label: string; value: string };

function measurementsToText(m: any): string {
  if (!m || typeof m !== 'object') return '';
  const labels: Record<string, string> = {
    chest: 'Poitrine',
    waist: 'Taille',
    hips: 'Hanches',
    arms: 'Bras',
    thighs: 'Cuisses',
  };
  return Object.entries(labels)
    .filter(([key]) => m[key])
    .map(([key, label]) => `${label} : ${m[key]} cm`)
    .join('\n');
}

function buildEntries(profile: any): Entry[] {
  const goals = profile.goals || {};
  const prefs = profile.training_preferences || {};
  const nutrition = profile.nutrition || {};
  const mindset = profile.mindset || {};

  const raw: [string, unknown][] = [
    ['Âge', profile.age ? `${profile.age} ans` : null],
    ['Taille', profile.height_cm ? `${profile.height_cm} cm` : null],
    ['Poids', profile.weight_kg ? `${profile.weight_kg} kg` : null],
    ['Mensurations', measurementsToText(profile.measurements)],
    ['Niveau sportif', FITNESS_LEVELS[profile.fitness_level] || profile.fitness_level],
    ['Expérience', profile.experience],
    ['Fréquence actuelle', profile.current_frequency],
    ["Lieu d'entraînement", TRAINING_LOCATIONS[profile.training_location] || profile.training_location],
    ['Matériel disponible', profile.equipment],
    ['Douleurs actuelles', profile.current_pain],
    ['Blessures passées', profile.past_injuries],
    ['Opérations', profile.surgeries],
    ['Points forts', profile.strengths],
    ['Points faibles', profile.weaknesses],
    ['Zones à développer', profile.target_zones],
    ['Objectif principal', goals.main],
    ['Objectif secondaire', goals.secondary],
    ['Objectif poids', goals.weight],
    ['Objectif performance', goals.performance],
    ['Séances voulues / semaine', prefs.sessions_wanted],
    ['Séances réalistes / semaine', prefs.sessions_realistic],
    ['Durée idéale', prefs.duration_minutes ? `${prefs.duration_minutes} min` : null],
    ['Exercices préférés', prefs.favorite_exercises],
    ['Exercices détestés', prefs.hated_exercises],
    ['Repas / jour', nutrition.meals_per_day],
    ['Petit-déjeuner', nutrition.has_breakfast === false ? 'Non' : nutrition.breakfast_detail || 'Oui'],
    ['Journée type', nutrition.typical_day],
    ['Compléments', nutrition.supplements],
    ['Eau / jour', nutrition.water_liters ? `${nutrition.water_liters} L` : null],
    ['Intolérances', nutrition.intolerances],
    ['Problème principal (alimentation)', nutrition.main_issue],
    ['Attentes du coaching', mindset.coaching_expectations],
    ['Coaching précédent', mindset.previous_coaching],
    ['Motivation (1-10)', mindset.motivation_level],
    ["Ce qui pourrait la faire abandonner", mindset.quit_triggers],
    ['Remarques', mindset.additional_notes],
  ];

  return raw
    .filter(([, value]) => value !== null && value !== undefined && String(value).trim() !== '')
    .map(([label, value]) => ({ label, value: String(value) }));
}

export function OnboardingSection({ profile }: Props) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!profile?.onboarding_completed_at) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        <h3 className="mb-4 font-semibold text-gray-800">Questionnaire d'onboarding</h3>
        <p className="text-sm text-gray-500">Pas encore rempli</p>
      </div>
    );
  }

  const entries = buildEntries(profile);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-gray-800">Questionnaire d'onboarding</h3>
          <p className="text-xs text-gray-400">
            Rempli le{' '}
            {new Date(profile.onboarding_completed_at).toLocaleDateString('fr-FR', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </p>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-sm text-rose-600 hover:text-rose-700"
        >
          {isExpanded ? 'Réduire' : 'Voir tout'}
        </button>
      </div>

      <div className="space-y-3">
        {(isExpanded ? entries : entries.slice(0, 6)).map(({ label, value }) => (
          <div key={label} className="border-b border-gray-100 pb-3 last:border-0">
            <p className="mb-1 text-xs font-medium uppercase text-gray-400">{label}</p>
            <p className="whitespace-pre-line text-sm text-gray-700">{value}</p>
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
