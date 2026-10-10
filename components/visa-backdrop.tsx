// Decorative page backdrop for /visa: sunrise washes, a soft dot grid and a few slow-drifting
// glows. Gradients only (no blur filters), animated with transforms, and hidden from assistive tech.
export function VisaBackdrop() {
  return (
    <div aria-hidden className="visa-backdrop">
      <div className="visa-dots" />
      <div className="visa-orb visa-orb--sun" />
      <div className="visa-orb visa-orb--lagoon" />
      <div className="visa-orb visa-orb--coral" />
    </div>
  );
}
