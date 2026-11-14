import React from 'react';
import { ArrowLeftRight, Home, Plus, ReceiptText, User } from 'lucide-react';
import { ScreenId } from '../types';

interface BottomNavProps {
  currentScreen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
  activeOrdersCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentScreen,
  onNavigate,
  activeOrdersCount,
}) => {
  const hiddenScreens: ScreenId[] = [
    'onboarding',
    'auth',
    'details',
    'groupbuy',
    'sell',
    'checkout',
  ];

  if (hiddenScreens.includes(currentScreen)) {
    return null;
  }

  return (
    <nav
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#e2e7ff] pb-safe"
    >
      <div className="flex items-center justify-around h-16 px-2">
        <button
          type="button"
          onClick={() => onNavigate('home')}
          className={`flex flex-col items-center justify-center min-w-[44px] min-h-[44px] flex-1 gap-0.5 cursor-pointer ${
            currentScreen === 'home' ? 'text-[#003734] font-bold' : 'text-[#3f4947]'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px]">Home</span>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('compare')}
          className={`flex flex-col items-center justify-center min-w-[44px] min-h-[44px] flex-1 gap-0.5 cursor-pointer ${
            currentScreen === 'compare' ? 'text-[#003734] font-bold' : 'text-[#3f4947]'
          }`}
        >
          <ArrowLeftRight className="w-5 h-5" />
          <span className="text-[10px]">Compare</span>
        </button>

        <div className="flex items-center justify-center px-1 -mt-4">
          <button
            type="button"
            onClick={() => onNavigate('sell')}
            aria-label="Sell Item"
            className="w-12 h-12 rounded-full bg-[#0b4f4b] text-white shadow-md flex items-center justify-center hover:bg-[#003734] active:scale-95 transition-transform cursor-pointer"
          >
            <Plus className="w-6 h-6" />
          </button>
        </div>

        <button
          type="button"
          onClick={() => onNavigate('orders')}
          className={`relative flex flex-col items-center justify-center min-w-[44px] min-h-[44px] flex-1 gap-0.5 cursor-pointer ${
            currentScreen === 'orders' ? 'text-[#003734] font-bold' : 'text-[#3f4947]'
          }`}
        >
          <span className="relative">
            <ReceiptText className="w-5 h-5" />
            {activeOrdersCount > 0 && (
              <span className="absolute -top-1.5 -right-2.5 min-w-[16px] h-[16px] px-1 rounded-full bg-[#006c49] text-white text-[9px] font-bold flex items-center justify-center tabular-nums">
                {activeOrdersCount}
              </span>
            )}
          </span>
          <span className="text-[10px]">Orders</span>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('profile')}
          className={`flex flex-col items-center justify-center min-w-[44px] min-h-[44px] flex-1 gap-0.5 cursor-pointer ${
            currentScreen === 'profile' ? 'text-[#003734] font-bold' : 'text-[#3f4947]'
          }`}
        >
          <User className="w-5 h-5" />
          <span className="text-[10px]">Profile</span>
        </button>
      </div>
    </nav>
  );
};
