import React, { useState } from 'react';
import { Pencil, Check as CheckIcon } from 'lucide-react';
import { useApp } from '../context/AppContext';
import Companion from '../components/Companion';
import { MOOD_LABELS, LEVEL_STAGES, randomIdleMessage } from '../utils/gameLogic';
import { SHOP_ITEMS } from '../constants/shopItems';

export default function CompanionPage() {
  const { companion, house, progress, buyShopItem, equipCosmetic, renameCompanion, feedPet, waterPlant, harvestPlant } = useApp();
  const [message, setMessage] = useState(null);
  const [editingName, setEditingName] = useState(false);
  const [nameDraft, setNameDraft] = useState(companion.name);
  const stage = LEVEL_STAGES[companion.level] || LEVEL_STAGES[1];

  function handleTap() {
    setMessage(randomIdleMessage(message));
  }

  function saveName() {
    const trimmed = nameDraft.trim().slice(0, 30);
    if (trimmed) renameCompanion(trimmed);
    setEditingName(false);
  }

  return (
    <div className="px-4 pb-6 pt-5">
      <h1 className="font-display text-xl font-semibold text-ink-900">Companion</h1>

      <div className="mt-4 flex flex-col items-center rounded-3xl bg-white px-5 py-7 shadow-card overflow-hidden">
        <Companion 
          companion={companion} 
          house={house}
          size={240} 
          onTap={handleTap} 
          onFeed={feedPet}
          onWater={waterPlant}
          onHarvest={harvestPlant}
          message={message} 
        />

        <div className="mt-4 flex items-center gap-1.5">
          {editingName ? (
            <>
              <input
                value={nameDraft}
                onChange={(e) => setNameDraft(e.target.value)}
                autoFocus
                maxLength={30}
                className="rounded-full border border-paper-200 px-3 py-1 text-center text-sm font-semibold"
              />
              <button onClick={saveName} className="rounded-full bg-sprout-500 p-1.5 text-white">
                <CheckIcon size={14} />
              </button>
            </>
          ) : (
            <>
              <p className="font-display text-lg font-semibold text-ink-900">{companion.name}</p>
              <button onClick={() => setEditingName(true)} className="text-ink-600/60">
                <Pencil size={14} />
              </button>
            </>
          )}
        </div>
        <p className="text-sm text-ink-600">
          Level {companion.level} · {stage.name} · {MOOD_LABELS[companion.mood]}
        </p>
      </div>

      <div className="mt-5">
        <div className="flex items-center justify-between px-1">
          <p className="text-sm font-semibold text-ink-900">Reward shop</p>
          <span className="text-sm font-semibold text-gold-500">⭐ {progress.totalStars}</span>
        </div>
        <p className="px-1 text-xs text-ink-600/70">Cosmetic only — spend stars, no surprises.</p>

        <div className="mt-3 grid grid-cols-2 gap-3">
          {SHOP_ITEMS.map((item) => {
            const owned = progress.ownedShopItems.includes(item.key);
            const equipped = companion.equippedCosmetics.includes(item.key);
            const canAfford = progress.totalStars >= item.cost;
            return (
              <div key={item.key} className="rounded-2xl border border-paper-200 bg-white p-3 text-center shadow-card">
                <div className="text-3xl">{item.icon}</div>
                <p className="mt-1 text-sm font-semibold text-ink-900">{item.name}</p>
                {owned ? (
                  <button
                    onClick={() => equipCosmetic(item.key)}
                    className={`mt-2 w-full rounded-full py-1.5 text-xs font-semibold ${
                      equipped ? 'bg-sprout-500 text-white' : 'border border-sprout-300 text-sprout-600'
                    }`}
                  >
                    {equipped ? 'Equipped' : 'Equip'}
                  </button>
                ) : (
                  <button
                    onClick={() => buyShopItem(item)}
                    disabled={!canAfford}
                    className={`mt-2 w-full rounded-full py-1.5 text-xs font-semibold ${
                      canAfford ? 'bg-gold-400 text-ink-900' : 'bg-paper-200 text-ink-600/50'
                    }`}
                  >
                    ⭐ {item.cost}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
