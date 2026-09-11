import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { FLOWERS, RARITIES, FLOWER_MAP } from '../constants/flowers';

const RARITY_ORDER = ['common', 'uncommon', 'rare', 'ultra_rare'];

export default function FlowerBook() {
  const { companion } = useApp();
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedFlower, setSelectedFlower] = useState(null);

  const collectedIds = new Set(companion?.garden?.flowerCollection || []);
  const totalCollected = new Set([...collectedIds]).size; // unique count
  const total = FLOWERS.length;

  const filtered = selectedFilter === 'all'
    ? FLOWERS
    : FLOWERS.filter(f => f.rarity === selectedFilter);

  return (
    <div className="px-4 pb-8 pt-5 min-h-screen" style={{ background: 'linear-gradient(135deg, #fdf6ff 0%, #f0fff4 100%)' }}>
      {/* Header */}
      <div className="mb-5">
        <h1 className="font-display text-2xl font-bold text-ink-900 flex items-center gap-2">
          🌸 كتاب الزهور
        </h1>
        <p className="text-sm text-ink-600 mt-1">اجمعي كل الزهور عن طريق حصاد نباتاتك!</p>

        {/* Progress Bar */}
        <div className="mt-4 rounded-2xl bg-white p-4 shadow-card">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold text-ink-700">مجموعتك</span>
            <span className="text-sm font-bold" style={{ color: '#7B4FBE' }}>
              {totalCollected} / {total} زهرة 🌺
            </span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ background: 'linear-gradient(90deg, #a78bfa, #f472b6)' }}
              initial={{ width: 0 }}
              animate={{ width: `${(totalCollected / total) * 100}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </div>
          {totalCollected === total && (
            <p className="text-center mt-2 text-sm font-bold text-amber-500 animate-bounce">
              👑 جمعتي كل الزهور! أنتي بطلة!
            </p>
          )}
        </div>
      </div>

      {/* Rarity Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide">
        <button
          onClick={() => setSelectedFilter('all')}
          className={`whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-bold transition-all border-2 ${
            selectedFilter === 'all'
              ? 'bg-ink-900 text-white border-ink-900'
              : 'bg-white text-ink-600 border-paper-200 hover:border-ink-300'
          }`}
        >
          الكل ({FLOWERS.length})
        </button>
        {RARITY_ORDER.map(rid => {
          const r = RARITIES[rid];
          const count = FLOWERS.filter(f => f.rarity === rid).length;
          const owned = FLOWERS.filter(f => f.rarity === rid && collectedIds.has(f.id)).length;
          return (
            <button
              key={rid}
              onClick={() => setSelectedFilter(rid)}
              className={`whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-bold transition-all border-2 ${
                selectedFilter === rid
                  ? 'text-white border-transparent'
                  : 'bg-white border-paper-200 hover:border-gray-300'
              }`}
              style={selectedFilter === rid ? { backgroundColor: r.color, borderColor: r.color } : { color: r.color }}
            >
              {r.labelAr} ({owned}/{count})
            </button>
          );
        })}
      </div>

      {/* Flower Grid */}
      <div className="grid grid-cols-4 gap-2">
        {filtered.map(flower => {
          const isOwned = collectedIds.has(flower.id);
          const rarity = RARITIES[flower.rarity];
          const count = [...collectedIds].filter(id => id === flower.id).length;

          return (
            <motion.button
              key={flower.id}
              onClick={() => setSelectedFlower(flower)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative flex flex-col items-center justify-center rounded-2xl p-2 border-2 transition-all"
              style={{
                background: isOwned ? rarity.bgColor : '#F5F5F5',
                borderColor: isOwned ? rarity.border : '#E0E0E0',
                opacity: isOwned ? 1 : 0.6,
              }}
            >
              {/* Flower emoji or mystery */}
              <span className={`text-2xl transition-all ${isOwned ? '' : 'grayscale opacity-30'}`}>
                {isOwned ? flower.emoji : '❓'}
              </span>

              {/* Name */}
              <p className={`mt-1 text-center leading-tight text-[10px] font-semibold ${isOwned ? 'text-ink-800' : 'text-ink-400'}`}>
                {isOwned ? flower.arabicName : '???'}
              </p>

              {/* Count badge if collected more than once */}
              {isOwned && count > 1 && (
                <span className="absolute -top-1.5 -right-1.5 bg-amber-400 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center shadow">
                  {count}
                </span>
              )}

              {/* New badge for ultra rare */}
              {isOwned && flower.rarity === 'ultra_rare' && (
                <span className="absolute -top-1.5 -left-1.5 text-[9px]">✨</span>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Flower Detail Modal */}
      <AnimatePresence>
        {selectedFlower && (
          <motion.div
            className="fixed inset-0 z-50 flex items-end justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedFlower(null)}
          >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

            {/* Sheet */}
            <motion.div
              className="relative w-full max-w-sm rounded-t-3xl bg-white p-6 pb-8 shadow-2xl"
              initial={{ y: 200, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 200, opacity: 0 }}
              transition={{ type: 'spring', damping: 20 }}
              onClick={e => e.stopPropagation()}
            >
              {/* Handle */}
              <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-gray-200" />

              {/* Rarity badge */}
              <div
                className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold text-white mb-3"
                style={{ backgroundColor: RARITIES[selectedFlower.rarity].color }}
              >
                {selectedFlower.rarity === 'ultra_rare' ? '✨ ' : ''}{RARITIES[selectedFlower.rarity].labelAr}
              </div>

              {/* Main content */}
              <div className="flex items-center gap-4">
                <div
                  className="w-20 h-20 rounded-2xl flex items-center justify-center text-5xl flex-shrink-0 border-2"
                  style={{
                    background: RARITIES[selectedFlower.rarity].bgColor,
                    borderColor: RARITIES[selectedFlower.rarity].border,
                  }}
                >
                  {collectedIds.has(selectedFlower.id) ? selectedFlower.emoji : '❓'}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-ink-900">
                    {collectedIds.has(selectedFlower.id) ? selectedFlower.arabicName : '???'}
                  </h2>
                  <p className="text-sm text-ink-500">
                    {collectedIds.has(selectedFlower.id) ? selectedFlower.name : 'غير مكتشفة بعد'}
                  </p>
                  {collectedIds.has(selectedFlower.id) && (
                    <p className="text-xs text-ink-500 mt-1">
                      جمعتيها {[...collectedIds].filter(id => id === selectedFlower.id).length} مرة
                    </p>
                  )}
                </div>
              </div>

              {/* Description */}
              <p className="mt-4 text-sm text-ink-600 leading-relaxed rounded-xl p-3"
                 style={{ background: RARITIES[selectedFlower.rarity].bgColor }}>
                {collectedIds.has(selectedFlower.id)
                  ? selectedFlower.description
                  : '🔒 اكملي دراستك وزودي نباتك عشان تكتشفي هذه الزهرة!'}
              </p>

              <button
                onClick={() => setSelectedFlower(null)}
                className="mt-4 w-full rounded-full bg-ink-900 py-3 text-sm font-bold text-white"
              >
                إغلاق
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
