
import React, { useState } from 'react';

interface GeneratedResumeProps {
  resumeText: string | null;
}

const GeneratedResume: React.FC<GeneratedResumeProps> = ({ resumeText }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (resumeText) {
      try {
        await navigator.clipboard.writeText(resumeText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000); // Reset copied status after 2 seconds
      } catch (err) {
        console.error('Failed to copy text: ', err);
        alert('Failed to copy text. Please try again or copy manually.');
      }
    }
  };

  const handleDownload = () => {
    if (!resumeText) return;

    const blob = new Blob([resumeText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'tailored-resume.txt');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (!resumeText) {
    return null; 
  }

  return (
    <div className="bg-slate-800/60 p-6 rounded-lg shadow-xl border border-slate-700 h-full flex flex-col">
      <div className="flex flex-wrap justify-between items-center mb-4 gap-2">
        <h2 className="text-2xl font-semibold text-sky-400">Tailored Resume</h2>
        <div className="flex gap-2">
          <button
            onClick={handleCopy}
            className="px-4 py-2 border border-sky-500 text-sky-400 rounded-md hover:bg-sky-500 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-slate-800 transition-colors duration-150 text-sm flex items-center"
          >
            {copied ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 inline mr-1">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
                Copied!
              </>
            ) : (
               <>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 inline mr-1">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184" />
                </svg>
                Copy Resume
              </>
            )}
          </button>
          <button
            onClick={handleDownload}
            className="px-4 py-2 border border-green-500 text-green-400 rounded-md hover:bg-green-500 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-slate-800 transition-colors duration-150 text-sm flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 inline mr-1">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            Download Resume
          </button>
        </div>
      </div>
      <div className="flex-grow overflow-auto bg-slate-700 p-4 rounded-md border border-slate-600 custom-scrollbar">
        <pre className="whitespace-pre-wrap text-sm text-slate-200 font-sans">{resumeText}</pre>
      </div>
      <p className="text-xs text-slate-400 mt-3">
        Note: AI-generated content. Please review carefully and edit as needed to ensure accuracy and desired formatting.
      </p>
    </div>
  );
};

export default GeneratedResume;
