import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useReducedMotion from '../hooks/useReducedMotion';
import { randomIdleMessage } from '../utils/gameLogic';

const COLORS = {
  wood: { base: '#E2B889', roof: '#B85E44', door: '#8C5642', window: '#FFF4E0', outline: '#4A352F' },
  blue: { base: '#A8DADC', roof: '#457B9D', door: '#1D3557', window: '#F1FAEE', outline: '#1B2C3C' },
  pink: { base: '#FFCDB2', roof: '#E5989B', door: '#B5838D', window: '#FFF0E5', outline: '#4A2F34' },
  white: { base: '#F8EDEB', roof: '#D8E2DC', door: '#F4A261', window: '#FFFFFF', outline: '#3D413F' },
};

function HouseSVG({ house }) {
  const scheme = COLORS[house?.colorScheme] || COLORS.wood;
  const shape = house?.shape || 'cottage';
  const roof = house?.roof || 'triangle';
  const door = house?.door || 'classic';
  const windows = house?.windows || 'square';
  const decorations = house?.decorations || [];
  const O = scheme.outline;

  return (
    <g transform="translate(0, -30)">
      {/* Drop Shadow */}
      <ellipse cx="0" cy="50" rx="55" ry="12" fill="#000000" opacity="0.1" />

      {/* Main Base */}
      {shape === 'modern' ? (
        <rect x="-40" y="-10" width="80" height="60" rx="8" fill={scheme.base} stroke={O} strokeWidth="2.5" />
      ) : shape === 'cabin' ? (
        <path d="M -45 5 L -45 50 L 45 50 L 45 5 Z" fill={scheme.base} stroke={O} strokeWidth="2.5" strokeLinejoin="round" />
      ) : (
        <path d="M -35 -5 L -35 50 L 35 50 L 35 -5 Z" fill={scheme.base} stroke={O} strokeWidth="2.5" strokeLinejoin="round" />
      )}

      {/* Chimney */}
      <g transform="translate(-25, -45)">
        <rect x="0" y="0" width="12" height="25" rx="2" fill={scheme.door} stroke={O} strokeWidth="2.5" />
        <rect x="-2" y="-3" width="16" height="6" rx="2" fill={scheme.base} stroke={O} strokeWidth="2.5" />
      </g>

      {/* Roof */}
      {roof === 'flat' ? (
        <rect x="-45" y={shape === 'modern' ? -15 : -10} width="90" height="12" rx="4" fill={scheme.roof} stroke={O} strokeWidth="2.5" />
      ) : roof === 'rounded' ? (
        <path d="M -45 -5 Q 0 -55 45 -5 Z" fill={scheme.roof} stroke={O} strokeWidth="2.5" strokeLinejoin="round" />
      ) : (
        <path d="M -45 -5 L 0 -45 L 45 -5 Z" fill={scheme.roof} stroke={O} strokeWidth="2.5" strokeLinejoin="round" />
      )}

      {/* Door */}
      <g transform="translate(0, 50)">
        {door === 'arched' ? (
          <path d="M -14 0 L -14 -22 A 14 14 0 0 1 14 -22 L 14 0 Z" fill={scheme.door} stroke={O} strokeWidth="2.5" strokeLinejoin="round" />
        ) : door === 'modern' ? (
          <rect x="-16" y="-35" width="32" height="35" rx="4" fill={scheme.door} stroke={O} strokeWidth="2.5" />
        ) : (
          <path d="M -14 0 L -14 -28 Q 0 -32 14 -28 L 14 0 Z" fill={scheme.door} stroke={O} strokeWidth="2.5" strokeLinejoin="round" />
        )}
        <circle cx="7" cy="-15" r="2.5" fill="#FFE066" stroke={O} strokeWidth="1.5" />
      </g>

      {/* Windows */}
      <g transform="translate(-22, 10)">
        {windows === 'round' ? (
          <circle cx="0" cy="0" r="9" fill={scheme.window} stroke={O} strokeWidth="2.5" />
        ) : windows === 'wide' ? (
          <rect x="-10" y="-6" width="20" height="12" rx="4" fill={scheme.window} stroke={O} strokeWidth="2.5" />
        ) : (
          <rect x="-8" y="-8" width="16" height="16" rx="4" fill={scheme.window} stroke={O} strokeWidth="2.5" />
        )}
        <line x1="0" y1="-8" x2="0" y2="8" stroke={O} strokeWidth="2" opacity="0.6" />
        <line x1="-8" y1="0" x2="8" y2="0" stroke={O} strokeWidth="2" opacity="0.6" />
        {/* Window highlight */}
        <path d="M 2 -4 L 6 -8" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
      </g>

      <g transform="translate(22, 10)">
        {windows === 'round' ? (
          <circle cx="0" cy="0" r="9" fill={scheme.window} stroke={O} strokeWidth="2.5" />
        ) : windows === 'wide' ? (
          <rect x="-10" y="-6" width="20" height="12" rx="4" fill={scheme.window} stroke={O} strokeWidth="2.5" />
        ) : (
          <rect x="-8" y="-8" width="16" height="16" rx="4" fill={scheme.window} stroke={O} strokeWidth="2.5" />
        )}
        <line x1="0" y1="-8" x2="0" y2="8" stroke={O} strokeWidth="2" opacity="0.6" />
        <line x1="-8" y1="0" x2="8" y2="0" stroke={O} strokeWidth="2" opacity="0.6" />
        <path d="M 2 -4 L 6 -8" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
      </g>

      {/* Decorations */}
      {decorations.includes('lanterns') && (
        <g>
          <g transform="translate(-35, -5)">
            <rect x="-4" y="-6" width="8" height="12" rx="2" fill="#FFE066" stroke={O} strokeWidth="2" />
            <path d="M -5 -6 L 5 -6 L 0 -10 Z" fill={scheme.door} stroke={O} strokeWidth="2" strokeLinejoin="round" />
            <circle cx="0" cy="-2" r="2" fill="#FFFFFF" opacity="0.8" />
          </g>
          <g transform="translate(35, -5)">
            <rect x="-4" y="-6" width="8" height="12" rx="2" fill="#FFE066" stroke={O} strokeWidth="2" />
            <path d="M -5 -6 L 5 -6 L 0 -10 Z" fill={scheme.door} stroke={O} strokeWidth="2" strokeLinejoin="round" />
            <circle cx="0" cy="-2" r="2" fill="#FFFFFF" opacity="0.8" />
          </g>
        </g>
      )}
      
      {decorations.includes('flowers') && (
        <g transform="translate(0, 52)">
          {[-28, -20, 20, 28].map((cx, i) => (
            <g key={i} transform={`translate(${cx}, 0)`}>
              <path d="M 0 0 L 0 -8" stroke="#457B9D" strokeWidth="2" strokeLinecap="round" />
              <circle cx="-3" cy="-10" r="3" fill="#F28482" />
              <circle cx="3" cy="-10" r="3" fill="#F28482" />
              <circle cx="0" cy="-13" r="3" fill="#F28482" />
              <circle cx="0" cy="-7" r="3" fill="#F28482" />
              <circle cx="0" cy="-10" r="1.5" fill="#F6BD60" />
            </g>
          ))}
        </g>
      )}
    </g>
  );
}

export default function Companion({ companion, house, size = 260, onTap, onFeed, onWater, onHarvest, message }) {
  const reducedMotion = useReducedMotion();
  const [tapped, setTapped] = useState(false);
  const [isFeeding, setIsFeeding] = useState(false);
  const [frame, setFrame] = useState(0);

  const animal = companion.animalType || 'dog';

  // Sprite animation loop for sprite sheets (dog2 and dog3)
  useEffect(() => {
    if ((animal !== 'dog2' && animal !== 'dog3') || reducedMotion) return;
    const interval = setInterval(() => {
      setFrame((f) => (f + 1) % 4);
    }, 250); // 4 FPS
    return () => clearInterval(interval);
  }, [animal, reducedMotion]);

  function handleTap() {
    setTapped(true);
    setTimeout(() => setTapped(false), 2000);
    onTap?.();
  }
  
  function handleFeed(e) {
    e.stopPropagation();
    setIsFeeding(true);
    setTimeout(() => setIsFeeding(false), 2500);
    onFeed?.();
  }

  // Determine which image to show based on state and animal type
  const getShibaImage = () => {
    if (isFeeding) return '/animation/shiba dog emote set 1/ball.gif';
    if (tapped || message) return '/animation/shiba dog emote set 1/interogative.gif';
    return '/animation/shiba dog emote set 1/bored.gif';
  };

  return (
    <div className="flex flex-col items-center select-none relative w-full">
      <motion.button
        aria-label="Tap your pet"
        onClick={handleTap}
        whileTap={reducedMotion ? {} : { scale: 0.97 }}
        className="relative w-full rounded-[2rem] outline-none focus-visible:ring-4 focus-visible:ring-sprout-400 overflow-hidden group"
        style={{ height: size, boxShadow: 'inset 0 4px 20px rgba(0,0,0,0.03)' }}
      >
        {/* Beautiful Sky Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#8ECAE6] to-[#E2F0F9]" />
        
        {/* Soft Clouds */}
        <svg className="absolute inset-0 w-full h-full opacity-60 pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d="M -10 30 Q 10 10 30 30 Q 50 15 70 30 Q 90 20 110 30 L 110 0 L -10 0 Z" fill="#FFFFFF" />
        </svg>
        
        {/* Ground */}
        <div className="absolute bottom-0 left-0 right-0 h-[45%] bg-gradient-to-b from-[#A7D185] to-[#8CBF63]" />
        <div className="absolute bottom-[45%] left-0 right-0 h-2 bg-[#97C573]" />

        {/* Background Rendered */}
        <svg
          viewBox="-80 -80 160 160"
          width="100%"
          height="100%"
          className="absolute inset-0"
          style={{ filter: 'drop-shadow(0px 8px 16px rgba(0,0,0,0.15))' }}
        >
          {/* House */}
          <HouseSVG house={house} />
          
          {/* Fence Decoration */}
          {house?.decorations?.includes('fence') && (
            <g transform="translate(0, 35)">
              <rect x="-80" y="-8" width="160" height="4" fill="#FFFFFF" stroke="#4A352F" strokeWidth="2" />
              <rect x="-80" y="4" width="160" height="4" fill="#FFFFFF" stroke="#4A352F" strokeWidth="2" />
              {[-65, -45, -25, 25, 45, 65].map((x) => (
                <path key={x} d={`M ${x-4} 15 L ${x-4} -15 L ${x} -20 L ${x+4} -15 L ${x+4} 15 Z`} fill="#FFFFFF" stroke="#4A352F" strokeWidth="2" strokeLinejoin="round" />
              ))}
            </g>
          )}
        </svg>

        {/* Ambient Robin Bird */}
        <div className="absolute right-12 bottom-[46%] pointer-events-none z-0">
          <img 
            src="/animation/town free/town free/robin_peck_left.gif" 
            alt="Robin" 
            className="w-10 h-10 object-contain drop-shadow-sm opacity-90"
            style={{ imageRendering: 'pixelated' }}
          />
        </div>

        {/* Pet Rendered */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none pb-4">
          {(animal === 'dog2' || animal === 'dog3') ? (
            <div 
              style={{
                width: 128,
                height: 128,
                backgroundImage: `url('/animation/${animal === 'dog3' ? 'pet1_free/pet1.png' : 'pet_free/pet12.png'}')`,
                backgroundPosition: `-${frame * 128}px ${isFeeding ? '-512px' : '0px'}`,
                imageRendering: 'pixelated'
              }}
            />
          ) : (
            <img 
              src={getShibaImage()} 
              alt="Companion" 
              className="w-32 h-32 object-contain"
              style={{ imageRendering: 'pixelated' }}
            />
          )}
        </div>

        {/* Feed Button Overlay */}
        {companion.foodBalance > 0 && onFeed && (
          <div className="absolute bottom-4 right-4 z-10">
            <button
              onClick={handleFeed}
              className="flex items-center gap-2 rounded-full bg-sprout-500 hover:bg-sprout-600 px-4 py-2 text-sm font-bold text-white shadow-lg transition-transform active:scale-95 border-2 border-sprout-700"
            >
              <span>🍖 Feed</span>
              <span className="bg-white text-sprout-700 px-2 py-0.5 rounded-full text-xs">{companion.foodBalance}</span>
            </button>
          </div>
        )}

        {/* Garden System */}
        <div className="absolute bottom-16 left-6 flex flex-col items-center gap-2 z-10 pointer-events-auto">
          {/* Plant Visualization */}
          <div className="relative w-16 h-16 flex items-end justify-center mb-1 drop-shadow-md cursor-pointer hover:scale-105 transition-transform" 
               onClick={() => (companion.garden?.plantStage >= 3) ? onHarvest?.() : onWater?.()}>
              {/* Dirt mound */}
              <div className="absolute bottom-0 w-12 h-4 bg-[#7A5C43] rounded-[100%]"></div>
              <div className="absolute bottom-0 w-14 h-3 bg-[#5C4230] rounded-[100%]"></div>
              
              {/* Stages */}
              {companion.garden?.plantStage === 0 && (
                <div className="absolute bottom-2 w-3 h-2 bg-[#A3D977] rounded-t-full"></div>
              )}
              {companion.garden?.plantStage === 1 && (
                <svg width="24" height="24" className="absolute bottom-2 overflow-visible">
                  <path d="M12 24 L12 10" stroke="#7CB342" strokeWidth="3" strokeLinecap="round" />
                  <path d="M12 16 Q8 12 4 14 Q6 18 12 16" fill="#8BC34A" />
                  <path d="M12 12 Q16 8 20 10 Q18 14 12 12" fill="#8BC34A" />
                </svg>
              )}
              {companion.garden?.plantStage === 2 && (
                <svg width="32" height="36" className="absolute bottom-2 overflow-visible">
                  <path d="M16 36 L16 8" stroke="#558B2F" strokeWidth="4" strokeLinecap="round" />
                  <path d="M16 24 Q8 16 0 20 Q4 28 16 24" fill="#7CB342" />
                  <path d="M16 16 Q24 8 32 12 Q28 20 16 16" fill="#7CB342" />
                  <circle cx="16" cy="8" r="4" fill="#FFF176" />
                </svg>
              )}
              {companion.garden?.plantStage >= 3 && (
                <svg width="40" height="48" className="absolute bottom-2 overflow-visible">
                  <path d="M20 48 L20 16" stroke="#33691E" strokeWidth="4" strokeLinecap="round" />
                  <path d="M20 32 Q10 24 2 28 Q6 36 20 32" fill="#558B2F" />
                  <path d="M20 22 Q30 14 38 18 Q34 26 20 22" fill="#558B2F" />
                  {/* Flower */}
                  <g transform="translate(20, 12)">
                    {[0, 45, 90, 135, 180, 225, 270, 315].map(deg => (
                      <ellipse key={deg} rx="6" ry="12" fill="#FF8A80" transform={`rotate(${deg}) translate(0, -6)`} />
                    ))}
                    <circle r="8" fill="#FFD54F" />
                  </g>
                </svg>
              )}
            </div>

            {/* Action Buttons */}
            {companion.garden?.plantStage < 3 ? (
              <button
                onClick={(e) => { e.stopPropagation(); onWater?.(); }}
                disabled={!companion.garden?.waterDrops}
                className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold shadow-md transition-transform active:scale-95 border-2 ${
                  companion.garden?.waterDrops > 0 
                    ? 'bg-blue-400 hover:bg-blue-500 text-white border-blue-600 cursor-pointer' 
                    : 'bg-gray-300 text-gray-500 border-gray-400 cursor-not-allowed opacity-80'
                }`}
              >
                <span>💧</span>
                <span className="bg-white text-blue-700 px-1.5 py-0 rounded-full">{companion.garden?.waterDrops || 0}</span>
              </button>
            ) : (
              <button
                onClick={(e) => { e.stopPropagation(); onHarvest?.(); }}
                className="flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold shadow-md transition-transform active:scale-95 border-2 bg-amber-400 hover:bg-amber-500 text-white border-amber-600 animate-bounce"
              >
                <span>✨ Harvest!</span>
              </button>
            )}
          </div>

        <AnimatePresence>
          {tapped && !reducedMotion && (
            <motion.div
              className="pointer-events-none absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 1 }}
              animate={{ opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
            >
              {[...Array(5)].map((_, i) => (
                <motion.span
                  key={i}
                  className="absolute text-gold-400 text-2xl drop-shadow-md"
                  style={{ left: `${40 + (i-2) * 15}%`, top: '35%' }}
                  initial={{ opacity: 1, y: 0, scale: 0.5, rotate: -20 }}
                  animate={{ opacity: 0, y: -50, scale: 1.5, rotate: 20 }}
                  transition={{ duration: 0.6, delay: i * 0.05 }}
                >
                  ⭐
                </motion.span>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      <AnimatePresence mode="wait">
        {message && (
          <motion.div
            key={message}
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -10 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className="absolute top-6 right-6 max-w-[180px] rounded-2xl rounded-br-sm bg-white px-4 py-3 text-center text-sm font-bold text-ink-700 shadow-xl border-2 border-ink-900"
          >
            {message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export { randomIdleMessage };
