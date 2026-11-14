import React, { useState } from 'react';
import {
  Award,
  Bike,
  ChevronRight,
  Footprints,
  PackageCheck,
  PiggyBank,
  Search,
  ShieldCheck,
  ShoppingBag,
  Star,
  Store,
  Tag,
  Users,
} from 'lucide-react';
import { ProductVisual } from '../components/ProductVisual';
import { GroupBuyPool, SupplyProduct, VendorQuote } from '../types';

interface CompareViewProps {
  products: SupplyProduct[];
  selectedProductId: string;
  onSelectProductId: (id: string) => void;
  pools: GroupBuyPool[];
  onBuyFromVendor: (product: SupplyProduct, quote: VendorQuote) => void;
  onOpenGroupBuy: (poolId?: string) => void;
}

export const CompareView: React.FC<CompareViewProps> = ({
  products,
  selectedProductId,
  onSelectProductId,
  pools,
  onBuyFromVendor,
  onOpenGroupBuy,
}) => {
  const [query, setQuery] = useState('');

  const matchingProducts = products.filter((p) => {
    const q = query.trim().toLowerCase();
    return !q || p.title.toLowerCase().includes(q) || p.categoryLabel.toLowerCase().includes(q);
  });

  const activeProduct =
    products.find((p) => p.id === selectedProductId) ?? matchingProducts[0] ?? products[0];

  const lowestQuote =
    activeProduct.vendorQuotes.reduce(
      (min, q) => (q.price < min.price ? q : min),
      activeProduct.vendorQuotes[0]
    ) ?? activeProduct.vendorQuotes[0];

  const highestRetail = Math.max(
    activeProduct.originalPrice,
    ...activeProduct.vendorQuotes.map((v) => v.retailPrice)
  );
  const maxSavings = Math.max(0, highestRetail - lowestQuote.price);
  const matchingPool = pools.find((pl) => pl.productId === activeProduct.id) ?? pools[0];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5 pb-24 md:pb-12 flex flex-col gap-5">
      {/* Search & Product Selector */}
      <div className="flex flex-col gap-3">
        <div className="bg-white rounded-full border border-[#e2e7ff] shadow-sm px-4 py-2.5 flex items-center gap-3">
          <Search className="w-5 h-5 text-[#003734] shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="text-[10px] font-bold uppercase tracking-wider text-[#006c49]">
              Price Comparison Engine
            </div>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search item to compare campus vendors..."
              className="w-full text-sm font-semibold text-[#131b2e] placeholder:text-[#707977] bg-transparent focus:outline-none"
            />
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
          {matchingProducts.map((p) => {
            const active = p.id === activeProduct.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => onSelectProductId(p.id)}
                className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap shrink-0 border transition-colors cursor-pointer ${
                  active
                    ? 'bg-[#003734] text-white border-[#003734]'
                    : 'bg-white text-[#3f4947] border-[#e2e7ff] hover:bg-[#f2f3ff]'
                }`}
              >
                {p.title.split('(')[0].trim()}
              </button>
            );
          })}
        </div>
      </div>

      {/* Savings Banner */}
      <div className="bg-[#6cf8bb] text-[#002113] px-4 py-3.5 rounded-2xl flex items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-full bg-[#006c49] text-white flex items-center justify-center shrink-0">
            <PiggyBank className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold leading-tight tabular-nums">
              Save up to ₱{maxSavings} per {activeProduct.unitLabel}!
            </p>
            <p className="text-xs opacity-90 truncate">
              Picking {lowestQuote.sellerName} gives USTP students the best on-campus rate.
            </p>
          </div>
        </div>
        <span className="text-xs font-bold bg-white text-[#006c49] px-3 py-1 rounded-full shrink-0">
          Best Rate
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Product Overview + Group Buy Upsell */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#e2e7ff]/70 flex flex-col gap-4">
            <div className="flex gap-4 items-start">
              <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0">
                <ProductVisual kind={activeProduct.visualKind} alt={activeProduct.title} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold text-[#006c49]">
                  {activeProduct.categoryLabel} · In Stock
                </div>
                <h1 className="text-base font-bold text-[#131b2e] leading-snug mt-0.5">
                  {activeProduct.title}
                </h1>
                <p className="text-xs text-[#3f4947] mt-1">
                  {activeProduct.specs.map((s) => `${s.label}: ${s.value}`).join(' · ')}
                </p>
              </div>
            </div>

            <div className="bg-[#f2f3ff] rounded-xl p-3.5 flex items-center justify-between tabular-nums">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-[#006c49]" />
                <div>
                  <div className="text-[11px] text-[#3f4947]">Lowest Found</div>
                  <div className="text-xl font-extrabold text-[#006c49]">
                    ₱{lowestQuote.price}
                  </div>
                </div>
              </div>
              <div className="h-7 w-px bg-[#dae2fd]" />
              <div className="text-right">
                <div className="text-[11px] text-[#3f4947]">Standard Retail</div>
                <div className="text-sm text-[#707977] line-through font-semibold">
                  ₱{highestRetail}
                </div>
              </div>
            </div>
          </div>

          {/* Group Buy Upsell Card */}
          {matchingPool && (
            <div className="bg-[#003734] text-white rounded-3xl p-5 shadow-md flex flex-col gap-4">
              <div className="flex items-center justify-between text-xs">
                <span className="inline-flex items-center gap-1.5 font-bold text-[#6ffbbe]">
                  <Users className="w-4 h-4" />
                  USTP Pool Discount
                </span>
                <span className="font-bold text-[#85bfba] tabular-nums">
                  Save ₱{matchingPool.originalPrice - matchingPool.groupPrice} Total
                </span>
              </div>

              <div>
                <h2 className="text-lg font-bold leading-snug">Want an even lower price?</h2>
                <p className="text-sm text-[#96d1cc] mt-1">
                  Join {matchingPool.joinedCount} other USTP students to unlock wholesale pricing at{' '}
                  <strong className="text-white">₱{matchingPool.groupPrice} each</strong>.
                </p>
              </div>

              <div className="bg-[#0b4f4b] rounded-2xl p-3.5 flex flex-col gap-2">
                <div className="flex items-center justify-between text-xs font-bold text-[#6ffbbe] tabular-nums">
                  <span>Pool Progress</span>
                  <span>
                    {matchingPool.joinedCount}/{matchingPool.targetCapacity} Students Joined
                  </span>
                </div>
                <div className="w-full h-2 bg-[#003734] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#6ffbbe] rounded-full"
                    style={{
                      width: `${Math.min(
                        100,
                        Math.round((matchingPool.joinedCount / matchingPool.targetCapacity) * 100)
                      )}%`,
                    }}
                  />
                </div>
                <div className="flex justify-between text-[11px] text-[#96d1cc]">
                  <span>Tier 1 Unlocked</span>
                  <span className="text-[#6ffbbe] font-semibold tabular-nums">
                    {Math.max(0, matchingPool.targetCapacity - matchingPool.joinedCount)} more needed
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onOpenGroupBuy(matchingPool.id)}
                className="w-full h-12 rounded-full bg-[#6ffbbe] hover:bg-[#4edea3] text-[#002113] font-extrabold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Users className="w-4 h-4" />
                <span>Join Group Buy · ₱{matchingPool.groupPrice}</span>
              </button>
            </div>
          )}
        </div>

        {/* Right: Ranked Vendors Compared */}
        <div className="lg:col-span-7 flex flex-col gap-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-sm font-bold text-[#131b2e]">
              {activeProduct.vendorQuotes.length} Campus Vendors Compared
            </h2>
            <span className="text-xs font-semibold text-[#003734] inline-flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-[#006c49]" />
              Verified Campus Sellers
            </span>
          </div>

          {activeProduct.vendorQuotes.map((quote) => {
            const diffFromRetail = Math.max(0, quote.retailPrice - quote.price);
            if (quote.isLowest) {
              return (
                <div
                  key={quote.id}
                  className="bg-gradient-to-b from-[#6ffbbe]/20 to-white rounded-2xl p-5 shadow-md border border-[#6cf8bb] flex flex-col gap-3.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#006c49] text-white text-xs font-bold">
                      <Award className="w-3.5 h-3.5" />
                      <span>Cheapest Option · USTP Pick</span>
                    </span>
                    <span className="text-xs font-bold text-[#006c49] tabular-nums">
                      Saves you ₱{diffFromRetail}
                    </span>
                  </div>

                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-base font-bold text-[#131b2e]">{quote.sellerName}</h3>
                      <p className="text-xs text-[#3f4947] mt-0.5">{quote.subtitle}</p>
                    </div>
                    <div className="text-right tabular-nums shrink-0">
                      <span className="text-xl font-extrabold text-[#006c49] block">
                        ₱{quote.price}
                      </span>
                      {quote.retailPrice > quote.price && (
                        <span className="text-xs text-[#707977] line-through">
                          ₱{quote.retailPrice}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5 text-xs">
                    <div className="bg-white/90 rounded-xl p-2.5 flex items-center gap-1.5 tabular-nums">
                      <Star className="w-4 h-4 fill-[#faa213] text-[#faa213]" />
                      <span className="font-bold text-[#131b2e]">{quote.rating.toFixed(1)}</span>
                      <span className="text-[#3f4947]">({quote.reviewCount})</span>
                    </div>
                    <div className="bg-white/90 rounded-xl p-2.5 flex items-center gap-1.5 text-[#131b2e]">
                      <PackageCheck className="w-4 h-4 text-[#006c49]" />
                      <span>{quote.stockLabel}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-[#3f4947]">
                    <Footprints className="w-4 h-4 text-[#006c49] shrink-0" />
                    <span>{quote.pickupNote}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => onBuyFromVendor(activeProduct, quote)}
                    className="w-full h-12 rounded-full bg-[#006c49] hover:bg-[#005236] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-sm cursor-pointer tabular-nums"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Buy Now — ₱{quote.price}</span>
                  </button>
                </div>
              );
            }

            return (
              <div
                key={quote.id}
                className="bg-white rounded-2xl p-5 shadow-sm border border-[#e2e7ff] flex flex-col gap-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-base font-semibold text-[#131b2e]">{quote.sellerName}</h3>
                    <p className="text-xs text-[#3f4947] mt-0.5">{quote.subtitle}</p>
                  </div>
                  <div className="text-right tabular-nums shrink-0">
                    <span className="text-lg font-bold text-[#131b2e] block">
                      ₱{quote.price}
                    </span>
                    <span className="text-[11px] text-[#3f4947]">
                      {quote.deliveryFee ? 'Partner Rate' : 'Retail Price'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-[#3f4947] tabular-nums">
                  <span className="inline-flex items-center gap-1">
                    <Star className="w-4 h-4 fill-[#faa213] text-[#faa213]" />
                    <strong className="text-[#131b2e]">{quote.rating.toFixed(1)}</strong> (
                    {quote.reviewCount})
                  </span>
                  <span className="inline-flex items-center gap-1">
                    {quote.deliveryFee ? (
                      <Bike className="w-4 h-4 text-[#3f4947]" />
                    ) : (
                      <Store className="w-4 h-4 text-[#3f4947]" />
                    )}
                    <span>{quote.pickupNote}</span>
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => onBuyFromVendor(activeProduct, quote)}
                  className="w-full h-11 rounded-full bg-[#eaedff] hover:bg-[#e2e7ff] text-[#003734] font-semibold text-xs flex items-center justify-center gap-1 transition-colors cursor-pointer"
                >
                  <span>Select {quote.sellerName.split('(')[0].trim()}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
