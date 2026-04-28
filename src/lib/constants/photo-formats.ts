export interface PhotoFormat {
  id: string;
  country: string;
  flag: string;
  type: string;
  dimensionsMm: string;
  dimensionsInches: string;
  resolutionPx: string;
  bgColor: string;
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
  },
];
