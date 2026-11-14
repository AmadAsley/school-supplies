import React, { useState } from 'react';
import { ArrowLeft, Bell, Plus, ShoppingCart, X } from 'lucide-react';
import { ScreenId } from '../types';

interface HeaderProps {
  currentScreen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
  onBack: () => void;
  cartCount: number;
  activeOrdersCount: number;
  userName: string;
}

const SUB_HEADER_TITLES: Partial<Record<ScreenId, string>> = {
  details: 'Details',
  groupbuy: 'Groupbuy',
  sell: 'Sell Item',
  checkout: 'Checkout',
};

export const Header: React.FC<HeaderProps> = ({
  currentScreen,
  onNavigate,
  onBack,
  cartCount,
  activeOrdersCount,
  userName,
}) => {
  const [showNotif, setShowNotif] = useState(false);

  const isSubScreen =
    currentScreen === 'details' ||
    currentScreen === 'groupbuy' ||
    currentScreen === 'sell' ||
    currentScreen === 'checkout';

  const navItems: { id: ScreenId; label: string }[] = [
    { id: 'home', label: 'Home' },
    { id: 'compare', label: 'Compare' },
    { id: 'groupbuy', label: 'Group Buy' },
    { id: 'marketplace', label: 'Marketplace' },
    { id: 'orders', label: 'Orders' },
  ];

  const notifications = [
    {
      id: 'n1',
      title: 'Pickup Ready · #USTP-98421',
      detail: 'Hard Copy A4 Paper & Pilot G-Tec waiting at Student Center Window 3.',
      time: '12m ago',
      target: 'orders' as ScreenId,
    },
    {
      id: 'n2',
      title: 'Group Buy Tier Nearly Locked',
      detail: 'Faber-Castell Drawing Pens pool is at 8/10 slots.',
      time: '1h ago',
      target: 'groupbuy' as ScreenId,
    },
    {
      id: 'n3',
      title: 'Price Drop at USTP Coop',
      detail: 'A4 Bond Paper 500s dropped to ₱240 (Save ₱20).',
      time: '3h ago',
      target: 'compare' as ScreenId,
    },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-[#e2e7ff]">
      <div className="max-w-6xl mx-auto h-16 px-4 sm:px-6 flex items-center justify-between gap-4 sm:gap-8">
        {/* Zone 1: Brand or Sub-Screen Back */}
        <div className="flex items-center gap-2.5 shrink-0">
          {isSubScreen ? (
            <button
              type="button"
              onClick={onBack}
              aria-label="Go back"
              className="min-w-[44px] min-h-[44px] -ml-2 flex items-center justify-center rounded-full text-[#131b2e] hover:bg-[#eaedff] transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          ) : null}

          <button
            type="button"
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2.5 text-left whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#003734] rounded-lg"
          >
            <img
              src="/assets/aistudio/Image_2_0f2f8706.png"
              alt="USTP SupplyHub"
              className="w-8 h-8 rounded-lg object-cover shrink-0"
            />
            <span className="text-base sm:text-lg font-extrabold tracking-tight text-[#003734] whitespace-nowrap shrink-0">
              {isSubScreen ? SUB_HEADER_TITLES[currentScreen] : 'USTP SupplyHub'}
            </span>
          </button>
        </div>

        {/* Zone 2: Desktop Single-Line Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-[#3f4947]">
          {navItems.map((item) => {
            const active = currentScreen === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigate(item.id)}
                className={`whitespace-nowrap shrink-0 py-1.5 border-b-2 transition-colors cursor-pointer ${
                  active
                    ? 'text-[#003734] border-[#006c49]'
                    : 'border-transparent hover:text-[#003734]'
                }`}
              >
                {item.label}
                {item.id === 'orders' && activeOrdersCount > 0 ? ` (${activeOrdersCount})` : ''}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => onNavigate('sell')}
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#003734] text-white text-xs font-semibold hover:bg-[#0b4f4b] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Sell Item</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('checkout')}
            aria-label="Open Cart and Checkout"
            className="relative min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full text-[#3f4947] hover:bg-[#eaedff] hover:text-[#003734] transition-colors cursor-pointer"
          >
            <ShoppingCart className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute top-1.5 right-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-[#006c49] text-white text-[10px] font-bold flex items-center justify-center tabular-nums">
                {cartCount}
              </span>
            )}
          </button>

          <div className="relative">
            <button
              type="button"
              onClick={() => setShowNotif((prev) => !prev)}
              aria-label="Campus Notifications"
              className="relative min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full text-[#3f4947] hover:bg-[#eaedff] hover:text-[#003734] transition-colors cursor-pointer"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 min-w-[16px] h-[16px] px-1 rounded-full bg-[#ba1a1a] text-white text-[10px] font-bold flex items-center justify-center tabular-nums">
                3
              </span>
            </button>

            {showNotif && (
              <div className="absolute right-0 mt-2 w-80 max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-xl border border-[#e2e7ff] p-4 z-50">
                <div className="flex items-center justify-between pb-3 border-b border-[#f2f3ff]">
                  <span className="text-sm font-bold text-[#131b2e]">Campus Alerts</span>
                  <button
                    type="button"
                    onClick={() => setShowNotif(false)}
                    aria-label="Close notifications"
                    className="p-1 rounded-full text-[#707977] hover:bg-[#f2f3ff] cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="divide-y divide-[#f2f3ff] mt-1">
                  {notifications.map((n) => (
                    <button
                      key={n.id}
                      type="button"
                      onClick={() => {
                        setShowNotif(false);
                        onNavigate(n.target);
                      }}
                      className="w-full text-left py-3 hover:bg-[#faf8ff] rounded-lg px-2 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-[#003734]">{n.title}</span>
                        <span className="text-[11px] text-[#707977] shrink-0">{n.time}</span>
                      </div>
                      <p className="text-xs text-[#3f4947] mt-1 leading-relaxed">{n.detail}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => onNavigate('profile')}
            aria-label={`Profile for ${userName}`}
            className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full cursor-pointer focus-visible:outline-2 focus-visible:outline-[#003734]"
          >
            <img
              src="/assets/aistudio/Image_1_209f2aa4.jpeg"
              alt={userName}
              className={`w-8 h-8 rounded-full object-cover ring-2 transition-all ${
                currentScreen === 'profile' ? 'ring-[#006c49]' : 'ring-[#b2eee8]'
              }`}
            />
          </button>
        </div>
      </div>
    </header>
  );
};
