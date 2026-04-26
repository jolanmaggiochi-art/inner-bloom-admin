import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { LogoutButton } from '@/components/LogoutButton';
import { ClientSearch } from '@/components/ClientSearch';

type Client = {
  id: string;
  first_name: string;
  last_name: string | null;
  created_at: string;
  role: string;
  programs: {
    id: string;
    name: string;
    status: string;
  }[];
  weekly_updates: { id: string }[];
  monthly_reviews: { id: string }[];
};

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Récupérer tous les profils (clients + coachs)
  const { data: clients, error } = await supabase
    .from('profiles')
    .select(`
      id,
      first_name,
      last_name,
      created_at,
      role,
      programs (
        id,
        name,
        status
      ),
      weekly_updates (id),
      monthly_reviews (id)
    `)
    .order('created_at', { ascending: false });

  // Récupérer les onboarding responses séparément
  const clientIds = clients?.map((c) => c.id) || [];
  const { data: onboardingData } = await supabase
    .from('onboarding_responses')
    .select('user_id')
    .in('user_id', clientIds);

  const onboardingCompletedIds = onboardingData?.map((o) => o.user_id) || [];

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
              className="text-sm font-medium text-rose-600"
            >
              Clientes
            </Link>
            <Link
              href="/exercises"
              className="text-sm font-medium text-gray-600 hover:text-gray-800"
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
          <h2 className="text-2xl font-semibold text-gray-800">Mes clientes</h2>
          <span className="rounded-full bg-rose-100 px-3 py-1 text-sm font-medium text-rose-700">
            {clients?.length || 0} cliente{(clients?.length || 0) > 1 ? 's' : ''}
          </span>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-4 text-red-600">
            Erreur: {error.message}
          </div>
        )}

        <ClientSearch clients={clients || []} onboardingCompletedIds={onboardingCompletedIds} />
      </main>
    </div>
  );
}
