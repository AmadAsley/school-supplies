export type ScreenId =
  | 'onboarding'
  | 'auth'
  | 'home'
  | 'details'
  | 'compare'
  | 'groupbuy'
  | 'marketplace'
  | 'sell'
  | 'checkout'
  | 'orders'
  | 'profile';

export type CategoryId =
  | 'all'
  | 'pens'
  | 'paper'
  | 'notebooks'
  | 'folders'
  | 'art'
  | 'electronics'
  | 'printing';

export type VisualKind =
  | 'paper-a4'
  | 'pen-gtec'
  | 'calculator'
  | 'drawing-pens'
  | 'yellow-pad'
  | 'textbook-calc'
  | 'lab-gown'
  | 'drafting-set'
  | 'notebook'
  | 'folder'
  | 'printing';

export interface VendorQuote {
  id: string;
  sellerName: string;
  subtitle: string;
  price: number;
  retailPrice: number;
  rating: number;
  reviewCount: number;
  stockLabel: string;
  pickupNote: string;
  deliveryFee?: number;
  isLowest?: boolean;
  isVerifiedCoop?: boolean;
}

export interface SupplyProduct {
  id: string;
  title: string;
  category: Exclude<CategoryId, 'all'>;
  categoryLabel: string;
  sellerName: string;
  sellerBadge: string;
  sellerLocation: string;
  pickupWindow: string;
  price: number;
  originalPrice: number;
  groupPrice?: number;
  rating: number;
  reviewCount: number;
  soldLabel: string;
  inStock: number;
  unitLabel: string;
  visualKind: VisualKind;
  specs: { label: string; value: string; accent?: boolean }[];
  description: string;
  highlights: string[];
  peerReview: {
    author: string;
    program: string;
    quote: string;
  };
  vendorQuotes: VendorQuote[];
}

export interface GroupBuyPool {
  id: string;
  productId: string;
  title: string;
  subtitle: string;
  vendorName: string;
  badgeLabel: string;
  groupPrice: number;
  originalPrice: number;
  joinedCount: number;
  minThreshold: number;
  targetCapacity: number;
  maxPerStudent: number;
  pickupPoint: string;
  pickupSubtext: string;
  scheduleLabel: string;
  peersSummary: string;
  visualKind: VisualKind;
  secondsRemaining: number;
}

export interface PeerListing {
  id: string;
  title: string;
  category: 'textbooks' | 'calculators' | 'drafting' | 'uniforms';
  sellerName: string;
  department: string;
  condition: 'Brand New' | 'Like New' | 'Good' | 'Fair';
  conditionNote: string;
  price: number;
  originalPrice: number;
  meetupSpot: string;
  badgeText: string;
  isFastResponder?: boolean;
  visualKind: VisualKind;
  customImageUrl?: string;
  description?: string;
  isMine?: boolean;
}

export interface CartItem {
  id: string;
  productId: string;
  title: string;
  subtitle: string;
  sellerName: string;
  unitPrice: number;
  originalPrice: number;
  quantity: number;
  tagLabel: string;
  visualKind: VisualKind;
}

export interface CampusOrder {
  id: string;
  code: string;
  type: 'pickup' | 'groupbuy' | 'completed';
  status: 'Ready for Pickup' | 'Pooling Orders' | 'Completed';
  title: string;
  subtitle: string;
  vendorName: string;
  timestamp: string;
  totalAmount: number;
  savingsAmount: number;
  paymentMethod: string;
  pickupLocation: string;
  stepIndex: number; // 1=Confirmed, 2=Preparing, 3=Ready to Claim, 4=Completed
  poolJoined?: number;
  poolTarget?: number;
  visualKind: VisualKind;
  quantity: number;
}

export interface StudentUser {
  name: string;
  studentId: string;
  college: string;
  yearLevel: string;
  email: string;
  campusBuilding: string;
  primaryKiosk: string;
  gcashMasked: string;
}

export interface ChatMessage {
  id: string;
  sender: 'me' | 'peer';
  text: string;
  time: string;
}
