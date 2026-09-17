import type { Metadata } from 'next';
import { LegalPage, Section } from '@/components/LegalPage';

export const metadata: Metadata = {
  title: 'Supprimer mon compte — Inner Bloom',
  description:
    'Comment demander la suppression de votre compte Inner Bloom et de vos données.',
};

export default function SuppressionComptePage() {
  return (
    <LegalPage title="Supprimer mon compte" lastUpdated="17 septembre 2026">
      <Section title="Comment faire la demande">
        <p>
          Pour supprimer votre compte Inner Bloom et l&apos;ensemble des données
          associées, envoyez un email à{' '}
          <a className="underline" href="mailto:laura_honvlt@icloud.com">
            laura_honvlt@icloud.com
          </a>{' '}
          depuis l&apos;adresse utilisée lors de votre inscription, avec pour
          objet <strong>« Suppression de mon compte »</strong>.
        </p>
        <p>
          Cette vérification par email nous permet de nous assurer que la demande
          émane bien de vous, afin de protéger votre compte.
        </p>
      </Section>

      <Section title="Délai de traitement">
        <p>
          Votre demande est traitée sous <strong>30 jours maximum</strong>, et
          généralement sous 72 heures. Vous recevez un email de confirmation une
          fois la suppression effectuée.
        </p>
      </Section>

      <Section title="Ce qui est supprimé">
        <p>
          La totalité des informations vous concernant est définitivement
          effacée :
        </p>
        <ul className="list-disc space-y-1 pl-6">
          <li>votre compte et vos identifiants de connexion ;</li>
          <li>vos prénom, nom et adresse email ;</li>
          <li>
            les réponses à votre questionnaire initial, y compris toutes vos
            données de santé ;
          </li>
          <li>vos programmes et l&apos;historique de vos séances ;</li>
          <li>vos charges enregistrées et vos progressions ;</li>
          <li>vos bilans hebdomadaires et mensuels ;</li>
          <li>votre jeton de notification.</li>
        </ul>
        <p>
          <strong>Cette suppression est définitive et irréversible.</strong> Vos
          données ne peuvent pas être restaurées ensuite.
        </p>
      </Section>

      <Section title="Ce qui peut être conservé">
        <p>
          Seuls les documents que la loi nous impose de garder sont conservés, par
          exemple les pièces comptables liées à un règlement, pendant la durée
          légale applicable. Ces éléments ne sont plus utilisés pour le coaching
          et ne sont accessibles à personne d&apos;autre.
        </p>
      </Section>

      <Section title="Supprimer vos données sans fermer votre compte">
        <p>
          Si vous souhaitez uniquement retirer vos données de santé tout en
          conservant votre compte, écrivez-nous à la même adresse en le
          précisant. Notez que votre coach ne pourra alors plus adapter votre
          programme à votre condition physique.
        </p>
      </Section>
    </LegalPage>
  );
}
