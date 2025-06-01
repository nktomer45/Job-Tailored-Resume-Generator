export interface ResumeData {
  originalResume: string;
  jobDescription: string;
  careerStartDate?: string; // Optional: e.g., "YYYY" or "MM/YYYY"
}

export interface GroundingChunk {
  web?: {
    uri?: string;
    title?: string;
  };
  retrievedContext?: {
    uri?: string;
    title?: string;
  };
}