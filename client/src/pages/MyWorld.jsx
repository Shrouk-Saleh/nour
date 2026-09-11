import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import Companion, { randomIdleMessage } from '../components/Companion';
import { Lock } from 'lucide-react';

const CATEGORIES = [
  { id: 'pet', label: 'Pet' },
  { id: 'shape', label: 'House' },
  { id: 'roof', label: 'Roof' },
  { id: 'door', label: 'Door' },
  { id: 'windows', label: 'Windows' },
  { id: 'colors', label: 'Colors' },
  { id: 'decorations', label: 'Yard' },
  { id: 'accessories', label: 'Accessories' },
];

const OPTIONS = {
  shape: [
    { id: 'cottage', label: 'Cottage', level: 1 },
    { id: 'cabin', label: 'Cabin', level: 4 },
    { id: 'modern', label: 'Modern', level: 4 },
  ],
  roof: [
    { id: 'triangle', label: 'Triangle', level: 1 },
    { id: 'flat', label: 'Flat', level: 2 },
    { id: 'rounded', label: 'Rounded', level: 5 },
  ],
  door: [
    { id: 'classic', label: 'Classic', level: 1 },
    { id: 'arched', label: 'Arched', level: 3 },
    { id: 'modern', label: 'Modern', level: 5 },
  ],
  windows: [
    { id: 'square', label: 'Square', level: 1 },
    { id: 'round', label: 'Round', level: 2 },
    { id: 'wide', label: 'Wide', level: 3 },
  ],
  colors: [
    { id: 'wood', label: 'Classic Wood', level: 1 },
    { id: 'pink', label: 'Pastel Pink', level: 1 },
    { id: 'blue', label: 'Ocean Blue', level: 2 },
    { id: 'white', label: 'Clean White', level: 2 },
  ],
  decorations: [
    { id: 'flowers', label: 'Flowers', level: 3 },
    { id: 'fence', label: 'White Fence', level: 3 },
    { id: 'lanterns', label: 'Lanterns', level: 4 },
  ],
  accessories: [
    { id: 'bow', label: 'Cute Bow', level: 2 },
    { id: 'collar', label: 'Red Collar', level: 4 },
  ],
  pet: [
    { id: 'dog', label: 'Shiba Dog', level: 1 },
    { id: 'dog2', label: 'Other Dog', level: 2 },
    { id: 'dog3', label: 'Third Dog', level: 3 },
  ]
};

export default function MyWorld() {
  const { companion, house, updateHouse, changeAnimal, feedPet, waterPlant, harvestPlant } = useApp();
  const [activeTab, setActiveTab] = useState('pet');
  const [message, setMessage] = useState(null);

  const level = companion.level || 1;

  function handleTap() {
    setMessage(randomIdleMessage(message));
  }

  function handleSelect(category, optionId, isArray) {
    if (category === 'pet') {
      changeAnimal(optionId);
      return;
    }
    
    if (isArray) {
      // Toggle for arrays (decorations, accessories)
      const current = house[category] || [];
      const has = current.includes(optionId);
      updateHouse({ [category]: has ? current.filter(id => id !== optionId) : [...current, optionId] });
    } else {
      // Set for single values
      updateHouse({ [category === 'colors' ? 'colorScheme' : category]: optionId });
    }
  }

  const renderOptions = (categoryId) => {
    const isArray = categoryId === 'decorations' || categoryId === 'accessories';
    const activeArray = house[categoryId === 'accessories' ? 'dogAccessories' : categoryId] || [];
    let activeValue = house[categoryId === 'colors' ? 'colorScheme' : categoryId];
    if (categoryId === 'pet') activeValue = companion.animalType || 'dog';

    return (
      <div className="grid grid-cols-2 gap-3 mt-4 pb-24">
        {OPTIONS[categoryId].map((opt) => {
          const locked = level < opt.level;
          const selected = isArray ? activeArray.includes(opt.id) : activeValue === opt.id;

          return (
            <button
              key={opt.id}
              onClick={() => !locked && handleSelect(categoryId === 'accessories' ? 'dogAccessories' : categoryId, opt.id, isArray)}
              disabled={locked}
              className={`relative flex flex-col items-center justify-center rounded-2xl border-2 p-4 text-sm font-medium transition-colors ${
                locked
                  ? 'border-paper-200 bg-paper-100 text-ink-400 opacity-70'
                  : selected
                  ? 'border-sprout-500 bg-sprout-50 text-sprout-900 shadow-sm'
                  : 'border-paper-200 bg-white text-ink-700 hover:border-sprout-200 hover:bg-sprout-50/50'
              }`}
            >
              {locked && <Lock size={16} className="mb-2 text-ink-400" />}
              <span>{opt.label}</span>
              {locked && <span className="mt-1 text-xs text-ink-400">Level {opt.level}</span>}
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <div className="flex min-h-screen flex-col bg-paper-50">
      <div className="sticky top-0 z-10 bg-paper-50/90 px-4 py-4 backdrop-blur-md">
        <h1 className="font-display text-xl font-semibold text-ink-900">My World 🐾</h1>
        <p className="text-sm text-ink-600">Customize your dog's home as you level up!</p>
      </div>

      <div className="px-4">
        <Companion 
          companion={companion} 
          house={house} 
          size={280} 
          onTap={handleTap} 
          onFeed={feedPet} 
          onWater={waterPlant}
          onHarvest={harvestPlant}
          message={message} 
        />
      </div>

      <div className="mt-6 flex-1 bg-white rounded-t-[2.5rem] shadow-[0_-4px_20px_rgba(0,0,0,0.03)] px-4 pt-6">
        <div className="flex overflow-x-auto pb-2 scrollbar-hide space-x-2">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                activeTab === cat.id
                  ? 'bg-ink-900 text-white'
                  : 'bg-paper-100 text-ink-600 hover:bg-paper-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
        
        {renderOptions(activeTab)}
      </div>
    </div>
  );
}
