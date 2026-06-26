import { useState, useMemo } from 'react';
import { 
  Search, 
  UserCheck, 
  Sparkles, 
  TrendingUp, 
  ArrowUpDown,
  Mail,
  Phone
} from 'lucide-react';

const CustomersView = ({ customers }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSegment, setFilterSegment] = useState('All'); // All, High Spenders (>5k), Repeat Buyers (>=3 orders)
  const [sortBy, setSortBy] = useState('spending-desc'); // spending-desc, orders-desc, name-asc, joined-desc

  // Calculate quick stats
  const stats = useMemo(() => {
    const total = customers.length;
    const totalSpent = customers.reduce((sum, c) => sum + c.totalSpending, 0);
    const avgSpent = total > 0 ? totalSpent / total : 0;
    const topSpenderObj = [...customers].sort((a,b) => b.totalSpending - a.totalSpending)[0];
    
    return {
      total,
      avgSpent,
      topSpender: topSpenderObj ? topSpenderObj.name : 'N/A'
    };
  }, [customers]);

  // Filtering & Sorting
  const filteredCustomers = useMemo(() => {
    let result = [...customers];

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(c => 
        c.name.toLowerCase().includes(q) || 
        c.email.toLowerCase().includes(q) || 
        c.phone.includes(q)
      );
    }

    // Segment Filter
    if (filterSegment === 'High Spenders') {
      result = result.filter(c => c.totalSpending > 5000);
    } else if (filterSegment === 'Repeat Buyers') {
      result = result.filter(c => c.totalOrders >= 3);
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === 'spending-desc') return b.totalSpending - a.totalSpending;
      if (sortBy === 'orders-desc') return b.totalOrders - a.totalOrders;
      if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
      if (sortBy === 'joined-desc') return new Date(b.joinedDate) - new Date(a.joinedDate);
      return 0;
    });

    return result;
  }, [customers, searchQuery, filterSegment, sortBy]);

  // Helper formats
  const formatINR = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif tracking-wide text-stone-900 dark:text-white">Client Portfolio</h1>
          <p className="text-xs tracking-wider uppercase text-stone-500 dark:text-amber-500/70 font-mono mt-1">
            Analyze client accounts, lifetime values, and engagement indices
          </p>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {/* Total Customers */}
        <div className="bg-white/60 dark:bg-neutral-900/40 backdrop-blur-md border border-stone-200/60 dark:border-white/5 p-5 shadow-sm rounded-xl flex items-center gap-4">
          <div className="p-3 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-lg">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-stone-400 dark:text-zinc-500 uppercase tracking-widest font-mono">Registered Spicers</span>
            <h3 className="text-xl font-serif font-bold text-stone-950 dark:text-white mt-0.5">{stats.total} accounts</h3>
          </div>
        </div>

        {/* Average LTV */}
        <div className="bg-white/60 dark:bg-neutral-900/40 backdrop-blur-md border border-stone-200/60 dark:border-white/5 p-5 shadow-sm rounded-xl flex items-center gap-4">
          <div className="p-3 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-lg">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-stone-400 dark:text-zinc-500 uppercase tracking-widest font-mono">Average LTV</span>
            <h3 className="text-xl font-serif font-bold text-stone-950 dark:text-white mt-0.5">{formatINR(stats.avgSpent)}</h3>
          </div>
        </div>

        {/* Top Spender */}
        <div className="bg-white/60 dark:bg-neutral-900/40 backdrop-blur-md border border-stone-200/60 dark:border-white/5 p-5 shadow-sm rounded-xl flex items-center gap-4">
          <div className="p-3 bg-orange-500/10 text-orange-500 border border-orange-500/20 rounded-lg">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-stone-400 dark:text-zinc-500 uppercase tracking-widest font-mono">Valued Patron</span>
            <h3 className="text-xl font-serif font-bold text-stone-950 dark:text-white mt-0.5 truncate max-w-[180px]">{stats.topSpender}</h3>
          </div>
        </div>
      </div>

      {/* Filters Card */}
      <div className="bg-white/60 dark:bg-neutral-900/40 backdrop-blur-md border border-stone-200/60 dark:border-white/5 p-4 rounded-xl shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search Box */}
          <div className="relative flex-grow">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-stone-400 dark:text-zinc-500" />
            <input
              type="text"
              placeholder="Search by client name, email address, phone..."
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
              <option value="spending-desc">Sort: Total Spent (High-Low)</option>
              <option value="orders-desc">Sort: Total Orders (High-Low)</option>
              <option value="name-asc">Sort: Name (A-Z)</option>
              <option value="joined-desc">Sort: Joined Date (Newest)</option>
            </select>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-6 pt-3 border-t border-stone-200/50 dark:border-white/5">
          <div className="flex items-center gap-2 text-stone-400 dark:text-zinc-500 text-[10px] uppercase font-mono tracking-widest">
            <ArrowUpDown className="w-3.5 h-3.5" />
            Segment Classification:
          </div>

          <div className="flex flex-wrap gap-1.5 items-center">
            {['All', 'High Spenders', 'Repeat Buyers'].map((seg) => (
              <button
                key={seg}
                onClick={() => setFilterSegment(seg)}
                className={`px-3 py-1 rounded-full text-[10px] font-mono tracking-wider border transition-all cursor-pointer ${
                  filterSegment === seg
                    ? 'bg-amber-500 border-amber-500 text-black font-semibold'
                    : 'bg-stone-50 dark:bg-neutral-950 border-stone-200 dark:border-white/5 text-stone-600 dark:text-zinc-400 hover:border-stone-300 dark:hover:border-zinc-700'
                }`}
              >
                {seg === 'High Spenders' ? 'Imperial Spenders (> ₹5,000)' : seg === 'Repeat Buyers' ? 'Frequent Patrons (3+ Orders)' : 'All Accounts'}
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
                <th className="p-4 font-normal">Patron Profile</th>
                <th className="p-4 font-normal">Registered Coordinates</th>
                <th className="p-4 font-normal text-center">Spicers Segment</th>
                <th className="p-4 font-normal text-center">Total Orders</th>
                <th className="p-4 font-normal text-right">Lifetime Expenditure</th>
                <th className="p-4 font-normal text-right">Account Joined</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((c) => (
                  <tr 
                    key={c.id}
                    className="border-b border-stone-200/60 dark:border-white/5 text-stone-700 dark:text-stone-300 hover:bg-stone-50/50 dark:hover:bg-neutral-850/10 transition-colors"
                  >
                    {/* Avatar & Name */}
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center font-serif text-xs font-bold border flex-shrink-0 ${c.avatarColor}`}>
                          {getInitials(c.name)}
                        </div>
                        <div className="font-semibold text-stone-900 dark:text-white">
                          {c.name}
                        </div>
                      </div>
                    </td>

                    {/* Contact info */}
                    <td className="p-4">
                      <div className="flex items-center gap-1.5 text-stone-600 dark:text-zinc-300">
                        <Mail className="w-3.5 h-3.5 text-stone-400" />
                        <span>{c.email}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-stone-400 dark:text-zinc-500 tracking-wide font-mono text-[10px] mt-1">
                        <Phone className="w-3.5 h-3.5 text-stone-400" />
                        <span>{c.phone}</span>
                      </div>
                    </td>

                    {/* Segment tags */}
                    <td className="p-4 text-center">
                      {c.totalSpending > 10000 ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[9px] font-mono font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/20 uppercase tracking-widest">
                          Imperial VIP
                        </span>
                      ) : c.totalOrders >= 3 ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[9px] font-mono font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 uppercase tracking-widest">
                          Frequent Patron
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full text-[9px] font-mono font-bold bg-stone-100 dark:bg-neutral-950 text-stone-500 dark:text-zinc-500 border border-stone-200 dark:border-white/5 uppercase tracking-widest">
                          Active Client
                        </span>
                      )}
                    </td>

                    {/* Orders count */}
                    <td className="p-4 text-center font-mono font-medium">
                      {c.totalOrders} items
                    </td>

                    {/* Spending LTV */}
                    <td className="p-4 text-right font-mono font-bold text-amber-600 dark:text-amber-400">
                      {formatINR(c.totalSpending)}
                    </td>

                    {/* Account Date */}
                    <td className="p-4 text-right font-mono text-[10px] text-stone-400 dark:text-zinc-500">
                      {new Date(c.joinedDate).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-stone-400 dark:text-zinc-500 font-mono text-xs">
                    No client profiles matches current filters.
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

export default CustomersView;
