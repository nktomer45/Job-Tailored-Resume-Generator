import React, { useState, useCallback } from "react";
import { ResumeData } from "./types";
import { generateTailoredResume } from "./services/geminiService";
import ResumeInputForm from "./components/ResumeInputForm";
import GeneratedResume from "./components/GeneratedResume";
import LoadingSpinner from "./components/LoadingSpinner";
import Header from "./components/Header";
import Footer from "./components/Footer";

const App: React.FC = () => {
  const [tailoredResume, setTailoredResume] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback(async (data: ResumeData) => {
    setIsLoading(true);
    setError(null);
    setTailoredResume(null);
    try {
      if (!process.env.API_KEY) {
        setError(
          "API key is not configured. Please ensure the API_KEY environment variable is set."
        );
        setIsLoading(false);
        return;
      }
      // Pass careerStartDate to the service
      const result = await generateTailoredResume(
        data.originalResume,
        data.jobDescription,
        data.careerStartDate
      );
      setTailoredResume(result);
    } catch (err) {
      if (err instanceof Error) {
        setError(`Failed to generate resume: ${err.message}`);
      } else {
        setError("An unknown error occurred.");
      }
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-sky-900 text-slate-100">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8">
        <div className="lg:w-1/2 flex flex-col">
          <ResumeInputForm onSubmit={handleSubmit} isLoading={isLoading} />
        </div>
        <div className="lg:w-1/2 flex flex-col">
          {isLoading && (
            <div className="flex justify-center items-center h-full bg-slate-700/50 rounded-lg p-6">
              <LoadingSpinner />
            </div>
          )}
          {error && (
            <div
              className="bg-red-700/80 border border-red-500 text-red-100 px-4 py-3 rounded-lg relative mb-4"
              role="alert"
            >
              <strong className="font-bold">Error:</strong>
              <span className="block sm:inline ml-2">{error}</span>
            </div>
          )}
          {!isLoading && tailoredResume && (
            <GeneratedResume resumeText={tailoredResume} />
          )}
          {!isLoading && !tailoredResume && !error && (
            <div className="flex flex-col justify-center items-center h-full bg-slate-800/60 rounded-lg p-6 shadow-xl border border-slate-700">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-16 h-16 text-sky-500 mb-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                />
              </svg>
              <p className="text-slate-300 text-center">
                Your tailored resume will appear here once generated.
              </p>
              <p className="text-slate-400 text-sm text-center mt-1">
                Fill in the details and click "Generate Tailored Resume".
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default App;
