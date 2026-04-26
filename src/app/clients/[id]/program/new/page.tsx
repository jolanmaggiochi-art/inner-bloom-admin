'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

export default function NewProgramPage() {
  const router = useRouter();
  const params = useParams();
  const clientId = params.id as string;
  
  const [formData, setFormData] = useState({
    name: '',
    start_date: new Date().toISOString().split('T')[0],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!formData.name) return;

    setIsSubmitting(true);
    setError('');

    try {
      const { data, error: insertError } = await supabase
        .from('programs')
        .insert({
          client_id: clientId,
          name: formData.name,
          start_date: formData.start_date,
          status: 'active',
        })
        .select()
        .single();

      if (insertError) throw insertError;

      // Rediriger vers la création de la première semaine
      router.push(`/clients/${clientId}/program/${data.id}/week/new`);
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
          <h1 className="text-xl font-semibold text-gray-800">Nouveau programme</h1>
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
              Nom du programme *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-100"
              placeholder="Ex: Programme Perte de gras & Construction"
              required
            />
          </div>

          <div className="mb-6">
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Date de début
            </label>
            <input
              type="date"
              value={formData.start_date}
              onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-100"
            />
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-lg bg-rose-500 px-6 py-2.5 font-medium text-white hover:bg-rose-600 disabled:opacity-50"
            >
              {isSubmitting ? 'Création...' : 'Créer le programme'}
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
