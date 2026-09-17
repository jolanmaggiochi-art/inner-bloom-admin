import type { Metadata } from 'next';
import { LegalPage, Section } from '@/components/LegalPage';

export const metadata: Metadata = {
  title: 'Politique de confidentialité — Inner Bloom',
  description:
    'Comment Inner Bloom collecte, utilise et protège vos données personnelles.',
};

export default function ConfidentialitePage() {
  return (
    <LegalPage title="Politique de confidentialité" lastUpdated="17 septembre 2026">
      <Section title="1. Qui est responsable de vos données ?">
        <p>
          L&apos;application Inner Bloom est éditée par Laura Honvault,
          entrepreneuse individuelle, dont le siège est situé 1640 boulevard
          Edmond Labrasse, 62780 Stella, immatriculée sous le numéro SIRET
          840 735 914 00045.
        </p>
        <p>
          Responsable du traitement et contact pour toute question relative à vos
          données :{' '}
          <a className="underline" href="mailto:jmaggiochi@gmail.com">
            jmaggiochi@gmail.com
          </a>
        </p>
      </Section>

      <Section title="2. Pourquoi nous collectons vos données">
        <p>
          Inner Bloom est une application de coaching sportif personnalisé. Les
          informations que vous renseignez servent exclusivement à permettre à
          votre coach de concevoir, adapter et suivre un programme
          d&apos;entraînement conçu pour vous. Elles ne sont jamais utilisées à
          des fins publicitaires.
        </p>
      </Section>

      <Section title="3. Quelles données nous collectons">
        <p>
          <strong>Données de compte</strong> — prénom, nom, adresse email et mot
          de passe (celui-ci est chiffré et nous n&apos;y avons jamais accès).
        </p>
        <p>
          <strong>Données relatives à votre santé et à votre condition
          physique</strong> — âge, taille, poids, mensurations, douleurs
          actuelles, blessures passées, opérations chirurgicales, intolérances et
          allergies alimentaires, habitudes alimentaires, qualité du sommeil,
          niveau d&apos;énergie et ressenti physique et mental.
        </p>
        <p>
          <strong>Données d&apos;entraînement</strong> — niveau et expérience
          sportive, matériel disponible, lieu d&apos;entraînement, objectifs,
          préférences, charges soulevées, séances réalisées, et vos réponses aux
          bilans hebdomadaires et mensuels.
        </p>
        <p>
          <strong>Données techniques</strong> — un identifiant unique de compte
          et, si vous les acceptez, un jeton de notification permettant de vous
          avertir lorsqu&apos;un nouveau programme est disponible.
        </p>
        <p>
          Nous ne collectons <strong>aucune</strong> donnée de localisation,
          aucun contact, aucune photo, et n&apos;utilisons aucun identifiant
          publicitaire.
        </p>
      </Section>

      <Section title="4. Vos données de santé : une protection renforcée">
        <p>
          Certaines informations que vous nous confiez (blessures, douleurs,
          opérations, poids, alimentation) constituent des données de santé. Le
          Règlement général sur la protection des données leur accorde une
          protection particulière.
        </p>
        <p>
          Nous les traitons uniquement sur la base de votre{' '}
          <strong>consentement explicite</strong>, donné au moment où vous
          remplissez le questionnaire initial. Elles sont strictement nécessaires
          pour adapter votre programme à votre état physique et éviter tout
          exercice qui pourrait vous blesser. Vous pouvez retirer ce consentement
          à tout moment en nous contactant, ce qui entraînera la suppression de
          ces données.
        </p>
      </Section>

      <Section title="5. Sur quelle base légale">
        <p>
          <strong>Exécution du contrat</strong> — vos données de compte et
          d&apos;entraînement sont nécessaires pour vous fournir le service de
          coaching auquel vous avez souscrit.
        </p>
        <p>
          <strong>Consentement explicite</strong> — pour vos données de santé
          ainsi que pour l&apos;envoi de notifications push.
        </p>
      </Section>

      <Section title="6. Qui accède à vos données">
        <p>
          <strong>Votre coach</strong> est la seule personne à consulter vos
          informations, afin de construire et d&apos;ajuster votre programme. À
          la fin du questionnaire initial, un récapitulatif au format PDF lui est
          envoyé par email.
        </p>
        <p>
          <strong>Les autres utilisatrices n&apos;ont accès à aucune de vos
          données.</strong> Nous ne vendons ni ne louons vos informations à qui
          que ce soit.
        </p>
        <p>
          Nous faisons appel à des prestataires techniques qui hébergent ou
          acheminent vos données pour notre compte, sans les exploiter à
          d&apos;autres fins :
        </p>
        <ul className="list-disc space-y-1 pl-6">
          <li>
            <strong>Supabase</strong> — hébergement de la base de données et
            gestion des comptes.
          </li>
          <li>
            <strong>Resend</strong> — acheminement de l&apos;email contenant
            votre questionnaire vers votre coach.
          </li>
          <li>
            <strong>Expo</strong> — service d&apos;envoi des notifications push.
          </li>
          <li>
            <strong>YouTube (Google)</strong> — lecture des vidéos de
            démonstration des exercices. Aucune information de votre compte Inner
            Bloom ne lui est transmise ; la lecture d&apos;une vidéo est soumise à
            la politique de confidentialité de Google.
          </li>
        </ul>
        <p>
          Certains de ces prestataires sont établis en dehors de l&apos;Union
          européenne. Ces transferts sont encadrés par les clauses contractuelles
          types de la Commission européenne.
        </p>
      </Section>

      <Section title="7. Combien de temps nous les conservons">
        <p>
          Vos données sont conservées pendant toute la durée de votre
          accompagnement, puis pendant <strong>douze mois</strong> après votre
          dernière activité, afin de vous permettre de reprendre votre suivi sans
          repartir de zéro.
        </p>
        <p>
          Passé ce délai, ou immédiatement si vous demandez la suppression de
          votre compte, elles sont définitivement effacées.
        </p>
      </Section>

      <Section title="8. Vos droits">
        <p>Vous disposez à tout moment des droits suivants :</p>
        <ul className="list-disc space-y-1 pl-6">
          <li>accéder à l&apos;ensemble des données que nous détenons sur vous ;</li>
          <li>les faire corriger si elles sont inexactes ;</li>
          <li>en demander la suppression ;</li>
          <li>en obtenir une copie dans un format réutilisable ;</li>
          <li>vous opposer à un traitement ou en demander la limitation ;</li>
          <li>retirer votre consentement pour vos données de santé.</li>
        </ul>
        <p>
          Pour exercer ces droits, écrivez-nous à{' '}
          <a className="underline" href="mailto:jmaggiochi@gmail.com">
            jmaggiochi@gmail.com
          </a>
          . Nous vous répondons sous un délai maximum d&apos;un mois.
        </p>
        <p>
          Si vous estimez que vos droits ne sont pas respectés, vous pouvez
          introduire une réclamation auprès de la CNIL (
          <a
            className="underline"
            href="https://www.cnil.fr"
            target="_blank"
            rel="noopener noreferrer"
          >
            www.cnil.fr
          </a>
          ).
        </p>
      </Section>

      <Section title="9. Sécurité">
        <p>
          Les échanges entre l&apos;application et nos serveurs sont chiffrés.
          L&apos;accès aux données est restreint par des règles de sécurité qui
          garantissent qu&apos;une utilisatrice ne peut consulter que ses propres
          informations. Les mots de passe sont stockés sous forme chiffrée
          irréversible.
        </p>
      </Section>

      <Section title="10. Mineurs">
        <p>
          L&apos;application n&apos;est pas destinée aux personnes de moins de 16
          ans. Si vous avez moins de 16 ans, l&apos;accord d&apos;un titulaire de
          l&apos;autorité parentale est requis avant toute utilisation.
        </p>
      </Section>

      <Section title="11. Modifications">
        <p>
          Cette politique peut évoluer. En cas de changement important, vous en
          serez informée dans l&apos;application ou par email. La date de
          dernière mise à jour figure en haut de cette page.
        </p>
      </Section>
    </LegalPage>
  );
}
