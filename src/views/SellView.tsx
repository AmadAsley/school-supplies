import React, { useState } from 'react';
import {
  Bolt,
  Camera,
  Check,
  CloudCheck,
  FileText,
  Info,
  Lock,
  MapPin,
  Minus,
  Package,
  Plus,
  ShieldCheck,
  TrendingDown,
  Wallet,
} from 'lucide-react';
import { PeerListing, StudentUser, VisualKind } from '../types';

interface SellViewProps {
  user: StudentUser;
  onPublishListing: (listing: PeerListing) => void;
}

const PICKUP_ZONES = [
  {
    id: 'student-center',
    title: 'USTP Main Campus (Student Center)',
    subtitle: 'Or CITC Lobby · High security & well-lit',
    recommended: true,
  },
  {
    id: 'cea-area',
    title: 'CEA Building Study Area',
    subtitle: 'Ground Floor Study Benches',
    recommended: false,
  },
  {
    id: 'limketkai',
    title: 'Limketkai Mall Meetup',
    subtitle: 'Overpass side entrance (After classes)',
    recommended: false,
  },
];

export const SellView: React.FC<SellViewProps> = ({ user, onPublishListing }) => {
  const [title, setTitle] = useState('Casio FX-991ES Plus 2nd Edition');
  const [category, setCategory] = useState<PeerListing['category']>('calculators');
  const [condition, setCondition] = useState<PeerListing['condition']>('Like New');
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState(500);
  const [originalPrice, setOriginalPrice] = useState(950);
  const [description, setDescription] = useState(
    'Gently used for 1 semester in Math 101. Fully functional, all buttons responsive with original protective hard case.'
  );
  const [pickupZone, setPickupZone] = useState(PICKUP_ZONES[0].title);
  const [uploadedPhoto, setUploadedPhoto] = useState<string | undefined>(undefined);

  const categoryToVisual: Record<PeerListing['category'], VisualKind> = {
    calculators: 'calculator',
    textbooks: 'textbook-calc',
    drafting: 'drafting-set',
    uniforms: 'lab-gown',
  };

  const savings = Math.max(0, originalPrice - price);
  const pctOff = originalPrice > 0 ? Math.round((savings / originalPrice) * 100) : 0;

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setUploadedPhoto(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || price <= 0) return;

    const newListing: PeerListing = {
      id: `peer-${Date.now()}`,
      title: title.trim(),
      category,
      sellerName: user.name.split(' ')[0] + ' ' + (user.name.split(' ')[1]?.[0] ?? 'D') + '.',
      department: user.campusBuilding,
      condition,
      conditionNote: `${condition} · ${quantity} unit${quantity > 1 ? 's' : ''} available`,
      price,
      originalPrice: Math.max(originalPrice, price),
      meetupSpot: pickupZone,
      badgeText: savings > 0 ? `Save ₱${savings}` : 'Student Deal',
      isFastResponder: true,
      visualKind: categoryToVisual[category],
      customImageUrl: uploadedPhoto,
      description,
      isMine: true,
    };
    onPublishListing(newListing);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-4xl mx-auto px-4 sm:px-6 py-5 pb-28 flex flex-col gap-5"
    >
      {/* Draft Banner */}
      <div className="bg-[#f2f3ff] rounded-2xl px-4 py-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <CloudCheck className="w-5 h-5 text-[#006c49]" />
          <div>
            <div className="text-xs font-bold text-[#131b2e]">Auto-saved to Student Drafts</div>
            <div className="text-[11px] text-[#3f4947]">
              Ready to publish to verified USTP CDO peers
            </div>
          </div>
        </div>
        <span className="text-xs font-bold text-[#006c49] bg-[#6cf8bb] px-3 py-1 rounded-full">
          Draft
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left: Photos + Pricing */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <section className="bg-white rounded-2xl p-5 shadow-sm border border-[#e2e7ff] flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-[#131b2e]">Item Photos</h2>
              <span className="text-xs font-bold text-[#006c49]">
                {uploadedPhoto ? '1 photo ready' : 'Auto visual ready'}
              </span>
            </div>
            <p className="text-xs text-[#3f4947]">
              Clear photos sell faster on campus. Upload a photo or use our clean category preview.
            </p>

            <div className="grid grid-cols-2 gap-3">
              <label className="aspect-square rounded-xl bg-[#f2f3ff] hover:bg-[#eaedff] border border-dashed border-[#bfc8c7] flex flex-col items-center justify-center gap-1.5 text-[#003734] cursor-pointer">
                <Camera className="w-6 h-6" />
                <span className="text-xs font-semibold">
                  {uploadedPhoto ? 'Replace Photo' : 'Upload Photo'}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
              </label>

              <div className="aspect-square rounded-xl bg-[#eaedff] overflow-hidden flex items-center justify-center relative">
                {uploadedPhoto ? (
                  <img
                    src={uploadedPhoto}
                    alt="Uploaded item preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center p-3">
                    <Package className="w-7 h-7 text-[#003734] mx-auto mb-1" />
                    <span className="text-[11px] font-semibold text-[#3f4947]">
                      Category illustration attached
                    </span>
                  </div>
                )}
              </div>
            </div>
          </section>

          <section className="bg-white rounded-2xl p-5 shadow-sm border border-[#e2e7ff] flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wallet className="w-5 h-5 text-[#006c49]" />
                <h2 className="text-base font-bold text-[#131b2e]">Pricing &amp; Value</h2>
              </div>
              <span className="text-xs font-bold text-[#006c49]">Fast Sell Range</span>
            </div>

            <div className="bg-[#f2f3ff] rounded-2xl p-4">
              <label htmlFor="sell-price" className="text-xs font-semibold text-[#3f4947]">
                Your Student Price (₱)
              </label>
              <div className="flex items-baseline gap-1.5 mt-1">
                <span className="text-3xl font-extrabold text-[#003734]">₱</span>
                <input
                  id="sell-price"
                  type="number"
                  min={10}
                  value={price}
                  onChange={(e) => setPrice(Math.max(0, Number(e.target.value)))}
                  required
                  className="w-full bg-transparent text-3xl font-extrabold text-[#131b2e] tabular-nums focus:outline-none"
                />
              </div>

              <div className="mt-3 flex items-center justify-between gap-2 text-xs">
                <label htmlFor="orig-price" className="text-[#3f4947]">
                  Original Retail (₱):
                </label>
                <input
                  id="orig-price"
                  type="number"
                  min={10}
                  value={originalPrice}
                  onChange={(e) => setOriginalPrice(Math.max(0, Number(e.target.value)))}
                  className="w-24 px-2.5 py-1 rounded-lg bg-white text-right font-bold tabular-nums border border-[#e2e7ff]"
                />
              </div>

              {savings > 0 && (
                <div className="mt-3 bg-white rounded-xl p-2.5 flex items-center justify-between text-xs tabular-nums">
                  <span className="inline-flex items-center gap-1 text-[#3f4947]">
                    <TrendingDown className="w-4 h-4 text-[#006c49]" />
                    Orig: ₱{originalPrice}
                  </span>
                  <span className="font-bold text-[#006c49]">
                    Save ₱{savings} ({pctOff}% OFF)
                  </span>
                </div>
              )}
            </div>

            <p className="text-xs text-[#3f4947] flex items-start gap-1.5">
              <Info className="w-4 h-4 text-[#006c49] shrink-0 mt-0.5" />
              <span>Items priced 30–50% below campus bookstore retail sell within 24 hours.</span>
            </p>
          </section>
        </div>

        {/* Right: Item Details, Description, Meetup Zone */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <section className="bg-white rounded-2xl p-5 shadow-sm border border-[#e2e7ff] flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5 text-[#006c49]" />
              <h2 className="text-base font-bold text-[#131b2e]">Item Details</h2>
            </div>

            <div>
              <label htmlFor="sell-title" className="block text-xs font-semibold text-[#3f4947] mb-1">
                Item Title
              </label>
              <input
                id="sell-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full h-11 px-4 rounded-xl bg-[#f2f3ff] text-sm font-medium text-[#131b2e] focus:bg-white focus:outline-2 focus:outline-[#003734]"
              />
            </div>

            <div>
              <label
                htmlFor="sell-category"
                className="block text-xs font-semibold text-[#3f4947] mb-1"
              >
                Department / Category
              </label>
              <select
                id="sell-category"
                value={category}
                onChange={(e) => setCategory(e.target.value as PeerListing['category'])}
                className="w-full h-11 px-4 rounded-xl bg-[#f2f3ff] text-sm font-medium text-[#131b2e] cursor-pointer"
              >
                <option value="calculators">Calculators &amp; Tech (CITC / CEA)</option>
                <option value="textbooks">Textbooks &amp; Course Modules</option>
                <option value="uniforms">Uniforms &amp; Lab Coats</option>
                <option value="drafting">Drafting &amp; Lab Equipment</option>
              </select>
            </div>

            <div>
              <div className="text-xs font-semibold text-[#3f4947] mb-1.5">Condition</div>
              <div className="grid grid-cols-4 gap-2">
                {(['Brand New', 'Like New', 'Good', 'Fair'] as const).map((cond) => (
                  <button
                    key={cond}
                    type="button"
                    onClick={() => setCondition(cond)}
                    className={`py-2.5 px-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                      condition === cond
                        ? 'bg-[#003734] text-white'
                        : 'bg-[#f2f3ff] text-[#3f4947] hover:bg-[#eaedff]'
                    }`}
                  >
                    {cond}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <div>
                <div className="text-xs font-semibold text-[#131b2e]">Available Quantity</div>
                <div className="text-xs text-[#3f4947]">How many units do you have?</div>
              </div>
              <div className="flex items-center gap-2 bg-[#f2f3ff] rounded-full p-1">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-8 h-8 rounded-full bg-white flex items-center justify-center cursor-pointer"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-6 text-center text-sm font-bold tabular-nums">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-8 h-8 rounded-full bg-[#003734] text-white flex items-center justify-center cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </section>

          <section className="bg-white rounded-2xl p-5 shadow-sm border border-[#e2e7ff] flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#006c49]" />
                <label htmlFor="sell-desc" className="text-base font-bold text-[#131b2e]">
                  Item Story &amp; Details
                </label>
              </div>
              <span className="text-xs text-[#3f4947] tabular-nums">
                {description.length}/500
              </span>
            </div>
            <textarea
              id="sell-desc"
              rows={3}
              maxLength={500}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3.5 rounded-xl bg-[#f2f3ff] text-sm text-[#131b2e] focus:bg-white focus:outline-2 focus:outline-[#003734] resize-none"
            />
          </section>

          <section className="bg-white rounded-2xl p-5 shadow-sm border border-[#e2e7ff] flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#006c49]" />
              <div>
                <h2 className="text-base font-bold text-[#131b2e]">Campus Pickup Zone</h2>
                <p className="text-xs text-[#3f4947]">Choose safe on-campus handover spots</p>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              {PICKUP_ZONES.map((zone) => {
                const selected = pickupZone === zone.title;
                return (
                  <button
                    key={zone.id}
                    type="button"
                    onClick={() => setPickupZone(zone.title)}
                    className={`p-3.5 rounded-xl text-left flex items-center justify-between gap-3 transition-colors cursor-pointer ${
                      selected
                        ? 'bg-[#6cf8bb]/25 border border-[#006c49]'
                        : 'bg-[#f2f3ff] hover:bg-[#eaedff]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                          selected
                            ? 'bg-[#003734] text-white'
                            : 'bg-white border border-[#bfc8c7]'
                        }`}
                      >
                        {selected && <Check className="w-3 h-3" />}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-[#131b2e]">{zone.title}</div>
                        <div className="text-xs text-[#3f4947]">{zone.subtitle}</div>
                      </div>
                    </div>
                    {zone.recommended && (
                      <span className="text-[11px] font-bold text-[#006c49] shrink-0">
                        Recommended
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </section>

          <div className="bg-[#e2e7ff] rounded-2xl p-4 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-[#003734] shrink-0 mt-0.5" />
            <div className="text-xs text-[#3f4947]">
              <strong className="text-[#131b2e] block">Verified Student Guarantee</strong>
              Buyer and seller are both certified USTP Trailblazers protected by Student ID
              verification.
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Sticky Submit Dock */}
      <div className="fixed bottom-0 inset-x-0 z-30 bg-white/95 backdrop-blur-md border-t border-[#e2e7ff] px-4 py-3 pb-safe">
        <div className="max-w-3xl mx-auto flex flex-col gap-1.5">
          <button
            type="submit"
            className="w-full h-12 rounded-full bg-[#003734] hover:bg-[#0b4f4b] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md cursor-pointer"
          >
            <Bolt className="w-4 h-4" />
            <span>Post Item to Marketplace</span>
          </button>
          <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#3f4947]">
            <Lock className="w-3.5 h-3.5 text-[#006c49]" />
            <span>Visible exclusively to verified USTP CDO students</span>
          </div>
        </div>
      </div>
    </form>
  );
};
