import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { LogoutButton } from '@/components/LogoutButton';
import { ExerciseList } from './ExerciseList';

export default async function ExercisesPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Récupérer tous les exercices de la bibliothèque
  const { data: libraryExercises } = await supabase
    .from('exercise_videos')
    .select('*')
    .order('name', { ascending: true });

  // Récupérer aussi les exercices utilisés dans les séances (avec video_url direct)
  const { data: usedExercises } = await supabase
    .from('exercises')
    .select('name, video_url')
    .not('video_url', 'is', null);

  // Fusionner et dédupliquer par nom
  const exerciseMap = new Map<string, { id: string; name: string; category: string | null; description: string | null; video_url: string }>();
  
  // D'abord les exercices de la bibliothèque
  (libraryExercises || []).forEach((ex) => {
    exerciseMap.set(ex.name.toLowerCase(), ex);
  });

  // Puis les exercices des séances (si pas déjà dans la bibliothèque)
  (usedExercises || []).forEach((ex, index) => {
    const key = ex.name.toLowerCase();
    if (!exerciseMap.has(key) && ex.video_url) {
      exerciseMap.set(key, {
        id: `used-${index}`,
        name: ex.name,
        category: null,
        description: null,
        video_url: ex.video_url,
      });
    }
  });

  const exercises = Array.from(exerciseMap.values()).sort((a, b) => a.name.localeCompare(b.name));
  const error = null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-xl font-semibold text-gray-800">Inner Bloom</h1>
            <p className="text-sm text-gray-500">Espace Coach</p>
          </div>
          <nav className="flex items-center gap-6">
            <Link
              href="/"
              className="text-sm font-medium text-gray-600 hover:text-gray-800"
            >
              Clientes
            </Link>
            <Link
              href="/exercises"
              className="text-sm font-medium text-rose-600"
            >
              Exercices
            </Link>
            <LogoutButton />
          </nav>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">Bibliothèque d'exercices</h2>
            <p className="text-sm text-gray-500">
              Exercices réutilisables dans tous les programmes
            </p>
          </div>
          <span className="rounded-full bg-rose-100 px-3 py-1 text-sm font-medium text-rose-700">
            {exercises?.length || 0} exercice{(exercises?.length || 0) > 1 ? 's' : ''}
          </span>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-4 text-red-600">
            Erreur: {error.message}
          </div>
        )}

        <ExerciseList initialExercises={exercises || []} />
      </main>
    </div>
  );
}
