
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-slate-900/80 backdrop-blur-md shadow-lg py-5">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl font-bold text-sky-400">
          Job<span className="text-slate-100">-Tailored</span> Resume <span className="text-slate-100">Generator</span>
        </h1>
        <p className="text-slate-300 mt-2 text-lg">
          Craft the perfect resume for your dream job with AI.
        </p>
      </div>
    </header>
  );
};

export default Header;
