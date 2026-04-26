'use client';

import { useState } from 'react';
import Link from 'next/link';

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

type Props = {
  clients: Client[];
  onboardingCompletedIds: string[];
};

export function ClientSearch({ clients, onboardingCompletedIds }: Props) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredClients = clients.filter((client) => {
    const fullName = `${client.first_name || ''} ${client.last_name || ''}`.toLowerCase();
    return fullName.includes(searchQuery.toLowerCase());
  });

  return (
    <>
      {/* Barre de recherche */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Rechercher une cliente..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-100"
        />
      </div>

      {filteredClients.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center">
          <p className="text-gray-500">
            {searchQuery ? 'Aucune cliente trouvée' : 'Aucune cliente pour le moment'}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredClients.map((client) => {
            const activeProgram = client.programs?.find((p) => p.status === 'active');
            const hasUnreadUpdates = client.weekly_updates?.length > 0;
            const hasCompletedOnboarding = onboardingCompletedIds.includes(client.id);

            return (
              <Link
                key={client.id}
                href={`/clients/${client.id}`}
                className="group rounded-2xl border border-gray-200 bg-white p-5 transition hover:border-rose-200 hover:shadow-md"
              >
                <div className="mb-3 flex items-start justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 text-lg font-semibold text-rose-600">
                    {client.first_name?.charAt(0).toUpperCase() || '?'}
                  </div>
                  <div className="flex gap-1">
                    {client.role === 'coach' && (
                      <span className="rounded-full bg-rose-100 px-2 py-0.5 text-xs font-medium text-rose-700">
                        Coach
                      </span>
                    )}
                    {client.role === 'client' && !hasCompletedOnboarding && (
                      <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
                        Onboarding
                      </span>
                    )}
                    {hasUnreadUpdates && (
                      <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
                        {client.weekly_updates.length} update
                        {client.weekly_updates.length > 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                </div>

                <h3 className="mb-1 font-semibold text-gray-800 group-hover:text-rose-600">
                  {client.first_name || ''} {client.last_name || ''}
                  {!client.first_name && !client.last_name && 'Sans nom'}
                </h3>

                <p className="mb-3 text-sm text-gray-500">
                  {activeProgram ? activeProgram.name : 'Pas de programme actif'}
                </p>

                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span>
                    Inscrite le{' '}
                    {new Date(client.created_at).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                  <span className="text-rose-400 opacity-0 transition group-hover:opacity-100">
                    Voir →
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </>
  );
}
