import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Filter, 
  AlertTriangle, 
  Image as ImageIcon,
  Sparkles
} from 'lucide-react';

const ProductsView = ({ products, addProduct, editProduct, deleteProduct, addToast }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [stockFilter, setStockFilter] = useState('All'); // All, In Stock, Low Stock, Out of Stock

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null); // Product object when editing
  const [deletingProduct, setDeletingProduct] = useState(null); // Product object when deleting
  const [imageFile, setImageFile] = useState(null);

  // Form Fields
  const [formFields, setFormFields] = useState({
    name: '',
    scientificName: '',
    priceNum: '',
    stock: '',
    category: 'single-origin',
    description: '',
    tag: ''
  });

  const categories = [
    { id: 'single-origin', name: 'Single-Origin' },
    { id: 'blends', name: 'Spice Blends' },
    { id: 'honey-elixirs', name: 'Honey & Elixirs' }
  ];

  // Filtering Logic
  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.scientificName.toLowerCase().includes(q) || 
        p.origin?.toLowerCase().includes(q)
      );
    }

    if (categoryFilter !== 'All') {
      result = result.filter(p => p.category === categoryFilter);
    }

    if (stockFilter !== 'All') {
      result = result.filter(p => {
        if (stockFilter === 'In Stock') return p.stock > 10;
        if (stockFilter === 'Low Stock') return p.stock > 0 && p.stock <= 10;
        if (stockFilter === 'Out of Stock') return p.stock === 0;
        return true;
      });
    }

    return result;
  }, [products, searchQuery, categoryFilter, stockFilter]);

  // Form handlers
  const handleFormInputChange = (e) => {
    const { name, value } = e.target;
    setFormFields(prev => ({ ...prev, [name]: value }));
  };

  const openAddModal = () => {
    setFormFields({
      name: '',
      scientificName: '',
      priceNum: '',
      stock: '',
      category: 'single-origin',
      description: '',
      tag: ''
    });
    setImageFile(null);
    setIsAddModalOpen(true);
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!formFields.name || !formFields.priceNum || formFields.stock === '') {
      addToast('Please fill in required fields', 'error');
      return;
    }

    addProduct(formFields, imageFile);
    setIsAddModalOpen(false);
  };

  const openEditModal = (prod) => {
    setEditingProduct(prod);
    setFormFields({
      name: prod.name,
      scientificName: prod.scientificName,
      priceNum: prod.priceNum,
      stock: prod.stock,
      category: prod.category,
      description: prod.description,
      tag: prod.tag
    });
    setImageFile(null);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!formFields.name || !formFields.priceNum || formFields.stock === '') {
      addToast('Please fill in required fields', 'error');
      return;
    }

    const priceNumVal = parseFloat(formFields.priceNum);
    const stockVal = parseInt(formFields.stock);
    let calculatedStatus = 'In Stock';
    if (stockVal === 0) calculatedStatus = 'Out of Stock';
    else if (stockVal <= 10) calculatedStatus = 'Low Stock';

    const updatedFields = {
      name: formFields.name,
      scientificName: formFields.scientificName,
      price: `₹${new Intl.NumberFormat('en-IN').format(priceNumVal)}`,
      priceNum: priceNumVal,
      stock: stockVal,
      category: formFields.category,
      description: formFields.description,
      tag: formFields.tag,
      image: editingProduct.image, // pass old image URL to update if new file is empty
      status: calculatedStatus
    };

    editProduct(editingProduct.id, updatedFields, imageFile);
    setEditingProduct(null);
  };

  const confirmDelete = (prod) => {
    setDeletingProduct(prod);
  };

  const handleDeleteSubmit = () => {
    deleteProduct(deletingProduct.id);
    addToast(`${deletingProduct.name} removed from catalog`, 'success');
    setDeletingProduct(null);
  };

  // Format INR
  const formatINR = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  // Stock Badge styles helper
  const getStockBadge = (prod) => {
    const base = "px-2 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider inline-block ";
    if (prod.stock === 0) {
      return base + "bg-red-500/10 text-red-500 border border-red-500/25";
    } else if (prod.stock <= 10) {
      return base + "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border border-yellow-500/25 animate-pulse";
    } else {
      return base + "bg-emerald-500/10 text-emerald-500 border border-emerald-500/25";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif tracking-wide text-stone-900 dark:text-white">Vault Inventory</h1>
          <p className="text-xs tracking-wider uppercase text-stone-500 dark:text-amber-500/70 font-mono mt-1">
            Curate products, pricing margins, and stock levels
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-black font-semibold text-xs tracking-wider uppercase transition-colors shadow-[0_4px_14px_rgba(245,158,11,0.25)] rounded-none cursor-pointer focus:outline-none"
        >
          <Plus className="w-4 h-4" />
          Add Spice Reserve
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white/60 dark:bg-neutral-900/40 backdrop-blur-md border border-stone-200/60 dark:border-white/5 p-4 rounded-xl shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search Box */}
          <div className="relative flex-grow">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-stone-400 dark:text-zinc-500" />
            <input
              type="text"
              placeholder="Search spices by name, scientific botanical identifier..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-stone-50 dark:bg-neutral-950 border border-stone-200 dark:border-white/5 text-xs text-stone-900 dark:text-white rounded-lg focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>
        </div>

        {/* Filters Select */}
        <div className="flex flex-wrap items-center gap-6 pt-3 border-t border-stone-200/50 dark:border-white/5">
          <div className="flex items-center gap-2 text-stone-400 dark:text-zinc-500 text-[10px] uppercase font-mono tracking-widest">
            <Filter className="w-3.5 h-3.5" />
            Segment Filters:
          </div>

          {/* Category */}
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-stone-400 dark:text-zinc-500 uppercase tracking-widest font-mono">Category:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-2 py-1 bg-stone-50 dark:bg-neutral-950 border border-stone-200 dark:border-white/5 text-[11px] text-stone-700 dark:text-stone-300 rounded focus:outline-none focus:border-amber-500 font-mono cursor-pointer"
            >
              <option value="All">All Categories</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Stock Availability */}
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-stone-400 dark:text-zinc-500 uppercase tracking-widest font-mono">Inventory Levels:</span>
            <select
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value)}
              className="px-2 py-1 bg-stone-50 dark:bg-neutral-950 border border-stone-200 dark:border-white/5 text-[11px] text-stone-700 dark:text-stone-300 rounded focus:outline-none focus:border-amber-500 font-mono cursor-pointer"
            >
              <option value="All">All Stock Levels</option>
              <option value="In Stock">In Stock (&gt; 10 items)</option>
              <option value="Low Stock">(1 - 10 items)</option>
              <option value="Out of Stock">Out of Stock (0 items)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products Grid/Table */}
      <div className="bg-white/60 dark:bg-neutral-900/40 backdrop-blur-md border border-stone-200/60 dark:border-white/5 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-stone-200 dark:border-white/5 text-[10px] tracking-wider uppercase text-stone-400 dark:text-zinc-500 font-mono bg-stone-50/50 dark:bg-neutral-900/20">
                <th className="p-4 font-normal">Spice Crop Image</th>
                <th className="p-4 font-normal">Botanical Name</th>
                <th className="p-4 font-normal">Origin Segment</th>
                <th className="p-4 font-normal text-right">Unit Price</th>
                <th className="p-4 font-normal text-center">Stock Count</th>
                <th className="p-4 font-normal text-center">Catalog Status</th>
                <th className="p-4 font-normal text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length > 0 ? (
                filteredProducts.map((p) => (
                  <tr 
                    key={p.id}
                    className="border-b border-stone-200/60 dark:border-white/5 text-stone-700 dark:text-stone-300 hover:bg-stone-50/50 dark:hover:bg-neutral-850/10 transition-colors"
                  >
                    {/* Image & Name */}
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg overflow-hidden border border-stone-200 dark:border-white/5 bg-neutral-900 flex-shrink-0 flex items-center justify-center">
                          {p.image ? (
                            <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                          ) : (
                            <ImageIcon className="w-5 h-5 text-stone-500" />
                          )}
                        </div>
                        <div>
                          <span className="text-[10px] tracking-wider font-mono text-amber-600 dark:text-amber-500 uppercase font-semibold">{p.tag}</span>
                          <h4 className="text-xs font-serif font-bold text-stone-900 dark:text-white mt-0.5">{p.name}</h4>
                        </div>
                      </div>
                    </td>

                    {/* Scientific Name */}
                    <td className="p-4 italic font-light text-stone-500 dark:text-zinc-400">
                      {p.scientificName}
                    </td>

                    {/* Category */}
                    <td className="p-4 font-mono text-[10px] uppercase text-stone-600 dark:text-zinc-400">
                      {categories.find(c => c.id === p.category)?.name || p.category}
                    </td>

                    {/* Price */}
                    <td className="p-4 text-right font-mono font-bold text-stone-950 dark:text-white">
                      {formatINR(p.priceNum)}
                    </td>

                    {/* Stock */}
                    <td className="p-4 text-center font-mono font-medium">
                      {p.stock} units
                    </td>

                    {/* Status Badge */}
                    <td className="p-4 text-center">
                      <span className={getStockBadge(p)}>
                        {p.stock === 0 ? 'Out of Stock' : p.stock <= 10 ? 'Low Stock' : 'In Stock'}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="p-4">
                      <div className="flex justify-center items-center gap-2">
                        <button
                          onClick={() => openEditModal(p)}
                          title="Edit Spice Details"
                          className="p-1.5 rounded bg-stone-100 dark:bg-neutral-950 border border-stone-200 dark:border-white/5 text-stone-600 hover:text-amber-500 hover:border-amber-500/30 transition-all cursor-pointer focus:outline-none"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => confirmDelete(p)}
                          title="Remove Spice From Vault"
                          className="p-1.5 rounded bg-red-500/10 border border-red-500/25 text-red-500 hover:bg-red-500 hover:text-white transition-all cursor-pointer focus:outline-none"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-stone-400 dark:text-zinc-500 font-mono text-xs">
                    No spices matching current filters cataloged.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Product Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-stone-50 dark:bg-[#141311] border border-stone-200 dark:border-white/10 w-full max-w-lg shadow-2xl relative overflow-hidden"
            >
              <div className="h-1 bg-gradient-to-r from-amber-500 to-orange-500 w-full" />
              
              <div className="p-6 pb-4 border-b border-stone-200 dark:border-white/5 flex justify-between items-center">
                <h3 className="text-xl font-serif text-stone-900 dark:text-white font-bold flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-500" />
                  Add New Spice Reserve
                </h3>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="text-stone-400 hover:text-amber-500 transition-colors text-lg focus:outline-none"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleAddSubmit} className="p-6 space-y-4 text-xs">
                {/* 2 columns row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-stone-500 dark:text-zinc-400 font-medium">Product Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formFields.name}
                      onChange={handleFormInputChange}
                      placeholder="e.g. Alleppey Gold Turmeric"
                      required
                      className="w-full p-2 bg-white dark:bg-neutral-950 border border-stone-200 dark:border-white/5 text-stone-900 dark:text-white rounded focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-stone-500 dark:text-zinc-400 font-medium">Botanical Identifier</label>
                    <input
                      type="text"
                      name="scientificName"
                      value={formFields.scientificName}
                      onChange={handleFormInputChange}
                      placeholder="e.g. Curcuma longa"
                      className="w-full p-2 bg-white dark:bg-neutral-950 border border-stone-200 dark:border-white/5 text-stone-900 dark:text-white rounded focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-stone-500 dark:text-zinc-400 font-medium">Unit Price (₹) *</label>
                    <input
                      type="number"
                      name="priceNum"
                      value={formFields.priceNum}
                      onChange={handleFormInputChange}
                      placeholder="950"
                      required
                      min="0"
                      className="w-full p-2 bg-white dark:bg-neutral-950 border border-stone-200 dark:border-white/5 text-stone-900 dark:text-white rounded focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-stone-500 dark:text-zinc-400 font-medium">Initial Stock *</label>
                    <input
                      type="number"
                      name="stock"
                      value={formFields.stock}
                      onChange={handleFormInputChange}
                      placeholder="45"
                      required
                      min="0"
                      className="w-full p-2 bg-white dark:bg-neutral-950 border border-stone-200 dark:border-white/5 text-stone-900 dark:text-white rounded focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-stone-500 dark:text-zinc-400 font-medium">Category</label>
                    <select
                      name="category"
                      value={formFields.category}
                      onChange={handleFormInputChange}
                      className="w-full p-2 bg-white dark:bg-neutral-950 border border-stone-200 dark:border-white/5 text-stone-700 dark:text-stone-300 rounded focus:outline-none focus:border-amber-500"
                    >
                      {categories.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-stone-500 dark:text-zinc-400 font-medium">Imperial / Reserve Label Tag</label>
                  <input
                    type="text"
                    name="tag"
                    value={formFields.tag}
                    onChange={handleFormInputChange}
                    placeholder="e.g. Imperial Selection, Ultra-Rare Grade A"
                    className="w-full p-2 bg-white dark:bg-neutral-950 border border-stone-200 dark:border-white/5 text-stone-900 dark:text-white rounded focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-stone-500 dark:text-zinc-400 font-medium">Organic Description</label>
                  <textarea
                    name="description"
                    value={formFields.description}
                    onChange={handleFormInputChange}
                    rows="3"
                    placeholder="Describe crop terroir, harvest profiles, solar drying processes..."
                    className="w-full p-2 bg-white dark:bg-neutral-950 border border-stone-200 dark:border-white/5 text-stone-900 dark:text-white rounded focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-stone-500 dark:text-zinc-400 font-medium">Product Image File</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files[0])}
                    className="w-full p-2 bg-white dark:bg-neutral-950 border border-stone-200 dark:border-white/5 text-stone-900 dark:text-white rounded focus:outline-none focus:border-amber-500 font-mono text-[11px]"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-4 border-t border-stone-200 dark:border-white/5">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2 bg-stone-200 hover:bg-stone-300 dark:bg-neutral-900 dark:hover:bg-neutral-800 text-stone-800 dark:text-stone-200 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-black font-semibold transition-colors cursor-pointer"
                  >
                    Store in Vault
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Product Modal */}
      <AnimatePresence>
        {editingProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-stone-50 dark:bg-[#141311] border border-stone-200 dark:border-white/10 w-full max-w-lg shadow-2xl relative overflow-hidden"
            >
              <div className="h-1 bg-gradient-to-r from-amber-500 to-orange-500 w-full" />
              
              <div className="p-6 pb-4 border-b border-stone-200 dark:border-white/5 flex justify-between items-center">
                <h3 className="text-xl font-serif text-stone-900 dark:text-white font-bold flex items-center gap-2">
                  <Edit className="w-5 h-5 text-amber-500" />
                  Edit {editingProduct.name}
                </h3>
                <button
                  onClick={() => setEditingProduct(null)}
                  className="text-stone-400 hover:text-amber-500 transition-colors text-lg focus:outline-none"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleEditSubmit} className="p-6 space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-stone-500 dark:text-zinc-400 font-medium">Product Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formFields.name}
                      onChange={handleFormInputChange}
                      required
                      className="w-full p-2 bg-white dark:bg-neutral-950 border border-stone-200 dark:border-white/5 text-stone-900 dark:text-white rounded focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-stone-500 dark:text-zinc-400 font-medium">Botanical Identifier</label>
                    <input
                      type="text"
                      name="scientificName"
                      value={formFields.scientificName}
                      onChange={handleFormInputChange}
                      className="w-full p-2 bg-white dark:bg-neutral-950 border border-stone-200 dark:border-white/5 text-stone-900 dark:text-white rounded focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-stone-500 dark:text-zinc-400 font-medium">Unit Price (₹) *</label>
                    <input
                      type="number"
                      name="priceNum"
                      value={formFields.priceNum}
                      onChange={handleFormInputChange}
                      required
                      min="0"
                      className="w-full p-2 bg-white dark:bg-neutral-950 border border-stone-200 dark:border-white/5 text-stone-900 dark:text-white rounded focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-stone-500 dark:text-zinc-400 font-medium">Stock count *</label>
                    <input
                      type="number"
                      name="stock"
                      value={formFields.stock}
                      onChange={handleFormInputChange}
                      required
                      min="0"
                      className="w-full p-2 bg-white dark:bg-neutral-950 border border-stone-200 dark:border-white/5 text-stone-900 dark:text-white rounded focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-stone-500 dark:text-zinc-400 font-medium">Category</label>
                    <select
                      name="category"
                      value={formFields.category}
                      onChange={handleFormInputChange}
                      className="w-full p-2 bg-white dark:bg-neutral-950 border border-stone-200 dark:border-white/5 text-stone-750 dark:text-stone-350 rounded focus:outline-none focus:border-amber-500 font-mono"
                    >
                      {categories.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-stone-500 dark:text-zinc-400 font-medium">Imperial / Reserve Label Tag</label>
                  <input
                    type="text"
                    name="tag"
                    value={formFields.tag}
                    onChange={handleFormInputChange}
                    className="w-full p-2 bg-white dark:bg-neutral-950 border border-stone-200 dark:border-white/5 text-stone-900 dark:text-white rounded focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-stone-500 dark:text-zinc-400 font-medium">Organic Description</label>
                  <textarea
                    name="description"
                    value={formFields.description}
                    onChange={handleFormInputChange}
                    rows="3"
                    className="w-full p-2 bg-white dark:bg-neutral-950 border border-stone-200 dark:border-white/5 text-stone-900 dark:text-white rounded focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-stone-500 dark:text-zinc-400 font-medium">Replace Product Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files[0])}
                    className="w-full p-2 bg-white dark:bg-neutral-950 border border-stone-200 dark:border-white/5 text-stone-900 dark:text-white rounded focus:outline-none focus:border-amber-500 font-mono text-[11px]"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-4 border-t border-stone-200 dark:border-white/5">
                  <button
                    type="button"
                    onClick={() => setEditingProduct(null)}
                    className="px-4 py-2 bg-stone-200 hover:bg-stone-300 dark:bg-neutral-900 dark:hover:bg-neutral-800 text-stone-800 dark:text-stone-200 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-black font-semibold transition-colors cursor-pointer"
                  >
                    Save Modifications
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Product Confirmation Modal */}
      <AnimatePresence>
        {deletingProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-stone-50 dark:bg-[#141311] border border-stone-200 dark:border-white/10 w-full max-w-sm shadow-2xl relative overflow-hidden"
            >
              <div className="h-1 bg-red-500 w-full" />
              
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-3 text-red-500">
                  <AlertTriangle className="w-6 h-6" />
                  <h3 className="text-lg font-serif font-bold text-stone-900 dark:text-white">Delete Spice Crop</h3>
                </div>
                
                <p className="text-stone-600 dark:text-stone-300 font-light">
                  Are you absolutely sure you want to remove <span className="font-bold text-stone-900 dark:text-white">{deletingProduct.name}</span> from the vault inventory? This action is permanent.
                </p>

                <div className="flex justify-end gap-2 pt-4 border-t border-stone-200 dark:border-white/5 text-xs font-mono">
                  <button
                    onClick={() => setDeletingProduct(null)}
                    className="px-4 py-2 bg-stone-200 hover:bg-stone-300 dark:bg-neutral-900 dark:hover:bg-neutral-800 text-stone-850 dark:text-stone-250 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteSubmit}
                    className="px-4 py-2 bg-red-650 hover:bg-red-750 text-white font-semibold transition-colors cursor-pointer"
                  >
                    Delete Forever
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductsView;
