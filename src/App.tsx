import React, { useState, useEffect, useMemo } from 'react';
import { 
  Package, ShoppingCart, Truck, DollarSign, Users, FileText, 
  RotateCcw, ShieldCheck, Activity, Search, Plus, Edit, Trash2, 
  CheckCircle, Clock, AlertTriangle, Eye, Printer, Download, Upload,
  ArrowUpRight, ArrowDownRight, RefreshCw, Lock, UserCheck, Key,
  BarChart2, Filter, ChevronRight, LogOut, FileSpreadsheet, Tag, TrendingUp,
  PieChart, Table, ArrowUpDown, UserPlus, CheckSquare, Square
} from 'lucide-react';

const API_BASE_URL = 'https://tn-backend-j1vg.onrender.com';

const INITIAL_USERS = [
  { id: 'USR-001', username: "admin", password: "admin123", name: "System Admin", role: "Admin", vendorId: "" },
  { id: 'USR-002', username: "staff", password: "staff123", name: "Operations Staff", role: "Staff", vendorId: "" },
  { id: 'USR-003', username: "vendor_a", password: "vendor123", name: "Aung Cosmetic Shop", role: "Vendor", vendorId: "VND-101" },
  { id: 'USR-004', username: "vendor_b", password: "vendor123", name: "Trendy Fashion Hub", role: "Vendor", vendorId: "VND-102" },
];

const INITIAL_VENDORS = [
  { id: 'VND-101', name: 'Aung Cosmetic Shop', phone: '09250001122', address: 'Kamayut, Yangon', bankAccount: 'KBZ Pay: 09250001122 (U Aung)', freeStorageDays: 7, dailyStoreFee: 200 },
  { id: 'VND-102', name: 'Trendy Fashion Hub', phone: '09450003344', address: 'Mandalay', bankAccount: 'AYA Bank: 00123456789 (Daw Mya)', freeStorageDays: 5, dailyStoreFee: 300 },
];

const INITIAL_DELIVERIES = [
  { id: 'DEL-101', name: 'Royal Express', phone: '095000111', address: 'Yangon Main Hub', bankAccount: 'KBZPay: 095000111 (Royal)' },
  { id: 'DEL-102', name: 'Ninja Van', phone: '096000222', address: 'Mandalay Hub', bankAccount: 'KBZPay: 096000222 (Ninja)' },
  { id: 'DEL-103', name: 'Britium Express', phone: '097000333', address: 'Naypyitaw Hub', bankAccount: 'KBZPay: 097000333 (Britium)' },
];

const INITIAL_ITEMS = [
  { id: 'ITM-001', vendorId: 'VND-101', name: 'Matte Lipstick (Red)', category: 'Beauty', price: 12000, cost: 0, quantity: 45, damagedQty: 2, stockInDate: '2026-10-01', sku: 'SKU-VND-A001', handlingFee: 500, storeChargePerDay: 50, freeDays: 7 },
  { id: 'ITM-002', vendorId: 'VND-101', name: 'Hydrating Serum 50ml', category: 'Skincare', price: 28000, cost: 0, quantity: 18, damagedQty: 0, stockInDate: '2026-09-15', sku: 'SKU-VND-A002', handlingFee: 500, storeChargePerDay: 50, freeDays: 7 },
  { id: 'ITM-003', vendorId: 'VND-102', name: 'Oversized Cotton Tee', category: 'Apparel', price: 18000, cost: 0, quantity: 30, damagedQty: 1, stockInDate: '2026-10-10', sku: 'SKU-VND-B001', handlingFee: 600, storeChargePerDay: 60, freeDays: 5 },
];

const INITIAL_ORDERS = [
  { 
    id: 'TN-ORD-8801', 
    vendorId: 'VND-101', 
    customerName: 'Daw Mya Mya', 
    customerPhone: '09790001234', 
    deliveryAddress: 'No. 45, Pyay Road, Mayangone, Yangon', 
    deliveryService: 'Royal Express', 
    trackingNo: 'REX-998234', 
    status: 'Delivered', 
    cancelled: false,
    items: [{ itemId: 'ITM-001', name: 'Matte Lipstick (Red)', qty: 2, price: 12000, discount: 1000, status: 'Delivered' }],
    itemTotal: 23000,
    deliveryFee: 0,
    totalCod: 23000,
    tnHandlingFee: 500,
    tnStoreFee: 0,
    codCollected: true,
    settlementStatus: 'Settled',
    createdAt: '2026-10-18 10:30 AM',
    updatedBy: 'Staff_Aung'
  }
];

const INITIAL_RETURNS = [
  { id: 'RET-001', orderId: 'TN-ORD-8800', vendorId: 'VND-101', itemName: 'Hydrating Serum', qty: 1, type: 'Delivery Return', reason: 'Customer Refused', status: 'In Warehouse', date: '2026-10-19' }
];

const INITIAL_LOGS = [
  { id: 'LOG-101', user: 'Admin_TN', role: 'Admin', action: 'System Initialization', timestamp: '2026-10-22 09:00 AM' }
];

export default function App() {
  const [usersList, setUsersList] = useState(INITIAL_USERS);
  const [currentUser, setCurrentUser] = useState(null);
  const [loginInput, setLoginInput] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');

  const [activeTab, setActiveTab] = useState('dashboard');
  
  const [vendors, setVendors] = useState(INITIAL_VENDORS);
  const [deliveries, setDeliveries] = useState(INITIAL_DELIVERIES);
  const [items, setItems] = useState(INITIAL_ITEMS);
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [returns, setReturns] = useState(INITIAL_RETURNS);
  const [logs, setLogs] = useState(INITIAL_LOGS);

  const [searchTerm, setSearchTerm] = useState('');
  const [vendorFilter, setVendorFilter] = useState('ALL');

  const [selectedOrderIds, setSelectedOrderIds] = useState([]);
  const [selectedItemIds, setSelectedItemIds] = useState([]);
  const [selectedReturnIds, setSelectedReturnIds] = useState([]);

  const [chartMetric, setChartMetric] = useState('qty');
  const [chartType, setChartType] = useState('line');
  const [sortOrder, setSortOrder] = useState('desc');
  const [hoveredPoint, setHoveredPoint] = useState(null);

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showVoucherModal, setShowVoucherModal] = useState(false);
  const [showItemModal, setShowItemModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showVendorModal, setShowVendorModal] = useState(false);
  const [showDeliveryModal, setShowDeliveryModal] = useState(false);
  const [showReturnModal, setShowReturnModal] = useState(false);
  
  const [showPartialModal, setShowPartialModal] = useState(false);
  const [targetPartialOrder, setTargetPartialOrder] = useState(null);
  const [partialItemsForm, setPartialItemsForm] = useState([]);

  const [editingVendor, setEditingVendor] = useState(null);
  const [editingDelivery, setEditingDelivery] = useState(null);
  const [editingUser, setEditingUser] = useState(null);

  const [targetReturnItem, setTargetReturnItem] = useState(null);
  const [returnForm, setReturnForm] = useState({ qty: 1, reason: 'Overstock Return' });

  const [newUser, setNewUser] = useState({ username: '', password: '', name: '', role: 'Staff', vendorId: '' });
  const [newVendor, setNewVendor] = useState({ name: '', phone: '', address: '', bankAccount: '' });
  const [newDelivery, setNewDelivery] = useState({ name: '', phone: '', address: '', bankAccount: '' });

  const [isExistingItemMode, setIsExistingItemMode] = useState(true);
  const [newItem, setNewItem] = useState({ 
    vendorId: '', 
    existingItemId: '',
    name: '', 
    category: 'General', 
    price: '', 
    quantity: '', 
    handlingFee: '500', 
    storeChargePerDay: '30', 
    freeDays: '7' 
  });

  const [newOrder, setNewOrder] = useState({
    vendorId: '',
    customerName: '',
    customerPhone: '',
    deliveryAddress: '',
    deliveryService: 'Royal Express',
    trackingNo: '',
    deliveryFee: 0,
    items: [{ itemId: '', qty: 1, discount: 0 }]
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const resUsers = await fetch(`${API_BASE_URL}/api/users`);
        if (resUsers.ok) {
          const dataUsers = await resUsers.json();
          if (Array.isArray(dataUsers) && dataUsers.length > 0) setUsersList(dataUsers);
        }

        const resVendors = await fetch(`${API_BASE_URL}/api/vendors`);
        if (resVendors.ok) {
          const dataVendors = await resVendors.json();
          if (Array.isArray(dataVendors)) setVendors(dataVendors);
        }

        const resDeliveries = await fetch(`${API_BASE_URL}/api/deliveries`);
        if (resDeliveries.ok) {
          const dataDeliveries = await resDeliveries.json();
          if (Array.isArray(dataDeliveries) && dataDeliveries.length > 0) setDeliveries(dataDeliveries);
        }

        const resItems = await fetch(`${API_BASE_URL}/api/inventory`);
        if (resItems.ok) {
          const dataItems = await resItems.json();
          if (Array.isArray(dataItems) && dataItems.length > 0) setItems(dataItems);
        }

        const resOrders = await fetch(`${API_BASE_URL}/api/orders`);
        if (resOrders.ok) {
          const dataOrders = await resOrders.json();
          if (Array.isArray(dataOrders) && dataOrders.length > 0) setOrders(dataOrders);
        }

        const resReturns = await fetch(`${API_BASE_URL}/api/returns`);
        if (resReturns.ok) {
          const dataReturns = await resReturns.json();
          if (Array.isArray(dataReturns) && dataReturns.length > 0) setReturns(dataReturns);
        }
      } catch (err) {
        console.error('API Sync Error:', err);
      }
    }
    fetchData();
  }, []);

  const addLog = (actionText) => {
    if (!currentUser) return;
    const newLog = {
      id: `LOG-${Date.now().toString().slice(-4)}`,
      user: currentUser.name,
      role: currentUser.role,
      action: actionText,
      timestamp: new Date().toLocaleString()
    };
    setLogs(prev => [newLog, ...prev]);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const found = usersList.find(u => u.username === loginInput.username && u.password === loginInput.password);
    if (found) {
      setCurrentUser(found);
      setLoginError('');
      if (found.role === 'Vendor') {
        setVendorFilter(found.vendorId);
      } else {
        setVendorFilter('ALL');
      }
    } else {
      setLoginError('Username သို့မဟုတ် Password မှားယွင်းနေပါသည်။');
    }
  };

  const handleSaveUser = async (e) => {
    e.preventDefault();
    if (!newUser.username) return;

    if (editingUser) {
      const updatedUser = {
        ...editingUser,
        username: newUser.username,
        password: newUser.password || editingUser.password,
        name: newUser.name,
        role: newUser.role,
        vendorId: newUser.role === 'Vendor' ? newUser.vendorId : ''
      };

      try {
        await fetch(`${API_BASE_URL}/api/users/${editingUser.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedUser)
        });
      } catch (e) {}

      setUsersList(usersList.map(u => u.id === editingUser.id ? updatedUser : u));
      addLog(`Updated user account: ${newUser.username}`);
    } else {
      const userObj = {
        id: `USR-${Date.now().toString().slice(-3)}`,
        username: newUser.username,
        password: newUser.password || '123456',
        name: newUser.name || newUser.username,
        role: newUser.role,
        vendorId: newUser.role === 'Vendor' ? newUser.vendorId : ''
      };

      try {
        await fetch(`${API_BASE_URL}/api/users`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(userObj)
        });
      } catch (e) {}

      setUsersList([...usersList, userObj]);
      addLog(`Created new user account: ${userObj.username}`);
    }

    setShowUserModal(false);
    setEditingUser(null);
    setNewUser({ username: '', password: '', name: '', role: 'Staff', vendorId: '' });
  };

  const handleDeleteUser = async (userId) => {
    if (confirm('ဤ User အကောင့်ကို ဖျက်ရန် သေချာပါသလား?')) {
      try {
        await fetch(`${API_BASE_URL}/api/users/${userId}`, { method: 'DELETE' });
      } catch (e) {}

      setUsersList(usersList.filter(u => u.id !== userId));
      addLog(`Deleted user ID ${userId}`);
    }
  };

  const handleSaveVendor = async (e) => {
    e.preventDefault();
    if (!newVendor.name || !newVendor.phone) return;

    if (editingVendor) {
      setVendors(vendors.map(v => v.id === editingVendor.id ? { ...v, ...newVendor } : v));
      addLog(`Updated vendor: ${newVendor.name}`);
      setEditingVendor(null);
    } else {
      const vendorObj = {
        id: `VND-${Math.floor(100 + Math.random() * 900)}`,
        name: newVendor.name,
        phone: newVendor.phone,
        address: newVendor.address,
        bankAccount: newVendor.bankAccount,
        freeStorageDays: 7,
        dailyStoreFee: 200
      };

      try {
        await fetch(`${API_BASE_URL}/api/vendors`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(vendorObj)
        });
      } catch (err) {}

      setVendors([...vendors, vendorObj]);
      addLog(`Registered new vendor: ${vendorObj.name}`);
    }

    setShowVendorModal(false);
    setNewVendor({ name: '', phone: '', address: '', bankAccount: '' });
  };

  const handleDeleteVendor = (vendorId) => {
    const hasItems = items.some(i => i.vendorId === vendorId && Number(i.quantity) > 0);
    const hasOrders = orders.some(o => o.vendorId === vendorId);

    if (hasItems || hasOrders) {
      alert('ဤ Vendor တွင် လက်ကျန်ပစ္စည်းများ သို့မဟုတ် အော်ဒါစာရင်းများ ရှိနေသေးသဖြင့် ဖျက်၍မရပါ။');
      return;
    }

    if (confirm('ဤ Vendor ကို အပြီးတိုင် ဖျက်ရန် သေချာပါသလား?')) {
      setVendors(vendors.filter(v => v.id !== vendorId));
      addLog(`Deleted vendor ID ${vendorId}`);
    }
  };

  const handleSaveDelivery = async (e) => {
    e.preventDefault();
    if (!newDelivery.name || !newDelivery.phone) return;

    if (editingDelivery) {
      const updatedObj = { ...editingDelivery, ...newDelivery };
      try {
        await fetch(`${API_BASE_URL}/api/deliveries/${editingDelivery.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedObj)
        });
      } catch (e) {}

      setDeliveries(deliveries.map(d => d.id === editingDelivery.id ? updatedObj : d));
      addLog(`Updated delivery service: ${newDelivery.name}`);
      setEditingDelivery(null);
    } else {
      const deliveryObj = {
        id: `DEL-${Math.floor(100 + Math.random() * 900)}`,
        name: newDelivery.name,
        phone: newDelivery.phone,
        address: newDelivery.address,
        bankAccount: newDelivery.bankAccount
      };

      try {
        await fetch(`${API_BASE_URL}/api/deliveries`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(deliveryObj)
        });
      } catch (e) {}

      setDeliveries([...deliveries, deliveryObj]);
      addLog(`Registered new delivery service: ${deliveryObj.name}`);
    }

    setShowDeliveryModal(false);
    setNewDelivery({ name: '', phone: '', address: '', bankAccount: '' });
  };

  const handleDeleteDelivery = async (delId, delName) => {
    const hasOrders = orders.some(o => o.deliveryService === delName && !o.cancelled);
    if (hasOrders) {
      alert('ဤ Delivery တွင် ဆက်စပ်အော်ဒါစာရင်းများ ရှိနေသေးသဖြင့် ဖျက်၍မရပါ သို့မဟုတ် Cancelled လုပ်ထားရန် လိုအပ်ပါသည်။');
      return;
    }

    if (confirm(`Delivery "${delName}" ကို ဖျက်ရန် သေချာပါသလား?`)) {
      try {
        await fetch(`${API_BASE_URL}/api/deliveries/${delId}`, { method: 'DELETE' });
      } catch (e) {}

      setDeliveries(deliveries.filter(d => d.id !== delId));
      addLog(`Deleted delivery service ID ${delId}`);
    }
  };

  const scopedItems = useMemo(() => {
    if (currentUser && currentUser.role === 'Vendor') {
      return items.filter(i => i.vendorId === currentUser.vendorId);
    }
    if (vendorFilter !== 'ALL') {
      return items.filter(i => i.vendorId === vendorFilter);
    }
    return items;
  }, [items, currentUser, vendorFilter]);

  const scopedOrders = useMemo(() => {
    if (currentUser && currentUser.role === 'Vendor') {
      return orders.filter(o => o.vendorId === currentUser.vendorId);
    }
    if (vendorFilter !== 'ALL') {
      return orders.filter(o => o.vendorId === vendorFilter);
    }
    return orders;
  }, [orders, currentUser, vendorFilter]);

  const stats = useMemo(() => {
    const totalOrders = scopedOrders.length;
    const pendingOrders = scopedOrders.filter(o => o.status === 'Pending' || o.status === 'In-Transit').length;
    const totalCodCollected = scopedOrders.filter(o => o.codCollected && !o.cancelled).reduce((sum, o) => sum + (Number(o.totalCod) || 0), 0);
    const totalTnRevenue = scopedOrders.filter(o => !o.cancelled).reduce((sum, o) => sum + (Number(o.tnHandlingFee) || 0) + (Number(o.tnStoreFee) || 0), 0);
    const totalStockValue = scopedItems.reduce((sum, i) => sum + ((Number(i.quantity) || 0) * (Number(i.price) || 0)), 0);

    return { totalOrders, pendingOrders, totalCodCollected, totalTnRevenue, totalStockValue };
  }, [scopedOrders, scopedItems]);

  const chartData = useMemo(() => {
    if (chartMetric === 'del_orders' || chartMetric === 'del_cod') {
      return deliveries.map(d => {
        const dOrders = orders.filter(o => o.deliveryService === d.name && !o.cancelled);
        const qty = dOrders.length;
        const cod = dOrders.filter(o => o.codCollected).reduce((sum, o) => sum + (Number(o.totalCod) || 0), 0);
        return { id: d.id, name: d.name, qty, val: cod, store: 0 };
      });
    }

    let result = vendors.map(v => {
      const vItems = items.filter(i => i.vendorId === v.id);
      const qty = vItems.reduce((sum, i) => sum + (Number(i.quantity) || 0), 0);
      const val = vItems.reduce((sum, i) => sum + ((Number(i.quantity) || 0) * (Number(i.price) || 0)), 0);
      return { id: v.id, name: v.name, qty, val };
    });
    return result;
  }, [items, vendors, deliveries, orders, chartMetric]);

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 font-sans">
        <div className="bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl border border-slate-700 space-y-6">
          <div className="text-center space-y-2">
            <div className="bg-indigo-600 text-white p-3 rounded-2xl inline-block shadow-lg font-black text-xl">
              T&N
            </div>
            <h1 className="text-2xl font-bold text-slate-900">T&N Fulfillment System</h1>
            <p className="text-xs text-slate-500">Vendor & Logistics Management Platform</p>
          </div>

          {loginError && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3 rounded-lg text-xs flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Username</label>
              <input 
                type="text" required
                placeholder="Enter username"
                value={loginInput.username}
                onChange={(e) => setLoginInput({ ...loginInput, username: e.target.value })}
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Password</label>
              <input 
                type="password" required
                placeholder="••••••••"
                value={loginInput.password}
                onChange={(e) => setLoginInput({ ...loginInput, password: e.target.value })}
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
            </div>

            <button 
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg shadow-md transition-all text-sm"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      <header className="bg-slate-900 text-white sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center space-x-3">
            <div className="bg-indigo-600 text-white p-2 rounded-lg font-extrabold text-xl">T&N</div>
            <div>
              <h1 className="font-bold text-lg leading-none">T&N Fulfillment System</h1>
              <p className="text-xs text-slate-400 mt-1">Vendor & Logistics Management Platform</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700 flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <div className="text-xs">
                <p className="text-indigo-300 font-bold">{currentUser.name}</p>
                <p className="text-[10px] text-slate-400 uppercase">Role: {currentUser.role}</p>
              </div>
            </div>

            <button 
              onClick={() => { addLog('Logged out'); setCurrentUser(null); }}
              className="bg-rose-600 hover:bg-rose-700 text-white text-xs px-3 py-2 rounded-lg font-semibold flex items-center space-x-1"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        <div className="bg-slate-800 border-t border-slate-700 px-4">
          <div className="max-w-7xl mx-auto flex space-x-1 overflow-x-auto text-xs font-medium py-2">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: BarChart2 },
              { id: 'orders', label: 'Orders & Vouchers', icon: ShoppingCart },
              { id: 'inventory', label: 'Vendor Inventory', icon: Package },
              { id: 'returns', label: 'Returns & Damage', icon: RotateCcw },
              { id: 'settlements', label: 'Vendors (Financial)', icon: DollarSign },
              { id: 'deliveries', label: 'Delivery Services', icon: Truck },
              { id: 'users', label: 'User Management', icon: Users, adminOnly: true },
              { id: 'logs', label: 'Action Logs', icon: Activity, adminOnly: true },
            ].map(tab => {
              if (tab.adminOnly && currentUser.role !== 'Admin') return null;
              if (currentUser.role === 'Vendor' && ['settlements', 'logs', 'users', 'deliveries'].includes(tab.id)) return null;
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-all whitespace-nowrap ${
                    isActive ? 'bg-indigo-600 text-white font-semibold' : 'text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </header>

      <main className="flex-grow max-w-7xl w-full mx-auto p-4 md:p-6 space-y-6">
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-xl border shadow-sm">
                <p className="text-xs font-semibold text-slate-500 uppercase">Total Orders</p>
                <p className="text-2xl font-bold text-slate-800 mt-1">{stats.totalOrders}</p>
              </div>
              <div className="bg-white p-5 rounded-xl border shadow-sm">
                <p className="text-xs font-semibold text-slate-500 uppercase">Total COD Collected</p>
                <p className="text-2xl font-bold text-emerald-600 mt-1">{(stats.totalCodCollected || 0).toLocaleString()} Ks</p>
              </div>
              <div className="bg-white p-5 rounded-xl border shadow-sm">
                <p className="text-xs font-semibold text-slate-500 uppercase">T&N Revenue (Fees)</p>
                <p className="text-2xl font-bold text-indigo-600 mt-1">{(stats.totalTnRevenue || 0).toLocaleString()} Ks</p>
              </div>
              <div className="bg-white p-5 rounded-xl border shadow-sm">
                <p className="text-xs font-semibold text-slate-500 uppercase">Vendor Stock Value</p>
                <p className="text-2xl font-bold text-slate-800 mt-1">{(stats.totalStockValue || 0).toLocaleString()} Ks</p>
              </div>
            </div>
          </div>
        )}

        {/* Users Management Tab */}
        {activeTab === 'users' && currentUser.role === 'Admin' && (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-xl border shadow-sm flex justify-between items-center">
              <div>
                <h3 className="font-bold text-slate-800 text-sm">System Users & Access Management</h3>
                <p className="text-xs text-slate-500">Create, edit and manage user credentials and roles</p>
              </div>
              <button 
                onClick={() => {
                  setEditingUser(null);
                  setNewUser({ username: '', password: '', name: '', role: 'Staff', vendorId: '' });
                  setShowUserModal(true);
                }}
                className="bg-indigo-600 text-white text-xs px-4 py-2 rounded-lg font-semibold flex items-center"
              >
                <UserPlus className="w-4 h-4 mr-1" />
                <span>Create New User</span>
              </button>
            </div>

            <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-600 font-semibold border-b">
                  <tr>
                    <th className="p-3">User ID</th>
                    <th className="p-3">Username</th>
                    <th className="p-3">Display Name</th>
                    <th className="p-3">Role</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {usersList.map(u => (
                    <tr key={u.id} className="hover:bg-slate-50">
                      <td className="p-3 font-mono text-slate-400">{u.id}</td>
                      <td className="p-3 font-bold text-slate-800">{u.username}</td>
                      <td className="p-3 text-slate-700">{u.name}</td>
                      <td className="p-3">
                        <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
                          u.role === 'Admin' ? 'bg-indigo-100 text-indigo-700' :
                          u.role === 'Staff' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'
                        }`}>{u.role}</span>
                      </td>
                      <td className="p-3 text-right space-x-3">
                        <button 
                          onClick={() => {
                            setEditingUser(u);
                            setNewUser({ username: u.username, password: '', name: u.name, role: u.role, vendorId: u.vendorId || '' });
                            setShowUserModal(true);
                          }}
                          className="text-indigo-600 hover:underline font-semibold"
                        >Edit</button>
                        {u.username !== 'admin' && (
                          <button 
                            onClick={() => handleDeleteUser(u.id)}
                            className="text-rose-600 hover:underline font-bold"
                          >Delete</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* User Modal */}
      {showUserModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-bold text-slate-800 text-base">{editingUser ? 'Edit User' : 'Create New User'}</h3>
              <button onClick={() => setShowUserModal(false)} className="text-slate-400">✕</button>
            </div>

            <form onSubmit={handleSaveUser} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Username *</label>
                <input 
                  type="text" required value={newUser.username}
                  onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                  className="w-full border rounded-lg p-2"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Password</label>
                <input 
                  type="password" value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  className="w-full border rounded-lg p-2"
                  placeholder={editingUser ? "Leave blank to keep current" : "Password"}
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Display Name</label>
                <input 
                  type="text" value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  className="w-full border rounded-lg p-2"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Role *</label>
                <select 
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                  className="w-full border rounded-lg p-2"
                >
                  <option value="Admin">Admin</option>
                  <option value="Staff">Staff</option>
                  <option value="Vendor">Vendor</option>
                </select>
              </div>

              {newUser.role === 'Vendor' && (
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Associated Vendor</label>
                  <select 
                    value={newUser.vendorId}
                    onChange={(e) => setNewUser({ ...newUser, vendorId: e.target.value })}
                    className="w-full border rounded-lg p-2"
                  >
                    <option value="">-- Choose Vendor --</option>
                    {vendors.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                  </select>
                </div>
              )}

              <div className="pt-3 flex space-x-2">
                <button type="button" onClick={() => setShowUserModal(false)} className="w-1/2 bg-slate-100 py-2.5 rounded-lg font-semibold">Cancel</button>
                <button type="submit" className="w-1/2 bg-indigo-600 text-white py-2.5 rounded-lg font-semibold">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <footer className="bg-white border-t py-3 text-center text-xs text-slate-500 mt-auto">
        T&N Fulfillment System • Supported by T&N
      </footer>
    </div>
  );
}