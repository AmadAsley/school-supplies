import React, { useState } from 'react';
import {
  BadgeCheck,
  Check,
  CheckCheck,
  Clock,
  GraduationCap,
  MapPin,
  QrCode,
  Receipt,
  RotateCcw,
  Search,
  Share2,
  Store,
  Users,
  X,
} from 'lucide-react';
import { ProductVisual } from '../components/ProductVisual';
import { CampusOrder } from '../types';

interface OrdersViewProps {
  orders: CampusOrder[];
  onClaimOrder: (orderId: string) => void;
  onReorder: (order: CampusOrder) => void;
  onShowToast: (msg: string) => void;
}

export const OrdersView: React.FC<OrdersViewProps> = ({
  orders,
  onClaimOrder,
  onReorder,
  onShowToast,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'ready' | 'completed'>('active');
  const [qrOrder, setQrOrder] = useState<CampusOrder | null>(null);
  const [receiptOrder, setReceiptOrder] = useState<CampusOrder | null>(null);

  const activeCount = orders.filter((o) => o.status !== 'Completed').length;
  const readyCount = orders.filter((o) => o.status === 'Ready for Pickup').length;
  const completedCount = orders.filter((o) => o.status === 'Completed').length;

  const filteredOrders = orders.filter((o) => {
    const q = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !q ||
      o.code.toLowerCase().includes(q) ||
      o.title.toLowerCase().includes(q) ||
      o.vendorName.toLowerCase().includes(q);
    const matchesFilter =
      filter === 'all'
        ? true
        : filter === 'active'
        ? o.status !== 'Completed'
        : filter === 'ready'
        ? o.status === 'Ready for Pickup'
        : o.status === 'Completed';
    return matchesSearch && matchesFilter;
  });

  const handleInviteClassmates = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href).catch(() => {});
    }
    onShowToast('Group Buy invite link copied! (+₱10 bonus when 2 more join)');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-5 pb-24 md:pb-12 flex flex-col gap-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-[#003734] tracking-tight">
            My Campus Orders
          </h1>
          <p className="text-xs text-[#3f4947]">
            Live pickups, group buy pools, and peer handshake records
          </p>
        </div>
        <span className="text-xs font-bold text-[#006c49] bg-[#6cf8bb]/40 px-3 py-1.5 rounded-full self-start sm:self-auto tabular-nums">
          {readyCount} Ready for Pickup
        </span>
      </div>

      {/* Search + Status Filter Tabs */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1 flex items-center bg-white rounded-full border border-[#e2e7ff] shadow-sm px-4 h-11">
          <Search className="w-4 h-4 text-[#707977] mr-2 shrink-0" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search order ID, item name, or seller..."
            className="w-full bg-transparent text-sm text-[#131b2e] placeholder:text-[#707977] focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          {(
            [
              { id: 'all', label: `All (${orders.length})` },
              { id: 'active', label: `Active (${activeCount})` },
              { id: 'ready', label: `Ready (${readyCount})` },
              { id: 'completed', label: `Completed (${completedCount})` },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilter(tab.id)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap shrink-0 transition-colors cursor-pointer tabular-nums ${
                filter === tab.id
                  ? 'bg-[#0b4f4b] text-white'
                  : 'bg-white text-[#3f4947] border border-[#e2e7ff] hover:bg-[#eaedff]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 text-center border border-[#e2e7ff]">
          <p className="text-sm font-semibold text-[#131b2e]">No orders in this filter.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {filteredOrders.map((order) => (
            <article
              key={order.id}
              className="bg-white rounded-2xl shadow-sm border border-[#e2e7ff] overflow-hidden"
            >
              {/* Card Ribbon */}
              <div
                className={`p-4 flex items-center justify-between gap-2 flex-wrap ${
                  order.status === 'Ready for Pickup'
                    ? 'bg-gradient-to-r from-[#6cf8bb]/25 to-white'
                    : order.status === 'Pooling Orders'
                    ? 'bg-gradient-to-r from-[#ffddb8]/35 to-white'
                    : 'bg-[#f2f3ff]/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                      order.status === 'Ready for Pickup'
                        ? 'bg-[#6ffbbe] text-[#002113]'
                        : order.status === 'Pooling Orders'
                        ? 'bg-[#ffddb8] text-[#2a1700]'
                        : 'bg-[#eaedff] text-[#3f4947]'
                    }`}
                  >
                    {order.type === 'groupbuy' ? (
                      <Users className="w-4 h-4" />
                    ) : (
                      <Store className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#003734]">
                      {order.code} · <span className="font-normal text-[#3f4947]">{order.timestamp}</span>
                    </div>
                    <div className="text-xs font-semibold text-[#006c49]">{order.vendorName}</div>
                  </div>
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold ${
                    order.status === 'Ready for Pickup'
                      ? 'bg-[#6ffbbe] text-[#002113]'
                      : order.status === 'Pooling Orders'
                      ? 'bg-[#ffddb8] text-[#2a1700]'
                      : 'bg-[#e2e7ff] text-[#131b2e]'
                  }`}
                >
                  {order.status}
                  {order.poolJoined && order.poolTarget
                    ? ` (${order.poolJoined}/${order.poolTarget})`
                    : ''}
                </span>
              </div>

              {/* Card Body */}
              <div className="p-4 flex flex-col gap-4">
                <div className="flex items-start gap-3.5">
                  <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0">
                    <ProductVisual kind={order.visualKind} alt={order.title} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-base font-bold text-[#131b2e] leading-snug">
                      {order.title}
                    </h2>
                    <div className="mt-1 flex items-center gap-2 text-xs text-[#3f4947] tabular-nums">
                      <span className="text-base font-extrabold text-[#003734]">
                        ₱{order.totalAmount}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[#006c49] font-semibold">
                        <BadgeCheck className="w-3.5 h-3.5" />
                        {order.paymentMethod}
                      </span>
                    </div>
                    <div className="mt-1.5 flex items-center gap-1.5 text-xs text-[#3f4947]">
                      <MapPin className="w-3.5 h-3.5 text-[#006c49] shrink-0" />
                      <span>{order.pickupLocation}</span>
                    </div>
                  </div>
                </div>

                {/* Pickup Step Tracker */}
                {order.status === 'Ready for Pickup' && (
                  <>
                    <div className="grid grid-cols-4 gap-1 text-center text-[11px] pt-1">
                      {['Confirmed', 'Preparing', 'Ready to Claim', 'Completed'].map((step, i) => {
                        const done = i + 1 <= order.stepIndex;
                        return (
                          <div key={step} className="flex flex-col items-center gap-1">
                            <div
                              className={`w-6 h-6 rounded-full flex items-center justify-center ${
                                done
                                  ? 'bg-[#006c49] text-white'
                                  : 'bg-[#eaedff] text-[#707977]'
                              }`}
                            >
                              {i + 1 === 3 && done ? (
                                <QrCode className="w-3.5 h-3.5" />
                              ) : (
                                <Check className="w-3.5 h-3.5" />
                              )}
                            </div>
                            <span
                              className={
                                done ? 'font-bold text-[#003734]' : 'text-[#707977]'
                              }
                            >
                              {step}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    <button
                      type="button"
                      onClick={() => setQrOrder(order)}
                      className="w-full h-11 rounded-xl bg-[#003734] hover:bg-[#0b4f4b] text-white font-bold text-sm flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <QrCode className="w-4 h-4" />
                      <span>Show Pickup QR Code to Kiosk</span>
                    </button>
                  </>
                )}

                {/* Pooling Progress */}
                {order.status === 'Pooling Orders' &&
                  order.poolJoined !== undefined &&
                  order.poolTarget !== undefined && (
                    <>
                      <div className="bg-[#f2f3ff] rounded-xl p-3 flex flex-col gap-2">
                        <div className="flex items-center justify-between text-xs font-bold tabular-nums">
                          <span className="text-[#3f4947]">Batch Slot Capacity</span>
                          <span className="text-[#003734]">
                            {order.poolJoined} of {order.poolTarget} slots filled
                          </span>
                        </div>
                        <div className="w-full h-2.5 bg-[#eaedff] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#006c49] rounded-full"
                            style={{
                              width: `${Math.min(
                                100,
                                Math.round((order.poolJoined / order.poolTarget) * 100)
                              )}%`,
                            }}
                          />
                        </div>
                        <p className="text-xs text-[#3f4947]">
                          Awaiting {Math.max(0, order.poolTarget - order.poolJoined)} more
                          students to trigger bulk delivery.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={handleInviteClassmates}
                        className="w-full h-11 rounded-xl bg-[#6cf8bb] hover:bg-[#4edea3] text-[#002113] font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Share2 className="w-4 h-4" />
                        <span>Invite Classmates (+₱10 bonus)</span>
                      </button>
                    </>
                  )}

                {/* Completed Actions */}
                {order.status === 'Completed' && (
                  <div className="flex items-center gap-2.5">
                    <button
                      type="button"
                      onClick={() => setReceiptOrder(order)}
                      className="flex-1 h-10 rounded-xl bg-[#eaedff] hover:bg-[#e2e7ff] text-[#003734] text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Receipt className="w-4 h-4" />
                      <span>View Receipt</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onReorder(order)}
                      className="flex-1 h-10 rounded-xl bg-[#003734] hover:bg-[#0b4f4b] text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>Order Again</span>
                    </button>
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Kiosk Pickup Tip */}
      <div className="rounded-2xl bg-[#003734] text-white p-5 flex items-center gap-4">
        <div className="w-11 h-11 rounded-full bg-white/10 text-[#6ffbbe] flex items-center justify-center shrink-0">
          <GraduationCap className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-sm font-bold">Pick up between classes</h3>
          <p className="text-xs text-[#b2eee8] mt-0.5">
            Kiosk Windows 1 to 4 stay open until 6:30 PM for all verified USTP Student ID holders.
          </p>
        </div>
      </div>

      {/* Pickup QR Modal */}
      {qrOrder && (
        <div className="fixed inset-0 z-50 bg-[#283044]/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full text-center shadow-2xl flex flex-col items-center">
            <div className="w-full flex justify-end">
              <button
                type="button"
                onClick={() => setQrOrder(null)}
                className="p-1.5 rounded-full hover:bg-[#f2f3ff] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-[#6ffbbe]/40 text-[#006c49] flex items-center justify-center mb-2">
              <QrCode className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#003734]">Fast Kiosk Pickup</h3>
            <p className="text-xs text-[#3f4947] mt-1">
              Scan at <strong className="text-[#131b2e]">{qrOrder.pickupLocation}</strong> for{' '}
              {qrOrder.code}
            </p>

            <div className="my-4 p-4 rounded-2xl bg-[#f2f3ff]">
              <svg viewBox="0 0 160 160" className="w-44 h-44">
                <rect width="160" height="160" rx="12" fill="#ffffff" />
                <path d="M16 16h40v40H16z m8 8v24h24V24z m8 8h8v8h-8z" fill="#003734" />
                <path d="M104 16h40v40h-40z m8 8v24h24V24z m8 8h8v8h-8z" fill="#003734" />
                <path d="M16 104h40v40H16z m8 8v24h24V112z m8 8h8v8h-8z" fill="#003734" />
                <rect x="68" y="20" width="8" height="8" fill="#006c49" />
                <rect x="80" y="28" width="8" height="16" fill="#003734" />
                <rect x="68" y="44" width="16" height="8" fill="#006c49" />
                <rect x="24" y="68" width="8" height="16" fill="#003734" />
                <rect x="40" y="76" width="12" height="8" fill="#003734" />
                <rect x="64" y="64" width="32" height="32" rx="4" fill="#0b4f4b" />
                <rect x="104" y="68" width="16" height="8" fill="#006c49" />
                <rect x="128" y="76" width="12" height="16" fill="#003734" />
                <rect x="68" y="104" width="8" height="16" fill="#003734" />
                <rect x="84" y="112" width="12" height="8" fill="#006c49" />
                <rect x="104" y="104" width="16" height="16" fill="#003734" />
                <rect x="128" y="128" width="16" height="16" fill="#006c49" />
                <circle cx="80" cy="80" r="8" fill="#6ffbbe" />
              </svg>
            </div>

            <div className="flex items-center gap-1.5 text-xs font-bold text-[#006c49] mb-4">
              <Clock className="w-4 h-4" />
              <span>Valid for 14 mins · Code {qrOrder.code}</span>
            </div>

            <div className="w-full flex flex-col gap-2">
              <button
                type="button"
                onClick={() => {
                  onClaimOrder(qrOrder.id);
                  setQrOrder(null);
                }}
                className="w-full h-11 rounded-full bg-[#006c49] hover:bg-[#005236] text-white text-sm font-bold flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <CheckCheck className="w-4 h-4" />
                <span>Confirm Kiosk Release</span>
              </button>
              <button
                type="button"
                onClick={() => setQrOrder(null)}
                className="w-full h-10 rounded-full bg-[#eaedff] text-[#003734] text-xs font-bold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Receipt Modal */}
      {receiptOrder && (
        <div className="fixed inset-0 z-50 bg-[#283044]/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-[#131b2e]">Digital Receipt</h3>
              <button
                type="button"
                onClick={() => setReceiptOrder(null)}
                className="p-1.5 rounded-full hover:bg-[#f2f3ff] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="bg-[#f2f3ff] rounded-2xl p-4 text-xs flex flex-col gap-2 tabular-nums">
              <div className="flex justify-between">
                <span className="text-[#3f4947]">Order ID</span>
                <span className="font-bold text-[#131b2e]">{receiptOrder.code}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#3f4947]">Item</span>
                <span className="font-semibold text-[#131b2e] text-right max-w-[180px] truncate">
                  {receiptOrder.title}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#3f4947]">Payment</span>
                <span className="font-semibold text-[#131b2e]">{receiptOrder.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#3f4947]">Savings</span>
                <span className="font-bold text-[#006c49]">₱{receiptOrder.savingsAmount}</span>
              </div>
              <div className="pt-2 border-t border-[#dae2fd] flex justify-between text-sm font-extrabold text-[#003734]">
                <span>Total Paid</span>
                <span>₱{receiptOrder.totalAmount}</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setReceiptOrder(null)}
              className="w-full h-11 rounded-full bg-[#003734] text-white text-sm font-bold cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
