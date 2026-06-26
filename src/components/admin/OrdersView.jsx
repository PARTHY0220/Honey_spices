import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Eye, 
  CheckCircle, 
  Truck, 
  Award, 
  XCircle, 
  Search, 
  SlidersHorizontal, 
  MapPin, 
  Phone, 
  Mail
} from 'lucide-react';

const OrdersView = ({ orders, updateOrderStatus, addToast }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [paymentFilter, setPaymentFilter] = useState('All');
  const [sortBy, setSortBy] = useState('newest'); // newest, oldest, amount-high, amount-low
  const [selectedOrder, setSelectedOrder] = useState(null); // Detail Modal

  // Filtering & Sorting Logic
  const filteredOrders = useMemo(() => {
    let result = [...orders];

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(o => 
        o.id.toLowerCase().includes(q) || 
        o.customerName.toLowerCase().includes(q) ||
        o.phone.includes(q)
      );
    }

    // Status Filter
    if (statusFilter !== 'All') {
      result = result.filter(o => o.orderStatus === statusFilter);
    }

    // Payment Filter
    if (paymentFilter !== 'All') {
      result = result.filter(o => o.paymentStatus === paymentFilter);
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.date) - new Date(a.date);
      if (sortBy === 'oldest') return new Date(a.date) - new Date(b.date);
      if (sortBy === 'amount-high') return b.amount - a.amount;
      if (sortBy === 'amount-low') return a.amount - b.amount;
      return 0;
    });

    return result;
  }, [orders, searchQuery, statusFilter, paymentFilter, sortBy]);

  // Formatter
  const formatINR = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  const formatFullDate = (dateStr) => {
    return new Date(dateStr).toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Badge styles helper
  const getStatusBadge = (status) => {
    const base = "px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider inline-block ";
    switch (status) {
      case 'Delivered': return base + "bg-emerald-500/10 text-emerald-500 border border-emerald-500/25";
      case 'Shipped': return base + "bg-blue-500/10 text-blue-500 border border-blue-500/25";
      case 'Confirmed': return base + "bg-amber-500/10 text-amber-500 border border-amber-500/25";
      case 'Pending': return base + "bg-yellow-500/10 text-yellow-500 border border-yellow-500/25 animate-pulse";
      case 'Cancelled': return base + "bg-red-500/10 text-red-500 border border-red-500/25";
      default: return base + "bg-stone-500/10 text-stone-500 border border-stone-500/25";
    }
  };

  const getPaymentBadge = (status) => {
    const base = "px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider inline-block ";
    switch (status) {
      case 'Paid': return base + "bg-emerald-500/10 text-emerald-500 border border-emerald-500/25";
      case 'Pending': return base + "bg-yellow-500/10 text-yellow-500 border border-yellow-500/25";
      case 'Failed': return base + "bg-red-500/10 text-red-500 border border-red-500/25";
      default: return base + "bg-stone-500/10 text-stone-500 border border-stone-500/25";
    }
  };

  const handleStatusChange = (orderId, newStatus) => {
    updateOrderStatus(orderId, newStatus);
    addToast(`Order ${orderId} marked as ${newStatus}`, 'success');
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder(prev => ({ ...prev, orderStatus: newStatus }));
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif tracking-wide text-stone-900 dark:text-white">Orders Ledger</h1>
          <p className="text-xs tracking-wider uppercase text-stone-500 dark:text-amber-500/70 font-mono mt-1">
            Manage spice order shipments and confirmations
          </p>
        </div>
        <div className="text-xs font-mono bg-stone-100 dark:bg-neutral-900 border border-stone-200 dark:border-white/5 px-4 py-2 text-stone-600 dark:text-stone-300 rounded-lg">
          Filtered Records: <span className="font-bold text-amber-600 dark:text-amber-400">{filteredOrders.length}</span>
        </div>
      </div>

      {/* Search, Filter and Sorting controls */}
      <div className="bg-white/60 dark:bg-neutral-900/40 backdrop-blur-md border border-stone-200/60 dark:border-white/5 p-4 rounded-xl shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search Box */}
          <div className="relative flex-grow">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-stone-400 dark:text-zinc-500" />
            <input
              type="text"
              placeholder="Search by Customer name, Phone, or Order ID (ORD-XXXX)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-stone-50 dark:bg-neutral-950 border border-stone-200 dark:border-white/5 text-xs text-stone-900 dark:text-white rounded-lg focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>
          
          {/* Sorting */}
          <div className="flex gap-2 min-w-fit">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2.5 bg-stone-50 dark:bg-neutral-950 border border-stone-200 dark:border-white/5 text-xs text-stone-700 dark:text-stone-300 rounded-lg focus:outline-none focus:border-amber-500 transition-colors font-mono cursor-pointer"
            >
              <option value="newest">Sort: Date (Newest)</option>
              <option value="oldest">Sort: Date (Oldest)</option>
              <option value="amount-high">Sort: Amount (High-Low)</option>
              <option value="amount-low">Sort: Amount (Low-High)</option>
            </select>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-6 pt-3 border-t border-stone-200/50 dark:border-white/5">
          <div className="flex items-center gap-2 text-stone-400 dark:text-zinc-500 text-[10px] uppercase font-mono tracking-widest">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Quick Filters:
          </div>

          {/* Status filter pills */}
          <div className="flex flex-wrap gap-1.5 items-center">
            <span className="text-[10px] text-stone-400 dark:text-zinc-500 uppercase tracking-widest font-mono mr-1">Status:</span>
            {['All', 'Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1 rounded-full text-[10px] font-mono tracking-wider border transition-all cursor-pointer ${
                  statusFilter === st
                    ? 'bg-amber-500 border-amber-500 text-black font-semibold'
                    : 'bg-stone-50 dark:bg-neutral-950 border-stone-200 dark:border-white/5 text-stone-600 dark:text-zinc-400 hover:border-stone-300 dark:hover:border-zinc-700'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Payment filter pills */}
          <div className="flex flex-wrap gap-1.5 items-center">
            <span className="text-[10px] text-stone-400 dark:text-zinc-500 uppercase tracking-widest font-mono mr-1">Payment:</span>
            {['All', 'Paid', 'Pending', 'Failed'].map((pt) => (
              <button
                key={pt}
                onClick={() => setPaymentFilter(pt)}
                className={`px-3 py-1 rounded-full text-[10px] font-mono tracking-wider border transition-all cursor-pointer ${
                  paymentFilter === pt
                    ? 'bg-amber-500 border-amber-500 text-black font-semibold'
                    : 'bg-stone-50 dark:bg-neutral-950 border-stone-200 dark:border-white/5 text-stone-600 dark:text-zinc-400 hover:border-stone-300 dark:hover:border-zinc-700'
                }`}
              >
                {pt}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white/60 dark:bg-neutral-900/40 backdrop-blur-md border border-stone-200/60 dark:border-white/5 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-stone-200 dark:border-white/5 text-[10px] tracking-wider uppercase text-stone-400 dark:text-zinc-500 font-mono bg-stone-50/50 dark:bg-neutral-900/20">
                <th className="p-4 font-normal">Order ID</th>
                <th className="p-4 font-normal">Customer Info</th>
                <th className="p-4 font-normal">Spices Ordered</th>
                <th className="p-4 font-normal text-right">Amount</th>
                <th className="p-4 font-normal text-center">Payment</th>
                <th className="p-4 font-normal text-center">Status</th>
                <th className="p-4 font-normal text-right">Order Date</th>
                <th className="p-4 font-normal text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length > 0 ? (
                filteredOrders.map((o) => (
                  <tr 
                    key={o.id}
                    className="border-b border-stone-200/60 dark:border-white/5 text-stone-700 dark:text-stone-300 hover:bg-stone-50/50 dark:hover:bg-neutral-850/10 transition-colors"
                  >
                    {/* Order ID */}
                    <td className="p-4 font-mono font-bold text-stone-900 dark:text-white">
                      {o.id}
                    </td>

                    {/* Customer Info */}
                    <td className="p-4">
                      <div className="font-semibold text-stone-900 dark:text-stone-200">{o.customerName}</div>
                      <div className="text-[10px] text-stone-400 dark:text-zinc-500 tracking-wide font-mono mt-0.5">{o.phone}</div>
                    </td>

                    {/* Product List */}
                    <td className="p-4 max-w-[200px]">
                      <div className="truncate font-light text-stone-600 dark:text-zinc-300">
                        {o.products.map(p => `${p.name} (x${p.quantity})`).join(', ')}
                      </div>
                    </td>

                    {/* Amount */}
                    <td className="p-4 text-right font-semibold text-amber-600 dark:text-amber-400 font-mono">
                      {formatINR(o.amount)}
                    </td>

                    {/* Payment Badge */}
                    <td className="p-4 text-center">
                      <span className={getPaymentBadge(o.paymentStatus)}>
                        {o.paymentStatus}
                      </span>
                    </td>

                    {/* Order Status */}
                    <td className="p-4 text-center">
                      <span className={getStatusBadge(o.orderStatus)}>
                        {o.orderStatus}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="p-4 text-right font-mono text-[10px] text-stone-400 dark:text-zinc-500">
                      {formatFullDate(o.date)}
                    </td>

                    {/* Action buttons */}
                    <td className="p-4">
                      <div className="flex justify-center items-center gap-1.5">
                        {/* View Button */}
                        <button
                          onClick={() => setSelectedOrder(o)}
                          title="View Details"
                          className="p-1.5 rounded bg-stone-100 dark:bg-neutral-950 border border-stone-200 dark:border-white/5 text-stone-500 hover:text-amber-500 hover:border-amber-500/30 transition-colors cursor-pointer focus:outline-none"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        {/* Interactive flow actions */}
                        {o.orderStatus === 'Pending' && (
                          <>
                            <button
                              onClick={() => handleStatusChange(o.id, 'Confirmed')}
                              title="Confirm Order"
                              className="p-1.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 hover:bg-amber-500 hover:text-black transition-all cursor-pointer focus:outline-none"
                            >
                              <CheckCircle className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleStatusChange(o.id, 'Cancelled')}
                              title="Cancel Order"
                              className="p-1.5 rounded bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white transition-all cursor-pointer focus:outline-none"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}

                        {o.orderStatus === 'Confirmed' && (
                          <>
                            <button
                              onClick={() => handleStatusChange(o.id, 'Shipped')}
                              title="Ship Package"
                              className="p-1.5 rounded bg-blue-500/10 border border-blue-500/20 text-blue-500 hover:bg-blue-500 hover:text-white transition-all cursor-pointer focus:outline-none"
                            >
                              <Truck className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleStatusChange(o.id, 'Cancelled')}
                              title="Cancel Order"
                              className="p-1.5 rounded bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white transition-all cursor-pointer focus:outline-none"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}

                        {o.orderStatus === 'Shipped' && (
                          <>
                            <button
                              onClick={() => handleStatusChange(o.id, 'Delivered')}
                              title="Deliver Package"
                              className="p-1.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 hover:bg-emerald-500 hover:text-white transition-all cursor-pointer focus:outline-none"
                            >
                              <Award className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleStatusChange(o.id, 'Cancelled')}
                              title="Cancel Order"
                              className="p-1.5 rounded bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white transition-all cursor-pointer focus:outline-none"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="p-8 text-center text-stone-400 dark:text-zinc-500 font-mono text-xs">
                    No orders matching selected criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-stone-50 dark:bg-[#141311] border border-stone-200 dark:border-white/10 w-full max-w-xl shadow-2xl relative overflow-hidden"
            >
              {/* Gold light banner at top */}
              <div className="h-1 bg-gradient-to-r from-amber-500 to-orange-500 w-full" />
              
              {/* Modal header */}
              <div className="p-6 pb-4 border-b border-stone-200 dark:border-white/5 flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-serif text-stone-900 dark:text-white font-bold">{selectedOrder.id} Details</h3>
                  <p className="text-[9px] uppercase tracking-wider text-stone-400 dark:text-zinc-500 font-mono mt-0.5">
                    Order registered {new Date(selectedOrder.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-stone-400 hover:text-amber-500 transition-colors text-lg cursor-pointer focus:outline-none"
                >
                  ✕
                </button>
              </div>

              {/* Modal body */}
              <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto text-xs text-stone-700 dark:text-stone-300">
                {/* 2-column details block */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Customer Block */}
                  <div className="bg-white/40 dark:bg-neutral-900/30 border border-stone-200/50 dark:border-white/5 p-4 rounded-lg space-y-3">
                    <h4 className="text-[10px] tracking-wider uppercase text-amber-600 dark:text-amber-500 font-bold font-mono">Customer Info</h4>
                    <div className="space-y-2">
                      <div className="font-semibold text-stone-950 dark:text-white flex items-center gap-2">
                        {selectedOrder.customerName}
                      </div>
                      <div className="flex items-center gap-2 text-stone-500 dark:text-zinc-400">
                        <Mail className="w-3.5 h-3.5 text-stone-400" />
                        {selectedOrder.email}
                      </div>
                      <div className="flex items-center gap-2 text-stone-500 dark:text-zinc-400">
                        <Phone className="w-3.5 h-3.5 text-stone-400" />
                        {selectedOrder.phone}
                      </div>
                    </div>
                  </div>

                  {/* Shipment & Payment Status details */}
                  <div className="bg-white/40 dark:bg-neutral-900/30 border border-stone-200/50 dark:border-white/5 p-4 rounded-lg space-y-3">
                    <h4 className="text-[10px] tracking-wider uppercase text-amber-600 dark:text-amber-500 font-bold font-mono">Fulfillment</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-stone-400 dark:text-zinc-500">Order Status:</span>
                        <span className={getStatusBadge(selectedOrder.orderStatus)}>{selectedOrder.orderStatus}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-stone-400 dark:text-zinc-500">Payment Status:</span>
                        <span className={getPaymentBadge(selectedOrder.paymentStatus)}>{selectedOrder.paymentStatus}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-stone-400 dark:text-zinc-500">Registered Date:</span>
                        <span className="font-mono text-stone-500 dark:text-zinc-400 text-[10px]">
                          {new Date(selectedOrder.date).toLocaleDateString('en-IN')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Delivery Address */}
                <div className="bg-white/40 dark:bg-neutral-900/30 border border-stone-200/50 dark:border-white/5 p-4 rounded-lg space-y-2 flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-amber-500/80 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-[10px] tracking-wider uppercase text-amber-600 dark:text-amber-500 font-bold font-mono mb-1">Shipping Address</h4>
                    <p className="leading-relaxed font-light text-stone-600 dark:text-stone-300">{selectedOrder.address}</p>
                  </div>
                </div>

                {/* Itemized Spices list */}
                <div>
                  <h4 className="text-[10px] tracking-wider uppercase text-amber-600 dark:text-amber-500 font-bold font-mono mb-3">Itemized Catalog Order</h4>
                  <div className="border border-stone-200 dark:border-white/5 rounded-lg overflow-hidden">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-stone-100 dark:bg-neutral-900/60 border-b border-stone-200 dark:border-white/5 font-mono text-[9px] uppercase tracking-wider text-stone-400 dark:text-zinc-500">
                          <th className="p-3 font-normal">Spice Name</th>
                          <th className="p-3 font-normal text-center">Qty</th>
                          <th className="p-3 font-normal text-right">Price</th>
                          <th className="p-3 font-normal text-right">Subtotal</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedOrder.products.map((p, idx) => (
                          <tr key={idx} className="border-b border-stone-250 dark:border-white/5 font-light">
                            <td className="p-3 font-medium text-stone-900 dark:text-white">{p.name}</td>
                            <td className="p-3 text-center font-mono">{p.quantity}</td>
                            <td className="p-3 text-right font-mono">{formatINR(p.price)}</td>
                            <td className="p-3 text-right font-mono font-medium text-stone-950 dark:text-white">{formatINR(p.price * p.quantity)}</td>
                          </tr>
                        ))}
                        <tr className="bg-stone-100/30 dark:bg-neutral-900/20 font-bold font-serif text-sm">
                          <td colSpan="3" className="p-4 text-right uppercase tracking-wider text-xs font-mono text-stone-400 dark:text-zinc-500">Total Charged</td>
                          <td className="p-4 text-right text-amber-600 dark:text-amber-400 font-mono font-bold">{formatINR(selectedOrder.amount)}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Quick workflow updates in Modal */}
                <div className="flex flex-wrap items-center justify-end gap-2 pt-4 border-t border-stone-200 dark:border-white/5">
                  <span className="text-[10px] text-stone-400 dark:text-zinc-500 uppercase tracking-widest font-mono mr-2">Quick Action Flow:</span>
                  
                  {selectedOrder.orderStatus === 'Pending' && (
                    <button
                      onClick={() => handleStatusChange(selectedOrder.id, 'Confirmed')}
                      className="px-4 py-2 text-xs font-semibold bg-amber-500 hover:bg-amber-600 text-black transition-colors cursor-pointer focus:outline-none"
                    >
                      Confirm Order
                    </button>
                  )}
                  {selectedOrder.orderStatus === 'Confirmed' && (
                    <button
                      onClick={() => handleStatusChange(selectedOrder.id, 'Shipped')}
                      className="px-4 py-2 text-xs font-semibold bg-blue-500 hover:bg-blue-600 text-white transition-colors cursor-pointer focus:outline-none"
                    >
                      Ship Package
                    </button>
                  )}
                  {selectedOrder.orderStatus === 'Shipped' && (
                    <button
                      onClick={() => handleStatusChange(selectedOrder.id, 'Delivered')}
                      className="px-4 py-2 text-xs font-semibold bg-emerald-500 hover:bg-emerald-600 text-white transition-colors cursor-pointer focus:outline-none"
                    >
                      Deliver Package
                    </button>
                  )}
                  {selectedOrder.orderStatus !== 'Delivered' && selectedOrder.orderStatus !== 'Cancelled' && (
                    <button
                      onClick={() => handleStatusChange(selectedOrder.id, 'Cancelled')}
                      className="px-4 py-2 text-xs font-semibold bg-red-600 hover:bg-red-750 text-white transition-colors cursor-pointer focus:outline-none"
                    >
                      Cancel Order
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OrdersView;
