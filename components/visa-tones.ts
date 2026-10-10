// Category colours for the visa explorer (text/background pairs meet WCAG AA).
// `accent` is the solid colour used for decorative accents (card edge, glow, progress bars).
export const VISA_TONES: Record<string, { pill: string; dot: string; accent: string }> = {
  green: { pill: "bg-[#eaf3de] text-[#3b6d11]", dot: "bg-[#639922]", accent: "#639922" },
  teal: { pill: "bg-[#e1f5ee] text-[#0f6e56]", dot: "bg-[#1d9e75]", accent: "#1d9e75" },
  sky: { pill: "bg-[#e6f1fb] text-[#185fa5]", dot: "bg-[#378add]", accent: "#378add" },
  amber: { pill: "bg-[#faeeda] text-[#854f0b]", dot: "bg-[#ba7517]", accent: "#ba7517" },
  clay: { pill: "bg-[#fde8d3] text-[#b5391c]", dot: "bg-clay", accent: "#b5391c" },
};
