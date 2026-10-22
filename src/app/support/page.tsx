import type { Metadata } from 'next';
import { LegalPage, Section } from '@/components/LegalPage';

export const metadata: Metadata = {
  title: 'Assistance — Inner Bloom',
  description:
    "Obtenir de l'aide sur l'application Inner Bloom : contact, questions fréquentes et résolution des problèmes courants.",
};

export default function SupportPage() {
  return (
    <LegalPage title="Assistance" lastUpdated="22 octobre 2026">
      <Section title="Nous contacter">
        <p>
          Une question sur l&apos;application, un problème technique ou une
          demande concernant votre suivi ? Écrivez-nous à{' '}
          <a className="underline" href="mailto:laura_honvlt@icloud.com">
            laura_honvlt@icloud.com
          </a>
          . Nous répondons sous 72 heures.
        </p>
        <p>
          Pour accélérer le traitement, précisez l&apos;adresse email de votre
          compte, le modèle de votre téléphone et une description de ce que vous
          observez.
        </p>
      </Section>

      <Section title="Je n'arrive pas à me connecter">
        <p>
          Vérifiez que vous utilisez bien l&apos;adresse email communiquée lors
          de votre inscription. Si vous avez oublié votre mot de passe, utilisez
          le lien « Mot de passe oublié ? » sur l&apos;écran de connexion : un
          email de réinitialisation vous sera envoyé.
        </p>
      </Section>

      <Section title="Je ne vois aucun programme">
        <p>
          Votre programme apparaît dès que votre coach l&apos;a créé et publié.
          Si l&apos;écran d&apos;accueil reste vide alors que votre
          accompagnement a commencé, contactez-nous : il s&apos;agit le plus
          souvent d&apos;une semaine qui n&apos;a pas encore été publiée.
        </p>
      </Section>

      <Section title="Les vidéos d'exercices ne se lancent pas">
        <p>
          Les démonstrations sont hébergées sur YouTube et nécessitent une
          connexion internet active. En cas de blocage, vérifiez votre connexion
          puis relancez l&apos;application.
        </p>
      </Section>

      <Section title="Je n'ai pas reçu de notification">
        <p>
          Les notifications vous préviennent de la publication d&apos;une
          nouvelle semaine de programme. Assurez-vous de les avoir autorisées
          pour Inner Bloom dans les réglages de votre téléphone.
        </p>
      </Section>

      <Section title="Gérer mes données">
        <p>
          Pour consulter, corriger ou supprimer vos données, consultez notre{' '}
          <a className="underline" href="/confidentialite">
            politique de confidentialité
          </a>{' '}
          ou la page{' '}
          <a className="underline" href="/suppression-compte">
            Supprimer mon compte
          </a>
          .
        </p>
      </Section>

      <Section title="Avertissement">
        <p>
          Inner Bloom est une application de bien-être et de remise en forme.
          Elle ne remplace pas un avis médical. Consultez un professionnel de
          santé avant de débuter un programme d&apos;entraînement.
        </p>
      </Section>
    </LegalPage>
  );
}
