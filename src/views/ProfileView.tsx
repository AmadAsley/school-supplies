import React, { useState } from 'react';
import {
  BadgeCheck,
  BellRing,
  ChevronRight,
  Edit3,
  Heart,
  HelpCircle,
  Leaf,
  LockKeyhole,
  LogOut,
  Mail,
  PiggyBank,
  QrCode,
  ReceiptText,
  ShieldCheck,
  Store,
  Users,
  Wallet,
  X,
} from 'lucide-react';
import { ScreenId, StudentUser } from '../types';

interface ProfileViewProps {
  user: StudentUser;
  totalSaved: number;
  poolsJoinedCount: number;
  myListingsCount: number;
  activeOrdersCount: number;
  wishlistCount: number;
  onUpdateUser: (updated: StudentUser) => void;
  onNavigate: (screen: ScreenId) => void;
  onLogout: () => void;
  onShowToast: (msg: string) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  user,
  totalSaved,
  poolsJoinedCount,
  myListingsCount,
  activeOrdersCount,
  wishlistCount,
  onUpdateUser,
  onNavigate,
  onLogout,
  onShowToast,
}) => {
  const [showPassModal, setShowPassModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editName, setEditName] = useState(user.name);
  const [editBuilding, setEditBuilding] = useState(user.campusBuilding);
  const [editKiosk, setEditKiosk] = useState(user.primaryKiosk);
  const [alertsEnabled, setAlertsEnabled] = useState(true);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({
      ...user,
      name: editName.trim() || user.name,
      campusBuilding: editBuilding.trim() || user.campusBuilding,
      primaryKiosk: editKiosk.trim() || user.primaryKiosk,
    });
    setShowEditModal(false);
    onShowToast('Student profile updated');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-5 pb-24 md:pb-12 flex flex-col gap-6">
      {/* Top Heading */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#131b2e]">Student Profile</h1>
          <p className="text-xs text-[#3f4947]">Manage identity, campus savings &amp; listings</p>
        </div>
        <button
          type="button"
          onClick={() => onNavigate('onboarding')}
          className="px-4 py-2 rounded-full bg-[#eaedff] hover:bg-[#e2e7ff] text-xs font-bold text-[#003734] cursor-pointer"
        >
          Welcome Tour
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left: Identity & Impact */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#e2e7ff]">
            <div className="flex items-start gap-4">
              <div className="relative shrink-0">
                <img
                  src="/assets/aistudio/Image_1_209f2aa4.jpeg"
                  alt={user.name}
                  className="w-20 h-20 rounded-full object-cover shadow-md"
                />
                <span className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-[#006c49] text-white flex items-center justify-center shadow-sm">
                  <BadgeCheck className="w-3.5 h-3.5" />
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-lg font-bold text-[#131b2e] truncate">{user.name}</h2>
                <div className="text-xs font-bold text-[#006c49] mt-0.5">
                  USTP ID: {user.studentId} · Verified Trailblazer
                </div>
                <p className="text-xs text-[#3f4947] mt-1.5">
                  {user.college} · {user.yearLevel}
                </p>
                <div className="flex items-center gap-1.5 text-xs text-[#3f4947] mt-1 truncate">
                  <Mail className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{user.email}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2.5 mt-4">
              <button
                type="button"
                onClick={() => setShowPassModal(true)}
                className="flex-1 h-10 rounded-full bg-[#eaedff] hover:bg-[#e2e7ff] text-[#003734] text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <QrCode className="w-4 h-4" />
                <span>Campus Pass ID</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditName(user.name);
                  setEditBuilding(user.campusBuilding);
                  setEditKiosk(user.primaryKiosk);
                  setShowEditModal(true);
                }}
                className="flex-1 h-10 rounded-full bg-[#f2f3ff] hover:bg-[#eaedff] text-[#3f4947] text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Edit3 className="w-4 h-4" />
                <span>Edit Profile</span>
              </button>
            </div>
          </div>

          {/* Campus Impact Summary */}
          <div className="bg-[#0b4f4b] text-white rounded-2xl p-5 shadow-md flex flex-col gap-3">
            <div className="flex items-center justify-between text-xs">
              <span className="inline-flex items-center gap-1.5 font-bold text-[#85bfba] uppercase tracking-wider">
                <PiggyBank className="w-4 h-4 text-[#6ffbbe]" />
                Campus Impact Summary
              </span>
              <span className="font-bold text-[#6ffbbe]">Top 10% Saver</span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center bg-[#003734]/50 rounded-xl py-3 px-2 tabular-nums">
              <div>
                <div className="text-lg font-extrabold text-[#6ffbbe]">
                  ₱{totalSaved.toLocaleString()}
                </div>
                <div className="text-[11px] text-[#96d1cc]">Total Saved</div>
              </div>
              <div>
                <div className="text-lg font-extrabold">{poolsJoinedCount}</div>
                <div className="text-[11px] text-[#96d1cc]">Pools Joined</div>
              </div>
              <div>
                <div className="text-lg font-extrabold">{4 + myListingsCount}</div>
                <div className="text-[11px] text-[#96d1cc]">Rehomed</div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-[#85bfba]">
              <Leaf className="w-4 h-4 text-[#6ffbbe]" />
              <span>Equivalent to 14kg CO₂ avoided through peer reuse</span>
            </div>
          </div>
        </div>

        {/* Right: Activity Grid + Account Settings */}
        <div className="lg:col-span-7 flex flex-col gap-5">
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <h3 className="text-base font-bold text-[#131b2e]">Campus Activity</h3>
              <span className="text-xs font-bold text-[#003734]">Live Hub</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => onNavigate('orders')}
                className="text-left p-4 rounded-2xl bg-white border border-[#e2e7ff] shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-full bg-[#6cf8bb]/35 text-[#006c49] flex items-center justify-center">
                    <ReceiptText className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-[#006c49] tabular-nums">
                    {activeOrdersCount} active
                  </span>
                </div>
                <div className="text-sm font-bold text-[#131b2e] mt-3">My Orders</div>
                <div className="text-xs text-[#3f4947]">Track pickups &amp; status</div>
              </button>

              <button
                type="button"
                onClick={() => onNavigate('marketplace')}
                className="text-left p-4 rounded-2xl bg-white border border-[#e2e7ff] shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-full bg-[#e2e7ff] text-[#003734] flex items-center justify-center">
                    <Store className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-[#3f4947] tabular-nums">
                    {1 + myListingsCount} listed
                  </span>
                </div>
                <div className="text-sm font-bold text-[#131b2e] mt-3">My Listings</div>
                <div className="text-xs text-[#3f4947]">Peer marketplace items</div>
              </button>

              <button
                type="button"
                onClick={() => onNavigate('groupbuy')}
                className="text-left p-4 rounded-2xl bg-white border border-[#e2e7ff] shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-full bg-[#ffddb8]/60 text-[#653e00] flex items-center justify-center">
                    <Users className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-[#653e00]">Pooling</span>
                </div>
                <div className="text-sm font-bold text-[#131b2e] mt-3">Group Buys</div>
                <div className="text-xs text-[#3f4947]">2 tiers unlocking soon</div>
              </button>

              <button
                type="button"
                onClick={() => onNavigate('marketplace')}
                className="text-left p-4 rounded-2xl bg-white border border-[#e2e7ff] shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-full bg-[#ffdad6]/60 text-[#ba1a1a] flex items-center justify-center">
                    <Heart className="w-5 h-5 fill-current" />
                  </div>
                  <span className="text-xs font-bold text-[#131b2e] tabular-nums">
                    {wishlistCount} items
                  </span>
                </div>
                <div className="text-sm font-bold text-[#131b2e] mt-3">Wishlist</div>
                <div className="text-xs text-[#3f4947]">Track price drops</div>
              </button>
            </div>
          </div>

          {/* Account & Campus Settings */}
          <div className="bg-white rounded-2xl border border-[#e2e7ff] shadow-sm overflow-hidden">
            <div className="px-4 py-3 bg-[#f2f3ff] text-xs font-bold text-[#3f4947] uppercase tracking-wider">
              Account &amp; Campus Settings
            </div>

            <div className="divide-y divide-[#f2f3ff]">
              <button
                type="button"
                onClick={() => onShowToast(`GCash ${user.gcashMasked} & Maya connected`)}
                className="w-full flex items-center justify-between p-4 hover:bg-[#faf8ff] text-left cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#eaedff] text-[#003734] flex items-center justify-center">
                    <Wallet className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-[#131b2e]">Payment Methods</div>
                    <div className="text-xs text-[#3f4947]">
                      GCash ({user.gcashMasked}) &amp; Maya connected
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-[#707977]" />
              </button>

              <button
                type="button"
                onClick={() => setShowEditModal(true)}
                className="w-full flex items-center justify-between p-4 hover:bg-[#faf8ff] text-left cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#eaedff] text-[#003734] flex items-center justify-center">
                    <Store className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-[#131b2e]">
                      Campus Pickup Preferences
                    </div>
                    <div className="text-xs font-semibold text-[#006c49]">
                      {user.primaryKiosk}
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-[#707977]" />
              </button>

              <button
                type="button"
                onClick={() => setShowPassModal(true)}
                className="w-full flex items-center justify-between p-4 hover:bg-[#faf8ff] text-left cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#6cf8bb]/40 text-[#006c49] flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-[#131b2e]">
                      University ID Verification
                    </div>
                    <div className="text-xs font-semibold text-[#006c49]">
                      Verified student ID until May 2026
                    </div>
                  </div>
                </div>
                <BadgeCheck className="w-5 h-5 text-[#006c49]" />
              </button>

              <button
                type="button"
                onClick={() => {
                  const next = !alertsEnabled;
                  setAlertsEnabled(next);
                  onShowToast(
                    next ? 'Price drop alerts enabled' : 'Price drop alerts muted'
                  );
                }}
                className="w-full flex items-center justify-between p-4 hover:bg-[#faf8ff] text-left cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#eaedff] text-[#003734] flex items-center justify-center">
                    <BellRing className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-[#131b2e]">
                      Notifications &amp; Price Alerts
                    </div>
                    <div className="text-xs text-[#3f4947]">
                      {alertsEnabled ? 'Push & campus alerts active' : 'Alerts paused'}
                    </div>
                  </div>
                </div>
                <span className="text-xs font-bold text-[#006c49]">
                  {alertsEnabled ? 'ON' : 'OFF'}
                </span>
              </button>

              <button
                type="button"
                onClick={() => onShowToast('2FA protected via @ustp.edu.ph email')}
                className="w-full flex items-center justify-between p-4 hover:bg-[#faf8ff] text-left cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#eaedff] text-[#003734] flex items-center justify-center">
                    <LockKeyhole className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-[#131b2e]">
                      Settings &amp; Security
                    </div>
                    <div className="text-xs text-[#3f4947]">2FA USTP Email Auth, PIN code</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-[#707977]" />
              </button>

              <button
                type="button"
                onClick={() => onNavigate('groupbuy')}
                className="w-full flex items-center justify-between p-4 hover:bg-[#faf8ff] text-left cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#eaedff] text-[#003734] flex items-center justify-center">
                    <HelpCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-[#131b2e]">
                      Help &amp; Support / Campus FAQ
                    </div>
                    <div className="text-xs text-[#3f4947]">
                      Group buy rules &amp; pickup guidelines
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-[#707977]" />
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={onLogout}
            className="w-full h-12 rounded-full bg-[#ffdad6] hover:bg-[#ffdad6]/80 text-[#93000a] font-bold text-sm flex items-center justify-center gap-2 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Log Out of USTP SupplyHub</span>
          </button>
        </div>
      </div>

      {/* Campus Pass ID Modal */}
      {showPassModal && (
        <div className="fixed inset-0 z-50 bg-[#283044]/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full text-center shadow-2xl">
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-bold uppercase text-[#006c49]">
                Digital Campus Pass
              </span>
              <button
                type="button"
                onClick={() => setShowPassModal(false)}
                className="p-1.5 rounded-full hover:bg-[#f2f3ff] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <img
              src="/assets/aistudio/Image_1_209f2aa4.jpeg"
              alt={user.name}
              className="w-16 h-16 rounded-full object-cover mx-auto mb-2"
            />
            <h3 className="text-base font-bold text-[#131b2e]">{user.name}</h3>
            <p className="text-xs text-[#3f4947]">
              USTP ID {user.studentId} · {user.campusBuilding}
            </p>
            <div className="my-4 p-4 rounded-2xl bg-[#f2f3ff] inline-block">
              <QrCode className="w-28 h-28 text-[#003734]" />
            </div>
            <p className="text-xs text-[#3f4947]">
              Present at Student Center Kiosks to verify student subsidies and claim orders.
            </p>
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 bg-[#283044]/50 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveProfile}
            className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl flex flex-col gap-3"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-[#131b2e]">Edit Student Profile</h3>
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                className="p-1.5 rounded-full hover:bg-[#f2f3ff] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div>
              <label className="text-xs font-semibold text-[#3f4947]">Full Name</label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full h-10 px-3 mt-1 rounded-xl bg-[#f2f3ff] text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-[#3f4947]">Primary Building</label>
              <input
                type="text"
                value={editBuilding}
                onChange={(e) => setEditBuilding(e.target.value)}
                className="w-full h-10 px-3 mt-1 rounded-xl bg-[#f2f3ff] text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-[#3f4947]">Preferred Kiosk</label>
              <input
                type="text"
                value={editKiosk}
                onChange={(e) => setEditKiosk(e.target.value)}
                className="w-full h-10 px-3 mt-1 rounded-xl bg-[#f2f3ff] text-sm"
              />
            </div>
            <button
              type="submit"
              className="w-full h-11 rounded-full bg-[#003734] text-white text-sm font-bold mt-2 cursor-pointer"
            >
              Save Changes
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
