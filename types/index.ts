// ============================================================
// TOP 10 PROM — TypeScript Interfaces (strict mode)
// All interfaces exported for use throughout the application
// ============================================================

export type StockStatus = 'in_stock' | 'low_stock' | 'backordered' | 'discontinued'
export type OrderStatus = 'processing' | 'confirmed' | 'shipped' | 'delivered' | 'returned' | 'cancelled'
export type AppointmentStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no_show'
export type UserRole = 'customer' | 'vendor' | 'admin'
export type Occasion = 'prom' | 'homecoming' | 'bridal' | 'tuxedo' | 'pageant' | 'sweet16' | 'quinceanera' | 'evening'
export type Silhouette = 'ballgown' | 'a-line' | 'mermaid' | 'trumpet' | 'sheath' | 'column' | 'empire' | 'fit-and-flare'
export type Region = 'northeast' | 'southeast' | 'south' | 'midwest' | 'west'
export type StyleArchetype = 'romantic' | 'classic' | 'bold' | 'bohemian' | 'edgy' | 'glamorous'

// ── DRESS / PRODUCT ──────────────────────────────────────────

export interface Dress {
  id: string
  name: string
  designer: string
  description: string
  price: number
  wholesalePrice?: number
  sku?: string
  colors: DressColor[]
  sizes: string[]
  occasions: Occasion[]
  silhouette: Silhouette
  neckline?: string
  embellishment?: string
  imageUrls: string[]
  isFeatured: boolean
  isNew: boolean
  isSale: boolean
  isExclusive: boolean
  stockStatus: StockStatus
  slug: string
  createdAt: string
}

export interface DressColor {
  name: string
  hex: string
}

// ── STORE ────────────────────────────────────────────────────

export interface Store {
  id: number
  name: string
  address: string
  city: string
  state: string
  zip: string
  phone?: string
  email?: string
  website?: string
  hours?: StoreHours
  coordinates: {
    lat: number
    lng: number
  }
  region: Region
  googleMapsUrl: string
  isHQ: boolean
  description?: string
}

export interface StoreHours {
  monday?: string
  tuesday?: string
  wednesday?: string
  thursday?: string
  friday?: string
  saturday?: string
  sunday?: string
}

// ── DESIGNER ─────────────────────────────────────────────────

export interface DesignerProfile {
  id: string
  name: string
  slug: string
  bio: string
  logoUrl?: string
  imageUrls: string[]
  stylesCount: number
  tagline: string
  website?: string
}

// ── USER / CUSTOMER ──────────────────────────────────────────

export interface Profile {
  id: string
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  dateOfBirth?: string
  role: UserRole
  shoppingIntent?: Occasion
  loyaltyPoints: number
  styleArchetype?: StyleArchetype
  preferredColors?: string[]
  preferredOccasions?: Occasion[]
  avatarUrl?: string
  memberTier?: 'silver' | 'gold' | 'platinum'
  createdAt: string
  updatedAt: string
}

// ── VENDOR ───────────────────────────────────────────────────

export interface Vendor {
  id: string
  storeName: string
  storeAddress?: string
  storeCity?: string
  storeState?: string
  storeZip?: string
  storePhone?: string
  storeWebsite?: string
  storeBio?: string
  logoUrl?: string
  isActive: boolean
  joinedAt: string
  profile?: Profile
}

// ── CART ─────────────────────────────────────────────────────

export interface CartItem {
  id: string
  dress_id: string
  dress: Dress
  quantity: number
  selected_color?: string
  selected_size?: string
  price: number
}

export interface CartState {
  items: CartItem[]
  isOpen: boolean
  openCart: () => void
  closeCart: () => void
  toggleCart: () => void
  addItem: (dress: Dress, quantity?: number, selectedColor?: string, selectedSize?: string) => void
  removeItem: (itemId: string) => void
  updateQuantity: (itemId: string, quantity: number) => void
  clearCart: () => void
  itemCount: number
  subtotal: number
}

// ── WISHLIST ─────────────────────────────────────────────────

export interface WishlistItem {
  id: string
  dress_id: string
  color_id?: string
  dress: Dress
  added_at: string
}

export interface WishlistState {
  items: WishlistItem[]
  addItem: (dress: Dress, colorId?: string) => void
  removeItem: (dressId: string, colorId?: string) => void
  toggleItem: (dress: Dress, colorId?: string) => void
  isWishlisted: (dressId: string, colorId?: string) => boolean
  clearWishlist: () => void
}

// ── ORDER ────────────────────────────────────────────────────

export interface Order {
  id: string
  customerId: string
  vendorId?: string
  stripePaymentIntentId?: string
  status: OrderStatus
  items: OrderItem[]
  subtotal: number
  shippingCost: number
  total: number
  shippingAddress: ShippingAddress
  trackingNumber?: string
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface OrderItem {
  dressId: string
  dressName: string
  designer: string
  imageUrl: string
  color: string
  size: string
  quantity: number
  price: number
}

export interface ShippingAddress {
  fullName: string
  email: string
  phone: string
  line1: string
  line2?: string
  city: string
  state: string
  zip: string
  country: string
}

export type ShippingMethod = 'standard' | 'express' | 'overnight'

export interface ShippingOption {
  id: ShippingMethod
  label: string
  description: string
  price: number
  days: string
}

// ── APPOINTMENT ──────────────────────────────────────────────

export interface Appointment {
  id: string
  customerId?: string
  storeId: number
  storeName: string
  occasion: Occasion
  appointmentDate: string
  appointmentTime: string
  partySize: number
  specialRequests?: string
  status: AppointmentStatus
  howHeard?: string
  firstName: string
  lastName: string
  email: string
  phone: string
  createdAt: string
}

// ── CHAT / ARIA ───────────────────────────────────────────────

export type MessageRole = 'user' | 'assistant'

export interface ChatMessage {
  id: string
  role: MessageRole
  content: string
  timestamp: string
  isStreaming?: boolean
  quickReplies?: string[]
}

// ── STYLE DNA ─────────────────────────────────────────────────

export interface StyleDNA {
  archetype: string
  archetypeName?: string
  archetypeDescription?: string
  preferredColors?: DressColor[]
  preferredSilhouettes?: Silhouette[]
  recommendedDresses?: Dress[]
  primaryVibe?: string
  silhouette?: string
  colorPalette?: string
  embellishment?: string
  designers?: string[]
  scores?: Record<string, number>
}

export interface StyleQuizAnswer {
  questionId: string
  answerId: string
}

// ── MARKETING ASSET ──────────────────────────────────────────

export interface MarketingAsset {
  id: string
  title: string
  description: string
  category: 'lookbook' | 'social' | 'signage' | 'email' | 'other'
  thumbnailUrl: string
  fileSize: string
  fileType: string
  downloadUrl: string
  year: number
}

// ── VENDOR ANALYTICS ─────────────────────────────────────────

export interface VendorAnalytics {
  totalOrdersMTD: number
  totalOrdersMTDTrend: number
  revenueMTD: number
  revenueMTDTrend: number
  topSellingStyle?: Dress
  avgOrderValue: number
  avgOrderValueTrend: number
  revenueByMonth: MonthlyRevenue[]
  ordersByOccasion: OccasionOrders[]
}

export interface MonthlyRevenue {
  month: string
  revenue: number
}

export interface OccasionOrders {
  occasion: string
  orders: number
  color: string
}

// ── SEARCH ───────────────────────────────────────────────────

export interface SearchResult {
  type: 'dress' | 'category' | 'store'
  id: string
  title: string
  subtitle?: string
  imageUrl?: string
  href: string
}

// ── FILTER ───────────────────────────────────────────────────

export interface FilterState {
  occasion?: Occasion
  silhouette?: Silhouette
  colors?: string[]
  sizes?: string[]
  priceMin?: number
  priceMax?: number
  designer?: string
  sortBy?: 'popular' | 'newest' | 'price-asc' | 'price-desc' | 'designer-az'
}

// ── TOAST ────────────────────────────────────────────────────

export type ToastVariant = 'success' | 'error' | 'warning' | 'info'

export interface Toast {
  id: string
  type: ToastVariant
  message: string
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}
