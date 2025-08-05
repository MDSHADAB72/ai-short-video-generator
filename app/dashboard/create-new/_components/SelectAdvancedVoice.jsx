// File: /app/_components/SelectAdvancedVoice.jsx
"use client"
import { Slider } from '@/components/ui/slider';
import React, { useState } from 'react';


function SelectAdvancedVoice({ onUserSelect }) {
  const [settings, setSettings] = useState({
    voiceId: 'josh',
    stability: 0.5,
    clarity: 0.75,
    style: 0
  });

  // Available voices in ElevenLabs
  const voices = [
    { id: 'rachel', name: 'Rachel (Female)', description: 'Calm and professional' },
    { id: 'domi', name: 'Domi (Female)', description: 'Strong and confident' },
    { id: 'bella', name: 'Bella (Female)', description: 'Gentle and soft' },
    { id: 'antoni', name: 'Antoni (Male)', description: 'Friendly and engaging' },
    { id: 'elli', name: 'Elli (Male)', description: 'Authoritative and clear' },
    { id: 'josh', name: 'Josh (Male)', description: 'Natural conversational' },
    { id: 'arnold', name: 'Arnold (Male)', description: 'Deep and powerful' },
    { id: 'adam', name: 'Adam (Male)', description: 'Smooth and professional' },
    { id: 'sam', name: 'Sam (Male)', description: 'Calm and measured' },
  ];

  const handleVoiceChange = (e) => {
    const newSettings = { ...settings, voiceId: e.target.value };
    setSettings(newSettings);
    onUserSelect('advancedVoice', newSettings);
  };

  const handleStabilityChange = (value) => {
    const newSettings = { ...settings, stability: value[0] };
    setSettings(newSettings);
    onUserSelect('advancedVoice', newSettings);
  };

  const handleClarityChange = (value) => {
    const newSettings = { ...settings, clarity: value[0] };
    setSettings(newSettings);
    onUserSelect('advancedVoice', newSettings);
  };

  const handleStyleChange = (value) => {
    const newSettings = { ...settings, style: value[0] };
    setSettings(newSettings);
    onUserSelect('advancedVoice', newSettings);
  };

  return (
    <div className="mt-5">
      <h3 className="text-lg font-medium mb-2">Advanced Voice Settings</h3>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Voice
        </label>
        <select 
          className="w-full border rounded-md p-2"
          onChange={handleVoiceChange}
          value={settings.voiceId}
        >
          {voices.map((voice) => (
            <option key={voice.id} value={voice.id}>
              {voice.name} - {voice.description}
            </option>
          ))}
        </select>
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Stability: {settings.stability.toFixed(2)}
        </label>
        <Slider 
          value={[settings.stability]} 
          min={0} 
          max={1} 
          step={0.01} 
          onValueChange={handleStabilityChange} 
        />
        <p className="text-xs text-gray-500 mt-1">
          Lower values create more variation, higher values make the voice more stable
        </p>
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Clarity/Voice Similarity: {settings.clarity.toFixed(2)}
        </label>
        <Slider 
          value={[settings.clarity]} 
          min={0} 
          max={1} 
          step={0.01} 
          onValueChange={handleClarityChange} 
        />
        <p className="text-xs text-gray-500 mt-1">
          Higher values increase voice clarity and similarity to the original voice
        </p>
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Style Exaggeration: {settings.style.toFixed(2)}
        </label>
        <Slider 
          value={[settings.style]} 
          min={0} 
          max={1} 
          step={0.01} 
          onValueChange={handleStyleChange} 
        />
        <p className="text-xs text-gray-500 mt-1">
          Higher values will cause the voice to express more emotion and exaggerate speaking style
        </p>
      </div>
    </div>
  );
}

export default SelectAdvancedVoice;