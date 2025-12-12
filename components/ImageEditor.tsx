import React, { useState, useRef } from 'react';
import { blobToBase64 } from '../services/utils';

export const ImageEditor: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const base64 = await blobToBase64(file);
      setSelectedImage(base64);
      setGeneratedImage(null);
    }
  };

  const handleEdit = async () => {
    if (!selectedImage || !prompt) return;
    setLoading(true);

    try {
      // Simulate image processing (without AI)
      await new Promise(resolve => setTimeout(resolve, 1500));
      alert(`Image processing not available. Received prompt: "${prompt}"`);
      setLoading(false);
    } catch (err) {
      console.error(err);
      alert("Failed to process image.");
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/90 backdrop-blur rounded-2xl p-6 shadow-xl border border-sky-200 w-full max-w-md mx-auto">
      <h2 className="text-xl font-bold text-sky-800 mb-4 flex items-center gap-2">
        <span className="text-2xl">✨</span> Magic Image Editor
      </h2>

      <div className="grid grid-cols-2 gap-2 mb-4">
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="aspect-square bg-sky-50 border-2 border-dashed border-sky-300 rounded-lg flex items-center justify-center cursor-pointer overflow-hidden relative hover:bg-sky-100 transition-colors"
        >
          {selectedImage ? (
            <img src={`data:image/png;base64,${selectedImage}`} alt="Original" className="w-full h-full object-cover" />
          ) : (
            <span className="text-sky-400 text-sm text-center px-2">Click to Upload Base</span>
          )}
        </div>
        <div className="aspect-square bg-sky-50 border-2 border-dashed border-sky-300 rounded-lg flex items-center justify-center overflow-hidden relative">
           {loading ? (
             <div className="w-8 h-8 border-4 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
           ) : generatedImage ? (
             <img src={`data:image/png;base64,${generatedImage}`} alt="Generated" className="w-full h-full object-cover" />
           ) : (
             <span className="text-sky-300 text-sm">Result</span>
           )}
        </div>
      </div>

      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleImageUpload} 
        accept="image/*" 
        className="hidden" 
      />

      <div className="space-y-2">
        <input 
          type="text" 
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          placeholder="e.g., Make it look like a cartoon"
          className="w-full px-4 py-2 border border-sky-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
        />
        <button 
          onClick={handleEdit}
          disabled={loading || !selectedImage}
          className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 rounded-lg transition-colors disabled:opacity-50"
        >
          Apply Magic
        </button>
      </div>
    </div>
  );
};
