import { createClient } from '@/lib/supabase/server';
import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import { OnboardingSection } from './OnboardingSection';
import { WeeklyUpdatesSection } from './WeeklyUpdatesSection';
import { MonthlyReviewsSection } from './MonthlyReviewsSection';
import { ExerciseLogsSection } from './ExerciseLogsSection';
import { ProgramSection } from './ProgramSection';
import { CustomQuestionsSection } from './CustomQuestionsSection';

type Props = {
  params: Promise<{ id: string }>;
};

export default async function ClientPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Récupérer le profil (client ou coach)
  const { data: client, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !client) {
    notFound();
  }

  // Récupérer l'onboarding
  const { data: onboarding } = await supabase
    .from('onboarding_responses')
    .select('*')
    .eq('user_id', id)
    .single();

  // Récupérer les programmes
  const { data: programs } = await supabase
    .from('programs')
    .select(`
      *,
      program_weeks (
        *,
        sessions (
          *,
          exercises (*)
        )
      )
    `)
    .eq('client_id', id)
    .order('created_at', { ascending: false });

  // Récupérer les weekly updates
  const { data: weeklyUpdates } = await supabase
    .from('weekly_updates')
    .select(`
      *,
      program_weeks (
        week_number,
        programs (name)
      )
    `)
    .eq('user_id', id)
    .order('submitted_at', { ascending: false });

  // Récupérer les monthly reviews
  const { data: monthlyReviews } = await supabase
    .from('monthly_reviews')
    .select(`
      *,
      programs (name)
    `)
    .eq('user_id', id)
    .order('submitted_at', { ascending: false });

  // Récupérer les exercise logs
  const { data: exerciseLogs } = await supabase
    .from('exercise_logs')
    .select(`
      *,
      exercises (name),
      program_weeks (week_number)
    `)
    .eq('user_id', id)
    .order('logged_at', { ascending: false });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200"
            >
              ←
            </Link>
            <div>
              <h1 className="text-xl font-semibold text-gray-800">
                {client.first_name || ''} {client.last_name || ''}
                {!client.first_name && !client.last_name && 'Cliente'}
              </h1>
              <p className="text-sm text-gray-500">Fiche cliente</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {!client.onboarding_completed && (
              <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-medium text-amber-700">
                Onboarding en attente
              </span>
            )}
            {programs?.some((p) => p.status === 'active') && (
              <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
                Programme actif
              </span>
            )}
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Colonne principale */}
          <div className="space-y-6 lg:col-span-2">
            {/* Programme */}
            <ProgramSection
              clientId={id}
              programs={programs || []}
            />

            {/* Questionnaire onboarding */}
            <OnboardingSection onboarding={onboarding} />

            {/* Questions personnalisées */}
            <CustomQuestionsSection clientId={id} />
          </div>

          {/* Colonne latérale */}
          <div className="space-y-6">
            {/* Weekly Updates */}
            <WeeklyUpdatesSection updates={weeklyUpdates || []} />

            {/* Monthly Reviews */}
            <MonthlyReviewsSection reviews={monthlyReviews || []} />

            {/* Exercise Logs */}
            <ExerciseLogsSection logs={exerciseLogs || []} />
          </div>
        </div>
      </main>
    </div>
  );
}
