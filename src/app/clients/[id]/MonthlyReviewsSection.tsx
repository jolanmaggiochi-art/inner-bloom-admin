'use client';

import { useState } from 'react';

type Review = {
  id: string;
  cycle_number: number;
  submitted_at: string;
  overall_feeling: string | null;
  what_worked: string | null;
  what_was_hard: string | null;
  best_progressions: string | null;
  visual_satisfaction: string | null;
  energy_score: number | null;
  sleep_score: number | null;
  nutrition_score: number | null;
  self_talk_progress: string | null;
  next_month_goal: string | null;
  current_weight: number | null;
  current_measurements: any;
  questions_for_coach: string | null;
  programs: { name: string } | null;
};

type Props = {
  reviews: Review[];
};

export function MonthlyReviewsSection({ reviews }: Props) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold text-gray-800">Bilans mensuels</h3>
        <span className="rounded-full bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-700">
          {reviews.length}
        </span>
      </div>

      {reviews.length === 0 ? (
        <p className="text-sm text-gray-500">Aucun bilan</p>
      ) : (
        <div className="space-y-3">
          {reviews.map((review) => {
            const isExpanded = expandedId === review.id;

            return (
              <div
                key={review.id}
                className="rounded-xl border border-gray-100 bg-gray-50 p-3"
              >
                <button
                  onClick={() => setExpandedId(isExpanded ? null : review.id)}
                  className="flex w-full items-center justify-between text-left"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      Cycle {review.cycle_number}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(review.submitted_at).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {review.current_weight && (
                      <span className="text-xs text-gray-500">
                        ⚖️ {review.current_weight}kg
                      </span>
                    )}
                    <span className="text-gray-400">{isExpanded ? '▲' : '▼'}</span>
                  </div>
                </button>

                {isExpanded && (
                  <div className="mt-3 space-y-2 border-t border-gray-200 pt-3 text-sm">
                    {/* Scores */}
                    <div className="flex gap-4">
                      {review.energy_score && (
                        <span className="text-gray-600">⚡ Énergie: {review.energy_score}/10</span>
                      )}
                      {review.sleep_score && (
                        <span className="text-gray-600">😴 Sommeil: {review.sleep_score}/10</span>
                      )}
                      {review.nutrition_score && (
                        <span className="text-gray-600">🍎 Nutrition: {review.nutrition_score}/10</span>
                      )}
                    </div>

                    {review.overall_feeling && (
                      <div>
                        <p className="text-xs font-medium text-gray-400">Ressenti global</p>
                        <p className="whitespace-pre-wrap text-gray-700">{review.overall_feeling}</p>
                      </div>
                    )}
                    {review.what_worked && (
                      <div>
                        <p className="text-xs font-medium text-gray-400">Ce qui a fonctionné</p>
                        <p className="whitespace-pre-wrap text-gray-700">{review.what_worked}</p>
                      </div>
                    )}
                    {review.what_was_hard && (
                      <div>
                        <p className="text-xs font-medium text-gray-400">Difficultés</p>
                        <p className="whitespace-pre-wrap text-gray-700">{review.what_was_hard}</p>
                      </div>
                    )}
                    {review.best_progressions && (
                      <div>
                        <p className="text-xs font-medium text-gray-400">Meilleures progressions</p>
                        <p className="whitespace-pre-wrap text-gray-700">{review.best_progressions}</p>
                      </div>
                    )}
                    {review.next_month_goal && (
                      <div>
                        <p className="text-xs font-medium text-gray-400">Objectif mois prochain</p>
                        <p className="whitespace-pre-wrap text-gray-700">{review.next_month_goal}</p>
                      </div>
                    )}
                    {review.questions_for_coach && (
                      <div className="rounded-lg bg-rose-50 p-2">
                        <p className="text-xs font-medium text-rose-600">Question pour toi</p>
                        <p className="whitespace-pre-wrap text-gray-700">{review.questions_for_coach}</p>
                      </div>
                    )}
                    {review.current_measurements && (
                      <div>
                        <p className="text-xs font-medium text-gray-400">Mensurations</p>
                        <p className="text-xs text-gray-600">
                          {Object.entries(review.current_measurements)
                            .map(([k, v]) => `${k}: ${v}cm`)
                            .join(' • ')}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
