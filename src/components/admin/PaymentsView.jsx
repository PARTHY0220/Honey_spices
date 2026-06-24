import React, { useState, useMemo } from 'react';
import { 
  Search, 
  CreditCard, 
  DollarSign, 
  AlertTriangle,
  ArrowUpDown,
  Filter
} from 'lucide-react';

const PaymentsView = ({ payments }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [methodFilter, setMethodFilter] = useState('All');
  const [sortBy, setSortBy] = useState('newest'); // newest, oldest, amount-desc, amount-asc

  // Calculations
  const stats = useMemo(() => {
    let captured = 0;
    let pending = 0;
    let failed = 0;

    payments.forEach(p => {
      if (p.status === 'Success') captured += p.amount;
      else if (p.status === 'Pending') pending += p.amount;
      else if (p.status === 'Failed') failed += p.amount;
    });

    return { captured, pending, failed };
  }, [payments]);

  // Filtering & Sorting
  const filteredPayments = useMemo(() => {
    let result = [...payments];

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.id.toLowerCase().includes(q) || 
        p.customerName.toLowerCase().includes(q) || 
        p.orderId.toLowerCase().includes(q)
      );
    }

    // Status
    if (statusFilter !== 'All') {
      result = result.filter(p => p.status === statusFilter);
    }

    // Method
    if (methodFilter !== 'All') {
      result = result.filter(p => p.method === methodFilter);
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.date) - new Date(a.date);
      if (sortBy === 'oldest') return new Date(a.date) - new Date(b.date);
      if (sortBy === 'amount-desc') return b.amount - a.amount;
      if (sortBy === 'amount-asc') return a.amount - b.amount;
      return 0;
    });

    return result;
  }, [payments, searchQuery, statusFilter, methodFilter, sortBy]);

  // INR format helper
  const formatINR = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  // Status Badge styles helper
  const getStatusBadge = (status) => {
    const base = "px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider inline-block ";
    switch (status) {
      case 'Success': return base + "bg-emerald-500/10 text-emerald-500 border border-emerald-500/25";
      case 'Pending': return base + "bg-yellow-500/10 text-yellow-500 border border-yellow-500/25 animate-pulse";
      case 'Failed': return base + "bg-red-500/10 text-red-500 border border-red-500/25";
      default: return base + "bg-stone-500/10 text-stone-500 border border-stone-500/25";
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif tracking-wide text-stone-900 dark:text-white">Transaction Logs</h1>
          <p className="text-xs tracking-wider uppercase text-stone-500 dark:text-amber-500/70 font-mono mt-1">
            Audit payment clearing databases and transaction gateways
          </p>
        </div>
      </div>

      {/* Summary Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {/* Total Paid */}
        <div className="bg-white/60 dark:bg-neutral-900/40 backdrop-blur-md border border-stone-200/60 dark:border-white/5 p-5 shadow-sm rounded-xl flex items-center gap-4">
          <div className="p-3 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-lg">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-stone-400 dark:text-zinc-500 uppercase tracking-widest font-mono">Captured Volume</span>
            <h3 className="text-xl font-serif font-bold text-stone-950 dark:text-white mt-0.5">{formatINR(stats.captured)}</h3>
          </div>
        </div>

        {/* Total Pending */}
        <div className="bg-white/60 dark:bg-neutral-900/40 backdrop-blur-md border border-stone-200/60 dark:border-white/5 p-5 shadow-sm rounded-xl flex items-center gap-4">
          <div className="p-3 bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 rounded-lg">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-stone-400 dark:text-zinc-500 uppercase tracking-widest font-mono">Pending Clearance</span>
            <h3 className="text-xl font-serif font-bold text-stone-950 dark:text-white mt-0.5">{formatINR(stats.pending)}</h3>
          </div>
        </div>

        {/* Failed */}
        <div className="bg-white/60 dark:bg-neutral-900/40 backdrop-blur-md border border-stone-200/60 dark:border-white/5 p-5 shadow-sm rounded-xl flex items-center gap-4">
          <div className="p-3 bg-red-500/10 text-red-500 border border-red-500/20 rounded-lg">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-stone-400 dark:text-zinc-500 uppercase tracking-widest font-mono">Bypassed/Failed</span>
            <h3 className="text-xl font-serif font-bold text-stone-950 dark:text-white mt-0.5">{formatINR(stats.failed)}</h3>
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white/60 dark:bg-neutral-900/40 backdrop-blur-md border border-stone-200/60 dark:border-white/5 p-4 rounded-xl shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search Box */}
          <div className="relative flex-grow">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-stone-400 dark:text-zinc-500" />
            <input
              type="text"
              placeholder="Search by Transaction ID, Client name, Order ID..."
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
              <option value="amount-desc">Sort: Amount (High-Low)</option>
              <option value="amount-asc">Sort: Amount (Low-High)</option>
            </select>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-6 pt-3 border-t border-stone-200/50 dark:border-white/5">
          <div className="flex items-center gap-2 text-stone-400 dark:text-zinc-500 text-[10px] uppercase font-mono tracking-widest">
            <Filter className="w-3.5 h-3.5" />
            Segment Classification:
          </div>

          {/* Status */}
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-stone-400 dark:text-zinc-500 uppercase tracking-widest font-mono">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-2 py-1 bg-stone-50 dark:bg-neutral-950 border border-stone-200 dark:border-white/5 text-[11px] text-stone-700 dark:text-stone-300 rounded focus:outline-none focus:border-amber-500 font-mono cursor-pointer"
            >
              <option value="All">All Transactions</option>
              <option value="Success">Success</option>
              <option value="Pending">Pending</option>
              <option value="Failed">Failed</option>
            </select>
          </div>

          {/* Method */}
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-stone-400 dark:text-zinc-500 uppercase tracking-widest font-mono">Method:</span>
            <select
              value={methodFilter}
              onChange={(e) => setMethodFilter(e.target.value)}
              className="px-2 py-1 bg-stone-50 dark:bg-neutral-950 border border-stone-200 dark:border-white/5 text-[11px] text-stone-700 dark:text-stone-300 rounded focus:outline-none focus:border-amber-500 font-mono cursor-pointer"
            >
              <option value="All">All Methods</option>
              <option value="UPI">UPI</option>
              <option value="Card">Card</option>
              <option value="NetBanking">NetBanking</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white/60 dark:bg-neutral-900/40 backdrop-blur-md border border-stone-200/60 dark:border-white/5 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-stone-200 dark:border-white/5 text-[10px] tracking-wider uppercase text-stone-400 dark:text-zinc-500 font-mono bg-stone-50/50 dark:bg-neutral-900/20">
                <th className="p-4 font-normal">Transaction ID</th>
                <th className="p-4 font-normal">Linked Order</th>
                <th className="p-4 font-normal">Payee Client</th>
                <th className="p-4 font-normal text-center">Settlement Method</th>
                <th className="p-4 font-normal text-right">Captured Amount</th>
                <th className="p-4 font-normal text-center">Gateway Status</th>
                <th className="p-4 font-normal text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.length > 0 ? (
                filteredPayments.map((p) => (
                  <tr 
                    key={p.id}
                    className="border-b border-stone-200/60 dark:border-white/5 text-stone-700 dark:text-stone-300 hover:bg-stone-50/50 dark:hover:bg-neutral-850/10 transition-colors"
                  >
                    {/* Transaction ID */}
                    <td className="p-4 font-mono font-bold text-stone-900 dark:text-white">
                      {p.id}
                    </td>

                    {/* Linked Order */}
                    <td className="p-4 font-mono font-medium text-stone-550 dark:text-zinc-400">
                      {p.orderId}
                    </td>

                    {/* Payee Client */}
                    <td className="p-4 font-semibold text-stone-950 dark:text-stone-200">
                      {p.customerName}
                    </td>

                    {/* Method */}
                    <td className="p-4 text-center">
                      <span className="px-2 py-0.5 rounded bg-stone-100 dark:bg-neutral-950 border border-stone-200 dark:border-white/5 text-[10px] font-mono text-stone-600 dark:text-zinc-400">
                        {p.method}
                      </span>
                    </td>

                    {/* Amount */}
                    <td className="p-4 text-right font-mono font-bold text-amber-600 dark:text-amber-400">
                      {formatINR(p.amount)}
                    </td>

                    {/* Status Badge */}
                    <td className="p-4 text-center">
                      <span className={getStatusBadge(p.status)}>
                        {p.status}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="p-4 text-right font-mono text-[10px] text-stone-400 dark:text-zinc-500">
                      {new Date(p.date).toLocaleString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-stone-400 dark:text-zinc-500 font-mono text-xs">
                    No transactions recorded matching filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PaymentsView;
