'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

export default function NewWeekPage() {
  const router = useRouter();
  const params = useParams();
  const clientId = params.id as string;
  const programId = params.programId as string;
  
  const [weekNumber, setWeekNumber] = useState(1);
  const [weeklyNotes, setWeeklyNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const supabase = createClient();

  useEffect(() => {
    async function getNextWeekNumber() {
      const { data } = await supabase
        .from('program_weeks')
        .select('week_number')
        .eq('program_id', programId)
        .order('week_number', { ascending: false })
        .limit(1);

      if (data && data.length > 0) {
        setWeekNumber(data[0].week_number + 1);
      }
    }
    getNextWeekNumber();
  }, [programId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setIsSubmitting(true);
    setError('');

    try {
      const { data, error: insertError } = await supabase
        .from('program_weeks')
        .insert({
          program_id: programId,
          week_number: weekNumber,
          weekly_notes: weeklyNotes || null,
        })
        .select()
        .single();

      if (insertError) throw insertError;

      router.push(`/clients/${clientId}/program/${programId}/week/${data.id}`);
      router.refresh();
    } catch (err: any) {
      console.error('Erreur:', err);
      setError(err.message || 'Erreur lors de la création');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-3xl items-center gap-4 px-6 py-4">
          <Link
            href={`/clients/${clientId}`}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200"
          >
            ←
          </Link>
          <h1 className="text-xl font-semibold text-gray-800">Nouvelle semaine</h1>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-8">
        <form onSubmit={handleSubmit} className="rounded-2xl border border-gray-200 bg-white p-6">
          {error && (
            <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="mb-4">
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Numéro de semaine
            </label>
            <input
              type="number"
              value={weekNumber}
              onChange={(e) => setWeekNumber(parseInt(e.target.value))}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-100"
              min={1}
            />
          </div>

          <div className="mb-6">
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Notes de la semaine
            </label>
            <textarea
              value={weeklyNotes}
              onChange={(e) => setWeeklyNotes(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-100"
              placeholder="Consignes générales, échauffement, objectifs..."
              rows={3}
            />
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-lg bg-rose-500 px-6 py-2.5 font-medium text-white hover:bg-rose-600 disabled:opacity-50"
            >
              {isSubmitting ? 'Création...' : 'Créer et ajouter des séances'}
            </button>
            <Link
              href={`/clients/${clientId}`}
              className="rounded-lg bg-gray-100 px-6 py-2.5 font-medium text-gray-600 hover:bg-gray-200"
            >
              Annuler
            </Link>
          </div>
        </form>
      </main>
    </div>
  );
}
