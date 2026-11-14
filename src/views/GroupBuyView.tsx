import React, { useEffect, useState } from 'react';
import {
  BadgeCheck,
  Bolt,
  CalendarCheck,
  Check,
  Handshake,
  HelpCircle,
  Lock,
  Minus,
  Plus,
  Shield,
  Truck,
  Users,
  X,
} from 'lucide-react';
import { ProductVisual } from '../components/ProductVisual';
import { GroupBuyPool } from '../types';

interface GroupBuyViewProps {
  pools: GroupBuyPool[];
  selectedPoolId: string;
  onSelectPoolId: (id: string) => void;
  joinedPoolIds: string[];
  onReservePool: (pool: GroupBuyPool, quantity: number) => void;
}

export const GroupBuyView: React.FC<GroupBuyViewProps> = ({
  pools,
  selectedPoolId,
  onSelectPoolId,
  joinedPoolIds,
  onReservePool,
}) => {
  const activePool = pools.find((p) => p.id === selectedPoolId) ?? pools[0];
  const [quantity, setQuantity] = useState(1);
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [seconds, setSeconds] = useState(activePool.secondsRemaining);

  useEffect(() => {
    setSeconds(activePool.secondsRemaining);
    setQuantity(1);
  }, [activePool.id, activePool.secondsRemaining]);

  useEffect(() => {
    const id = window.setInterval(() => {
      setSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => window.clearInterval(id);
  }, []);

  const hours = String(Math.floor(seconds / 3600)).padStart(2, '0');
  const mins = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
  const secs = String(seconds % 60).padStart(2, '0');

  const alreadyJoined = joinedPoolIds.includes(activePool.id);
  const savingsPerUnit = Math.max(0, activePool.originalPrice - activePool.groupPrice);
  const savingsPct = Math.round((savingsPerUnit / activePool.originalPrice) * 100);
  const spotsLeft = Math.max(0, activePool.targetCapacity - activePool.joinedCount);
  const progressPct = Math.min(
    100,
    Math.round((activePool.joinedCount / activePool.targetCapacity) * 100)
  );
  const totalDeposit = quantity * activePool.groupPrice;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-5 pb-36 flex flex-col gap-5">
      {/* Pool Selector Pills */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-[#6cf8bb] text-[#002113] flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-[#131b2e]">Group Buy Deals</h1>
            <p className="text-xs font-bold text-[#006c49] uppercase tracking-wider">
              Active Campus Pool
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowGuideModal(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#eaedff] text-xs font-semibold text-[#003734] hover:bg-[#e2e7ff] cursor-pointer"
        >
          <HelpCircle className="w-4 h-4" />
          <span>How It Works</span>
        </button>
      </div>

      <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
        {pools.map((pool) => {
          const active = pool.id === activePool.id;
          return (
            <button
              key={pool.id}
              type="button"
              onClick={() => onSelectPoolId(pool.id)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap shrink-0 border transition-colors cursor-pointer ${
                active
                  ? 'bg-[#003734] text-white border-[#003734]'
                  : 'bg-white text-[#3f4947] border-[#e2e7ff] hover:bg-[#f2f3ff]'
              }`}
            >
              {pool.title.split('(')[0].trim()}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left: Explainer + Countdown + Escrow */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="bg-[#003734] text-white rounded-2xl p-5 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-white/15 text-[#6ffbbe] flex items-center justify-center shrink-0">
                <Handshake className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm font-bold">How Group Buy Works</h2>
                <p className="text-xs text-[#b2eee8] mt-1 leading-relaxed">
                  Pool orders with fellow USTP students to unlock wholesale bulk pricing. Once the
                  pool fills up, all orders land directly at the campus hub.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-[#e2e7ff] rounded-2xl p-4 flex items-center justify-between">
            <span className="text-xs font-bold text-[#131b2e]">Pool Closes In</span>
            <div className="flex items-center gap-1 text-base font-extrabold text-[#653e00] tabular-nums">
              <span className="bg-white px-2.5 py-1 rounded-lg shadow-xs">{hours}</span>
              <span>:</span>
              <span className="bg-white px-2.5 py-1 rounded-lg shadow-xs">{mins}</span>
              <span>:</span>
              <span className="bg-white px-2.5 py-1 rounded-lg shadow-xs text-[#ba1a1a]">
                {secs}
              </span>
            </div>
          </div>

          <div className="bg-[#eaedff] rounded-2xl p-4 flex items-center gap-3 text-xs text-[#131b2e]">
            <Shield className="w-5 h-5 text-[#006c49] shrink-0" />
            <span>
              Protected Student Escrow. Full automatic refund to GCash or Maya if threshold is not
              met.
            </span>
          </div>
        </div>

        {/* Right: Main Active Pool Card */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-5 shadow-md border border-[#e2e7ff] flex flex-col gap-4">
          <div className="flex gap-4">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden shrink-0">
              <ProductVisual kind={activePool.visualKind} alt={activePool.title} />
            </div>
            <div className="flex-1 min-w-0 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 text-xs text-[#006c49] font-semibold">
                  <BadgeCheck className="w-3.5 h-3.5" />
                  <span>{activePool.vendorName}</span>
                </div>
                <h2 className="text-base sm:text-lg font-bold text-[#131b2e] leading-snug mt-0.5">
                  {activePool.title}
                </h2>
                <p className="text-xs text-[#3f4947] mt-0.5">{activePool.subtitle}</p>
              </div>
              <div className="flex items-baseline gap-2 mt-2 tabular-nums">
                <span className="text-2xl sm:text-3xl font-extrabold text-[#003734]">
                  ₱{activePool.groupPrice}
                </span>
                <span className="text-sm text-[#707977] line-through">
                  ₱{activePool.originalPrice}
                </span>
                <span className="text-xs font-bold text-[#006c49]">
                  Save ₱{savingsPerUnit} ({savingsPct}% OFF)
                </span>
              </div>
            </div>
          </div>

          {/* Pool Goal Status */}
          <div className="bg-[#f2f3ff] rounded-xl p-4 flex flex-col gap-2.5">
            <div className="flex items-center justify-between text-xs font-bold tabular-nums">
              <span className="text-[#131b2e]">Pool Goal Status</span>
              <span className="text-[#003734]">
                {activePool.joinedCount} / {activePool.targetCapacity} Joined
              </span>
            </div>

            <div className="w-full h-3 bg-[#dae2fd] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#006c49] rounded-full transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>

            <div className="flex justify-between text-[11px] font-semibold text-[#3f4947] tabular-nums">
              <span className="text-[#006c49]">{activePool.minThreshold} min (Unlocked)</span>
              <span className="text-[#006c49]">{activePool.joinedCount} Current</span>
              <span>
                {activePool.targetCapacity} Max (Locks ₱{activePool.groupPrice})
              </span>
            </div>

            <div className="bg-[#ffddb8]/60 rounded-lg py-2 px-3 flex items-center gap-2 text-xs font-bold text-[#2a1700]">
              <Bolt className="w-4 h-4 text-[#653e00] shrink-0" />
              <span>
                {spotsLeft > 0
                  ? `Only ${spotsLeft} more student${spotsLeft === 1 ? '' : 's'} needed to guarantee ₱${activePool.groupPrice} wholesale rate!`
                  : `Wholesale rate ₱${activePool.groupPrice} guaranteed for this batch!`}
              </span>
            </div>
          </div>

          {/* Classmates & Pickup */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="bg-[#faf8ff] rounded-xl p-3.5 border border-[#e2e7ff]">
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#3f4947]">
                Classmates in this pool
              </div>
              <div className="font-bold text-[#131b2e] mt-1">{activePool.peersSummary}</div>
              <div className="text-[#006c49] font-semibold mt-0.5">Verified USTP peers</div>
            </div>

            <div className="bg-[#faf8ff] rounded-xl p-3.5 border border-[#e2e7ff] flex flex-col gap-1.5">
              <div className="flex items-start gap-2">
                <Truck className="w-4 h-4 text-[#003734] shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-[#131b2e]">{activePool.pickupPoint}</div>
                  <div className="text-[#3f4947]">{activePool.pickupSubtext}</div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-[#006c49] font-semibold">
                <CalendarCheck className="w-4 h-4 shrink-0" />
                <span>{activePool.scheduleLabel}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Sticky Reservation Dock */}
      <div className="fixed bottom-0 inset-x-0 z-30 bg-white/95 backdrop-blur-md border-t border-[#e2e7ff] p-4 pb-safe">
        <div className="max-w-3xl mx-auto flex flex-col gap-2">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="text-xs font-semibold text-[#131b2e]">Quantity:</span>
              <div className="flex items-center bg-[#eaedff] rounded-full p-1">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1 || alreadyJoined}
                  aria-label="Decrease quantity"
                  className="w-7 h-7 rounded-full bg-white flex items-center justify-center disabled:opacity-40 cursor-pointer"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-3 text-sm font-extrabold text-[#003734] tabular-nums">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setQuantity((q) => Math.min(activePool.maxPerStudent, q + 1))
                  }
                  disabled={quantity >= activePool.maxPerStudent || alreadyJoined}
                  aria-label="Increase quantity"
                  className="w-7 h-7 rounded-full bg-white flex items-center justify-center disabled:opacity-40 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
              <span className="text-[11px] text-[#3f4947]">
                (Max {activePool.maxPerStudent}/student)
              </span>
            </div>

            <div className="text-right tabular-nums">
              <div className="text-[10px] font-bold uppercase text-[#3f4947]">Total Deposit</div>
              <div className="text-lg font-extrabold text-[#003734]">₱{totalDeposit}</div>
            </div>
          </div>

          <button
            type="button"
            disabled={alreadyJoined}
            onClick={() => onReservePool(activePool, quantity)}
            className={`w-full h-12 rounded-full font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer tabular-nums ${
              alreadyJoined
                ? 'bg-[#006c49] text-white'
                : 'bg-[#003734] hover:bg-[#0b4f4b] text-white'
            }`}
          >
            {alreadyJoined ? (
              <>
                <Check className="w-5 h-5" />
                <span>Slot Reserved (View in Orders)</span>
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                <span>Join Group Buy (Reserve at ₱{totalDeposit})</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* How Group Buy Works Modal */}
      {showGuideModal && (
        <div className="fixed inset-0 z-50 bg-[#283044]/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-xl flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-[#131b2e]">USTP Group Buy Guidelines</h3>
              <button
                type="button"
                onClick={() => setShowGuideModal(false)}
                className="p-1.5 rounded-full hover:bg-[#f2f3ff] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex flex-col gap-3 text-xs text-[#3f4947]">
              <div className="flex gap-3">
                <span className="w-7 h-7 rounded-full bg-[#003734] text-white font-bold flex items-center justify-center shrink-0">
                  1
                </span>
                <div>
                  <div className="font-bold text-[#131b2e]">Lock In the Discount</div>
                  <p>Reserve your slot at the wholesale student deal rate with zero markup.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="w-7 h-7 rounded-full bg-[#006c49] text-white font-bold flex items-center justify-center shrink-0">
                  2
                </span>
                <div>
                  <div className="font-bold text-[#131b2e]">Pool Threshold Goal</div>
                  <p>
                    Once batchmates reach the target, bulk cartons ship directly to the USTP Hub.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="w-7 h-7 rounded-full bg-[#653e00] text-white font-bold flex items-center justify-center shrink-0">
                  3
                </span>
                <div>
                  <div className="font-bold text-[#131b2e]">Swift Campus Hub Pickup</div>
                  <p>Flash your Digital Student ID QR code at Booth 2 between classes.</p>
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowGuideModal(false)}
              className="w-full h-11 rounded-full bg-[#003734] text-white text-sm font-bold cursor-pointer"
            >
              Got It, Let&apos;s Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
