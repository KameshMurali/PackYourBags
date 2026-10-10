import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/legal-page";
import { CONTACT_EMAIL, OPERATOR_NAME, SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of use",
  description: `The ground rules for using ${SITE_NAME}.`,
};

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of use"
      intro={`By using ${SITE_NAME} you agree to these short terms. ${SITE_NAME} is run by ${OPERATOR_NAME}.`}
    >
      <section>
        <h2>Visa and travel information is indicative</h2>
        <p>
          Visa and entry rules change often and depend on your exact situation. What you see here is a
          guide, not legal or immigration advice. Always confirm with the official source linked on each
          result before you book or travel. Itineraries written by the AI concierge can contain mistakes
          too, so check opening hours, prices and availability yourself.
        </p>
      </section>

      <section>
        <h2>Using the service</h2>
        <ul>
          <li>Use it for your own trip planning, and be truthful about your account.</li>
          <li>
            Don’t try to get around the free allowance, overload the service, scrape it, or attack it.
          </li>
          <li>Don’t use it to break the law or to harm other people.</li>
        </ul>
        <p className="mt-3">
          The AI concierge has a limited number of free itineraries per person. Access can be paused,
          limited or removed at any time, including to protect the service or its running costs.
        </p>
      </section>

      <section>
        <h2>Your content</h2>
        <p>
          The trip briefs and plans you create are yours. You allow {SITE_NAME} to process them only to
          run the features you use, as described in the <Link href="/privacy">privacy policy</Link>.
        </p>
      </section>

      <section>
        <h2>No warranty, limited liability</h2>
        <p>
          {SITE_NAME} is provided &ldquo;as is&rdquo;, without promises about accuracy, availability or
          fitness for a purpose. To the extent the law allows, {OPERATOR_NAME} is not liable for losses
          that come from relying on information here, such as a refused boarding or a missed trip. Nothing
          in these terms limits rights you have that can’t be limited by law.
        </p>
      </section>

      <section>
        <h2>The service can change</h2>
        <p>
          Features may change, and the service may be paused or shut down. These terms may be updated;
          the date at the top shows the latest version, and using the service after a change means you
          accept it.
        </p>
      </section>

      <section>
        <h2>Contact</h2>
        <p>
          Questions or reports of an error in the visa data: <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
        </p>
      </section>
    </LegalPage>
  );
}
