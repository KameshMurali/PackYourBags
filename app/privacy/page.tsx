import type { Metadata } from "next";
import Link from "next/link";
import { DeleteAccount } from "@/components/delete-account";
import { LegalPage } from "@/components/legal-page";
import { CONTACT_EMAIL, OPERATOR_NAME, SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy policy",
  description: `What ${SITE_NAME} collects, why, who it is shared with, and how to delete it.`,
};

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy policy"
      intro={`${SITE_NAME} helps you check visa rules and plan trips. This page explains, in plain language, what it stores about you and what you can do about it. It is run by ${OPERATOR_NAME}.`}
    >
      <section>
        <h2>What we collect</h2>
        <ul>
          <li>
            <strong>When you sign in with Google:</strong> your name, email address and profile photo
            link. We never see your Google password.
          </li>
          <li>
            <strong>Basic activity on your account:</strong> when you first and last visited, how many
            times you signed in, how many AI itineraries you have generated, and whether you are on the
            free or Pro plan.
          </li>
          <li>
            <strong>What you type into the AI concierge:</strong> your trip brief is sent to Anthropic
            to write the itinerary. We do not keep your briefs on our servers; the itinerary comes back
            to your browser.
          </li>
          <li>
            <strong>Plans saved from Claude or ChatGPT:</strong> if you connect an assistant and ask it to
            save a trip, that trip is stored under your account so you can see it on the Connect page.
          </li>
          <li>
            <strong>In your own browser:</strong> trip briefs and itineraries you save are kept in your
            browser’s local storage on your device.
          </li>
        </ul>
        <p className="mt-3">
          The visa explorer works without an account and does not collect anything about you.
        </p>
      </section>

      <section>
        <h2>Cookies</h2>
        <p>
          Only the cookies the site needs to work: Google sign-in and your session (set by the Auth.js
          library), and a connection token if you use the Connect page. There are no advertising or
          tracking cookies and no analytics.
        </p>
      </section>

      <section>
        <h2>Why we use it</h2>
        <ul>
          <li>To sign you in and show you your own plans.</li>
          <li>To generate itineraries and keep the free allowance fair (a few per person).</li>
          <li>To keep the service secure and stop abuse.</li>
        </ul>
        <p className="mt-3">We do not sell your data, show ads, or use it for anything else.</p>
      </section>

      <section>
        <h2>Who it is shared with</h2>
        <p>Only the services that run the site, each for one job:</p>
        <ul>
          <li>
            <strong>Google</strong>, to sign you in.
          </li>
          <li>
            <strong>Anthropic</strong>, which receives your concierge trip brief to write the itinerary,
            under its own API terms.
          </li>
          <li>
            <strong>Vercel</strong>, which hosts the site and keeps standard server logs.
          </li>
          <li>
            <strong>Upstash</strong>, which stores account records and assistant-saved plans.
          </li>
        </ul>
      </section>

      <section>
        <h2>How long we keep it</h2>
        <p>
          Your account record and saved plans stay until you delete them. If you delete your data, one
          small thing remains: a count of how many free itineraries that email address has used, stored
          under a one-way hash rather than your email. It exists only so the free allowance can’t be
          reset by deleting and re-creating an account.
        </p>
      </section>

      <section>
        <h2>Your choices</h2>
        <p>
          You can delete your data yourself, right now, from this page. It removes your profile record,
          your assistant-saved plans, and the trips saved in this browser, and signs you out.
        </p>
        <DeleteAccount />
        <p className="mt-4">
          You can also email <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> to ask for a copy of
          your data, a correction, or deletion. Revoking {SITE_NAME}’s access in your{" "}
          <a href="https://myaccount.google.com/permissions" rel="noopener noreferrer" target="_blank">
            Google account settings
          </a>{" "}
          also stops it from signing you in.
        </p>
      </section>

      <section>
        <h2>Children</h2>
        <p>{SITE_NAME} is not meant for anyone under 13, and we do not knowingly collect their data.</p>
      </section>

      <section>
        <h2>Changes and contact</h2>
        <p>
          If this policy changes, the date at the top changes too. Questions go to{" "}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>. See also the{" "}
          <Link href="/terms">terms of use</Link>.
        </p>
      </section>
    </LegalPage>
  );
}
