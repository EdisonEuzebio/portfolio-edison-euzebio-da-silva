import React from 'react';
import { AccordionItem } from '../ui/Accordion';
import { Info } from 'lucide-react';

interface SidebarProps {
  options: any;
  setOptions: (options: any) => void;
}

export function Sidebar({ options, setOptions }: SidebarProps) {
  const handleChange = (path: string, value: any) => {
    const newOptions = { ...options };
    const keys = path.split('.');
    let current = newOptions;
    
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]];
    }
    
    current[keys[keys.length - 1]] = value;
    setOptions(newOptions);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        handleChange('image', event.target?.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <aside className="w-full md:w-[450px] border-r border-slate-200 bg-slate-50 p-6">
      <div className="space-y-6">
        <h3 className="text-xl font-bold text-slate-800">Configurações</h3>
        
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <AccordionItem title="Opções principais" defaultOpen={true}>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-600">Data</label>
                <input 
                  type="text" 
                  value={options.data}
                  onChange={(e) => handleChange('data', e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-md focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                  placeholder="https://example.com"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-600">Image file</label>
                <input 
                  type="file" 
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100 transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-600">Largura</label>
                  <input 
                    type="number" 
                    value={options.width}
                    onChange={(e) => handleChange('width', Number(e.target.value))}
                    className="w-full p-2 border border-slate-200 rounded-md focus:ring-2 focus:ring-purple-500 outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-600">Altura</label>
                  <input 
                    type="number" 
                    value={options.height}
                    onChange={(e) => handleChange('height', Number(e.target.value))}
                    className="w-full p-2 border border-slate-200 rounded-md focus:ring-2 focus:ring-purple-500 outline-none"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-600">Margem</label>
                <input 
                  type="number" 
                  value={options.margin}
                  onChange={(e) => handleChange('margin', Number(e.target.value))}
                  className="w-full p-2 border border-slate-200 rounded-md focus:ring-2 focus:ring-purple-500 outline-none"
                />
              </div>
            </div>
          </AccordionItem>

          <AccordionItem title="Dots Options">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-600">Dots Style</label>
                <select 
                  value={options.dotsOptions.type}
                  onChange={(e) => handleChange('dotsOptions.type', e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-md outline-none"
                >
                  <option value="square">Square</option>
                  <option value="dots">Dots</option>
                  <option value="rounded">Rounded</option>
                  <option value="extra-rounded">Extra Rounded</option>
                  <option value="classy">Classy</option>
                  <option value="classy-rounded">Classy Rounded</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-600">Color Type</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 text-sm">
                    <input 
                      type="radio" 
                      checked={!options.dotsOptions.gradient}
                      onChange={() => handleChange('dotsOptions.gradient', null)}
                    /> Single
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input 
                      type="radio" 
                      checked={!!options.dotsOptions.gradient}
                      onChange={() => handleChange('dotsOptions.gradient', { type: 'linear', rotation: 0, colorStops: [{ offset: 0, color: options.dotsOptions.color }, { offset: 1, color: '#000000' }] })}
                    /> Gradient
                  </label>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-600">DOTS Color</label>
                <input 
                  type="color" 
                  value={options.dotsOptions.color}
                  onChange={(e) => handleChange('dotsOptions.color', e.target.value)}
                  className="w-full h-10 p-1 border border-slate-200 rounded-md cursor-pointer"
                />
              </div>
            </div>
          </AccordionItem>

          <AccordionItem title="Corners Square Options">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-600">Corners Square Style</label>
                <select 
                  value={options.cornersSquareOptions.type}
                  onChange={(e) => handleChange('cornersSquareOptions.type', e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-md outline-none"
                >
                  <option value="">None</option>
                  <option value="square">Square</option>
                  <option value="dot">Dot</option>
                  <option value="extra-rounded">Extra Rounded</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-600">Corners Square Color</label>
                <input 
                  type="color" 
                  value={options.cornersSquareOptions.color}
                  onChange={(e) => handleChange('cornersSquareOptions.color', e.target.value)}
                  className="w-full h-10 p-1 border border-slate-200 rounded-md cursor-pointer"
                />
              </div>
            </div>
          </AccordionItem>

          <AccordionItem title="Corners Dot Options">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-600">Corners Dot Style</label>
                <select 
                  value={options.cornersDotOptions.type}
                  onChange={(e) => handleChange('cornersDotOptions.type', e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-md outline-none"
                >
                  <option value="">None</option>
                  <option value="square">Square</option>
                  <option value="dot">Dot</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-600">Corners Dot Color</label>
                <input 
                  type="color" 
                  value={options.cornersDotOptions.color}
                  onChange={(e) => handleChange('cornersDotOptions.color', e.target.value)}
                  className="w-full h-10 p-1 border border-slate-200 rounded-md cursor-pointer"
                />
              </div>
            </div>
          </AccordionItem>

          <AccordionItem title="Background Options">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-600">Background Color</label>
                <input 
                  type="color" 
                  value={options.backgroundOptions.color}
                  onChange={(e) => handleChange('backgroundOptions.color', e.target.value)}
                  className="w-full h-10 p-1 border border-slate-200 rounded-md cursor-pointer"
                />
              </div>
            </div>
          </AccordionItem>

          <AccordionItem title="Image Options">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  checked={options.imageOptions.hideBackgroundDots}
                  onChange={(e) => handleChange('imageOptions.hideBackgroundDots', e.target.checked)}
                  className="w-4 h-4 text-purple-600 rounded"
                />
                <label className="text-sm font-medium text-slate-600">Hide Background Dots</label>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-600">Image Size</label>
                <input 
                  type="range" 
                  min="0.1" 
                  max="1" 
                  step="0.1"
                  value={options.imageOptions.imageSize}
                  onChange={(e) => handleChange('imageOptions.imageSize', Number(e.target.value))}
                  className="w-full accent-purple-600"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-600">Margin</label>
                <input 
                  type="number" 
                  value={options.imageOptions.margin}
                  onChange={(e) => handleChange('imageOptions.margin', Number(e.target.value))}
                  className="w-full p-2 border border-slate-200 rounded-md"
                />
              </div>
            </div>
          </AccordionItem>

          <AccordionItem title="QR Options">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-600">Type Number</label>
                <input 
                  type="number" 
                  min="0" 
                  max="40"
                  value={options.qrOptions.typeNumber}
                  onChange={(e) => handleChange('qrOptions.typeNumber', Number(e.target.value))}
                  className="w-full p-2 border border-slate-200 rounded-md"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-600">Mode</label>
                <select 
                  value={options.qrOptions.mode}
                  onChange={(e) => handleChange('qrOptions.mode', e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-md outline-none"
                >
                  <option value="Numeric">Numeric</option>
                  <option value="Alphanumeric">Alphanumeric</option>
                  <option value="Byte">Byte</option>
                  <option value="Kanji">Kanji</option>
                </select>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-1 group relative">
                  <label className="text-sm font-medium text-slate-600">Error Correction Level</label>
                  <Info className="w-3.5 h-3.5 text-slate-400 cursor-help" />
                  <div className="absolute bottom-full left-0 mb-2 w-64 p-3 bg-slate-800 text-white text-[11px] rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                    <p className="mb-1 font-bold border-b border-slate-600 pb-1">Níveis de Correção de Erro:</p>
                    <p><strong>L:</strong> 7% (Alta densidade, baixa recuperação)</p>
                    <p><strong>M:</strong> 15% (Equilibrado)</p>
                    <p><strong>Q:</strong> 25% (Boa recuperação)</p>
                    <p><strong>H:</strong> 30% (Máxima recuperação - Ideal para logos)</p>
                  </div>
                </div>
                <select 
                  value={options.qrOptions.errorCorrectionLevel}
                  onChange={(e) => handleChange('qrOptions.errorCorrectionLevel', e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-md outline-none"
                >
                  <option value="L">L (7%)</option>
                  <option value="M">M (15%)</option>
                  <option value="Q">Q (25%)</option>
                  <option value="H">H (30%)</option>
                </select>
              </div>
            </div>
          </AccordionItem>
        </div>

        <button 
          onClick={() => {
            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(options, null, 2));
            const downloadAnchorNode = document.createElement('a');
            downloadAnchorNode.setAttribute("href", dataStr);
            downloadAnchorNode.setAttribute("download", "qr-options.json");
            document.body.appendChild(downloadAnchorNode);
            downloadAnchorNode.click();
            downloadAnchorNode.remove();
          }}
          className="w-full mt-6 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all shadow-lg active:scale-[0.98]"
        >
          EXPORT OPTIONS AS JSON
        </button>
      </div>
    </aside>
  );
}
