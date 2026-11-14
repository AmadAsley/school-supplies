import React from 'react';
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  IdCard,
  ShoppingBag,
  Store,
  Users,
} from 'lucide-react';
import { ScreenId } from '../types';

interface OnboardingViewProps {
  onGetStarted: () => void;
  onLogin: () => void;
  onNavigate: (screen: ScreenId) => void;
}

export const OnboardingView: React.FC<OnboardingViewProps> = ({
  onGetStarted,
  onLogin,
}) => {
  const features = [
    {
      icon: BarChart3,
      title: 'Smart Price Comparison',
      tag: 'Best Deals',
      description:
        'Real-time index across local CDO school bookshops, stationery suppliers, and student peers.',
      accentBg: 'bg-[#b2eee8]',
      accentInk: 'text-[#0c4f4b]',
    },
    {
      icon: Users,
      title: 'Campus Group Buys',
      tag: 'Up to 40% Off',
      description:
        'Pool orders with fellow engineering, tech, and architecture majors for bulk tier discounts.',
      accentBg: 'bg-[#6cf8bb]',
      accentInk: 'text-[#005236]',
    },
    {
      icon: Store,
      title: 'Safe On-Campus Pickups',
      tag: '₱0 Delivery Fee',
      description:
        'Designated secure claim points at the Student Center and College of Technology Kiosks.',
      accentBg: 'bg-[#e2e7ff]',
      accentInk: 'text-[#0b4f4b]',
    },
  ];

  return (
    <div className="min-h-screen bg-[#faf8ff] flex flex-col justify-center py-8 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left Hero Identity */}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#006c49] tracking-wide uppercase mb-5">
            <BadgeCheck className="w-4 h-4" />
            <span>USTP Trailblazers · CDO Campus</span>
          </div>

          <div className="relative w-28 h-28 rounded-3xl bg-white p-3 shadow-md border border-[#e2e7ff] flex items-center justify-center mb-5">
            <img
              src="/assets/aistudio/Image_2_0f2f8706.png"
              alt="USTP SupplyHub Logo"
              className="w-full h-full object-contain rounded-2xl"
            />
            <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-[#006c49] text-white flex items-center justify-center shadow-sm">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#003734] tracking-tight">
            USTP SupplyHub
          </h1>
          <p className="text-base sm:text-lg font-medium text-[#3f4947] mt-1.5">
            Save more. Shop smarter.
          </p>

          <div className="mt-6 w-full max-w-md bg-[#f2f3ff] rounded-xl px-4 py-3 flex items-center justify-between text-xs font-semibold text-[#131b2e]">
            <span>1,420+ Active USTP Students</span>
            <span className="text-[#006c49] font-bold tabular-nums">₱184k Total Saved</span>
          </div>

          <div className="mt-6 w-full max-w-md flex flex-col gap-3">
            <button
              type="button"
              onClick={onGetStarted}
              className="w-full h-12 rounded-full bg-[#003734] hover:bg-[#0b4f4b] text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-md active:scale-[0.99] transition-all cursor-pointer"
            >
              <span>Get Started as USTP Student</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={onLogin}
              className="w-full h-11 rounded-full text-sm font-medium text-[#3f4947] hover:text-[#003734] transition-colors cursor-pointer"
            >
              Already registered?{' '}
              <span className="font-bold text-[#003734] underline underline-offset-4">
                Log in
              </span>
            </button>
          </div>

          <div className="mt-4 flex items-center gap-2 text-xs text-[#3f4947]">
            <IdCard className="w-4 h-4 text-[#707977] shrink-0" />
            <span>USTP Student ID verification required for selling and order hosting.</span>
          </div>
        </div>

        {/* Right Feature Showcase */}
        <div className="flex flex-col gap-4">
          {features.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.title}
                className="flex items-start gap-4 bg-white p-5 rounded-2xl shadow-sm border border-[#e2e7ff]/70"
              >
                <div
                  className={`w-11 h-11 rounded-xl ${feat.accentBg} ${feat.accentInk} flex items-center justify-center shrink-0`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h2 className="text-sm font-bold text-[#131b2e]">{feat.title}</h2>
                    <span className="text-xs font-bold text-[#006c49] whitespace-nowrap">
                      {feat.tag}
                    </span>
                  </div>
                  <p className="text-sm text-[#3f4947] mt-1 leading-relaxed">
                    {feat.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
