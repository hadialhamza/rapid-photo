export interface PhotoFormat {
  // Display fields (used by SupportedFormatsSection)
  id: string;
  country: string;
  flag: string;
  type: string;
  dimensionsMm: string;
  dimensionsInches: string;
  resolutionPx: string;
  bgColor: string;

  // Engine fields (used by processing pipeline)
  widthPx: number;
  heightPx: number;
  aspectRatio: number;
  defaultBgHex: string;
  dpi: number;
  headRatio: number;
  eyeLineRatio: number;
}

export const SUPPORTED_FORMATS: PhotoFormat[] = [
  {
    id: "bd-passport",
    country: "Bangladesh",
    flag: "🇧🇩",
    type: "Passport",
    dimensionsMm: "40 × 50 mm",
    dimensionsInches: "1.5 × 1.9 in",
    resolutionPx: "450 × 570 px",
    bgColor: "White / Blue",
    widthPx: 450,
    heightPx: 570,
    aspectRatio: 450 / 570,
    defaultBgHex: "#FFFFFF",
    dpi: 300,
    headRatio: 0.50,
    eyeLineRatio: 0.40,
  },
  {
    id: "in-visa",
    country: "India",
    flag: "🇮🇳",
    type: "Visa",
    dimensionsMm: "51 × 51 mm",
    dimensionsInches: "2.0 × 2.0 in",
    resolutionPx: "600 × 600 px",
    bgColor: "White",
    widthPx: 600,
    heightPx: 600,
    aspectRatio: 1,
    defaultBgHex: "#FFFFFF",
    dpi: 300,
    headRatio: 0.50,
    eyeLineRatio: 0.40,
  },
  {
    id: "us-passport",
    country: "United States",
    flag: "🇺🇸",
    type: "Passport & Visa",
    dimensionsMm: "51 × 51 mm",
    dimensionsInches: "2.0 × 2.0 in",
    resolutionPx: "600 × 600 px",
    bgColor: "White",
    widthPx: 600,
    heightPx: 600,
    aspectRatio: 1,
    defaultBgHex: "#FFFFFF",
    dpi: 300,
    headRatio: 0.50,
    eyeLineRatio: 0.40,
  },
  {
    id: "uk-passport",
    country: "United Kingdom",
    flag: "🇬🇧",
    type: "Passport",
    dimensionsMm: "35 × 45 mm",
    dimensionsInches: "1.38 × 1.77 in",
    resolutionPx: "413 × 531 px",
    bgColor: "Light Grey",
    widthPx: 413,
    heightPx: 531,
    aspectRatio: 413 / 531,
    defaultBgHex: "#D3D3D3",
    dpi: 300,
    headRatio: 0.50,
    eyeLineRatio: 0.40,
  },
  {
    id: "schengen-visa",
    country: "Schengen Area",
    flag: "🇪🇺",
    type: "Visa",
    dimensionsMm: "35 × 45 mm",
    dimensionsInches: "1.38 × 1.77 in",
    resolutionPx: "413 × 531 px",
    bgColor: "Light / White",
    widthPx: 413,
    heightPx: 531,
    aspectRatio: 413 / 531,
    defaultBgHex: "#FFFFFF",
    dpi: 300,
    headRatio: 0.50,
    eyeLineRatio: 0.40,
  },
  {
    id: "ca-passport",
    country: "Canada",
    flag: "🇨🇦",
    type: "Passport",
    dimensionsMm: "50 × 70 mm",
    dimensionsInches: "2.0 × 2.75 in",
    resolutionPx: "590 × 826 px",
    bgColor: "White",
    widthPx: 590,
    heightPx: 826,
    aspectRatio: 590 / 826,
    defaultBgHex: "#FFFFFF",
    dpi: 300,
    headRatio: 0.50,
    eyeLineRatio: 0.40,
  },
];

/** Find a format by its ID. Returns undefined if not found. */
export function getFormatById(id: string): PhotoFormat | undefined {
  return SUPPORTED_FORMATS.find((f) => f.id === id);
}
