import React, { useState, useRef } from 'react';
import { ResumeData } from '../types';
import * as pdfjsLib from 'pdfjs-dist/build/pdf.min.mjs';

// Set the workerSrc for pdf.js. This path will be resolved by the import map.
// It's crucial for pdf.js to operate correctly, especially for larger files or complex operations.
pdfjsLib.GlobalWorkerOptions.workerSrc = 'pdfjs-dist/build/pdf.worker.min.mjs';

interface ResumeInputFormProps {
  onSubmit: (data: ResumeData) => void;
  isLoading: boolean;
}

const ResumeInputForm: React.FC<ResumeInputFormProps> = ({ onSubmit, isLoading }) => {
  const [originalResume, setOriginalResume] = useState<string>('');
  const [jobDescription, setJobDescription] = useState<string>('');
  const [careerStartDate, setCareerStartDate] = useState<string>('');
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const clearFileStates = () => {
    setOriginalResume('');
    setFileName(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; // Reset the file input
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setOriginalResume(''); 

      if (file.type === "text/plain" || file.type === "text/markdown") {
        const reader = new FileReader();
        reader.onload = (e) => {
          const text = e.target?.result as string | null;
          setOriginalResume(text || '');
          if (!(text || '').trim()) {
            alert(`The file "${file.name}" was processed, but it appears to be empty or contains only whitespace. The resume field is empty. Please try a different file or paste text manually.`);
          }
        };
        reader.onerror = (e) => {
          console.error("Error reading text file:", e);
          alert("Error reading file. Please ensure it's a valid .txt or .md file.");
          clearFileStates();
        };
        reader.readAsText(file);
      } else if (file.type === "application/pdf") {
        try {
          const arrayBuffer = await file.arrayBuffer();
          const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
          const pdf = await loadingTask.promise;
          
          let extractedText = "";
          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            textContent.items.forEach(item => {
              if ('str' in item) { // Type guard for TextItem
                extractedText += item.str + " ";
              }
            });
            extractedText += "\n"; 
            page.cleanup(); // Recommended for memory management
          }
          
          setOriginalResume(extractedText.trim());
          if (!extractedText.trim()) {
            alert(`The file "${file.name}" (PDF) was processed, but no text content could be extracted. It might contain images of text, be empty, or have an unsupported format for text extraction. The resume field is empty.`);
          }
        } catch (pdfError) {
          console.error("Error parsing PDF with pdf.js:", pdfError);
          let message = "Error parsing PDF. The file might be corrupted or in an unsupported PDF format.";
          if (pdfError instanceof Error) {
              if (pdfError.name === 'PasswordException') {
                  message = "The PDF file is password-protected and cannot be opened.";
              } else if (pdfError.name === 'InvalidPDFException') {
                  message = "Invalid or corrupted PDF file.";
              } else if (pdfError.name === 'MissingPDFException') {
                  message = "The provided file does not appear to be a valid PDF.";
              }
          }
          alert(message + " Please try a different PDF or a .txt/.md file.");
          clearFileStates();
        }
      } else {
        alert("Unsupported file type. Please upload a .pdf, .txt, or .md file.");
        clearFileStates();
      }
    }
  };

  const handleClearFile = () => {
    clearFileStates();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!originalResume.trim() || !jobDescription.trim()) {
      alert("Please provide your original resume (by typing or uploading meaningful content) and the job description.");
      return;
    }
    onSubmit({ originalResume, jobDescription, careerStartDate: careerStartDate.trim() });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-slate-800/60 p-6 rounded-lg shadow-xl border border-slate-700 h-full flex flex-col">
      <div className="flex-grow flex flex-col space-y-6">
        <div>
          <div className="flex justify-between items-center mb-1">
            <label htmlFor="originalResume" className="block text-sm font-medium text-sky-400">
              Your Current Resume
            </label>
            <input
              type="file"
              id="resumeFile"
              ref={fileInputRef}
              className="hidden"
              accept=".txt,.md,.pdf"
              onChange={handleFileChange}
              disabled={isLoading}
              aria-label="Upload resume file"
            />
            <label
              htmlFor="resumeFile"
              className={`cursor-pointer px-3 py-1.5 text-xs font-medium rounded-md border transition-colors duration-150 ${
                isLoading
                  ? 'bg-slate-600 text-slate-400 border-slate-500 cursor-not-allowed'
                  : 'bg-sky-700 hover:bg-sky-600 text-white border-sky-600'
              }`}
              aria-disabled={isLoading}
            >
              Upload File (.txt, .md, .pdf)
            </label>
          </div>
           {fileName && (
            <div className="mt-2 mb-1 p-2 bg-slate-700/70 border border-slate-600 rounded-md text-xs text-slate-300 flex justify-between items-center" aria-live="polite">
              <span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 inline mr-2 align-middle text-sky-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 0 0 2.122 2.122l7.81-7.81" />
                </svg>
                {fileName}
                </span>
              <button
                type="button"
                onClick={handleClearFile}
                className="ml-2 p-0.5 rounded-full hover:bg-slate-600 focus:outline-none focus:ring-1 focus:ring-sky-500 focus:ring-offset-1 focus:ring-offset-slate-700"
                aria-label="Clear uploaded file"
                disabled={isLoading}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-slate-400 hover:text-slate-200">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}
          <textarea
            id="originalResume"
            name="originalResume"
            rows={fileName ? 8 : 10} 
            className="block w-full p-3 bg-slate-700 border border-slate-600 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500 text-slate-200 placeholder-slate-400 resize-none transition-all duration-150"
            placeholder="Paste your current resume here, or upload a .txt, .md, or .pdf file..."
            value={originalResume}
            onChange={(e) => {
              setOriginalResume(e.target.value);
            }}
            required
            disabled={isLoading}
            aria-describedby="resume-description"
          />
          <p id="resume-description" className="sr-only">Input for your current resume. You can either paste text or upload a .txt, .md, or .pdf file.</p>
        </div>

        <div>
          <label htmlFor="careerStartDate" className="block text-sm font-medium text-sky-400 mb-1">
            When did you start your career? (Optional)
          </label>
          <input
            type="text"
            id="careerStartDate"
            name="careerStartDate"
            className="block w-full p-3 bg-slate-700 border border-slate-600 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500 text-slate-200 placeholder-slate-400"
            placeholder="E.g., 2018 or 05/2018"
            value={careerStartDate}
            onChange={(e) => setCareerStartDate(e.target.value)}
            disabled={isLoading}
            aria-describedby="career-start-description"
          />
          <p id="career-start-description" className="sr-only">Input for your career start date, e.g., YYYY or MM/YYYY. This is optional.</p>
        </div>

        <div className="flex-grow flex flex-col">
          <label htmlFor="jobDescription" className="block text-sm font-medium text-sky-400 mb-1">
            Job Description
          </label>
          <textarea
            id="jobDescription"
            name="jobDescription"
            rows={10}
            className="block w-full p-3 bg-slate-700 border border-slate-600 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500 text-slate-200 placeholder-slate-400 resize-none flex-grow"
            placeholder="Paste the job description here..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            required
            disabled={isLoading}
            aria-describedby="job-description-desc"
          />
          <p id="job-description-desc" className="sr-only">Input for the job description.</p>
        </div>
      </div>
      <div className="mt-auto pt-4">
        <button
          type="submit"
          disabled={isLoading || !originalResume.trim() || !jobDescription.trim()}
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-sky-500 disabled:bg-slate-500 disabled:text-slate-400 disabled:cursor-not-allowed transition-colors duration-150"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating...
            </>
          ) : (
            'Generate Tailored Resume'
          )}
        </button>
      </div>
    </form>
  );
};

export default ResumeInputForm;