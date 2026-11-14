import { useEffect, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { BottomNav } from './components/BottomNav';
import { Header } from './components/Header';
import {
  GROUP_BUY_POOLS,
  INITIAL_CART,
  INITIAL_ORDERS,
  INITIAL_PEER_LISTINGS,
  INITIAL_USER,
  SUPPLY_PRODUCTS,
} from './data/mockSupplyData';
import {
  CampusOrder,
  CartItem,
  GroupBuyPool,
  PeerListing,
  ScreenId,
  StudentUser,
  SupplyProduct,
  VendorQuote,
} from './types';
import { AuthView } from './views/AuthView';
import { CheckoutView } from './views/CheckoutView';
import { CompareView } from './views/CompareView';
import { GroupBuyView } from './views/GroupBuyView';
import { HomeView } from './views/HomeView';
import { MarketplaceView } from './views/MarketplaceView';
import { OnboardingView } from './views/OnboardingView';
import { OrdersView } from './views/OrdersView';
import { ProductDetailView } from './views/ProductDetailView';
import { ProfileView } from './views/ProfileView';
import { SellView } from './views/SellView';

function loadStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export default function App() {
  const [screen, setScreen] = useState<ScreenId>('home');
  const [history, setHistory] = useState<ScreenId[]>(['home']);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

  const [user, setUser] = useState<StudentUser>(() =>
    loadStorage('ustp_user_v1', INITIAL_USER)
  );
  const [pools, setPools] = useState<GroupBuyPool[]>(() =>
    loadStorage('ustp_pools_v1', GROUP_BUY_POOLS)
  );
  const [joinedPoolIds, setJoinedPoolIds] = useState<string[]>(() =>
    loadStorage('ustp_joined_pools_v1', [])
  );
  const [peerListings, setPeerListings] = useState<PeerListing[]>(() =>
    loadStorage('ustp_peer_listings_v1', INITIAL_PEER_LISTINGS)
  );
  const [savedListingIds, setSavedListingIds] = useState<string[]>(() =>
    loadStorage('ustp_saved_listings_v1', [])
  );
  const [wishlistProductIds, setWishlistProductIds] = useState<string[]>(() =>
    loadStorage('ustp_wishlist_products_v1', ['prod-hardcopy-a4'])
  );
  const [cart, setCart] = useState<CartItem[]>(() =>
    loadStorage('ustp_cart_v1', INITIAL_CART)
  );
  const [orders, setOrders] = useState<CampusOrder[]>(() =>
    loadStorage('ustp_orders_v1', INITIAL_ORDERS)
  );

  const [selectedProductId, setSelectedProductId] = useState<string>(SUPPLY_PRODUCTS[0].id);
  const [compareProductId, setCompareProductId] = useState<string>(SUPPLY_PRODUCTS[0].id);
  const [selectedPoolId, setSelectedPoolId] = useState<string>(GROUP_BUY_POOLS[0].id);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem('ustp_user_v1', JSON.stringify(user));
      localStorage.setItem('ustp_pools_v1', JSON.stringify(pools));
      localStorage.setItem('ustp_joined_pools_v1', JSON.stringify(joinedPoolIds));
      localStorage.setItem('ustp_peer_listings_v1', JSON.stringify(peerListings));
      localStorage.setItem('ustp_saved_listings_v1', JSON.stringify(savedListingIds));
      localStorage.setItem('ustp_wishlist_products_v1', JSON.stringify(wishlistProductIds));
      localStorage.setItem('ustp_cart_v1', JSON.stringify(cart));
      localStorage.setItem('ustp_orders_v1', JSON.stringify(orders));
    } catch {
      // Ignore storage quota errors
    }
  }, [
    user,
    pools,
    joinedPoolIds,
    peerListings,
    savedListingIds,
    wishlistProductIds,
    cart,
    orders,
  ]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    window.setTimeout(() => {
      setToastMsg((curr) => (curr === msg ? null : curr));
    }, 2600);
  };

  const navigate = (next: ScreenId) => {
    setScreen(next);
    setHistory((prev) => [...prev, next]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goBack = () => {
    setHistory((prev) => {
      if (prev.length <= 1) {
        setScreen('home');
        return ['home'];
      }
      const nextHist = prev.slice(0, -1);
      const target = nextHist[nextHist.length - 1] ?? 'home';
      setScreen(target);
      return nextHist;
    });
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const activeOrdersCount = orders.filter((o) => o.status !== 'Completed').length;
  const totalSaved =
    480 + orders.reduce((sum, o) => sum + o.savingsAmount, 0);

  const handleAddToCart = (product: SupplyProduct, qty = 1, customVendor?: VendorQuote) => {
    const unitPrice = customVendor ? customVendor.price : product.price;
    const sellerName = customVendor ? customVendor.sellerName : product.sellerName;
    setCart((prev) => {
      const existing = prev.find(
        (c) => c.productId === product.id && c.sellerName === sellerName
      );
      if (existing) {
        return prev.map((c) =>
          c.id === existing.id ? { ...c, quantity: c.quantity + qty } : c
        );
      }
      const newItem: CartItem = {
        id: `cart-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        productId: product.id,
        title: product.title,
        subtitle: `${product.specs[0]?.value ?? product.unitLabel} · ${sellerName}`,
        sellerName,
        unitPrice,
        originalPrice: product.originalPrice,
        quantity: qty,
        tagLabel: product.categoryLabel,
        visualKind: product.visualKind,
      };
      return [...prev, newItem];
    });
    showToast(`Added ${qty} × ${product.title.split('(')[0].trim()} to cart`);
  };

  const handleBuyNow = (product: SupplyProduct, qty = 1, customVendor?: VendorQuote) => {
    handleAddToCart(product, qty, customVendor);
    navigate('checkout');
  };

  const handleUpdateCartQty = (cartItemId: string, delta: number) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === cartItemId
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const handleRemoveCartItem = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== cartItemId));
    showToast('Item removed from cart');
  };

  const handlePlaceOrder = ({
    paymentMethod,
    fulfillmentMode,
    totalPayable,
    totalSavings,
  }: {
    paymentMethod: string;
    fulfillmentMode: 'pickup' | 'delivery';
    fulfillmentFee: number;
    totalPayable: number;
    totalSavings: number;
  }) => {
    const num = Math.floor(10000 + Math.random() * 89999);
    const code = `#USTP-${num}`;
    const first = cart[0];
    const summaryTitle =
      cart.length > 1
        ? `${first.title} + ${cart.length - 1} more`
        : first?.title ?? 'Campus Supply Order';

    const newOrder: CampusOrder = {
      id: `ord-${Date.now()}`,
      code,
      type: 'pickup',
      status: 'Ready for Pickup',
      title: summaryTitle,
      subtitle:
        fulfillmentMode === 'pickup'
          ? user.primaryKiosk
          : `Campus Runner Delivery · ${user.campusBuilding}`,
      vendorName: first?.sellerName ?? 'USTP Campus Coop',
      timestamp: 'Just now',
      totalAmount: totalPayable,
      savingsAmount: totalSavings,
      paymentMethod: `Paid via ${paymentMethod}`,
      pickupLocation:
        fulfillmentMode === 'pickup'
          ? user.primaryKiosk
          : `${user.campusBuilding} Lobby`,
      stepIndex: 3,
      visualKind: first?.visualKind ?? 'paper-a4',
      quantity: cart.reduce((s, c) => s + c.quantity, 0),
    };

    setOrders((prev) => [newOrder, ...prev]);
    setCart([]);
    return code;
  };

  const handleReservePool = (pool: GroupBuyPool, quantity = 1) => {
    if (joinedPoolIds.includes(pool.id)) {
      showToast('You already reserved a slot in this pool');
      return;
    }

    setJoinedPoolIds((prev) => [...prev, pool.id]);
    setPools((prev) =>
      prev.map((p) =>
        p.id === pool.id
          ? { ...p, joinedCount: Math.min(p.targetCapacity, p.joinedCount + 1) }
          : p
      )
    );

    const newPoolOrder: CampusOrder = {
      id: `ord-gb-${Date.now()}`,
      code: `#GB-POOL-${Math.floor(1000 + Math.random() * 8999)}`,
      type: 'groupbuy',
      status: 'Pooling Orders',
      title: pool.title,
      subtitle: `Locked at ₱${pool.groupPrice} wholesale tier`,
      vendorName: pool.vendorName,
      timestamp: 'Just now',
      totalAmount: pool.groupPrice * quantity,
      savingsAmount: Math.max(0, (pool.originalPrice - pool.groupPrice) * quantity),
      paymentMethod: 'Student Escrow Reserved',
      pickupLocation: pool.pickupPoint,
      stepIndex: 2,
      poolJoined: Math.min(pool.targetCapacity, pool.joinedCount + 1),
      poolTarget: pool.targetCapacity,
      visualKind: pool.visualKind,
      quantity,
    };

    setOrders((prev) => [newPoolOrder, ...prev]);
    showToast('Group Buy slot reserved! Added to My Campus Orders.');
  };

  const handlePublishListing = (listing: PeerListing) => {
    setPeerListings((prev) => [listing, ...prev]);
    showToast('Published to USTP Student Marketplace!');
    navigate('marketplace');
  };

  const handleOrderPeerListing = (listing: PeerListing) => {
    const newOrder: CampusOrder = {
      id: `ord-peer-${Date.now()}`,
      code: `#USTP-${Math.floor(10000 + Math.random() * 89999)}`,
      type: 'pickup',
      status: 'Ready for Pickup',
      title: listing.title,
      subtitle: `${listing.sellerName} · Peer Meetup`,
      vendorName: `${listing.sellerName} (${listing.department})`,
      timestamp: 'Just now',
      totalAmount: listing.price,
      savingsAmount: Math.max(0, listing.originalPrice - listing.price),
      paymentMethod: 'Cash on Campus Meetup',
      pickupLocation: listing.meetupSpot,
      stepIndex: 3,
      visualKind: listing.visualKind,
      quantity: 1,
    };
    setOrders((prev) => [newOrder, ...prev]);
    showToast(`Meetup requested with ${listing.sellerName}! Check Orders.`);
    navigate('orders');
  };

  const handleClaimOrder = (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId ? { ...o, status: 'Completed', stepIndex: 4 } : o
      )
    );
    showToast('Pickup confirmed! Order marked as Completed.');
  };

  const handleReorder = (order: CampusOrder) => {
    const matched =
      SUPPLY_PRODUCTS.find((p) => p.visualKind === order.visualKind) ?? SUPPLY_PRODUCTS[0];
    handleAddToCart(matched, 1);
    navigate('checkout');
  };

  const selectedProduct =
    SUPPLY_PRODUCTS.find((p) => p.id === selectedProductId) ?? SUPPLY_PRODUCTS[0];

  const showAppShell = screen !== 'onboarding' && screen !== 'auth';

  return (
    <div className="min-h-screen bg-[#faf8ff] text-[#131b2e] flex flex-col">
      {showAppShell && (
        <Header
          currentScreen={screen}
          onNavigate={navigate}
          onBack={goBack}
          cartCount={cartCount}
          activeOrdersCount={activeOrdersCount}
          userName={user.name}
        />
      )}

      <main className="flex-1 w-full">
        {screen === 'onboarding' && (
          <OnboardingView
            onGetStarted={() => {
              setAuthMode('signup');
              navigate('auth');
            }}
            onLogin={() => {
              setAuthMode('login');
              navigate('auth');
            }}
            onNavigate={navigate}
          />
        )}

        {screen === 'auth' && (
          <AuthView
            initialMode={authMode}
            onBack={() => navigate('onboarding')}
            onAuthenticated={(email) => {
              setUser((prev) => ({ ...prev, email }));
              navigate('home');
            }}
            onShowToast={showToast}
          />
        )}

        {screen === 'home' && (
          <HomeView
            user={user}
            products={SUPPLY_PRODUCTS}
            pools={pools}
            totalSaved={totalSaved}
            joinedPoolIds={joinedPoolIds}
            onSelectProduct={(id) => {
              setSelectedProductId(id);
              navigate('details');
            }}
            onAddToCart={(product, qty) => handleAddToCart(product, qty)}
            onOpenCompare={(id) => {
              if (id) setCompareProductId(id);
              navigate('compare');
            }}
            onOpenGroupBuy={(poolId) => {
              if (poolId) setSelectedPoolId(poolId);
              navigate('groupbuy');
            }}
            onJoinPoolQuick={(pool) => handleReservePool(pool, 1)}
            onNavigate={navigate}
          />
        )}

        {screen === 'details' && (
          <ProductDetailView
            product={selectedProduct}
            isWishlisted={wishlistProductIds.includes(selectedProduct.id)}
            onToggleWishlist={(id) => {
              setWishlistProductIds((prev) =>
                prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
              );
              showToast('Updated saved supplies');
            }}
            onAddToCart={(p, q) => handleAddToCart(p, q)}
            onBuyNow={(p, q) => handleBuyNow(p, q)}
            onJoinGroupBuy={(prodId) => {
              const found = pools.find((pl) => pl.productId === prodId) ?? pools[0];
              setSelectedPoolId(found.id);
              navigate('groupbuy');
            }}
          />
        )}

        {screen === 'compare' && (
          <CompareView
            products={SUPPLY_PRODUCTS}
            selectedProductId={compareProductId}
            onSelectProductId={setCompareProductId}
            pools={pools}
            onBuyFromVendor={(product, quote) => handleBuyNow(product, 1, quote)}
            onOpenGroupBuy={(poolId) => {
              if (poolId) setSelectedPoolId(poolId);
              navigate('groupbuy');
            }}
          />
        )}

        {screen === 'groupbuy' && (
          <GroupBuyView
            pools={pools}
            selectedPoolId={selectedPoolId}
            onSelectPoolId={setSelectedPoolId}
            joinedPoolIds={joinedPoolIds}
            onReservePool={handleReservePool}
          />
        )}

        {screen === 'marketplace' && (
          <MarketplaceView
            listings={peerListings}
            savedIds={savedListingIds}
            onToggleSaved={(id) => {
              setSavedListingIds((prev) =>
                prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
              );
              showToast('Updated saved peer listings');
            }}
            onOpenSell={() => navigate('sell')}
            onOrderPeerListing={handleOrderPeerListing}
          />
        )}

        {screen === 'sell' && (
          <SellView user={user} onPublishListing={handlePublishListing} />
        )}

        {screen === 'checkout' && (
          <CheckoutView
            user={user}
            cart={cart}
            onUpdateQty={handleUpdateCartQty}
            onRemoveItem={handleRemoveCartItem}
            onPlaceOrder={handlePlaceOrder}
            onBrowseHome={() => navigate('home')}
            onViewOrders={() => navigate('orders')}
          />
        )}

        {screen === 'orders' && (
          <OrdersView
            orders={orders}
            onClaimOrder={handleClaimOrder}
            onReorder={handleReorder}
            onShowToast={showToast}
          />
        )}

        {screen === 'profile' && (
          <ProfileView
            user={user}
            totalSaved={totalSaved}
            poolsJoinedCount={6 + joinedPoolIds.length}
            myListingsCount={peerListings.filter((l) => l.isMine).length}
            activeOrdersCount={activeOrdersCount}
            wishlistCount={wishlistProductIds.length + savedListingIds.length}
            onUpdateUser={setUser}
            onNavigate={navigate}
            onLogout={() => {
              showToast('Signed out of USTP SupplyHub');
              navigate('auth');
            }}
            onShowToast={showToast}
          />
        )}
      </main>

      {showAppShell && (
        <BottomNav
          currentScreen={screen}
          onNavigate={navigate}
          activeOrdersCount={activeOrdersCount}
        />
      )}

      {/* Global Toast */}
      {toastMsg && (
        <div
          role="status"
          className="fixed bottom-20 md:bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#003734] text-white px-4 py-2.5 rounded-full shadow-xl flex items-center gap-2 text-xs font-semibold max-w-[90vw]"
        >
          <CheckCircle2 className="w-4 h-4 text-[#6ffbbe] shrink-0" />
          <span className="truncate">{toastMsg}</span>
        </div>
      )}
    </div>
  );
}
