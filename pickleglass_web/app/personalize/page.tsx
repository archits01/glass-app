'use client'

import { useState, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'
import { getPresets, updatePreset, PromptPreset } from '@/utils/api'

export default function PersonalizePage() {
  const [allPresets, setAllPresets] = useState<PromptPreset[]>([]);
  const [selectedPreset, setSelectedPreset] = useState<PromptPreset | null>(null);
  const [showPresets, setShowPresets] = useState(true);
  const [editorContent, setEditorContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const presetsData = await getPresets();
        setAllPresets(presetsData);
        
        if (presetsData.length > 0) {
          const firstUserPreset = presetsData.find(p => p.is_default === 0) || presetsData[0];
          setSelectedPreset(firstUserPreset);
          setEditorContent(firstUserPreset.prompt);
        }
      } catch (error) {
        console.error("Failed to fetch presets:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const handlePresetClick = (preset: PromptPreset) => {
    if (isDirty && !window.confirm("You have unsaved changes. Are you sure you want to switch?")) {
        return;
    }
    setSelectedPreset(preset);
    setEditorContent(preset.prompt);
    setIsDirty(false);
  };

  const handleEditorChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditorContent(e.target.value);
    setIsDirty(true);
  };

  const handleSave = async () => {
    if (!selectedPreset || saving || !isDirty) return;
    
    if (selectedPreset.is_default === 1) {
        alert("Default presets cannot be modified.");
        return;
    }
    
    try {
      setSaving(true);
      await updatePreset(selectedPreset.id, { 
        title: selectedPreset.title, 
        prompt: editorContent 
      });

      setAllPresets(prev => 
        prev.map(p => 
          p.id === selectedPreset.id 
            ? { ...p, prompt: editorContent }
            : p
          )
        );
      setIsDirty(false);
        console.log('Save completed!');
    } catch (error) {
      console.error("Save failed:", error);
      alert("Failed to save preset. See console for details.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="bg-white border-b border-gray-100">
        <div className="px-8 pt-8 pb-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500 mb-2">Presets</p>
              <h1 className="text-3xl font-bold text-gray-900">Personalize</h1>
            </div>
            <button
              onClick={handleSave}
              disabled={saving || !isDirty || selectedPreset?.is_default === 1}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                !isDirty && !saving
                  ? 'bg-gray-500 text-white cursor-default'
                  : saving 
                    ? 'bg-gray-400 text-white cursor-not-allowed' 
                    : 'bg-gray-600 text-white hover:bg-gray-700'
              }`}
            >
              {!isDirty && !saving ? 'Saved' : saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      </div>

      <div className={`transition-colors duration-300 ${showPresets ? 'bg-gray-50' : 'bg-white'}`}>
        <div className="px-8 py-6">
          <div className="mb-6">
            <button
              onClick={() => setShowPresets(!showPresets)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 text-sm font-medium transition-colors"
            >
              <ChevronDown 
                className={`h-4 w-4 transition-transform duration-200 ${showPresets ? 'rotate-180' : ''}`}
              />
              {showPresets ? 'Hide Presets' : 'Show Presets'}
            </button>
          </div>
          
          {showPresets && (
            <div className="grid grid-cols-5 gap-4 mb-6">
              {allPresets.map((preset) => (
                <div
                  key={preset.id}
                  onClick={() => handlePresetClick(preset)}
                  className={`
                    p-4 rounded-lg cursor-pointer transition-all duration-200 bg-white
                    h-48 flex flex-col shadow-sm hover:shadow-md
                    ${selectedPreset?.id === preset.id
                      ? 'border-2 border-blue-500 shadow-md'
                      : 'border border-gray-200 hover:border-gray-300'
                    }
                  `}
                >
                  <h3 className="font-semibold text-gray-900 mb-3 text-center text-sm">
                    {preset.title}
                  </h3>
                  <p className="text-xs text-gray-600 leading-relaxed flex-1 overflow-hidden">
                    {preset.prompt.substring(0, 100) + (preset.prompt.length > 100 ? '...' : '')}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 bg-white">
        <div className="h-full px-8 py-6">
          <textarea
            value={editorContent}
            onChange={handleEditorChange}
            className="w-full h-full text-sm text-gray-900 border-0 resize-none focus:outline-none bg-transparent font-mono leading-relaxed"
            placeholder="Select a preset or type directly..."
          />
        </div>
      </div>
    </div>
  );
} 