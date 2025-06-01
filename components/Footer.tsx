
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900/80 py-6 mt-auto">
      <div className="container mx-auto px-4 text-center">
        <p className="text-slate-400 text-sm">
          &copy; {new Date().getFullYear()} AI Resume Tailor. Powered by Gemini.
        </p>
        <p className="text-slate-500 text-xs mt-1">
          Disclaimer: AI generations may require review and editing. Always verify important information.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
