import turmericImg from '../../assets/turmeric_jar.png';
import chiliImg from '../../assets/chili_jar.png';
import garamMasalaImg from '../../assets/garam_masala_jar.png';

export const initialProducts = [
  {
    id: 'turmeric',
    name: 'Alleppey Gold Turmeric',
    scientificName: 'Curcuma longa',
    price: '₹950',
    priceNum: 950,
    rating: 4.9,
    reviews: 148,
    origin: 'Kerala, India',
    image: turmericImg,
    category: 'single-origin',
    description: 'Sourced from the hills of Alleppey, offering an exceptionally high curcumin content and warm earthy flavor.',
    tag: 'Imperial Selection',
    stock: 45,
    status: 'In Stock'
  },
  {
    id: 'chili',
    name: 'Kashmiri Chili Powder',
    scientificName: 'Capsicum annuum',
    price: '₹850',
    priceNum: 850,
    rating: 4.8,
    reviews: 96,
    origin: 'Kashmir Valley',
    image: chiliImg,
    category: 'single-origin',
    description: 'Hand-harvested vibrant crimson pods dried and ground to preserve their rich color and mild, sweet heat.',
    tag: 'Ultra-Rare Grade A',
    stock: 28,
    status: 'In Stock'
  },
  {
    id: 'garam-masala',
    name: 'Royal Garam Masala',
    scientificName: 'Artisanal Blend',
    price: '₹1,100',
    priceNum: 1100,
    rating: 5.0,
    reviews: 112,
    origin: 'Rajasthan, India',
    image: garamMasalaImg,
    category: 'blends',
    description: 'A traditional royal recipe blending black cardamom, star anise, cloves, and mace, dry-roasted and stone-ground.',
    tag: 'Reserve Blend',
    stock: 5,
    status: 'Low Stock'
  },
  {
    id: 'cinnamon',
    name: 'Ceylon Cinnamon Bark',
    scientificName: 'Cinnamomum verum',
    price: '₹1,300',
    priceNum: 1300,
    rating: 4.9,
    reviews: 84,
    origin: 'Matara, Sri Lanka',
    image: turmericImg,
    category: 'single-origin',
    description: 'Delicate, multi-layered quills of authentic Ceylon cinnamon, releasing a refined sweet, warm woody aroma.',
    tag: 'Fine Quill Selection',
    stock: 12,
    status: 'In Stock'
  },
  {
    id: 'black-pepper',
    name: 'Malabar Tellicherry Pepper',
    scientificName: 'Piper nigrum',
    price: '₹980',
    priceNum: 980,
    rating: 4.7,
    reviews: 104,
    origin: 'Malabar Coast, India',
    image: garamMasalaImg,
    category: 'single-origin',
    description: 'Extra-large vine-ripened black peppercorns offering deep complex pungency, hot citrus sharpness, and woodsmoke notes.',
    tag: 'Premium Pepper',
    stock: 0,
    status: 'Out of Stock'
  },
  {
    id: 'saffron-honey',
    name: 'Saffron Infused Honey',
    scientificName: 'Mellifica & Crocus',
    price: '₹1,750',
    priceNum: 1750,
    rating: 5.0,
    reviews: 67,
    origin: 'Kashmiri Highlands',
    image: turmericImg,
    category: 'honey-elixirs',
    description: 'Pure, organic wildflower honey cold-steeped with Kashmiri saffron threads for a honeyed floral luxury finish.',
    tag: 'Limited Release',
    stock: 32,
    status: 'In Stock'
  },
  {
    id: 'wild-honey',
    name: 'Wild Forest Honey',
    scientificName: 'Apis dorsata',
    price: '₹650',
    priceNum: 650,
    rating: 4.6,
    reviews: 58,
    origin: 'Western Ghats, India',
    image: chiliImg,
    category: 'honey-elixirs',
    description: 'Sourced from native wild beehives in dense forest reserves, rich in natural pollen and enzyme notes.',
    tag: 'Wild Sourced',
    stock: 60,
    status: 'In Stock'
  },
  {
    id: 'cardamom',
    name: 'Green Cardamom Pods',
    scientificName: 'Elettaria cardamomum',
    price: '₹1,450',
    priceNum: 1450,
    rating: 4.9,
    reviews: 43,
    origin: 'Idukki Hills, Kerala',
    image: garamMasalaImg,
    category: 'single-origin',
    description: 'Extra-bold 8mm green cardamom pods, hand-sorted for intense aromatic eucalyptus and citrus brightness.',
    tag: 'Imperial Grade',
    stock: 8,
    status: 'Low Stock'
  }
];

export const initialOrders = [
  {
    id: 'ORD-8492',
    customerName: 'Aditya Verma',
    email: 'aditya.verma@example.com',
    phone: '+91 98765 43210',
    address: 'Flat 402, Shanti Vihar, Sector 56, Gurgaon, HR - 122011',
    products: [
      { id: 'turmeric', name: 'Alleppey Gold Turmeric', quantity: 2, price: 950 },
      { id: 'saffron-honey', name: 'Saffron Infused Honey', quantity: 1, price: 1750 }
    ],
    amount: 3650,
    paymentStatus: 'Paid',
    orderStatus: 'Delivered',
    date: '2026-06-18T14:32:00Z'
  },
  {
    id: 'ORD-8491',
    customerName: 'Priya Nair',
    email: 'priya.nair@example.com',
    phone: '+91 91234 56789',
    address: 'House 12B, Lakeview Avenue, Koramangala 4th Block, Bangalore, KA - 560034',
    products: [
      { id: 'cinnamon', name: 'Ceylon Cinnamon Bark', quantity: 1, price: 1300 },
      { id: 'garam-masala', name: 'Royal Garam Masala', quantity: 1, price: 1100 }
    ],
    amount: 2400,
    paymentStatus: 'Paid',
    orderStatus: 'Shipped',
    date: '2026-06-20T10:15:00Z'
  },
  {
    id: 'ORD-8490',
    customerName: 'Rohan Sharma',
    email: 'rohan.sharma@example.com',
    phone: '+91 99887 76655',
    address: '15/3, Alpine Crest, Off Linking Road, Bandra West, Mumbai, MH - 400050',
    products: [
      { id: 'chili', name: 'Kashmiri Chili Powder', quantity: 3, price: 850 }
    ],
    amount: 2550,
    paymentStatus: 'Paid',
    orderStatus: 'Confirmed',
    date: '2026-06-22T09:45:00Z'
  },
  {
    id: 'ORD-8489',
    customerName: 'Ananya Sen',
    email: 'ananya.sen@example.com',
    phone: '+91 88776 65544',
    address: 'Block E, Flat 701, Salt Lake Sector V, Kolkata, WB - 700091',
    products: [
      { id: 'saffron-honey', name: 'Saffron Infused Honey', quantity: 2, price: 1750 },
      { id: 'black-pepper', name: 'Malabar Tellicherry Pepper', quantity: 1, price: 980 }
    ],
    amount: 4480,
    paymentStatus: 'Pending',
    orderStatus: 'Pending',
    date: '2026-06-23T11:20:00Z'
  },
  {
    id: 'ORD-8488',
    customerName: 'Kabir Mehta',
    email: 'kabir.mehta@example.com',
    phone: '+91 77665 54433',
    address: '42, Boulevard Towers, Jubilee Hills Road No. 4, Hyderabad, TG - 500033',
    products: [
      { id: 'wild-honey', name: 'Wild Forest Honey', quantity: 1, price: 650 },
      { id: 'turmeric', name: 'Alleppey Gold Turmeric', quantity: 1, price: 950 }
    ],
    amount: 1600,
    paymentStatus: 'Paid',
    orderStatus: 'Delivered',
    date: '2026-06-15T16:05:00Z'
  },
  {
    id: 'ORD-8487',
    customerName: 'Sneha Patel',
    email: 'sneha.patel@example.com',
    phone: '+91 90909 09090',
    address: 'C-904, Galaxy Heights, Near Alpha Mall, Vastrapur, Ahmedabad, GJ - 380015',
    products: [
      { id: 'cardamom', name: 'Green Cardamom Pods', quantity: 2, price: 1450 }
    ],
    amount: 2900,
    paymentStatus: 'Failed',
    orderStatus: 'Cancelled',
    date: '2026-06-14T08:30:00Z'
  },
  {
    id: 'ORD-8486',
    customerName: 'Arjun Das',
    email: 'arjun.das@example.com',
    phone: '+91 81818 18181',
    address: 'House No. 415, VIP Road, Guwahati, AS - 781022',
    products: [
      { id: 'chili', name: 'Kashmiri Chili Powder', quantity: 1, price: 850 },
      { id: 'garam-masala', name: 'Royal Garam Masala', quantity: 1, price: 1100 },
      { id: 'wild-honey', name: 'Wild Forest Honey', quantity: 2, price: 650 }
    ],
    amount: 3250,
    paymentStatus: 'Paid',
    orderStatus: 'Delivered',
    date: '2026-06-12T12:00:00Z'
  }
];

export const initialCustomers = [
  {
    id: 'CUST-001',
    name: 'Aditya Verma',
    email: 'aditya.verma@example.com',
    phone: '+91 98765 43210',
    totalOrders: 4,
    totalSpending: 12450,
    avatarColor: 'bg-amber-600/20 text-amber-400 border border-amber-500/30',
    joinedDate: '2025-11-12'
  },
  {
    id: 'CUST-002',
    name: 'Priya Nair',
    email: 'priya.nair@example.com',
    phone: '+91 91234 56789',
    totalOrders: 3,
    totalSpending: 6780,
    avatarColor: 'bg-orange-600/20 text-orange-400 border border-orange-500/30',
    joinedDate: '2026-01-05'
  },
  {
    id: 'CUST-003',
    name: 'Rohan Sharma',
    email: 'rohan.sharma@example.com',
    phone: '+91 99887 76655',
    totalOrders: 2,
    totalSpending: 5100,
    avatarColor: 'bg-yellow-600/20 text-yellow-400 border border-yellow-500/30',
    joinedDate: '2026-02-14'
  },
  {
    id: 'CUST-004',
    name: 'Ananya Sen',
    email: 'ananya.sen@example.com',
    phone: '+91 88776 65544',
    totalOrders: 5,
    totalSpending: 18920,
    avatarColor: 'bg-stone-600/20 text-stone-300 border border-stone-500/30',
    joinedDate: '2025-08-20'
  },
  {
    id: 'CUST-005',
    name: 'Kabir Mehta',
    email: 'kabir.mehta@example.com',
    phone: '+91 77665 54433',
    totalOrders: 1,
    totalSpending: 1600,
    avatarColor: 'bg-red-600/20 text-red-400 border border-red-500/30',
    joinedDate: '2026-06-15'
  },
  {
    id: 'CUST-006',
    name: 'Sneha Patel',
    email: 'sneha.patel@example.com',
    phone: '+91 90909 09090',
    totalOrders: 1,
    totalSpending: 0,
    avatarColor: 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30',
    joinedDate: '2026-06-14'
  },
  {
    id: 'CUST-007',
    name: 'Arjun Das',
    email: 'arjun.das@example.com',
    phone: '+91 81818 18181',
    totalOrders: 3,
    totalSpending: 9400,
    avatarColor: 'bg-amber-800/20 text-amber-500 border border-amber-500/30',
    joinedDate: '2026-03-29'
  }
];

export const initialPayments = [
  {
    id: 'TXN-90234',
    orderId: 'ORD-8492',
    customerName: 'Aditya Verma',
    method: 'UPI',
    amount: 3650,
    status: 'Success',
    date: '2026-06-18T14:35:00Z'
  },
  {
    id: 'TXN-90233',
    orderId: 'ORD-8491',
    customerName: 'Priya Nair',
    method: 'Card',
    amount: 2400,
    status: 'Success',
    date: '2026-06-20T10:18:00Z'
  },
  {
    id: 'TXN-90232',
    orderId: 'ORD-8490',
    customerName: 'Rohan Sharma',
    method: 'NetBanking',
    amount: 2550,
    status: 'Success',
    date: '2026-06-22T09:47:00Z'
  },
  {
    id: 'TXN-90231',
    orderId: 'ORD-8489',
    customerName: 'Ananya Sen',
    method: 'UPI',
    amount: 4480,
    status: 'Pending',
    date: '2026-06-23T11:20:00Z'
  },
  {
    id: 'TXN-90230',
    orderId: 'ORD-8488',
    customerName: 'Kabir Mehta',
    method: 'Card',
    amount: 1600,
    status: 'Success',
    date: '2026-06-15T16:07:00Z'
  },
  {
    id: 'TXN-90229',
    orderId: 'ORD-8487',
    customerName: 'Sneha Patel',
    method: 'UPI',
    amount: 2900,
    status: 'Failed',
    date: '2026-06-14T08:31:00Z'
  },
  {
    id: 'TXN-90228',
    orderId: 'ORD-8486',
    customerName: 'Arjun Das',
    method: 'UPI',
    amount: 3250,
    status: 'Success',
    date: '2026-06-12T12:02:00Z'
  }
];

export const initialMessages = [
  {
    id: 'MSG-301',
    name: 'Vikram Seth',
    email: 'vikram.seth@example.com',
    message: 'Greetings. I am looking to purchase Alleppey Gold Turmeric in bulk (around 50kg) for our gourmet restaurants in Delhi. Can you offer bulk trade discounts and shipping estimates?',
    date: '2026-06-22T10:04:00Z',
    replied: false
  },
  {
    id: 'MSG-300',
    name: 'Elena Rostova',
    email: 'elena.rostova@example.com',
    message: 'Hello! I absolute adore your Ceylon Cinnamon Bark. However, the last jar received seemed slightly less aromatic than the previous order. Is this due to seasonal harvest variations, or a shift in estates? Thank you!',
    date: '2026-06-20T15:42:00Z',
    replied: true,
    replyText: 'Hi Elena, thank you for writing. Indeed, our cinnamon is harvested in small seasonal batches from Matara. Due to minor rainfall shifts during the drying phase in mid-May, the oils can vary slightly in weight. We appreciate your fine palate and are happy to send a replacement sample from our newer solar-dried reserve batch!'
  },
  {
    id: 'MSG-299',
    name: 'Dr. Ramesh Kumar',
    email: 'dr.ramesh@ayurvedacare.org',
    message: 'Respected admin, I need the chemical profile certificate (specifically curcumin content analysis) for the current batch of Alleppey Gold. Our clinic uses this for therapeutic preparation checks. Please email the PDF.',
    date: '2026-06-17T09:12:00Z',
    replied: false
  },
  {
    id: 'MSG-298',
    name: 'Sophie Martin',
    email: 'sophie.m@gourmetfrance.fr',
    message: 'Do you ship to Paris, France? I tried ordering Saffron Honey but checkout would not accept my European credit cards. Looking forward to your response.',
    date: '2026-06-14T17:50:00Z',
    replied: true,
    replyText: 'Bonjour Sophie! Yes, we absolutely ship to France via our DHL priority express route. We have adjusted our international payment gate options. You should now be able to check out with cards issued in Europe, or via global PayPal. Please let us know if you need assistance.'
  }
];

export const salesHistory = [
  { month: 'Jan', sales: 42, revenue: 110000, customers: 120 },
  { month: 'Feb', sales: 50, revenue: 135000, customers: 132 },
  { month: 'Mar', sales: 68, revenue: 180000, customers: 148 },
  { month: 'Apr', sales: 60, revenue: 165000, customers: 155 },
  { month: 'May', sales: 78, revenue: 210000, customers: 172 },
  { month: 'Jun', sales: 95, revenue: 284500, customers: 189 }
];

export const weeklySales = [
  { day: 'Mon', revenue: 28000, orders: 12 },
  { day: 'Tue', revenue: 35000, orders: 16 },
  { day: 'Wed', revenue: 42000, orders: 19 },
  { day: 'Thu', revenue: 31000, orders: 15 },
  { day: 'Fri', revenue: 49000, orders: 22 },
  { day: 'Sat', revenue: 58000, orders: 28 },
  { day: 'Sun', revenue: 41500, orders: 20 }
];

export const initialSettings = {
  profile: {
    name: 'Devaiah Thimmaiah',
    email: 'admin@honeyspices.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    role: 'Managing Curator & Director'
  },
  store: {
    name: 'L\'Épice Honey & Spices',
    email: 'concierge@lepice.com',
    currency: 'INR',
    phone: '+91 99887 76655',
    address: '12 Rue de L\'Éspice, 75001 Paris, France / Sourcing Desk: Fort Kochi, Kerala, India',
    seoTitle: 'L\'Épice | Curated Single-Origin Spices & Honey Elixirs',
    seoDescription: 'Premium organic honeys and rare single-origin spices sourced direct from Indian micro-estates.'
  },
  notifications: {
    emailAlerts: true,
    pushAlerts: false,
    lowStockAlerts: true,
    dailySummary: true
  }
};
