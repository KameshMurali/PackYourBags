import { Plane } from "lucide-react";

// The passport / residence / held-visa controls, dressed as a boarding pass: two halves
// joined by a dashed tear line with a notch at each end. Purely presentational, so the
// controls stay in the explorer (and keep their state and accessible names).
export function VisaTicket({
  profile,
  visas,
}: {
  profile: React.ReactNode;
  visas: React.ReactNode;
}) {
  return (
    <div className="visa-ticket">
      <div className="visa-ticket-top rounded-t-[2rem] bg-white px-5 pb-7 pt-5 md:px-8 md:pt-6">
        <div className="mb-5 flex items-center justify-between gap-4">
          <p className="inline-flex items-center gap-2.5 text-[0.7rem] font-extrabold uppercase tracking-[0.2em] text-clay">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-sunset text-night">
              <Plane className="h-4 w-4" aria-hidden />
            </span>
            Your travel profile
          </p>
          <span aria-hidden className="visa-barcode hidden h-6 w-24 sm:block" />
        </div>
        {profile}
      </div>
      <div className="visa-ticket-bottom rounded-b-[2rem] bg-[#fffaf2] px-5 pb-6 pt-7 md:px-8">
        {visas}
      </div>
    </div>
  );
}
