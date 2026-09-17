import type { Metadata } from 'next';
import { LegalPage, Section } from '@/components/LegalPage';

export const metadata: Metadata = {
  title: "Conditions d'utilisation — Inner Bloom",
  description:
    "Les règles d'utilisation de l'application de coaching sportif Inner Bloom.",
};

export default function CguPage() {
  return (
    <LegalPage
      title="Conditions générales d'utilisation"
      lastUpdated="17 septembre 2026"
    >
      <Section title="1. Objet">
        <p>
          Les présentes conditions régissent l&apos;utilisation de
          l&apos;application mobile Inner Bloom, éditée par Laura Honvault,
          entrepreneuse individuelle, 1640 boulevard Edmond Labrasse, 62780
          Stella, immatriculée sous le numéro SIRET 840 735 914 00045.
        </p>
        <p>
          En créant un compte, vous acceptez ces conditions dans leur intégralité.
        </p>
      </Section>

      <Section title="2. Le service">
        <p>
          Inner Bloom vous donne accès à un programme d&apos;entraînement
          personnalisé, construit par votre coach à partir des informations que
          vous renseignez. L&apos;application vous permet de consulter vos
          séances, de visionner des vidéos de démonstration, d&apos;enregistrer
          vos charges et de transmettre vos bilans hebdomadaires et mensuels.
        </p>
        <p>
          L&apos;accès à l&apos;application est lié à un accompagnement convenu
          directement avec votre coach. Aucun paiement n&apos;est effectué au sein
          de l&apos;application.
        </p>
      </Section>

      <Section title="3. Avertissement important sur votre santé">
        <p>
          <strong>
            Inner Bloom ne fournit pas de conseils médicaux et ne remplace en
            aucun cas l&apos;avis d&apos;un professionnel de santé.
          </strong>
        </p>
        <p>
          Avant de commencer un programme d&apos;entraînement, il vous appartient
          de vous assurer que votre état de santé le permet, en consultant un
          médecin si nécessaire, en particulier en cas d&apos;antécédent médical,
          de blessure, de grossesse ou de traitement en cours.
        </p>
        <p>
          Vous vous engagez à renseigner des informations exactes et complètes
          concernant votre santé, et à signaler sans délai à votre coach toute
          douleur, blessure ou évolution de votre état. Interrompez immédiatement
          tout exercice provoquant une douleur anormale.
        </p>
        <p>
          Vous pratiquez les exercices sous votre propre responsabilité. La
          pratique d&apos;une activité physique comporte des risques inhérents,
          notamment de blessure.
        </p>
      </Section>

      <Section title="4. Votre compte">
        <p>
          Votre compte est strictement personnel. Vous êtes responsable de la
          confidentialité de vos identifiants et de toute activité effectuée
          depuis votre compte. Prévenez-nous sans délai en cas d&apos;utilisation
          non autorisée.
        </p>
        <p>
          Vous vous engagez à fournir des informations exactes lors de votre
          inscription et à les tenir à jour.
        </p>
      </Section>

      <Section title="5. Propriété intellectuelle">
        <p>
          Les programmes, contenus, vidéos et supports accessibles dans
          l&apos;application sont protégés par le droit d&apos;auteur et restent
          la propriété de leur auteur.
        </p>
        <p>
          Ils vous sont fournis pour votre usage personnel uniquement. Vous ne
          pouvez ni les partager, ni les revendre, ni les diffuser, ni les
          utiliser à des fins commerciales sans autorisation écrite préalable.
        </p>
      </Section>

      <Section title="6. Vos engagements">
        <p>Vous vous engagez à ne pas :</p>
        <ul className="list-disc space-y-1 pl-6">
          <li>partager vos accès avec une tierce personne ;</li>
          <li>copier ou diffuser les programmes et contenus ;</li>
          <li>
            tenter d&apos;accéder à des données qui ne vous appartiennent pas ;
          </li>
          <li>
            perturber le fonctionnement de l&apos;application ou de ses serveurs.
          </li>
        </ul>
      </Section>

      <Section title="7. Disponibilité">
        <p>
          Nous mettons tout en œuvre pour assurer la disponibilité de
          l&apos;application, sans pouvoir en garantir un accès ininterrompu.
          L&apos;accès peut être temporairement suspendu pour maintenance ou en
          cas de difficulté technique indépendante de notre volonté.
        </p>
      </Section>

      <Section title="8. Responsabilité">
        <p>
          Notre responsabilité ne saurait être engagée en cas de blessure ou de
          dommage résultant du non-respect des consignes d&apos;exécution, de la
          communication d&apos;informations de santé inexactes ou incomplètes, ou
          d&apos;une pratique inadaptée à votre condition physique.
        </p>
        <p>
          Les résultats d&apos;un programme sportif varient selon les personnes et
          dépendent de nombreux facteurs individuels. Aucun résultat précis ne
          peut être garanti.
        </p>
      </Section>

      <Section title="9. Résiliation">
        <p>
          Vous pouvez demander la suppression de votre compte à tout moment,
          selon la procédure décrite sur la page{' '}
          <a className="underline" href="/suppression-compte">
            Supprimer mon compte
          </a>
          .
        </p>
        <p>
          Nous pouvons suspendre ou résilier un compte en cas de manquement grave
          aux présentes conditions.
        </p>
      </Section>

      <Section title="10. Modification des conditions">
        <p>
          Ces conditions peuvent être modifiées. En cas de changement important,
          vous en serez informée dans l&apos;application ou par email.
        </p>
      </Section>

      <Section title="11. Droit applicable">
        <p>
          Les présentes conditions sont soumises au droit français. En cas de
          litige, une solution amiable sera recherchée en priorité. À défaut, les
          tribunaux français seront compétents.
        </p>
        <p>
          Pour toute question :{' '}
          <a className="underline" href="mailto:laura_honvlt@icloud.com">
            laura_honvlt@icloud.com
          </a>
        </p>
      </Section>
    </LegalPage>
  );
}
