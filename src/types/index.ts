// API response types
export interface SentimentResponse {
  label: "POSITIVE" | "NEGATIVE" | "NEUTRAL";
  score: number;
}

// Application state types
export type SentimentAnalysisStatus = "idle" | "loading" | "success" | "error";

export interface SentimentAnalysisState {
  status: SentimentAnalysisStatus;
  result?: SentimentResponse;
  error?: string;
}

// Sentiment descriptions and tips
export interface SentimentInfo {
  description: string;
  tip: string;
}

export type SentimentInfoMap = {
  [key in SentimentResponse["label"]]: SentimentInfo;
};
