import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  BarChart,
  Bar,
  Cell,
  LineChart,
  Line
} from 'recharts';
import { 
  BarChart3, 
  PieChart as PieIcon, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  ShoppingBag,
  Percent,
  Sparkles
} from 'lucide-react';
import { salesHistory } from './mockData';

const AnalyticsView = ({ orders, products, customers }) => {

  // Calculate metrics based on live state data
  const totalRevenue = useMemo(() => {
    return orders
      .filter(o => o.orderStatus !== 'Cancelled' && o.paymentStatus === 'Paid')
      .reduce((sum, o) => sum + o.amount, 0);
  }, [orders]);

  const activeOrdersCount = useMemo(() => {
    return orders.filter(o => o.orderStatus !== 'Cancelled').length;
  }, [orders]);

  const averageOrderValue = useMemo(() => {
    return activeOrdersCount > 0 ? totalRevenue / activeOrdersCount : 0;
  }, [totalRevenue, activeOrdersCount]);

  // Aggregate products sold data for vertical bar chart
  const productsComparisonData = useMemo(() => {
    const counts = {};
    orders.forEach(order => {
      if (order.orderStatus !== 'Cancelled') {
        order.products.forEach(p => {
          counts[p.name] = (counts[p.name] || 0) + p.quantity;
        });
      }
    });

    return Object.entries(counts)
      .map(([name, qty]) => ({ name, qty }))
      .sort((a, b) => b.qty - a.qty)
      .slice(0, 5);
  }, [orders]);

  // Format currencies
  const formatINR = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  // Metrics array
  const keyMetrics = [
    {
      title: 'Average Order Value (AOV)',
      value: formatINR(averageOrderValue),
      subtext: 'Optimal cart value ratio',
      icon: ShoppingBag,
      color: 'text-amber-500 bg-amber-500/10'
    },
    {
      title: 'Gross Margin',
      value: '68.5%',
      subtext: 'Spice sourcing markup',
      icon: Percent,
      color: 'text-emerald-500 bg-emerald-500/10'
    },
    {
      title: 'Checkout Conversion',
      value: '3.42%',
      subtext: 'Visitor to order ratio',
      icon: TrendingUp,
      color: 'text-blue-500 bg-blue-500/10'
    },
    {
      title: 'Customer Acq. Cost',
      value: '₹140',
      subtext: 'Direct digital attribution',
      icon: Users,
      color: 'text-stone-500 bg-stone-500/10'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif tracking-wide text-stone-900 dark:text-white">Business Intelligence</h1>
          <p className="text-xs tracking-wider uppercase text-stone-500 dark:text-amber-500/70 font-mono mt-1">
            Aggregate reports, sales funnels, and product popularity graphs
          </p>
        </div>
      </div>

      {/* Top metrics grids */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {keyMetrics.map((m, index) => (
          <motion.div
            key={m.title}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white/60 dark:bg-neutral-900/40 backdrop-blur-md border border-stone-200/60 dark:border-white/5 p-5 shadow-sm rounded-xl flex items-center gap-4"
          >
            <div className={`p-3 rounded-lg border border-transparent ${m.color}`}>
              <m.icon className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-stone-400 dark:text-zinc-550 uppercase tracking-widest font-mono">{m.title}</span>
              <h3 className="text-lg font-serif font-bold text-stone-900 dark:text-white mt-0.5">{m.value}</h3>
              <p className="text-[9px] text-stone-400 dark:text-zinc-500 font-light mt-0.5">{m.subtext}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Row 1 Charts: Revenue curve vs Monthly sales bar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Growth Curve */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/60 dark:bg-neutral-900/40 backdrop-blur-md border border-stone-200/60 dark:border-white/5 p-6 shadow-sm rounded-xl"
        >
          <div className="mb-4">
            <h3 className="text-base font-serif text-stone-950 dark:text-stone-100">Cumulative Revenue Expansion</h3>
            <p className="text-[9px] text-stone-400 dark:text-zinc-500 uppercase tracking-widest font-mono">Monthly Revenue Curve (H1 2026)</p>
          </div>

          <div className="h-[250px] w-full text-xs font-mono">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesHistory} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenueVal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D97706" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#D97706" stopOpacity={0.01}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(128,128,128,0.1)" />
                <XAxis dataKey="month" stroke="#888888" tickLine={false} />
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
                <Area type="monotone" dataKey="revenue" stroke="#D97706" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenueVal)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Monthly Sales Volume */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-white/60 dark:bg-neutral-900/40 backdrop-blur-md border border-stone-200/60 dark:border-white/5 p-6 shadow-sm rounded-xl"
        >
          <div className="mb-4">
            <h3 className="text-base font-serif text-stone-950 dark:text-stone-100">Order Quantity Dynamics</h3>
            <p className="text-[9px] text-stone-400 dark:text-zinc-500 uppercase tracking-widest font-mono">Monthly order counts (H1 2026)</p>
          </div>

          <div className="h-[250px] w-full text-xs font-mono">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(128,128,128,0.1)" />
                <XAxis dataKey="month" stroke="#888888" tickLine={false} />
                <YAxis stroke="#888888" tickLine={false} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(22, 22, 22, 0.95)', 
                    borderColor: 'rgba(255,255,255,0.1)', 
                    color: '#fff',
                    borderRadius: '8px',
                    fontFamily: 'monospace' 
                  }}
                  formatter={(value) => [value, 'Sales count']}
                />
                <Bar dataKey="sales" fill="#F59E0B" radius={[4, 4, 0, 0]}>
                  {salesHistory.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={index === salesHistory.length - 1 ? '#D97706' : '#F59E0B'} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Row 2 Charts: Best selling horizontal bar vs customer growth line */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Best Selling Products */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/60 dark:bg-neutral-900/40 backdrop-blur-md border border-stone-200/60 dark:border-white/5 p-6 shadow-sm rounded-xl"
        >
          <div className="mb-4">
            <h3 className="text-base font-serif text-stone-950 dark:text-stone-100">Bestselling Spice Reserves</h3>
            <p className="text-[9px] text-stone-400 dark:text-zinc-500 uppercase tracking-widest font-mono">Top product volumes sold</p>
          </div>

          <div className="h-[250px] w-full text-xs font-mono">
            {productsComparisonData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={productsComparisonData}
                  layout="vertical"
                  margin={{ top: 10, right: 10, left: 30, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(128,128,128,0.1)" horizontal={false} />
                  <XAxis type="number" stroke="#888888" tickLine={false} />
                  <YAxis dataKey="name" type="category" stroke="#888888" tickLine={false} width={80} style={{ fontSize: '9px' }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(22, 22, 22, 0.95)', 
                      borderColor: 'rgba(255,255,255,0.1)', 
                      color: '#fff',
                      borderRadius: '8px',
                      fontFamily: 'monospace' 
                    }}
                    formatter={(value) => [value, 'Units Sold']}
                  />
                  <Bar dataKey="qty" fill="#F59E0B" radius={[0, 4, 4, 0]}>
                    {productsComparisonData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={index === 0 ? '#B45309' : index === 1 ? '#D97706' : '#F59E0B'} 
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-zinc-500 font-mono text-[10px]">No sales recorded database.</div>
            )}
          </div>
        </motion.div>

        {/* Customer Growth Line Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="bg-white/60 dark:bg-neutral-900/40 backdrop-blur-md border border-stone-200/60 dark:border-white/5 p-6 shadow-sm rounded-xl"
        >
          <div className="mb-4">
            <h3 className="text-base font-serif text-stone-950 dark:text-stone-100">Patron Acquisition Curve</h3>
            <p className="text-[9px] text-stone-400 dark:text-zinc-500 uppercase tracking-widest font-mono">Registered spice accounts expansion</p>
          </div>

          <div className="h-[250px] w-full text-xs font-mono">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesHistory} margin={{ top: 10, right: 15, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(128,128,128,0.1)" />
                <XAxis dataKey="month" stroke="#888888" tickLine={false} />
                <YAxis stroke="#888888" tickLine={false} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(22, 22, 22, 0.95)', 
                    borderColor: 'rgba(255,255,255,0.1)', 
                    color: '#fff',
                    borderRadius: '8px',
                    fontFamily: 'monospace' 
                  }}
                  formatter={(value) => [value, 'Total clients']}
                />
                <Legend style={{ fontSize: '10px' }} />
                <Line 
                  type="monotone" 
                  dataKey="customers" 
                  name="Clients Database"
                  stroke="#F59E0B" 
                  strokeWidth={2.5} 
                  activeDot={{ r: 6 }} 
                  dot={{ strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AnalyticsView;
