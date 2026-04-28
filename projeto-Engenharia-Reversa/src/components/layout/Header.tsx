import React from 'react';

export function Header() {
  return (
    <header className="h-16 border-b border-slate-200 flex items-center justify-between px-6 bg-white sticky top-0 z-50">
      <div className="flex items-center gap-2">
        <h1 className="text-xl font-bold tracking-tight text-slate-900">
          QR Code Styling
        </h1>
      </div>
      
      <div className="flex items-center gap-6 text-sm font-medium">
        <a 
          href="https://www.npmjs.com/package/qr-code-styling" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-slate-600 hover:text-slate-900 transition-colors"
        >
          npm v1.8.3
        </a>
        <a 
          href="https://github.com/kozakdenys/qr-code-styling" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-slate-600 hover:text-slate-900 transition-colors"
        >
          GitHub
        </a>
      </div>
    </header>
  );
}
