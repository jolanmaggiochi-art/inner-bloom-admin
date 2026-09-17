import Link from 'next/link';

export function LegalPage({
  title,
  lastUpdated,
  children,
}: {
  title: string;
  lastUpdated: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#FBF4F6]">
      <div className="mx-auto max-w-3xl px-6 py-16">
        <header className="mb-12 border-b border-[#E4C4C8] pb-8">
          <p className="mb-2 text-sm uppercase tracking-[2px] text-[#965C5C]">
            Inner Bloom
          </p>
          <h1 className="text-3xl font-semibold text-[#4A3F3B]">{title}</h1>
          <p className="mt-3 text-sm text-[#97837E]">
            Dernière mise à jour : {lastUpdated}
          </p>
        </header>

        <article className="legal-content space-y-8 text-[#4A3F3B]">
          {children}
        </article>

        <footer className="mt-16 flex flex-wrap gap-6 border-t border-[#E4C4C8] pt-8 text-sm text-[#77635F]">
          <Link href="/confidentialite" className="hover:text-[#965C5C]">
            Politique de confidentialité
          </Link>
          <Link href="/cgu" className="hover:text-[#965C5C]">
            Conditions d&apos;utilisation
          </Link>
          <Link href="/suppression-compte" className="hover:text-[#965C5C]">
            Supprimer mon compte
          </Link>
        </footer>
      </div>
    </div>
  );
}

export function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-3">
      <h2 className="text-xl font-semibold text-[#7A4A4F]">{title}</h2>
      <div className="space-y-3 leading-relaxed text-[#4A3F3B]">{children}</div>
    </section>
  );
}
