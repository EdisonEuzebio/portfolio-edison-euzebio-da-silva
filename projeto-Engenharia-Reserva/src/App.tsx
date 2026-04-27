/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Header } from './components/layout/Header';
import { Hero } from './components/layout/Hero';
import { Sidebar } from './components/layout/Sidebar';
import { QRPreview } from './components/qr/QRPreview';

export default function App() {
  // Initial state for QR Code Styling
  const [options, setOptions] = useState({
    width: 300,
    height: 300,
    data: "https://qr-code-styling.com",
    margin: 0,
    qrOptions: {
      typeNumber: 0,
      mode: "Byte",
      errorCorrectionLevel: "H"
    },
    imageOptions: {
      hideBackgroundDots: true,
      imageSize: 0.4,
      margin: 0
    },
    dotsOptions: {
      type: "rounded",
      color: "#6a1a4c",
      gradient: null
    },
    backgroundOptions: {
      color: "#ffffff"
    },
    cornersSquareOptions: {
      type: "extra-rounded",
      color: "#000000"
    },
    cornersDotOptions: {
      type: "dot",
      color: "#000000"
    }
  });

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 flex flex-col">
      <Header />
      
      <div className="flex-1 flex flex-col overflow-y-auto">
        <Hero />
        
        <main className="flex flex-col md:flex-row">
          {/* Sidebar for Options on the left */}
          <Sidebar options={options} setOptions={setOptions} />

          {/* QR Code Preview on the right */}
          <div className="flex-1 p-8 flex justify-center items-start min-h-[500px] bg-white">
            <QRPreview options={options} />
          </div>
        </main>
      </div>
    </div>
  );
}
