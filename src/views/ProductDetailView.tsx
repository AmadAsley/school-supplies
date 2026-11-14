import React, { useState } from 'react';
import {
  BarChart3,
  Bolt,
  Check,
  ChevronDown,
  ChevronUp,
  Flame,
  GraduationCap,
  Heart,
  MapPin,
  Minus,
  PiggyBank,
  Plus,
  ShoppingCart,
  Star,
  Store,
  Users,
} from 'lucide-react';
import { ProductVisual } from '../components/ProductVisual';
import { SupplyProduct } from '../types';

interface ProductDetailViewProps {
  product: SupplyProduct;
  isWishlisted: boolean;
  onToggleWishlist: (productId: string) => void;
  onAddToCart: (product: SupplyProduct, qty: number) => void;
  onBuyNow: (product: SupplyProduct, qty: number) => void;
  onJoinGroupBuy: (productId: string) => void;
}

export const ProductDetailView: React.FC<ProductDetailViewProps> = ({
  product,
  isWishlisted,
  onToggleWishlist,
  onAddToCart,
  onBuyNow,
  onJoinGroupBuy,
}) => {
  const [qty, setQty] = useState(1);
  const [showComparison, setShowComparison] = useState(true);

  const unitSavings = Math.max(0, product.originalPrice - product.price);
  const pctSaved =
    product.originalPrice > 0
      ? Math.round((unitSavings / product.originalPrice) * 100)
      : 0;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-5 pb-28">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Visual Showcase & Specs */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-5 shadow-sm border border-[#e2e7ff]/70 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#006c49]">
              Verified University Supply
            </span>
            <button
              type="button"
              onClick={() => onToggleWishlist(product.id)}
              aria-label="Toggle Wishlist"
              className={`min-w-[44px] min-h-[44px] rounded-full flex items-center justify-center transition-colors cursor-pointer ${
                isWishlisted
                  ? 'bg-[#ffdad6] text-[#ba1a1a]'
                  : 'bg-[#f2f3ff] text-[#3f4947] hover:text-[#ba1a1a]'
              }`}
            >
              <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
            </button>
          </div>

          <div className="w-full aspect-square max-h-[320px] rounded-2xl overflow-hidden">
            <ProductVisual kind={product.visualKind} alt={product.title} />
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            {product.specs.map((spec) => (
              <div
                key={spec.label}
                className="bg-[#f2f3ff] rounded-xl p-2.5 text-center"
              >
                <div className="text-[11px] font-semibold text-[#3f4947]">{spec.label}</div>
                <div
                  className={`text-xs sm:text-sm font-bold mt-0.5 ${
                    spec.accent ? 'text-[#006c49]' : 'text-[#131b2e]'
                  }`}
                >
                  {spec.value}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Title, Pricing, Vendor Comparison, Merchant, Quantity, Specs */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#e2e7ff]/70 flex flex-col gap-3">
            <span className="text-xs font-bold text-[#0b4f4b] tracking-wide uppercase">
              {product.categoryLabel}
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#131b2e] leading-snug">
              {product.title}
            </h1>

            <div className="flex flex-wrap items-center gap-3 text-xs text-[#3f4947] tabular-nums">
              <span className="inline-flex items-center gap-1 bg-[#eaedff] px-2.5 py-1 rounded-md font-bold text-[#131b2e]">
                <Star className="w-3.5 h-3.5 fill-[#faa213] text-[#faa213]" />
                {product.rating.toFixed(1)} ({product.reviewCount} reviews)
              </span>
              <span>·</span>
              <span className="inline-flex items-center gap-1 font-semibold text-[#006c49]">
                <Flame className="w-3.5 h-3.5" />
                {product.soldLabel}
              </span>
            </div>

            <div className="flex items-baseline justify-between flex-wrap gap-2 pt-1">
              <div className="flex items-baseline gap-2 tabular-nums">
                <span className="text-3xl font-extrabold text-[#131b2e]">
                  ₱{product.price}
                </span>
                <span className="text-base text-[#707977] line-through">
                  ₱{product.originalPrice}
                </span>
              </div>
              {unitSavings > 0 && (
                <div className="inline-flex items-center gap-1.5 bg-[#6cf8bb] text-[#002113] text-xs font-bold px-3 py-1 rounded-full tabular-nums">
                  <PiggyBank className="w-3.5 h-3.5" />
                  <span>
                    Save ₱{unitSavings} ({pctSaved}% OFF)
                  </span>
                </div>
              )}
            </div>

            {product.groupPrice && (
              <div className="bg-[#f2f3ff] rounded-xl p-3 flex items-center gap-2.5 text-xs text-[#3f4947]">
                <Users className="w-4 h-4 text-[#003734] shrink-0" />
                <span>
                  Order together with campus batchmates to unlock{' '}
                  <strong className="text-[#006c49]">
                    ₱{product.groupPrice}/{product.unitLabel}
                  </strong>
                  .
                </span>
              </div>
            )}
          </div>

          {/* Live Campus Price Comparison */}
          <div className="bg-white rounded-2xl shadow-sm border border-[#e2e7ff]/70 overflow-hidden">
            <button
              type="button"
              onClick={() => setShowComparison((prev) => !prev)}
              className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-[#f2f3ff]/70 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#b2eee8] text-[#0c4f4b] flex items-center justify-center">
                  <BarChart3 className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm font-bold text-[#131b2e]">
                    Live Campus Price Comparison
                  </div>
                  <div className="text-xs font-semibold text-[#006c49]">
                    Lowest campus rate verified today
                  </div>
                </div>
              </div>
              {showComparison ? (
                <ChevronUp className="w-5 h-5 text-[#3f4947]" />
              ) : (
                <ChevronDown className="w-5 h-5 text-[#3f4947]" />
              )}
            </button>

            {showComparison && (
              <div className="px-5 pb-4 flex flex-col gap-2">
                {product.vendorQuotes.map((vq) => (
                  <div
                    key={vq.id}
                    className={`flex items-center justify-between p-3 rounded-xl ${
                      vq.isLowest ? 'bg-[#6cf8bb]/30' : 'bg-[#f2f3ff]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Store
                        className={`w-4 h-4 shrink-0 ${
                          vq.isLowest ? 'text-[#006c49]' : 'text-[#707977]'
                        }`}
                      />
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-[#131b2e] truncate">
                          {vq.sellerName}
                        </div>
                        <div className="text-xs text-[#3f4947] truncate">{vq.subtitle}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 tabular-nums">
                      <span
                        className={`text-base font-extrabold ${
                          vq.isLowest ? 'text-[#006c49]' : 'text-[#131b2e]'
                        }`}
                      >
                        ₱{vq.price}
                      </span>
                      {vq.isLowest && (
                        <span className="bg-[#006c49] text-white text-[10px] font-bold px-2 py-0.5 rounded">
                          Lowest
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Merchant Card */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#e2e7ff]/70 flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-[#0b4f4b] text-white flex items-center justify-center shrink-0">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <div className="text-sm font-bold text-[#131b2e]">{product.sellerName}</div>
                <div className="text-xs font-semibold text-[#006c49]">
                  {product.sellerBadge}
                </div>
              </div>
            </div>
            <div className="bg-[#f2f3ff] rounded-xl p-3 flex flex-col gap-1.5 text-xs">
              <div className="flex items-center gap-2 text-[#131b2e]">
                <MapPin className="w-4 h-4 text-[#003734] shrink-0" />
                <span>{product.sellerLocation}</span>
              </div>
              <div className="flex items-center gap-2 font-semibold text-[#006c49]">
                <Bolt className="w-4 h-4 shrink-0" />
                <span>{product.pickupWindow}</span>
              </div>
            </div>
          </div>

          {/* Quantity Picker */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#e2e7ff]/70 flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold text-[#131b2e]">Select Quantity</div>
              <div className="text-xs font-semibold text-[#006c49] tabular-nums">
                In stock: {product.inStock} {product.unitLabel}s left
              </div>
            </div>
            <div className="flex items-center bg-[#f2f3ff] rounded-full p-1">
              <button
                type="button"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                disabled={qty <= 1}
                aria-label="Decrease quantity"
                className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-[#131b2e] disabled:opacity-40 cursor-pointer"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-10 text-center font-bold text-base tabular-nums">{qty}</span>
              <button
                type="button"
                onClick={() => setQty((q) => Math.min(product.inStock, q + 1))}
                disabled={qty >= product.inStock}
                aria-label="Increase quantity"
                className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-[#131b2e] disabled:opacity-40 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Product Specifications & Peer Review */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#e2e7ff]/70 flex flex-col gap-3">
            <h2 className="text-base font-bold text-[#131b2e]">Product Specifications</h2>
            <p className="text-sm text-[#3f4947] leading-relaxed">{product.description}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {product.highlights.map((h) => (
                <div
                  key={h}
                  className="bg-[#f2f3ff] p-2.5 rounded-xl flex items-center gap-2 text-xs font-medium text-[#131b2e]"
                >
                  <Check className="w-4 h-4 text-[#006c49] shrink-0" />
                  <span>{h}</span>
                </div>
              ))}
            </div>
            <div className="bg-[#f2f3ff]/70 rounded-xl p-3 flex items-start gap-2.5 mt-1">
              <img
                src="/assets/aistudio/Image_1_209f2aa4.jpeg"
                alt={product.peerReview.author}
                className="w-8 h-8 rounded-full object-cover shrink-0"
              />
              <div>
                <div className="text-xs font-bold text-[#131b2e]">
                  {product.peerReview.author} ({product.peerReview.program}) ·{' '}
                  <span className="text-[#006c49]">Verified Buyer</span>
                </div>
                <p className="text-xs text-[#3f4947] mt-0.5">"{product.peerReview.quote}"</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Bottom Action Bar */}
      <div className="fixed bottom-0 inset-x-0 z-30 bg-white/95 backdrop-blur-md border-t border-[#e2e7ff] pb-safe">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => onAddToCart(product, qty)}
            aria-label="Add to cart"
            className="w-12 h-12 rounded-xl bg-[#e2e7ff] text-[#003734] hover:bg-[#dae2fd] flex items-center justify-center shrink-0 cursor-pointer"
          >
            <ShoppingCart className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={() => onBuyNow(product, qty)}
            className="flex-1 h-12 rounded-xl bg-[#003734] hover:bg-[#0b4f4b] text-white font-semibold text-sm flex flex-col items-center justify-center tabular-nums cursor-pointer"
          >
            <span>Buy Now</span>
            <span className="text-[11px] text-[#b2eee8]">₱{qty * product.price}</span>
          </button>

          {product.groupPrice && (
            <button
              type="button"
              onClick={() => onJoinGroupBuy(product.id)}
              className="flex-1 h-12 rounded-xl bg-[#006c49] hover:bg-[#005236] text-white font-semibold text-sm flex flex-col items-center justify-center tabular-nums cursor-pointer"
            >
              <span className="inline-flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>Group Buy</span>
              </span>
              <span className="text-[11px] text-[#6ffbbe]">
                ₱{product.groupPrice} (Save ₱{product.originalPrice - product.groupPrice})
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
