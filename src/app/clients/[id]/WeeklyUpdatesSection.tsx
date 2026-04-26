'use client';

import { useState } from 'react';

type Update = {
  id: string;
  submitted_at: string;
  feeling: string | null;
  sessions_completed: string | null;
  pain_notes: string | null;
  injury_status: string | null;
  progressions: string | null;
  sleep_score: number | null;
  nutrition_score: number | null;
  self_talk: string | null;
  adjustments_requested: string | null;
  program_weeks: {
    week_number: number;
    programs: { name: string };
  } | null;
};

type Props = {
  updates: Update[];
};

export function WeeklyUpdatesSection({ updates }: Props) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold text-gray-800">Updates hebdo</h3>
        <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
          {updates.length}
        </span>
      </div>

      {updates.length === 0 ? (
        <p className="text-sm text-gray-500">Aucun update</p>
      ) : (
        <div className="space-y-3">
          {updates.slice(0, 5).map((update) => {
            const isExpanded = expandedId === update.id;

            return (
              <div
                key={update.id}
                className="rounded-xl border border-gray-100 bg-gray-50 p-3"
              >
                <button
                  onClick={() => setExpandedId(isExpanded ? null : update.id)}
                  className="flex w-full items-center justify-between text-left"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      Semaine {update.program_weeks?.week_number || '?'}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(update.submitted_at).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'short',
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {update.sleep_score && (
                      <span className="text-xs text-gray-500">
                        😴 {update.sleep_score}/10
                      </span>
                    )}
                    {update.nutrition_score && (
                      <span className="text-xs text-gray-500">
                        🍎 {update.nutrition_score}/10
                      </span>
                    )}
                    <span className="text-gray-400">{isExpanded ? '▲' : '▼'}</span>
                  </div>
                </button>

                {isExpanded && (
                  <div className="mt-3 space-y-2 border-t border-gray-200 pt-3 text-sm">
                    {update.feeling && (
                      <div>
                        <p className="text-xs font-medium text-gray-400">Ressenti</p>
                        <p className="whitespace-pre-wrap text-gray-700">{update.feeling}</p>
                      </div>
                    )}
                    {update.sessions_completed && (
                      <div>
                        <p className="text-xs font-medium text-gray-400">Séances</p>
                        <p className="whitespace-pre-wrap text-gray-700">{update.sessions_completed}</p>
                      </div>
                    )}
                    {update.pain_notes && (
                      <div>
                        <p className="text-xs font-medium text-gray-400">Douleurs</p>
                        <p className="whitespace-pre-wrap text-gray-700">{update.pain_notes}</p>
                      </div>
                    )}
                    {update.progressions && (
                      <div>
                        <p className="text-xs font-medium text-gray-400">Progressions</p>
                        <p className="whitespace-pre-wrap text-gray-700">{update.progressions}</p>
                      </div>
                    )}
                    {update.self_talk && (
                      <div>
                        <p className="text-xs font-medium text-gray-400">Self-talk</p>
                        <p className="whitespace-pre-wrap text-gray-700">{update.self_talk}</p>
                      </div>
                    )}
                    {update.adjustments_requested && (
                      <div>
                        <p className="text-xs font-medium text-gray-400">Ajustements</p>
                        <p className="whitespace-pre-wrap text-gray-700">{update.adjustments_requested}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {updates.length > 5 && (
            <p className="text-center text-xs text-gray-400">
              +{updates.length - 5} autres updates
            </p>
          )}
        </div>
      )}
    </div>
  );
}
