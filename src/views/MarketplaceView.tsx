import React, { useState } from 'react';
import {
  Bookmark,
  MapPin,
  MessageSquare,
  PlusCircle,
  Search,
  Send,
  ShieldCheck,
  X,
} from 'lucide-react';
import { ProductVisual } from '../components/ProductVisual';
import { ChatMessage, PeerListing } from '../types';

interface MarketplaceViewProps {
  listings: PeerListing[];
  savedIds: string[];
  onToggleSaved: (listingId: string) => void;
  onOpenSell: () => void;
  onOrderPeerListing: (listing: PeerListing) => void;
}

type FilterTab = 'all' | 'textbooks' | 'calculators' | 'drafting' | 'uniforms' | 'under300';

export const MarketplaceView: React.FC<MarketplaceViewProps> = ({
  listings,
  savedIds,
  onToggleSaved,
  onOpenSell,
  onOrderPeerListing,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<FilterTab>('all');
  const [conditionFilter, setConditionFilter] = useState<'all' | 'Like New' | 'Good' | 'Brand New'>('all');
  const [activeChatListing, setActiveChatListing] = useState<PeerListing | null>(null);
  const [chatHistory, setChatHistory] = useState<Record<string, ChatMessage[]>>({});
  const [draftMsg, setDraftMsg] = useState('');

  const filtered = listings.filter((item) => {
    const q = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !q ||
      item.title.toLowerCase().includes(q) ||
      item.department.toLowerCase().includes(q) ||
      item.sellerName.toLowerCase().includes(q);
    const matchesTab =
      activeTab === 'all'
        ? true
        : activeTab === 'under300'
        ? item.price <= 300
        : item.category === activeTab;
    const matchesCond = conditionFilter === 'all' || item.condition === conditionFilter;
    return matchesSearch && matchesTab && matchesCond;
  });

  const openChat = (listing: PeerListing) => {
    setActiveChatListing(listing);
    setChatHistory((prev) => {
      if (prev[listing.id]) return prev;
      return {
        ...prev,
        [listing.id]: [
          {
            id: 'm-init',
            sender: 'peer',
            text: `Hi! Yes, "${listing.title}" is still available for meetup at ${listing.meetupSpot}.`,
            time: 'Just now',
          },
        ],
      };
    });
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeChatListing || !draftMsg.trim()) return;
    const targetId = activeChatListing.id;
    const text = draftMsg.trim();
    setDraftMsg('');
    setChatHistory((prev) => ({
      ...prev,
      [targetId]: [
        ...(prev[targetId] ?? []),
        { id: `me-${Date.now()}`, sender: 'me', text, time: 'Now' },
      ],
    }));
  };

  const tabs: { id: FilterTab; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'textbooks', label: 'Textbooks' },
    { id: 'calculators', label: 'Calculators' },
    { id: 'drafting', label: 'Drafting & Art' },
    { id: 'uniforms', label: 'Uniforms & Merch' },
    { id: 'under300', label: 'Under ₱300' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5 pb-24 md:pb-12 flex flex-col gap-5">
      {/* Header + Sell Banner */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
        <div className="lg:col-span-6">
          <div className="text-xs font-bold text-[#006c49] uppercase tracking-wider">
            Campus Verified Network · {listings.length} Peer Listings
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#003734] tracking-tight mt-1">
            Student Marketplace
          </h1>
          <p className="text-sm text-[#3f4947] mt-1">
            Buy &amp; sell secondhand course materials directly with verified USTP peers.
          </p>
        </div>

        <div className="lg:col-span-6 rounded-2xl bg-gradient-to-br from-[#0b4f4b] to-[#003734] text-white p-5 flex items-center justify-between gap-4 shadow-sm">
          <div>
            <div className="text-xs font-semibold text-[#6cf8bb]">Declutter &amp; Earn</div>
            <h2 className="text-base sm:text-lg font-bold mt-0.5">
              Got unused books or supplies?
            </h2>
            <p className="text-xs text-[#96d1cc] mt-0.5">
              Turn past semester gear into instant campus cash.
            </p>
          </div>
          <button
            type="button"
            onClick={onOpenSell}
            className="h-11 px-5 rounded-full bg-[#6cf8bb] text-[#002113] font-bold text-xs flex items-center gap-1.5 shrink-0 hover:brightness-105 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Sell an Item</span>
          </button>
        </div>
      </div>

      {/* Search + Filters */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 flex items-center bg-white rounded-full border border-[#e2e7ff] shadow-sm px-4 h-12">
            <Search className="w-5 h-5 text-[#707977] mr-2 shrink-0" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search books, uniforms, drafting boards..."
              className="w-full bg-transparent text-sm text-[#131b2e] placeholder:text-[#707977] focus:outline-none"
            />
          </div>

          <select
            aria-label="Filter by condition"
            value={conditionFilter}
            onChange={(e) =>
              setConditionFilter(
                e.target.value as 'all' | 'Like New' | 'Good' | 'Brand New'
              )
            }
            className="h-12 px-4 rounded-full bg-white border border-[#e2e7ff] text-xs font-semibold text-[#131b2e] cursor-pointer"
          >
            <option value="all">Condition: All Grades</option>
            <option value="Brand New">Brand New</option>
            <option value="Like New">Like New</option>
            <option value="Good">Good</option>
          </select>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          {tabs.map((tab) => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`h-9 px-4 rounded-full text-xs font-semibold whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                  active
                    ? 'bg-[#003734] text-white'
                    : 'bg-white text-[#3f4947] border border-[#e2e7ff] hover:bg-[#eaedff]'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Listings Grid */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 text-center border border-[#e2e7ff]">
          <p className="text-sm font-semibold text-[#131b2e]">
            No peer listings match your current filters.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setActiveTab('all');
              setConditionFilter('all');
            }}
            className="mt-3 px-4 py-2 rounded-full bg-[#003734] text-white text-xs font-semibold cursor-pointer"
          >
            Show All Listings
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((item) => {
            const saved = savedIds.includes(item.id);
            return (
              <article
                key={item.id}
                className="bg-white rounded-2xl p-4 shadow-sm border border-[#e2e7ff]/70 flex flex-col justify-between gap-3"
              >
                <div className="flex gap-3.5">
                  <div className="w-28 h-32 rounded-xl overflow-hidden shrink-0">
                    <ProductVisual
                      kind={item.visualKind}
                      customImageUrl={item.customImageUrl}
                      alt={item.title}
                    />
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-[#006c49]">
                          {item.isFastResponder ? 'Fast Responder' : 'Verified Seller'} ·{' '}
                          {item.badgeText}
                        </span>
                        <button
                          type="button"
                          onClick={() => onToggleSaved(item.id)}
                          aria-label="Bookmark listing"
                          className={`p-1.5 rounded-full cursor-pointer ${
                            saved
                              ? 'text-[#006c49] bg-[#6cf8bb]/30'
                              : 'text-[#707977] hover:text-[#003734]'
                          }`}
                        >
                          <Bookmark className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} />
                        </button>
                      </div>

                      <h2 className="text-base font-bold text-[#131b2e] line-clamp-1 mt-1">
                        {item.title}
                      </h2>
                      <p className="text-xs text-[#3f4947] mt-0.5">
                        {item.sellerName} ·{' '}
                        <span className="font-semibold text-[#003734]">{item.department}</span>
                      </p>
                      <p className="text-xs text-[#707977] mt-1">{item.conditionNote}</p>
                    </div>

                    <div className="flex items-baseline gap-2 mt-2 tabular-nums">
                      <span className="text-lg font-extrabold text-[#003734]">
                        ₱{item.price}
                      </span>
                      {item.originalPrice > item.price && (
                        <span className="text-xs text-[#707977] line-through">
                          ₱{item.originalPrice}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="pt-2.5 border-t border-[#f2f3ff] flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 text-xs text-[#3f4947] truncate">
                    <MapPin className="w-4 h-4 text-[#006c49] shrink-0" />
                    <span className="truncate">{item.meetupSpot}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => onOrderPeerListing(item)}
                      className="h-9 px-3.5 rounded-full bg-[#eaedff] hover:bg-[#e2e7ff] text-[#003734] text-xs font-bold cursor-pointer"
                    >
                      Request Meetup
                    </button>
                    <button
                      type="button"
                      onClick={() => openChat(item)}
                      className="h-9 px-3.5 rounded-full bg-[#0b4f4b] hover:bg-[#003734] text-white text-xs font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Message</span>
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Safe Exchange Callout */}
      <div className="bg-[#f2f3ff] rounded-2xl p-4 flex items-start gap-3">
        <div className="w-9 h-9 rounded-full bg-[#6cf8bb] text-[#002113] flex items-center justify-center shrink-0">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-[#131b2e]">Campus Safe Exchange Zone</h3>
          <p className="text-xs text-[#3f4947] mt-0.5">
            Always complete exchanges during daylight hours in populated areas like the USTP
            Learning Resource Center or CEA Cafeteria.
          </p>
        </div>
      </div>

      {/* Peer Messaging Modal */}
      {activeChatListing && (
        <div className="fixed inset-0 z-50 bg-[#283044]/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
            <div className="p-4 border-b border-[#e2e7ff] flex items-center justify-between bg-[#faf8ff]">
              <div className="min-w-0">
                <div className="text-sm font-bold text-[#131b2e] truncate">
                  Chat with {activeChatListing.sellerName}
                </div>
                <div className="text-xs text-[#006c49] truncate">
                  {activeChatListing.title} · ₱{activeChatListing.price}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveChatListing(null)}
                className="p-2 rounded-full hover:bg-[#eaedff] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 flex-1 overflow-y-auto flex flex-col gap-2.5 bg-[#faf8ff]">
              {(chatHistory[activeChatListing.id] ?? []).map((msg) => (
                <div
                  key={msg.id}
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs ${
                    msg.sender === 'me'
                      ? 'self-end bg-[#003734] text-white'
                      : 'self-start bg-white border border-[#e2e7ff] text-[#131b2e]'
                  }`}
                >
                  <p>{msg.text}</p>
                  <span className="block text-[10px] opacity-70 mt-1">{msg.time}</span>
                </div>
              ))}
            </div>

            <form
              onSubmit={handleSendMessage}
              className="p-3 border-t border-[#e2e7ff] flex items-center gap-2 bg-white"
            >
              <input
                type="text"
                value={draftMsg}
                onChange={(e) => setDraftMsg(e.target.value)}
                placeholder="Ask about meetup time or condition..."
                className="flex-1 h-10 px-4 rounded-full bg-[#f2f3ff] text-xs text-[#131b2e] focus:outline-none"
              />
              <button
                type="submit"
                aria-label="Send message"
                className="w-10 h-10 rounded-full bg-[#003734] text-white flex items-center justify-center shrink-0 cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
