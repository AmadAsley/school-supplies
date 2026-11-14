import React, { useEffect, useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  Calculator,
  ChevronRight,
  FileText,
  Folder,
  Palette,
  PenLine,
  PiggyBank,
  PlusCircle,
  Printer,
  Recycle,
  ScanBarcode,
  Search,
  ShoppingCart,
  Star,
  Store,
  Timer,
  TrendingUp,
  Users,
  X,
} from 'lucide-react';
import { ProductVisual } from '../components/ProductVisual';
import { CategoryId, GroupBuyPool, ScreenId, StudentUser, SupplyProduct } from '../types';

interface HomeViewProps {
  user: StudentUser;
  products: SupplyProduct[];
  pools: GroupBuyPool[];
  totalSaved: number;
  joinedPoolIds: string[];
  onSelectProduct: (productId: string) => void;
  onAddToCart: (product: SupplyProduct, qty?: number) => void;
  onOpenCompare: (productId?: string) => void;
  onOpenGroupBuy: (poolId?: string) => void;
  onJoinPoolQuick: (pool: GroupBuyPool) => void;
  onNavigate: (screen: ScreenId) => void;
}

const CATEGORIES: { id: CategoryId; label: string; icon: React.ComponentType<{ className?: string }>; note?: string }[] = [
  { id: 'all', label: 'All', icon: Store },
  { id: 'pens', label: 'Pens', icon: PenLine, note: 'Popular' },
  { id: 'paper', label: 'Paper', icon: FileText, note: '-25%' },
  { id: 'notebooks', label: 'Notebooks', icon: BookOpen },
  { id: 'folders', label: 'Folders', icon: Folder },
  { id: 'art', label: 'Art Supplies', icon: Palette },
  { id: 'electronics', label: 'Electronics', icon: Calculator },
  { id: 'printing', label: 'Printing', icon: Printer },
];

export const HomeView: React.FC<HomeViewProps> = ({
  user,
  products,
  pools,
  totalSaved,
  joinedPoolIds,
  onSelectProduct,
  onAddToCart,
  onOpenCompare,
  onOpenGroupBuy,
  onJoinPoolQuick,
  onNavigate,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<CategoryId>('all');
  const [showScannerModal, setShowScannerModal] = useState(false);
  const [onlySubsidized, setOnlySubsidized] = useState(false);

  const featuredPool = pools[0];
  const [secondsLeft, setSecondsLeft] = useState(featuredPool?.secondsRemaining ?? 15735);

  useEffect(() => {
    const id = window.setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => window.clearInterval(id);
  }, []);

  const formatTimer = (sec: number) => {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const filteredProducts = products.filter((item) => {
    const matchesCat = activeCategory === 'all' || item.category === activeCategory;
    const q = searchQuery.trim().toLowerCase();
    const matchesQuery =
      !q ||
      item.title.toLowerCase().includes(q) ||
      item.sellerName.toLowerCase().includes(q) ||
      item.categoryLabel.toLowerCase().includes(q);
    const matchesSub = !onlySubsidized || Boolean(item.groupPrice || item.price < item.originalPrice);
    return matchesCat && matchesQuery && matchesSub;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5 pb-24 md:pb-12 flex flex-col gap-6">
      {/* Top Split: Greeting Savings Hero + Featured Live Group Buy */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Campus Savings Banner */}
        <div className="lg:col-span-7 rounded-2xl bg-gradient-to-br from-[#003734] via-[#0b4f4b] to-[#003734] p-5 sm:p-6 text-white shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                Hi, {user.name.split(' ')[0]}!
              </h1>
              <span className="text-xs font-semibold text-[#b2eee8]">
                {user.campusBuilding} · USTP CDO
              </span>
            </div>
            <p className="text-sm text-[#96d1cc] mt-1.5 max-w-lg">
              Split bulk costs with batchmates and compare verified campus store prices before
              pickup.
            </p>
          </div>

          <div className="mt-5 p-3.5 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#6ffbbe]/20 text-[#6ffbbe] flex items-center justify-center shrink-0">
                <PiggyBank className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[11px] font-semibold text-[#96d1cc] tracking-wide">
                  Your Campus Savings
                </div>
                <div className="text-lg sm:text-xl font-extrabold text-[#6ffbbe] tabular-nums">
                  ₱{totalSaved.toLocaleString()} saved this semester
                </div>
              </div>
            </div>
            <TrendingUp className="w-5 h-5 text-[#6ffbbe] shrink-0" />
          </div>
        </div>

        {/* Highlight Banner: Group Buy Happening Now */}
        {featuredPool && (
          <div className="lg:col-span-5 rounded-2xl bg-white p-5 shadow-sm border border-[#e2e7ff] flex flex-col justify-between">
            <div className="flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => onOpenGroupBuy(featuredPool.id)}
                className="text-sm font-extrabold text-[#131b2e] hover:text-[#003734] transition-colors cursor-pointer text-left"
              >
                Group Buy Happening Now
              </button>
              <div className="inline-flex items-center gap-1 text-xs font-bold text-[#93000a] bg-[#ffdad6] px-2.5 py-1 rounded-full tabular-nums">
                <Timer className="w-3.5 h-3.5" />
                <span>{formatTimer(secondsLeft)}</span>
              </div>
            </div>

            <div className="flex gap-3.5 items-start mt-3">
              <button
                type="button"
                onClick={() => onOpenGroupBuy(featuredPool.id)}
                className="w-20 h-20 rounded-xl overflow-hidden shrink-0 cursor-pointer"
              >
                <ProductVisual kind={featuredPool.visualKind} alt={featuredPool.title} />
              </button>
              <div className="flex-1 min-w-0">
                <button
                  type="button"
                  onClick={() => onOpenGroupBuy(featuredPool.id)}
                  className="text-sm font-bold text-[#131b2e] text-left hover:text-[#003734] line-clamp-1 cursor-pointer"
                >
                  {featuredPool.title}
                </button>
                <p className="text-xs text-[#3f4947] mt-1 flex items-center gap-1 tabular-nums">
                  <Users className="w-3.5 h-3.5 text-[#006c49]" />
                  <span>
                    {featuredPool.joinedCount} of {featuredPool.targetCapacity} students joined
                  </span>
                </p>
                <div className="w-full h-2 rounded-full bg-[#e2e7ff] my-2.5 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#006c49] transition-all duration-300"
                    style={{
                      width: `${Math.min(
                        100,
                        Math.round((featuredPool.joinedCount / featuredPool.targetCapacity) * 100)
                      )}%`,
                    }}
                  />
                </div>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-baseline gap-1.5 tabular-nums">
                    <span className="text-lg font-extrabold text-[#006c49]">
                      ₱{featuredPool.groupPrice}
                    </span>
                    <span className="text-xs text-[#707977] line-through">
                      ₱{featuredPool.originalPrice}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => onJoinPoolQuick(featuredPool)}
                    className={`h-9 px-4 rounded-full text-xs font-bold transition-all cursor-pointer ${
                      joinedPoolIds.includes(featuredPool.id)
                        ? 'bg-[#6cf8bb] text-[#002113]'
                        : 'bg-[#0b4f4b] text-white hover:bg-[#003734]'
                    }`}
                  >
                    {joinedPoolIds.includes(featuredPool.id) ? 'Pool Joined' : 'Join Pool'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Search & Category Controls */}
      <section className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 flex items-center bg-white rounded-full border border-[#e2e7ff] shadow-sm px-3 h-12">
            <Search className="w-5 h-5 text-[#707977] mr-2 shrink-0" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search school supplies, calculators, paper..."
              className="w-full bg-transparent text-sm text-[#131b2e] placeholder:text-[#707977] focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setShowScannerModal(true)}
              aria-label="Scan supply barcode"
              className="w-9 h-9 rounded-full bg-[#f2f3ff] text-[#003734] hover:bg-[#eaedff] flex items-center justify-center shrink-0 cursor-pointer"
            >
              <ScanBarcode className="w-4 h-4" />
            </button>
          </div>

          <button
            type="button"
            onClick={() => setOnlySubsidized((prev) => !prev)}
            className={`h-12 px-5 rounded-full text-xs font-semibold border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              onlySubsidized
                ? 'bg-[#003734] text-white border-[#003734]'
                : 'bg-white text-[#3f4947] border-[#e2e7ff] hover:text-[#003734]'
            }`}
          >
            {onlySubsidized ? 'Showing Subsidized Deals' : 'Filter: Student Deals'}
          </button>
        </div>

        {/* Quick Category Strip */}
        <div className="flex gap-2.5 overflow-x-auto no-scrollbar py-1">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const active = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-semibold whitespace-nowrap shrink-0 border transition-all cursor-pointer ${
                  active
                    ? 'bg-[#003734] text-white border-[#003734] shadow-sm'
                    : 'bg-white text-[#3f4947] border-[#e2e7ff] hover:bg-[#f2f3ff]'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{cat.label}</span>
                {cat.note && (
                  <span
                    className={`text-[10px] font-bold ${
                      active ? 'text-[#6ffbbe]' : 'text-[#006c49]'
                    }`}
                  >
                    {cat.note}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </section>

      {/* Best Deals & Price Drops */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-bold text-[#131b2e]">Best Deals &amp; Price Drops</h2>
            <p className="text-xs text-[#3f4947]">
              Verified campus store rates &amp; peer listings
            </p>
          </div>
          <button
            type="button"
            onClick={() => onOpenCompare()}
            className="text-xs font-bold text-[#003734] hover:underline flex items-center gap-0.5 whitespace-nowrap cursor-pointer"
          >
            <span>Compare Rates</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-[#e2e7ff]">
            <p className="text-sm font-semibold text-[#131b2e]">
              No supplies matched "{searchQuery}".
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setActiveCategory('all');
                setOnlySubsidized(false);
              }}
              className="mt-3 px-4 py-2 rounded-full bg-[#003734] text-white text-xs font-semibold cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProducts.map((product) => {
              const savings = product.originalPrice - product.price;
              return (
                <article
                  key={product.id}
                  className="bg-white rounded-2xl p-4 shadow-sm border border-[#e2e7ff]/70 flex flex-col justify-between gap-3 hover:shadow-md transition-shadow"
                >
                  <div className="flex gap-3.5">
                    <button
                      type="button"
                      onClick={() => onSelectProduct(product.id)}
                      className="w-24 h-24 rounded-xl overflow-hidden shrink-0 cursor-pointer"
                    >
                      <ProductVisual kind={product.visualKind} alt={product.title} />
                    </button>

                    <div className="flex-1 min-w-0 flex flex-col">
                      <span className="text-xs text-[#3f4947] truncate">
                        {product.sellerName} · {product.sellerBadge}
                      </span>
                      <button
                        type="button"
                        onClick={() => onSelectProduct(product.id)}
                        className="text-sm font-bold text-[#131b2e] text-left hover:text-[#003734] line-clamp-2 mt-0.5 cursor-pointer"
                      >
                        {product.title}
                      </button>

                      <div className="flex items-center gap-2 mt-1.5 text-xs text-[#3f4947] tabular-nums">
                        <span className="inline-flex items-center gap-0.5 font-bold text-[#131b2e]">
                          <Star className="w-3.5 h-3.5 fill-[#faa213] text-[#faa213]" />
                          {product.rating.toFixed(1)}
                        </span>
                        <span>·</span>
                        <span className="truncate">{product.soldLabel}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-[#f2f3ff]">
                    <div className="flex items-baseline gap-1.5 tabular-nums">
                      <span className="text-lg font-extrabold text-[#003734]">
                        ₱{product.price}
                      </span>
                      <span className="text-xs text-[#707977] line-through">
                        ₱{product.originalPrice}
                      </span>
                      {savings > 0 && (
                        <span className="text-xs font-bold text-[#006c49]">
                          Save ₱{savings}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onOpenCompare(product.id)}
                        className="h-9 px-3 rounded-full bg-[#f2f3ff] hover:bg-[#e2e7ff] text-[#003734] text-xs font-bold transition-colors cursor-pointer"
                      >
                        Compare
                      </button>
                      <button
                        type="button"
                        onClick={() => onAddToCart(product, 1)}
                        aria-label={`Add ${product.title} to cart`}
                        className="w-9 h-9 rounded-full bg-[#003734] hover:bg-[#0b4f4b] text-white flex items-center justify-center transition-colors cursor-pointer"
                      >
                        <ShoppingCart className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* Active Student Group Buys */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-[#131b2e]">Active Student Group Buys</h2>
            <p className="text-xs text-[#3f4947]">
              Team up with batchmates to unlock wholesale tiers
            </p>
          </div>
          <button
            type="button"
            onClick={() => onOpenGroupBuy()}
            className="text-xs font-bold text-[#003734] hover:underline flex items-center gap-0.5 cursor-pointer"
          >
            <span>All Pools</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {pools.map((pool) => {
            const pct = Math.min(100, Math.round((pool.joinedCount / pool.targetCapacity) * 100));
            const joined = joinedPoolIds.includes(pool.id);
            return (
              <div
                key={pool.id}
                className="bg-white rounded-2xl p-4 shadow-sm border border-[#e2e7ff]/70 flex flex-col justify-between gap-3"
              >
                <div>
                  <button
                    type="button"
                    onClick={() => onOpenGroupBuy(pool.id)}
                    className="w-full h-32 rounded-xl overflow-hidden mb-3 cursor-pointer"
                  >
                    <ProductVisual kind={pool.visualKind} alt={pool.title} />
                  </button>
                  <div className="text-xs font-semibold text-[#006c49]">
                    {pool.badgeLabel} · {pool.targetCapacity - pool.joinedCount} slots left
                  </div>
                  <button
                    type="button"
                    onClick={() => onOpenGroupBuy(pool.id)}
                    className="text-sm font-bold text-[#131b2e] text-left hover:text-[#003734] mt-0.5 line-clamp-1 cursor-pointer"
                  >
                    {pool.title}
                  </button>
                  <div className="w-full h-2 rounded-full bg-[#e2e7ff] my-2.5 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#006c49]"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div className="tabular-nums">
                    <span className="text-base font-extrabold text-[#003734]">
                      ₱{pool.groupPrice}
                    </span>
                    <span className="text-xs text-[#707977] line-through ml-1.5">
                      ₱{pool.originalPrice}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => onJoinPoolQuick(pool)}
                    className={`h-9 px-4 rounded-full text-xs font-bold transition-colors cursor-pointer ${
                      joined
                        ? 'bg-[#e2e7ff] text-[#003734]'
                        : 'bg-[#6cf8bb] text-[#002113] hover:bg-[#4edea3]'
                    }`}
                  >
                    {joined ? 'Reserved' : 'Claim Slot'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Peer-to-Peer ReUse Banner */}
      <section className="rounded-2xl bg-[#e2e7ff] p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="max-w-xl">
          <div className="inline-flex items-center gap-2 text-xs font-extrabold text-[#003734] mb-1">
            <Recycle className="w-4 h-4" />
            <span>Peer-to-Peer ReUse Marketplace</span>
          </div>
          <h3 className="text-lg font-bold text-[#131b2e]">
            Sell your used textbooks &amp; lab kits directly to freshmen
          </h3>
          <p className="text-sm text-[#3f4947] mt-1">
            Pass down semester notes, calculators, or drafting tools. Zero listing fees for all
            verified USTP students.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => onNavigate('sell')}
            className="h-11 px-5 rounded-full bg-[#0b4f4b] hover:bg-[#003734] text-white text-sm font-semibold flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Post Item</span>
          </button>
          <button
            type="button"
            onClick={() => onNavigate('marketplace')}
            className="h-11 px-5 rounded-full bg-white text-[#003734] text-sm font-semibold hover:bg-[#f2f3ff] flex items-center gap-1 cursor-pointer"
          >
            <span>Browse Peers</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* Barcode Lookup Modal */}
      {showScannerModal && (
        <div className="fixed inset-0 z-50 bg-[#283044]/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-bold text-[#131b2e]">Quick Campus Barcode Match</h3>
              <button
                type="button"
                onClick={() => setShowScannerModal(false)}
                className="p-1.5 rounded-full hover:bg-[#f2f3ff] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-[#3f4947] mb-4">
              Select a common USTP item barcode to compare live bookstore and coop rates:
            </p>
            <div className="flex flex-col gap-2">
              {products.slice(0, 3).map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setShowScannerModal(false);
                    onOpenCompare(item.id);
                  }}
                  className="w-full text-left p-3 rounded-xl bg-[#f2f3ff] hover:bg-[#eaedff] flex items-center justify-between cursor-pointer"
                >
                  <span className="text-xs font-bold text-[#131b2e] truncate pr-2">
                    {item.title}
                  </span>
                  <span className="text-xs font-extrabold text-[#006c49] tabular-nums shrink-0">
                    ₱{item.price}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
