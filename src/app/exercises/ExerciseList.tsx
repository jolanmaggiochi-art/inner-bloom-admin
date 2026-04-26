'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

type Exercise = {
  id: string;
  name: string;
  category: string | null;
  description: string | null;
  video_url: string;
  thumbnail_url: string | null;
};

type Props = {
  initialExercises: Exercise[];
};

export function ExerciseList({ initialExercises }: Props) {
  const [exercises, setExercises] = useState(initialExercises);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    video_url: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const supabase = createClient();

  const filteredExercises = exercises.filter(
    (ex) =>
      ex.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ex.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  function resetForm() {
    setFormData({ name: '', category: '', description: '', video_url: '' });
    setEditingId(null);
    setShowForm(false);
  }

  function startEdit(exercise: Exercise) {
    setFormData({
      name: exercise.name,
      category: exercise.category || '',
      description: exercise.description || '',
      video_url: exercise.video_url,
    });
    setEditingId(exercise.id);
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!formData.name || !formData.video_url) return;

    setIsSubmitting(true);

    try {
      if (editingId) {
        // Update
        const { data, error } = await supabase
          .from('exercise_videos')
          .update({
            name: formData.name,
            category: formData.category || null,
            description: formData.description || null,
            video_url: formData.video_url,
          })
          .eq('id', editingId)
          .select()
          .single();

        if (error) throw error;

        setExercises((prev) =>
          prev.map((ex) => (ex.id === editingId ? data : ex))
        );
      } else {
        // Create
        const { data, error } = await supabase
          .from('exercise_videos')
          .insert({
            name: formData.name,
            category: formData.category || null,
            description: formData.description || null,
            video_url: formData.video_url,
          })
          .select()
          .single();

        if (error) throw error;

        setExercises((prev) => [...prev, data].sort((a, b) => a.name.localeCompare(b.name)));
      }

      resetForm();
    } catch (err) {
      console.error('Erreur:', err);
      alert('Erreur lors de la sauvegarde');
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    // Ne pas permettre la suppression des exercices importés (id commence par "used-")
    if (id.startsWith('used-')) {
      alert('Cet exercice vient d\'une séance existante. Ajoutez-le à la bibliothèque pour le modifier.');
      return;
    }
    
    if (!confirm('Supprimer cet exercice ?')) return;

    try {
      const { error } = await supabase.from('exercise_videos').delete().eq('id', id);
      if (error) throw error;
      setExercises((prev) => prev.filter((ex) => ex.id !== id));
    } catch (err) {
      console.error('Erreur:', err);
      alert('Erreur lors de la suppression');
    }
  }

  function getYouTubeId(url: string): string | null {
    const regex = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regex);
    return match && match[2].length === 11 ? match[2] : null;
  }

  return (
    <div>
      {/* Search + Add button */}
      <div className="mb-6 flex gap-4">
        <input
          type="text"
          placeholder="Rechercher un exercice..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-100"
        />
        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="rounded-lg bg-rose-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-rose-600"
        >
          + Ajouter un exercice
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-6">
          <h3 className="mb-4 font-semibold text-gray-800">
            {editingId ? 'Modifier l\'exercice' : 'Nouvel exercice'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Nom *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-100"
                  placeholder="Ex: Hip Thrust"
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Catégorie
                </label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-100"
                  placeholder="Ex: Fessiers, Dos, Épaules..."
                />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                URL YouTube *
              </label>
              <input
                type="url"
                value={formData.video_url}
                onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-100"
                placeholder="https://www.youtube.com/watch?v=..."
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-100"
                placeholder="Notes sur l'exécution..."
                rows={2}
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-lg bg-rose-500 px-4 py-2 text-sm font-medium text-white hover:bg-rose-600 disabled:opacity-50"
              >
                {isSubmitting ? 'Enregistrement...' : editingId ? 'Enregistrer' : 'Ajouter'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-200"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      {/* List */}
      {filteredExercises.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center">
          <p className="text-gray-500">
            {searchQuery ? 'Aucun exercice trouvé' : 'Aucun exercice dans la bibliothèque'}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredExercises.map((exercise) => {
            const youtubeId = getYouTubeId(exercise.video_url);
            const thumbnail = youtubeId
              ? `https://img.youtube.com/vi/${youtubeId}/mqdefault.jpg`
              : null;

            return (
              <div
                key={exercise.id}
                className="group overflow-hidden rounded-2xl border border-gray-200 bg-white transition hover:shadow-md"
              >
                {/* Thumbnail */}
                {thumbnail && (
                  <a
                    href={exercise.video_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <div className="relative aspect-video bg-gray-100">
                      <img
                        src={thumbnail}
                        alt={exercise.name}
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition group-hover:opacity-100">
                        <span className="rounded-full bg-white/90 px-3 py-1 text-sm font-medium text-gray-800">
                          ▶ Voir
                        </span>
                      </div>
                    </div>
                  </a>
                )}

                {/* Info */}
                <div className="p-4">
                  <div className="mb-2 flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-800">{exercise.name}</h3>
                      {exercise.category && (
                        <span className="text-xs text-gray-500">{exercise.category}</span>
                      )}
                    </div>
                  </div>

                  {exercise.description && (
                    <p className="mb-3 text-sm text-gray-600 line-clamp-2">
                      {exercise.description}
                    </p>
                  )}

                  <div className="flex gap-2">
                    <button
                      onClick={() => startEdit(exercise)}
                      className="flex-1 rounded-lg bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-200"
                    >
                      Modifier
                    </button>
                    <button
                      onClick={() => handleDelete(exercise.id)}
                      className="rounded-lg bg-red-50 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-100"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
