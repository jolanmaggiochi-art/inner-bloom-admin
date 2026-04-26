'use client';

import { useState, useMemo } from 'react';

type Log = {
  id: string;
  logged_value: string;
  logged_at: string;
  exercises: { name: string } | null;
  program_weeks: { week_number: number } | null;
};

type Props = {
  logs: Log[];
};

export function ExerciseLogsSection({ logs }: Props) {
  const [isExpanded, setIsExpanded] = useState(false);

  const grouped = useMemo(() => {
    const result: Record<string, { name: string; entries: { week: number; value: string }[] }> = {};
    
    logs.forEach((log) => {
      const name = log.exercises?.name || 'Inconnu';
      if (!result[name]) {
        result[name] = { name, entries: [] };
      }
      if (!result[name].entries.some((e) => e.week === (log.program_weeks?.week_number || 0))) {
        result[name].entries.push({
          week: log.program_weeks?.week_number || 0,
          value: log.logged_value,
        });
      }
    });

    Object.values(result).forEach((ex) => {
      ex.entries.sort((a, b) => a.week - b.week);
    });

    return result;
  }, [logs]);

  const exercises = useMemo(() => 
    Object.values(grouped).sort((a, b) => a.name.localeCompare(b.name)),
    [grouped]
  );

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold text-gray-800">Suivi des charges</h3>
        <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
          {exercises.length} exos
        </span>
      </div>

      {exercises.length === 0 ? (
        <p className="text-sm text-gray-500">Aucune charge enregistrée</p>
      ) : (
        <>
          <div className="space-y-2">
            {(isExpanded ? exercises : exercises.slice(0, 5)).map((exercise) => (
              <div
                key={exercise.name}
                className="flex items-center justify-between border-b border-gray-100 pb-2 last:border-0"
              >
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-700">{exercise.name}</p>
                  <p className="text-xs text-gray-400">
                    {exercise.entries.length} semaine{exercise.entries.length > 1 ? 's' : ''}
                  </p>
                </div>
                <div className="text-right">
                  {exercise.entries.slice(-2).reverse().map((entry, i) => (
                    <p key={entry.week} className={`text-sm ${i === 0 ? 'font-semibold text-gray-800' : 'text-gray-500'}`}>
                      Sem. {entry.week}: {entry.value}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {exercises.length > 5 && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="mt-3 w-full text-center text-sm text-rose-600 hover:text-rose-700"
            >
              {isExpanded ? 'Voir moins' : `Voir les ${exercises.length - 5} autres`}
            </button>
          )}
        </>
      )}
    </div>
  );
}
