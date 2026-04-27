import React, { useEffect, useRef } from 'react';
import QRCodeStyling from 'qr-code-styling';

interface QRPreviewProps {
  options: any;
}

export function QRPreview({ options }: QRPreviewProps) {
  const ref = useRef<HTMLDivElement>(null);
  const qrCode = useRef<QRCodeStyling | null>(null);

  useEffect(() => {
    qrCode.current = new QRCodeStyling(options);
    if (ref.current) {
      qrCode.current.append(ref.current);
    }
  }, []);

  useEffect(() => {
    if (qrCode.current) {
      qrCode.current.update(options);
    }
  }, [options]);

  const onDownload = (extension: 'png' | 'jpeg' | 'webp' | 'svg') => {
    if (qrCode.current) {
      qrCode.current.download({ extension });
    }
  };

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="bg-white p-8 rounded-2xl shadow-2xl border border-slate-100 flex items-center justify-center">
        <div ref={ref} className="qr-container" />
      </div>

      <div className="flex flex-wrap justify-center gap-3">
        {(['png', 'jpeg', 'svg'] as const).map((ext) => (
          <button
            key={ext}
            onClick={() => onDownload(ext)}
            className="px-6 py-2 bg-white border border-slate-200 rounded-full text-sm font-bold text-slate-700 hover:border-purple-500 hover:text-purple-600 transition-all shadow-sm active:scale-95 uppercase"
          >
            {ext}
          </button>
        ))}
      </div>
    </div>
  );
}
