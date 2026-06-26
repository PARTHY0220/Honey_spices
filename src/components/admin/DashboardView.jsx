import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { 
  ShoppingBag, 
  DollarSign, 
  Package, 
  Users, 
  Clock, 
  TrendingUp, 
  Star 
} from 'lucide-react';
import { weeklySales } from './mockData';

const DashboardView = ({ orders, products, customers, setViewTab }) => {
  
  // Calculate Dashboard Metrics reactively from parent state
  const totalRevenue = useMemo(() => {
    return orders
      .filter(o => o.orderStatus !== 'Cancelled' && o.paymentStatus === 'Paid')
      .reduce((sum, o) => sum + o.amount, 0);
  }, [orders]);

  const pendingOrdersCount = useMemo(() => {
    return orders.filter(o => o.orderStatus === 'Pending').length;
  }, [orders]);

  const totalOrdersCount = orders.length;
  const totalProductsCount = products.length;
  const totalCustomersCount = customers.length;

  // Recent 5 Orders
  const recentOrders = useMemo(() => {
    return [...orders]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);
  }, [orders]);

  // Pie chart status distribution data
  const pieData = useMemo(() => {
    const counts = orders.reduce((acc, o) => {
      acc[o.orderStatus] = (acc[o.orderStatus] || 0) + 1;
      return acc;
    }, {});
    
    return [
      { name: 'Delivered', value: counts['Delivered'] || 0, color: '#10B981' }, // emerald
      { name: 'Shipped', value: counts['Shipped'] || 0, color: '#3B82F6' },    // blue
      { name: 'Confirmed', value: counts['Confirmed'] || 0, color: '#F59E0B' },  // amber
      { name: 'Pending', value: counts['Pending'] || 0, color: '#EAB308' },    // yellow
      { name: 'Cancelled', value: counts['Cancelled'] || 0, color: '#EF4444' }   // red
    ].filter(d => d.value > 0);
  }, [orders]);

  // Top Selling Products calculation
  const topProducts = useMemo(() => {
    const salesMap = {};
    orders.forEach(order => {
      if (order.orderStatus !== 'Cancelled') {
        order.products.forEach(p => {
          salesMap[p.id] = (salesMap[p.id] || 0) + p.quantity;
        });
      }
    });

    return products
      .map(p => ({
        ...p,
        unitsSold: salesMap[p.id] || 0,
        totalSalesVal: (salesMap[p.id] || 0) * p.priceNum
      }))
      .sort((a, b) => b.unitsSold - a.unitsSold)
      .slice(0, 4);
  }, [orders, products]);

  // Format currencies
  const formatINR = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  // Status badges classes
  const getStatusBadge = (status) => {
    const base = "px-2 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider inline-block ";
    switch (status) {
      case 'Delivered': return base + "bg-emerald-500/10 text-emerald-500 border border-emerald-500/25";
      case 'Shipped': return base + "bg-blue-500/10 text-blue-500 border border-blue-500/25";
      case 'Confirmed': return base + "bg-amber-500/10 text-amber-500 border border-amber-500/25";
      case 'Pending': return base + "bg-yellow-500/10 text-yellow-500 border border-yellow-500/25 animate-pulse";
      case 'Cancelled': return base + "bg-red-500/10 text-red-500 border border-red-500/25";
      default: return base + "bg-stone-500/10 text-stone-500 border border-stone-500/25";
    }
  };

  // Metric Cards Data
  const stats = [
    {
      title: 'Total Revenue',
      value: formatINR(totalRevenue),
      change: '+14.2% vs last month',
      isPositive: true,
      icon: DollarSign,
      colorClass: 'text-amber-500 bg-amber-500/10 border-amber-500/20'
    },
    {
      title: 'Total Orders',
      value: totalOrdersCount,
      change: '+8.6% vs last month',
      isPositive: true,
      icon: ShoppingBag,
      colorClass: 'text-orange-500 bg-orange-500/10 border-orange-500/20'
    },
    {
      title: 'Total Products',
      value: totalProductsCount,
      change: 'Active catalog',
      isPositive: true,
      icon: Package,
      colorClass: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20'
    },
    {
      title: 'Total Customers',
      value: totalCustomersCount,
      change: '+22 new clients',
      isPositive: true,
      icon: Users,
      colorClass: 'text-stone-500 bg-stone-500/10 border-stone-500/20'
    },
    {
      title: 'Pending Orders',
      value: pendingOrdersCount,
      change: 'Requires confirmation',
      isPositive: pendingOrdersCount === 0,
      icon: Clock,
      colorClass: pendingOrdersCount > 0 
        ? 'text-yellow-600 bg-yellow-500/10 border-yellow-500/30' 
        : 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Page Title Header */}
      <div>
        <h1 className="text-3xl font-serif tracking-wide text-stone-900 dark:text-white">Curator Workspace</h1>
        <p className="text-xs tracking-wider uppercase text-stone-500 dark:text-amber-500/70 font-mono mt-1">
          L'Épice Store Command • Live Overview
        </p>
      </div>

      {/* Grid of 5 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
        {stats.map((s, idx) => (
          <motion.div
            key={s.title}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="bg-white/60 dark:bg-neutral-900/40 backdrop-blur-md border border-stone-200/60 dark:border-white/5 p-5 shadow-sm rounded-xl relative overflow-hidden flex flex-col justify-between"
          >
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs text-stone-400 dark:text-zinc-500 tracking-wide font-light">
                  {s.title}
                </span>
                <h3 className="text-xl font-serif text-stone-900 dark:text-stone-100 font-bold mt-1">
                  {s.value}
                </h3>
              </div>
              <div className={`p-2.5 rounded-lg border ${s.colorClass}`}>
                <s.icon className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-1">
              <span className={`text-[10px] font-mono tracking-wide ${
                s.isPositive ? 'text-emerald-500' : 'text-amber-600 dark:text-amber-400'
              }`}>
                {s.change}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales & Revenue Trend Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="lg:col-span-2 bg-white/60 dark:bg-neutral-900/40 backdrop-blur-md border border-stone-200/60 dark:border-white/5 p-6 shadow-sm rounded-xl"
        >
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-serif text-stone-950 dark:text-stone-100">Weekly Revenue Flow</h3>
              <p className="text-[10px] text-stone-400 dark:text-zinc-500 uppercase tracking-widest font-mono">Daily Sales Performance</p>
            </div>
            <div className="flex items-center gap-2 text-[10px] uppercase font-mono tracking-wider text-amber-600 dark:text-amber-400 bg-amber-500/10 px-3 py-1 border border-amber-500/20 rounded-full">
              <TrendingUp className="w-3.5 h-3.5" />
              Live Sales Ledger
            </div>
          </div>
          <div className="h-[300px] w-full text-xs font-mono">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklySales} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.01}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(128,128,128,0.1)" />
                <XAxis dataKey="day" stroke="#888888" tickLine={false} />
                <YAxis stroke="#888888" tickLine={false} tickFormatter={(val) => `₹${val/1000}k`} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(22, 22, 22, 0.95)', 
                    borderColor: 'rgba(255,255,255,0.1)', 
                    color: '#fff',
                    borderRadius: '8px',
                    fontFamily: 'monospace' 
                  }}
                  formatter={(value) => [`₹${value}`, 'Revenue']}
                />
                <Area type="monotone" dataKey="revenue" stroke="#F59E0B" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Order Status Distribution Pie Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/60 dark:bg-neutral-900/40 backdrop-blur-md border border-stone-200/60 dark:border-white/5 p-6 shadow-sm rounded-xl flex flex-col justify-between"
        >
          <div>
            <h3 className="text-lg font-serif text-stone-950 dark:text-stone-100">Order Dispersal</h3>
            <p className="text-[10px] text-stone-400 dark:text-zinc-500 uppercase tracking-widest font-mono mb-4">Status Distributions</p>
          </div>
          
          <div className="h-[200px] w-full relative flex items-center justify-center">
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ 
                      backgroundColor: 'rgba(22, 22, 22, 0.95)', 
                      borderColor: 'rgba(255,255,255,0.1)', 
                      color: '#fff',
                      borderRadius: '8px',
                      fontFamily: 'monospace' 
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-zinc-500 font-mono text-[11px]">No orders database registered</div>
            )}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-serif font-bold text-stone-900 dark:text-white">{orders.length}</span>
              <span className="text-[9px] uppercase tracking-wider text-zinc-500">Total Ledgers</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-4 text-[10px] font-mono">
            {pieData.map((d) => (
              <div key={d.name} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }}></span>
                <span className="text-stone-600 dark:text-zinc-400 font-light">{d.name} ({d.value})</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Recent Orders & Top Selling Products */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="lg:col-span-2 bg-white/60 dark:bg-neutral-900/40 backdrop-blur-md border border-stone-200/60 dark:border-white/5 p-6 shadow-sm rounded-xl"
        >
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-serif text-stone-950 dark:text-stone-100">Recent Transactions</h3>
              <p className="text-[10px] text-stone-400 dark:text-zinc-500 uppercase tracking-widest font-mono">L'Épice checkout ledger</p>
            </div>
            <button 
              onClick={() => setViewTab('orders')}
              className="text-[10px] uppercase font-mono tracking-widest text-amber-600 dark:text-amber-400 hover:underline cursor-pointer focus:outline-none"
            >
              Manage Ledgers →
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-stone-200 dark:border-white/5 text-[10px] tracking-wider uppercase text-stone-400 dark:text-zinc-500 font-mono pb-3">
                  <th className="py-3 font-normal">Order ID</th>
                  <th className="py-3 font-normal">Customer</th>
                  <th className="py-3 font-normal text-right">Amount</th>
                  <th className="py-3 font-normal text-center">Status</th>
                  <th className="py-3 font-normal text-right">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((o) => (
                  <tr 
                    key={o.id}
                    className="border-b border-stone-100 dark:border-white/5 text-stone-700 dark:text-stone-300 hover:bg-stone-50/50 dark:hover:bg-neutral-850/20 transition-colors"
                  >
                    <td className="py-3.5 font-mono font-medium text-stone-950 dark:text-white">{o.id}</td>
                    <td className="py-3.5 font-light">{o.customerName}</td>
                    <td className="py-3.5 text-right font-medium text-amber-600 dark:text-amber-400">{formatINR(o.amount)}</td>
                    <td className="py-3.5 text-center">
                      <span className={getStatusBadge(o.orderStatus)}>
                        {o.orderStatus}
                      </span>
                    </td>
                    <td className="py-3.5 text-right font-mono text-[10px] text-stone-400 dark:text-zinc-500">
                      {new Date(o.date).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short'
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Top Selling Products */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/60 dark:bg-neutral-900/40 backdrop-blur-md border border-stone-200/60 dark:border-white/5 p-6 shadow-sm rounded-xl flex flex-col justify-between"
        >
          <div>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-serif text-stone-950 dark:text-stone-100">Top Sellers</h3>
                <p className="text-[10px] text-stone-400 dark:text-zinc-500 uppercase tracking-widest font-mono">Popular reserves</p>
              </div>
              <button 
                onClick={() => setViewTab('products')}
                className="text-[10px] uppercase font-mono tracking-widest text-amber-600 dark:text-amber-400 hover:underline cursor-pointer focus:outline-none"
              >
                Catalog
              </button>
            </div>

            <div className="space-y-4">
              {topProducts.map((p) => (
                <div key={p.id} className="flex items-center gap-3 group">
                  <div className="w-10 h-10 rounded-lg overflow-hidden border border-stone-200 dark:border-white/5 bg-neutral-900 flex-shrink-0">
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  </div>
                  <div className="flex-grow min-w-0">
                    <h4 className="text-xs font-serif font-medium text-stone-900 dark:text-white truncate">{p.name}</h4>
                    <span className="text-[9px] tracking-wider uppercase text-amber-600 dark:text-amber-500/70 font-mono">{p.category}</span>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="text-xs font-mono font-medium block text-stone-950 dark:text-white">{p.unitsSold} sold</span>
                    <span className="text-[10px] font-light text-stone-400 dark:text-zinc-500 font-mono">{formatINR(p.totalSalesVal)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-stone-200 dark:border-white/5 pt-4 mt-6 flex justify-between items-center text-[10px] uppercase font-mono text-zinc-500">
            <span>Premium Cured Grade</span>
            <span className="flex items-center gap-0.5 text-amber-500 font-bold">
              <Star className="w-3 h-3 fill-amber-500" />
              100% Organique
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardView;
