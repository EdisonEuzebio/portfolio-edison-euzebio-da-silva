import React from 'react';

export function Hero() {
  return (
    <section 
      className="py-16 px-8 flex flex-col items-center justify-center text-center relative overflow-hidden"
      style={{
        background: 'linear-gradient(90deg, rgb(0, 0, 0) 0%, rgb(106, 26, 76) 50%, rgb(255, 255, 255) 100%)'
      }}
    >
      <div className="relative z-10">
        <h2 className="text-5xl md:text-6xl font-black text-white mb-4 drop-shadow-lg">
          QR Code Styling
        </h2>
        <p className="text-xl text-white/90 font-medium mb-2">
          An Open source JS library
        </p>
        <p className="text-lg text-white/80 italic">
          For generating styled QR Codes
        </p>
      </div>
      
      {/* Subtle overlay to ensure text readability if needed, though the gradient is quite dark in the middle */}
      <div className="absolute inset-0 bg-black/10 pointer-events-none" />
    </section>
  );
}
