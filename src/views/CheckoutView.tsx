import React, { useState } from 'react';
import {
  BadgeCheck,
  Banknote,
  CheckCircle2,
  Clock,
  CreditCard,
  Lock,
  MapPin,
  Minus,
  PiggyBank,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Store,
  Trash2,
  Wallet,
} from 'lucide-react';
import { ProductVisual } from '../components/ProductVisual';
import { CartItem, StudentUser } from '../types';

interface CheckoutViewProps {
  user: StudentUser;
  cart: CartItem[];
  onUpdateQty: (cartItemId: string, delta: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  onPlaceOrder: (payload: {
    paymentMethod: string;
    fulfillmentMode: 'pickup' | 'delivery';
    fulfillmentFee: number;
    totalPayable: number;
    totalSavings: number;
  }) => string;
  onBrowseHome: () => void;
  onViewOrders: () => void;
}

export const CheckoutView: React.FC<CheckoutViewProps> = ({
  user,
  cart,
  onUpdateQty,
  onRemoveItem,
  onPlaceOrder,
  onBrowseHome,
  onViewOrders,
}) => {
  const [fulfillmentMode, setFulfillmentMode] = useState<'pickup' | 'delivery'>('pickup');
  const [paymentMethod, setPaymentMethod] = useState<'GCash' | 'Maya' | 'Cash on Campus Pickup'>(
    'GCash'
  );
  const [placedOrderCode, setPlacedOrderCode] = useState<string | null>(null);

  const subtotal = cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const retailSubtotal = cart.reduce(
    (sum, item) => sum + item.originalPrice * item.quantity,
    0
  );
  const itemDiscount = Math.max(0, retailSubtotal - subtotal);
  const subsidy = cart.length > 0 ? 20 : 0;
  const fulfillmentFee = fulfillmentMode === 'delivery' ? 20 : 0;
  const totalSavings = itemDiscount + subsidy;
  const totalPayable = Math.max(0, subtotal + fulfillmentFee - subsidy);

  const handleCheckout = () => {
    if (cart.length === 0) return;
    const code = onPlaceOrder({
      paymentMethod,
      fulfillmentMode,
      fulfillmentFee,
      totalPayable,
      totalSavings,
    });
    setPlacedOrderCode(code);
  };

  if (cart.length === 0 && !placedOrderCode) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center flex flex-col items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-[#eaedff] text-[#003734] flex items-center justify-center">
          <ShoppingBag className="w-7 h-7" />
        </div>
        <h1 className="text-xl font-bold text-[#131b2e]">Your campus cart is empty</h1>
        <p className="text-sm text-[#3f4947]">
          Explore verified USTP Coop supplies, compare vendor prices, or join an active group buy.
        </p>
        <button
          type="button"
          onClick={onBrowseHome}
          className="h-11 px-6 rounded-full bg-[#003734] text-white text-sm font-bold cursor-pointer"
        >
          Browse Campus Supplies
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-5 pb-32 flex flex-col gap-5">
      {/* Verified USTP Subsidy Banner */}
      <div className="bg-[#eaedff] rounded-2xl p-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-full bg-[#0b4f4b] text-[#85bfba] flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="text-sm font-bold text-[#131b2e]">USTP Student ID Verified</div>
            <div className="text-xs text-[#3f4947] truncate">
              Institutional subsidies &amp; discounts active for {user.studentId}
            </div>
          </div>
        </div>
        <span className="bg-[#6cf8bb] text-[#002113] text-xs font-bold px-3 py-1 rounded-full shrink-0 tabular-nums">
          Save ₱{totalSavings}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Items & Fulfillment & Payment */}
        <div className="lg:col-span-7 flex flex-col gap-5">
          <section className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h1 className="text-base font-bold text-[#131b2e]">
                Order Items ({cart.length})
              </h1>
              <span className="text-xs font-semibold text-[#006c49]">Bulk Campus Rate</span>
            </div>

            {cart.map((item) => {
              const lineTotal = item.unitPrice * item.quantity;
              const lineSaved = Math.max(0, (item.originalPrice - item.unitPrice) * item.quantity);
              return (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl p-4 shadow-sm border border-[#e2e7ff] flex flex-col gap-3"
                >
                  <div className="flex gap-3.5 items-start">
                    <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0">
                      <ProductVisual kind={item.visualKind} alt={item.title} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h2 className="text-sm font-bold text-[#131b2e] line-clamp-1">
                          {item.title}
                        </h2>
                        <button
                          type="button"
                          onClick={() => onRemoveItem(item.id)}
                          aria-label={`Remove ${item.title}`}
                          className="p-1 text-[#707977] hover:text-[#ba1a1a] cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-xs text-[#3f4947]">{item.subtitle}</p>
                      <div className="mt-2.5 flex items-center justify-between gap-2">
                        <div className="flex items-baseline gap-1.5 tabular-nums">
                          <span className="text-base font-extrabold text-[#131b2e]">
                            ₱{lineTotal}
                          </span>
                          <span className="text-xs text-[#3f4947]">₱{item.unitPrice}/ea</span>
                        </div>

                        <div className="flex items-center bg-[#eaedff] rounded-full p-0.5">
                          <button
                            type="button"
                            onClick={() => onUpdateQty(item.id, -1)}
                            disabled={item.quantity <= 1}
                            aria-label="Decrease quantity"
                            className="w-7 h-7 rounded-full bg-white flex items-center justify-center disabled:opacity-40 cursor-pointer"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-7 text-center text-xs font-bold tabular-nums">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => onUpdateQty(item.id, 1)}
                            aria-label="Increase quantity"
                            className="w-7 h-7 rounded-full bg-white flex items-center justify-center cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#f2f3ff] rounded-lg px-3 py-1.5 flex items-center justify-between text-xs text-[#3f4947]">
                    <span className="inline-flex items-center gap-1.5">
                      <Store className="w-3.5 h-3.5 text-[#006c49]" />
                      <span>{item.sellerName} · Free handling</span>
                    </span>
                    {lineSaved > 0 && (
                      <span className="font-bold text-[#006c49] tabular-nums">
                        ₱{lineSaved} saved
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </section>

          {/* Fulfillment Option */}
          <section className="flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-[#131b2e]">Fulfillment Option</h2>
              <span className="text-xs text-[#3f4947]">USTP CDO Quad</span>
            </div>

            <label
              className={`cursor-pointer bg-white rounded-2xl p-4 border transition-colors flex items-start gap-3 ${
                fulfillmentMode === 'pickup'
                  ? 'border-[#003734] bg-[#003734]/[0.03]'
                  : 'border-[#e2e7ff]'
              }`}
            >
              <input
                type="radio"
                name="fulfillment"
                checked={fulfillmentMode === 'pickup'}
                onChange={() => setFulfillmentMode('pickup')}
                className="mt-1 w-4 h-4 accent-[#003734]"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-[#131b2e]">Free On-Campus Pickup</span>
                  <span className="text-xs font-bold text-[#006c49]">FREE</span>
                </div>
                <p className="text-xs text-[#3f4947] mt-0.5">{user.primaryKiosk}</p>
                <div className="inline-flex items-center gap-1 mt-2 text-[11px] font-semibold text-[#653e00] bg-[#ffddb8]/50 px-2.5 py-1 rounded-lg">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Available today: 1:00 PM – 5:00 PM</span>
                </div>
              </div>
            </label>

            <label
              className={`cursor-pointer bg-white rounded-2xl p-4 border transition-colors flex items-start gap-3 ${
                fulfillmentMode === 'delivery'
                  ? 'border-[#003734] bg-[#003734]/[0.03]'
                  : 'border-[#e2e7ff]'
              }`}
            >
              <input
                type="radio"
                name="fulfillment"
                checked={fulfillmentMode === 'delivery'}
                onChange={() => setFulfillmentMode('delivery')}
                className="mt-1 w-4 h-4 accent-[#003734]"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-[#131b2e]">
                    Dorm / Canteen Runner Delivery
                  </span>
                  <span className="text-xs font-bold text-[#131b2e] tabular-nums">+₱20</span>
                </div>
                <p className="text-xs text-[#3f4947] mt-0.5">
                  Peer student courier brings it directly to your building hall (~35 mins)
                </p>
              </div>
            </label>
          </section>

          {/* Payment Method */}
          <section className="flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-[#131b2e]">Payment Method</h2>
              <span className="text-xs text-[#006c49] inline-flex items-center gap-1 font-semibold">
                <Lock className="w-3.5 h-3.5" />
                Encrypted
              </span>
            </div>

            <div className="bg-white rounded-2xl p-3 border border-[#e2e7ff] flex flex-col gap-1.5">
              {(
                [
                  {
                    id: 'GCash',
                    sub: `${user.gcashMasked} · Connected`,
                    icon: Wallet,
                  },
                  {
                    id: 'Maya',
                    sub: 'Pay via e-wallet',
                    icon: CreditCard,
                  },
                  {
                    id: 'Cash on Campus Pickup',
                    sub: 'Pay at student booth counter',
                    icon: Banknote,
                  },
                ] as const
              ).map((pm) => {
                const Icon = pm.icon;
                const active = paymentMethod === pm.id;
                return (
                  <label
                    key={pm.id}
                    className={`cursor-pointer rounded-xl p-3 flex items-center justify-between transition-colors ${
                      active ? 'bg-[#eaedff]' : 'hover:bg-[#f2f3ff]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[#faf8ff] flex items-center justify-center text-[#003734]">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-[#131b2e]">{pm.id}</div>
                        <div className="text-xs text-[#3f4947]">{pm.sub}</div>
                      </div>
                    </div>
                    <input
                      type="radio"
                      name="payment"
                      checked={active}
                      onChange={() => setPaymentMethod(pm.id)}
                      className="w-4 h-4 accent-[#003734]"
                    />
                  </label>
                );
              })}
            </div>
          </section>
        </div>

        {/* Right: Cost Breakdown */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-5 shadow-sm border border-[#e2e7ff] flex flex-col gap-4 lg:sticky lg:top-24">
          <h2 className="text-base font-bold text-[#131b2e]">Cost Breakdown</h2>
          <div className="flex flex-col gap-2.5 text-sm tabular-nums">
            <div className="flex justify-between text-[#3f4947]">
              <span>Items Subtotal</span>
              <span className="font-semibold text-[#131b2e]">₱{subtotal}</span>
            </div>
            <div className="flex justify-between text-[#3f4947]">
              <span>Campus Fulfillment</span>
              <span className="font-semibold text-[#006c49]">
                {fulfillmentFee === 0 ? 'FREE' : `+₱${fulfillmentFee}`}
              </span>
            </div>
            <div className="flex justify-between text-[#3f4947]">
              <span>Student Tech Subsidy</span>
              <span className="font-semibold text-[#006c49]">-₱{subsidy}</span>
            </div>

            <div className="p-3 rounded-xl bg-[#6cf8bb]/35 flex items-center justify-between text-xs font-bold text-[#002113]">
              <span className="inline-flex items-center gap-1.5">
                <PiggyBank className="w-4 h-4" />
                Total Savings
              </span>
              <span>₱{totalSavings} Total Discount</span>
            </div>

            <div className="pt-2 border-t border-[#f2f3ff] flex items-baseline justify-between">
              <div>
                <div className="text-sm font-bold text-[#131b2e]">Total Payable</div>
                <div className="text-[11px] text-[#707977]">
                  Inclusive of campus VAT exemptions
                </div>
              </div>
              <span className="text-3xl font-extrabold text-[#131b2e]">₱{totalPayable}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleCheckout}
            className="hidden lg:flex w-full h-12 rounded-full bg-[#003734] hover:bg-[#0b4f4b] text-white font-bold text-sm items-center justify-center gap-2 shadow-md cursor-pointer tabular-nums"
          >
            <Lock className="w-4 h-4" />
            <span>Place Order · ₱{totalPayable}</span>
          </button>
        </div>
      </div>

      {/* Mobile Sticky Bottom Checkout Bar */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-30 bg-white/95 backdrop-blur-md border-t border-[#e2e7ff] p-4 pb-safe">
        <div className="flex items-center gap-3">
          <div className="tabular-nums pr-2">
            <div className="text-[10px] font-bold text-[#3f4947]">TOTAL</div>
            <div className="text-lg font-extrabold text-[#131b2e]">₱{totalPayable}</div>
          </div>
          <button
            type="button"
            onClick={handleCheckout}
            className="flex-1 h-12 rounded-full bg-[#003734] hover:bg-[#0b4f4b] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md cursor-pointer tabular-nums"
          >
            <Lock className="w-4 h-4" />
            <span>Place Order · ₱{totalPayable}</span>
          </button>
        </div>
      </div>

      {/* Order Confirmation Modal */}
      {placedOrderCode && (
        <div className="fixed inset-0 z-50 bg-[#283044]/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full text-center shadow-2xl flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-[#6cf8bb] text-[#002113] flex items-center justify-center mb-3">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <h3 className="text-xl font-extrabold text-[#131b2e]">Order Reserved!</h3>
            <p className="text-sm text-[#3f4947] mt-1">
              Pick-up code{' '}
              <span className="font-mono font-bold text-[#003734]">{placedOrderCode}</span>{' '}
              issued for {paymentMethod}.
            </p>
            <div className="w-full bg-[#f2f3ff] rounded-xl p-3 my-4 text-left flex items-center gap-2.5 text-xs">
              <MapPin className="w-4 h-4 text-[#006c49] shrink-0" />
              <div>
                <div className="font-bold text-[#131b2e]">{user.primaryKiosk}</div>
                <div className="text-[#3f4947]">Ready for claiming today 1:00 PM</div>
              </div>
            </div>
            <div className="w-full flex flex-col gap-2">
              <button
                type="button"
                onClick={() => {
                  setPlacedOrderCode(null);
                  onViewOrders();
                }}
                className="w-full h-11 rounded-full bg-[#003734] text-white text-sm font-bold cursor-pointer"
              >
                Track Order &amp; Show QR
              </button>
              <button
                type="button"
                onClick={() => {
                  setPlacedOrderCode(null);
                  onBrowseHome();
                }}
                className="w-full h-10 rounded-full text-xs font-semibold text-[#3f4947] hover:text-[#131b2e] cursor-pointer"
              >
                Back to Campus Marketplace
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
