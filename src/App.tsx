import React, { useState, useEffect, useMemo } from 'react';
import { 
  Package, ShoppingCart, Truck, Users, FileText, 
  RotateCcw, ShieldCheck, Activity, Search, Plus, Edit, Trash2, 
  CheckCircle, Clock, AlertTriangle, Eye, Printer, Download, Upload,
  ArrowUpRight, ArrowDownRight, RefreshCw, Lock, UserCheck, Key,
  BarChart2, Filter, ChevronRight, LogOut, FileSpreadsheet, Tag, TrendingUp,
  PieChart, Table, ArrowUpDown, UserPlus, CheckSquare, Square, Bell, HardDrive, Shield, CreditCard, DollarSign
} from 'lucide-react';

// --- BACKEND API BASE URL ---
const API_BASE_URL = 'https://tn-backend-j1vg.onrender.com';

// --- INITIAL DATABASE STATE ---
const INITIAL_USERS = [
  { id: 'USR-001', username: "admin", password: "admin123", name: "System Admin", role: "Admin", vendorId: "" },
  { id: 'USR-002', username: "staff", password: "staff123", name: "Operations Staff", role: "Staff", vendorId: "" },
  { id: 'USR-003', username: "vendor_a", password: "vendor123", name: "Aung Cosmetic Shop", role: "Vendor", vendorId: "VND-101" },
  { id: 'USR-004', username: "vendor_b", password: "vendor123", name: "Trendy Fashion Hub", role: "Vendor", vendorId: "VND-102" },
];

const INITIAL_VENDORS = [
  { id: 'VND-101', name: 'Aung Cosmetic Shop', phone: '09250001122', address: 'Kamlaryut, Yangon', handlingFee: 500, freeStorageDays: 7, dailyStoreFee: 200 },
  { id: 'VND-102', name: 'Trendy Fashion Hub', phone: '09450003344', address: 'Mandalay', handlingFee: 600, freeStorageDays: 5, dailyStoreFee: 300 },
];

const INITIAL_ITEMS = [
  { id: 'ITM-001', vendorId: 'VND-101', name: 'Matte Lipstick (Red)', category: 'Beauty', price: 12000, cost: 8000, quantity: 45, damagedQty: 2, stockInDate: '2026-10-01', sku: 'SKU-VND-A001', handlingFee: 500, storeChargePerDay: 50, freeDays: 7 },
  { id: 'ITM-002', vendorId: 'VND-101', name: 'Hydrating Serum 50ml', category: 'Skincare', price: 28000, cost: 20000, quantity: 18, damagedQty: 0, stockInDate: '2026-09-15', sku: 'SKU-VND-A002', handlingFee: 500, storeChargePerDay: 50, freeDays: 7 },
  { id: 'ITM-003', vendorId: 'VND-102', name: 'Oversized Cotton Tee', category: 'Apparel', price: 18000, cost: 11000, quantity: 30, damagedQty: 1, stockInDate: '2026-10-10', sku: 'SKU-VND-B001', handlingFee: 600, storeChargePerDay: 60, freeDays: 5 },
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
    items: [{ itemId: 'ITM-001', name: 'Matte Lipstick (Red)', qty: 2, price: 12000, discount: 1000 }],
    itemTotal: 23000,
    deliveryFee: 2500,
    totalCod: 25500,
    tnHandlingFee: 500,
    tnStoreFee: 0,
    codCollected: true,
    settlementStatus: 'Settled',
    createdAt: '2026-10-18 10:30 AM',
    updatedBy: 'Staff_Aung'
  },
  { 
    id: 'TN-ORD-8802', 
    vendorId: 'VND-102', 
    customerName: 'U Kyaw Swar', 
    customerPhone: '09960005678', 
    deliveryAddress: '78th St, Mandalay', 
    deliveryService: 'Ninja Van', 
    trackingNo: 'NV-334112', 
    status: 'In-Transit', 
    cancelled: false,
    items: [{ itemId: 'ITM-003', name: 'Oversized Cotton Tee', qty: 1, price: 18000, discount: 0 }],
    itemTotal: 18000,
    deliveryFee: 3000,
    totalCod: 21000,
    tnHandlingFee: 600,
    tnStoreFee: 600, 
    codCollected: false,
    settlementStatus: 'Pending',
    createdAt: '2026-10-21 02:15 PM',
    updatedBy: 'Staff_Su'
  }
];

const INITIAL_RETURNS = [
  { id: 'RET-001', orderId: 'TN-ORD-8800', vendorId: 'VND-101', itemName: 'Hydrating Serum', qty: 1, type: 'Delivery Return', reason: 'Customer Refused', status: 'In Warehouse', date: '2026-10-19' },
  { id: 'RET-002', itemId: 'ITM-001', vendorId: 'VND-101', itemName: 'Matte Lipstick (Red)', qty: 2, type: 'Vendor Return (Damage)', reason: 'Expired packaging', status: 'Returned to Vendor', date: '2026-10-20' }
];

const INITIAL_LOGS = [
  { id: 'LOG-101', user: 'Admin_TN', role: 'Admin', action: 'System Initialization', timestamp: '2026-10-22 09:00 AM' },
  { id: 'LOG-102', user: 'Staff_Aung', role: 'Staff', action: 'Updated Order TN-ORD-8801 status to Delivered', timestamp: '2026-10-22 11:20 AM' }
];

export default function App() {
  const [usersList, setUsersList] = useState(INITIAL_USERS);
  const [currentUser, setCurrentUser] = useState(null);
  const [loginInput, setLoginInput] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');

  const [activeTab, setActiveTab] = useState('dashboard');
  
  const [vendors, setVendors] = useState(INITIAL_VENDORS);
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
  const [editingUser, setEditingUser] = useState(null);

  const [newUser, setNewUser] = useState({ username: '', password: '', name: '', role: 'Staff', vendorId: '' });
  const [newItem, setNewItem] = useState({ 
    vendorId: '', 
    name: '', 
    category: 'General', 
    price: '', 
    cost: '', 
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
    deliveryFee: 2500,
    items: [{ itemId: '', qty: 1, discount: 0 }]
  });

  useEffect(() => {
    async function fetchData() {
      try {
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
    const deliveredOrders = scopedOrders.filter(o => o.status === 'Delivered').length;
    const totalCodCollected = scopedOrders.filter(o => o.codCollected && !o.cancelled).reduce((sum, o) => sum + (Number(o.totalCod) || 0), 0);
    const totalTnRevenue = scopedOrders.filter(o => !o.cancelled).reduce((sum, o) => sum + (Number(o.tnHandlingFee) || 0) + (Number(o.tnStoreFee) || 0), 0);
    const totalStockValue = scopedItems.reduce((sum, i) => sum + ((Number(i.quantity) || 0) * (Number(i.cost) || 0)), 0);

    return { totalOrders, pendingOrders, deliveredOrders, totalCodCollected, totalTnRevenue, totalStockValue };
  }, [scopedOrders, scopedItems]);

  const chartData = useMemo(() => {
    let result = vendors.map(v => {
      const vItems = items.filter(i => i.vendorId === v.id);
      const qty = vItems.reduce((sum, i) => sum + (Number(i.quantity) || 0), 0);
      const val = vItems.reduce((sum, i) => sum + ((Number(i.quantity) || 0) * (Number(i.price) || 0)), 0);
      const store = vItems.reduce((sum, i) => sum + calculateStoreCharge(i), 0);
      return { id: v.id, name: v.name, qty, val, store };
    });

    result.sort((a, b) => {
      const valA = a[chartMetric] || 0;
      const valB = b[chartMetric] || 0;
      return sortOrder === 'asc' ? valA - valB : valB - valA;
    });

    return result;
  }, [items, vendors, chartMetric, sortOrder]);

  const maxChartValue = useMemo(() => {
    return Math.max(...chartData.map(d => Number(d[chartMetric]) || 0), 1);
  }, [chartData, chartMetric]);

  function calculateStoreCharge(item) {
    const vendor = vendors.find(v => v.id === item.vendorId);
    if (!vendor) return 0;
    
    const stockIn = new Date(item.stockInDate);
    const today = new Date();
    const diffDays = Math.floor((today.getTime() - stockIn.getTime()) / (1000 * 60 * 60 * 24));
    
    const freeDays = item.freeDays !== undefined ? item.freeDays : vendor.freeStorageDays;
    const dailyFee = item.storeChargePerDay !== undefined ? item.storeChargePerDay : vendor.dailyStoreFee;

    if (diffDays > freeDays) {
      const extraDays = diffDays - freeDays;
      return extraDays * dailyFee * (Number(item.quantity) || 0);
    }
    return 0;
  }

  const handleSaveUser = (e) => {
    e.preventDefault();
    if (!newUser.username) return;

    if (editingUser) {
      setUsersList(usersList.map(u => u.id === editingUser.id ? {
        ...u,
        username: newUser.username,
        password: newUser.password || u.password,
        name: newUser.name,
        role: newUser.role,
        vendorId: newUser.role === 'Vendor' ? newUser.vendorId : ''
      } : u));
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
      setUsersList([...usersList, userObj]);
      addLog(`Created new user account: ${userObj.username}`);
    }

    setShowUserModal(false);
    setEditingUser(null);
    setNewUser({ username: '', password: '', name: '', role: 'Staff', vendorId: '' });
  };

  const handleDeleteUser = (userId) => {
    if (confirm('ဤ User အကောင့်ကို ဖျက်ရန် သေချာပါသလား?')) {
      setUsersList(usersList.filter(u => u.id !== userId));
      addLog(`Deleted user ID ${userId}`);
    }
  };

  const exportSelectedToExcel = (type, dataList, selectedIds) => {
    const targetData = selectedIds.length > 0 
      ? dataList.filter(item => selectedIds.includes(item.id))
      : dataList;

    if (targetData.length === 0) {
      alert('Export ထုတ်ရန် ဒေတာ ရွေးချယ်ထားခြင်း မရှိပါ (သို့) ဒေတာ မရှိပါ။');
      return;
    }

    const headers = Object.keys(targetData[0] || {}).join("\t");
    const rows = targetData.map(row => Object.values(row).map(v => typeof v === 'object' ? JSON.stringify(v) : v).join("\t")).join("\n");
    const blob = new Blob([headers + "\n" + rows], { type: 'application/vnd.ms-excel' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `TN_Fulfillment_Selected_${type}_${Date.now()}.xls`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    addLog(`Exported selected ${type} data as Excel .xls format`);
  };

  const handleCreateOrder = async (e) => {
    e.preventDefault();
    if (!newOrder.vendorId || newOrder.items.length === 0) return;

    const selectedVendor = vendors.find(v => v.id === newOrder.vendorId);
    let itemTotal = 0;
    const orderItems = newOrder.items.map(it => {
      const itemData = items.find(i => i.id === it.itemId);
      const price = itemData ? (Number(itemData.price) || 0) : 0;
      const lineTotal = (price - (Number(it.discount) || 0)) * (Number(it.qty) || 1);
      itemTotal += lineTotal;
      return {
        itemId: it.itemId,
        name: itemData ? itemData.name : 'Unknown Item',
        qty: Number(it.qty) || 1,
        price: price,
        discount: Number(it.discount) || 0
      };
    });

    const createdOrder = {
      id: `TN-ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      vendorId: newOrder.vendorId,
      customerName: newOrder.customerName,
      customerPhone: newOrder.customerPhone,
      deliveryAddress: newOrder.deliveryAddress,
      deliveryService: newOrder.deliveryService,
      trackingNo: newOrder.trackingNo || 'PENDING',
      status: 'Pending',
      cancelled: false,
      items: orderItems,
      itemTotal: itemTotal,
      deliveryFee: Number(newOrder.deliveryFee) || 0,
      totalCod: itemTotal + (Number(newOrder.deliveryFee) || 0),
      tnHandlingFee: selectedVendor ? selectedVendor.handlingFee : 500,
      tnStoreFee: 0,
      codCollected: false,
      settlementStatus: 'Pending',
      createdAt: new Date().toLocaleString(),
      updatedBy: currentUser?.name || 'Staff'
    };

    try {
      const response = await fetch(`${API_BASE_URL}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(createdOrder)
      });

      if (response.ok) {
        setOrders([createdOrder, ...orders]);

        setItems(prev => prev.map(item => {
          const ordered = newOrder.items.find(i => i.itemId === item.id);
          if (ordered) {
            return { ...item, quantity: Math.max(0, (Number(item.quantity) || 0) - (Number(ordered.qty) || 1)) };
          }
          return item;
        }));

        addLog(`Created new order ${createdOrder.id} for Vendor ${newOrder.vendorId}`);
        setShowOrderModal(false);
      } else {
        const errData = await response.json();
        alert('Order သိမ်းဆည်းရာတွင် အမှားဖြစ်သွားပါသည်: ' + (errData.error || 'Unknown error'));
      }
    } catch (err) {
      console.error('API Error:', err);
      alert('Backend ဆီသို့ ချိတ်ဆက်၍မရပါ။ Server ဖွင့်ထားခြင်း ရှိမရှိ စစ်ဆေးပါ။');
    }
  };

  const handleUpdateOrderStatus = (orderId, newStatus, newTracking) => {
    const targetOrder = orders.find(o => o.id === orderId);
    if (targetOrder && targetOrder.status === 'Delivered' && currentUser?.role !== 'Admin') {
      alert('မေတ္တာရပ်ခံချက်: Delivered ဖြစ်ပြီးသား စာရင်းများကို Admin သာ ပြင်ဆင်ခွင့်ရှိပါသည်။');
      return;
    }

    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        const isDelivered = newStatus === 'Delivered';
        return {
          ...o,
          status: newStatus,
          trackingNo: newTracking || o.trackingNo,
          codCollected: isDelivered ? true : o.codCollected,
          updatedBy: currentUser?.name || 'Staff'
        };
      }
      return o;
    }));
    addLog(`Updated Order ${orderId} status to '${newStatus}'`);
  };

  const handleCancelVoucher = (orderId) => {
    if (currentUser?.role !== 'Admin') {
      alert('ခွင့်ပြုချက်မရှိပါ: Voucher များကို Cancel လုပ်ရန် Admin အဆင့် လိုအပ်ပါသည်။');
      return;
    }
    if (confirm(`Voucher ${orderId} ကို Cancel လုပ်ရန် သေချာပါသလား?`)) {
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, cancelled: true, status: 'Cancelled' } : o));
      addLog(`Admin cancelled Voucher ${orderId}`);
    }
  };

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

          <div className="border-t pt-4 text-center text-xs text-slate-400">
            Protected Corporate System • T&N Fulfillment
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      
      <header className="bg-slate-900 text-white sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center space-x-3">
            <div className="bg-indigo-600 text-white p-2 rounded-lg font-extrabold text-xl tracking-wider">
              T&N
            </div>
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
              className="bg-rose-600 hover:bg-rose-700 text-white text-xs px-3 py-2 rounded-lg font-semibold flex items-center space-x-1 transition-colors"
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
              { id: 'settlements', label: 'COD & Billing', icon: DollarSign },
              { id: 'vendors', label: 'Vendors', icon: Users },
              { id: 'users', label: 'User Management', icon: Users, adminOnly: true },
              { id: 'logs', label: 'Action Logs', icon: Activity, adminOnly: true },
            ].map(tab => {
              if (tab.adminOnly && currentUser.role !== 'Admin') return null;
              if (currentUser.role === 'Vendor' && ['settlements', 'logs', 'users'].includes(tab.id)) return null;
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-all whitespace-nowrap ${
                    isActive 
                      ? 'bg-indigo-600 text-white font-semibold shadow-sm' 
                      : 'text-slate-300 hover:bg-slate-700 hover:text-white'
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
            
            {currentUser.role === 'Vendor' ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex justify-between items-center">
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase">My Total Orders</p>
                    <p className="text-2xl font-bold text-slate-800 mt-1">{stats.totalOrders}</p>
                    <p className="text-xs text-indigo-600 mt-1">{stats.pendingOrders} In-Transit / Pending</p>
                  </div>
                  <div className="bg-indigo-50 p-3 rounded-lg text-indigo-600">
                    <ShoppingCart className="w-6 h-6" />
                  </div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex justify-between items-center">
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase">Total COD Collected</p>
                    <p className="text-2xl font-bold text-emerald-600 mt-1">{(stats.totalCodCollected || 0).toLocaleString()} Ks</p>
                    <p className="text-xs text-slate-400 mt-1">Delivered Waybills</p>
                  </div>
                  <div className="bg-emerald-50 p-3 rounded-lg text-emerald-600">
                    <DollarSign className="w-6 h-6" />
                  </div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex justify-between items-center">
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase">My Stock Capital Value</p>
                    <p className="text-2xl font-bold text-slate-800 mt-1">{(stats.totalStockValue || 0).toLocaleString()} Ks</p>
                    <p className="text-xs text-slate-400 mt-1">In T&N Warehouse</p>
                  </div>
                  <div className="bg-amber-50 p-3 rounded-lg text-amber-600">
                    <Package className="w-6 h-6" />
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex justify-between items-center">
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase">Total Orders</p>
                    <p className="text-2xl font-bold text-slate-800 mt-1">{stats.totalOrders}</p>
                    <p className="text-xs text-indigo-600 mt-1">{stats.pendingOrders} In-Transit / Pending</p>
                  </div>
                  <div className="bg-indigo-50 p-3 rounded-lg text-indigo-600">
                    <ShoppingCart className="w-6 h-6" />
                  </div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex justify-between items-center">
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase">Total COD Collected</p>
                    <p className="text-2xl font-bold text-emerald-600 mt-1">{(stats.totalCodCollected || 0).toLocaleString()} Ks</p>
                    <p className="text-xs text-slate-400 mt-1">For Vendors & Delivery</p>
                  </div>
                  <div className="bg-emerald-50 p-3 rounded-lg text-emerald-600">
                    <DollarSign className="w-6 h-6" />
                  </div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex justify-between items-center">
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase">T&N Revenue (Fees)</p>
                    <p className="text-2xl font-bold text-indigo-600 mt-1">{(stats.totalTnRevenue || 0).toLocaleString()} Ks</p>
                    <p className="text-xs text-slate-400 mt-1">Handling + Store Charges</p>
                  </div>
                  <div className="bg-indigo-50 p-3 rounded-lg text-indigo-600">
                    <Tag className="w-6 h-6" />
                  </div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex justify-between items-center">
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase">Vendor Stock Value</p>
                    <p className="text-2xl font-bold text-slate-800 mt-1">{(stats.totalStockValue || 0).toLocaleString()} Ks</p>
                    <p className="text-xs text-slate-400 mt-1">Total capital in warehouse</p>
                  </div>
                  <div className="bg-amber-50 p-3 rounded-lg text-amber-600">
                    <Package className="w-6 h-6" />
                  </div>
                </div>
              </div>
            )}

            {currentUser.role !== 'Vendor' && (
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
                
                <div className="flex flex-wrap justify-between items-center gap-3 border-b pb-3">
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center bg-indigo-50 border border-indigo-200 rounded-lg px-3 py-1.5 text-xs font-bold text-indigo-700">
                      <span className="mr-2">Measures:</span>
                      <select 
                        value={chartMetric}
                        onChange={(e) => setChartMetric(e.target.value)}
                        className="bg-transparent focus:outline-none cursor-pointer"
                      >
                        <option value="qty">Stock Quantity (Units)</option>
                        <option value="val">Stock Selling Value (Ks)</option>
                        <option value="store">Store Charges Total (Ks)</option>
                      </select>
                    </div>

                    <div className="flex items-center border border-slate-300 rounded-lg bg-slate-50 p-0.5 space-x-1">
                      <button 
                        onClick={() => setChartType('line')} 
                        title="Area / Line Chart"
                        className={`p-1.5 rounded ${chartType === 'line' ? 'bg-white shadow text-indigo-600 font-bold' : 'text-slate-500'}`}
                      >
                        <TrendingUp className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => setChartType('bar')} 
                        title="Bar Chart"
                        className={`p-1.5 rounded ${chartType === 'bar' ? 'bg-white shadow text-indigo-600 font-bold' : 'text-slate-500'}`}
                      >
                        <BarChart2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => setChartType('pie')} 
                        title="Pie Chart Share"
                        className={`p-1.5 rounded ${chartType === 'pie' ? 'bg-white shadow text-indigo-600 font-bold' : 'text-slate-500'}`}
                      >
                        <PieChart className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => setChartType('table')} 
                        title="Pivot Table View"
                        className={`p-1.5 rounded ${chartType === 'table' ? 'bg-white shadow text-indigo-600 font-bold' : 'text-slate-500'}`}
                      >
                        <Table className="w-4 h-4" />
                      </button>
                    </div>

                    <button 
                      onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                      className="p-1.5 border border-slate-300 rounded-lg bg-slate-50 text-slate-600 hover:bg-slate-100 flex items-center space-x-1 text-xs"
                      title="Sort Order"
                    >
                      <ArrowUpDown className="w-3.5 h-3.5" />
                      <span className="uppercase text-[10px] font-bold">{sortOrder}</span>
                    </button>
                  </div>

                  <button 
                    onClick={() => exportSelectedToExcel('items', items, [])}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-3 py-1.5 rounded-lg font-semibold flex items-center space-x-1 shadow-sm"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export All Excel (.xls)</span>
                  </button>
                </div>

                <div className="min-h-[240px] relative flex flex-col justify-end pt-6">
                  {hoveredPoint && (
                    <div className="absolute top-2 right-2 bg-slate-900 text-white p-2.5 rounded-lg shadow-lg text-xs space-y-1 z-20">
                      <p className="font-bold text-indigo-300">{hoveredPoint.name}</p>
                      <p className="text-slate-300">
                        {chartMetric === 'qty' ? `Stock Qty: ${hoveredPoint.qty} Units` :
                         chartMetric === 'val' ? `Selling Value: ${(hoveredPoint.val || 0).toLocaleString()} Ks` :
                         `Store Charges: ${(hoveredPoint.store || 0).toLocaleString()} Ks`}
                      </p>
                    </div>
                  )}

                  {chartType === 'line' && (
                    <div className="h-44 w-full flex items-end justify-between gap-4 border-b border-indigo-100 pb-2 relative">
                      {chartData.map((d) => {
                        const heightPct = Math.max(15, ((d[chartMetric] || 0) / maxChartValue) * 100);
                        return (
                          <div 
                            key={d.id} 
                            onMouseEnter={() => setHoveredPoint(d)}
                            onMouseLeave={() => setHoveredPoint(null)}
                            className="flex-1 flex flex-col items-center group cursor-pointer z-10"
                          >
                            <div className="text-[10px] font-bold text-indigo-600 mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              {(d[chartMetric] || 0).toLocaleString()}
                            </div>
                            <div 
                              className="w-3 h-3 bg-indigo-600 rounded-full border-2 border-white shadow group-hover:scale-150 transition-transform"
                              style={{ marginBottom: `${heightPct * 1.2}px` }}
                            ></div>
                            <span className="text-xs font-semibold text-slate-600 truncate max-w-[100px]">{d.name}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {chartType === 'bar' && (
                    <div className="h-44 flex items-end justify-around gap-4 border-b pb-2">
                      {chartData.map(d => {
                        const heightPct = Math.max(10, ((d[chartMetric] || 0) / maxChartValue) * 100);
                        return (
                          <div 
                            key={d.id}
                            onMouseEnter={() => setHoveredPoint(d)}
                            onMouseLeave={() => setHoveredPoint(null)}
                            className="flex-1 flex flex-col items-center group cursor-pointer"
                          >
                            <span className="text-[10px] font-bold text-indigo-600 mb-1">{(d[chartMetric] || 0).toLocaleString()}</span>
                            <div 
                              className="w-full max-w-[60px] bg-indigo-500 group-hover:bg-indigo-600 rounded-t-lg transition-all shadow-md"
                              style={{ height: `${heightPct}%` }}
                            ></div>
                            <span className="text-xs font-semibold text-slate-600 mt-2 truncate max-w-[100px]">{d.name}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {chartType === 'pie' && (
                    <div className="p-2 space-y-3">
                      {chartData.map(d => {
                        const pct = Math.round(((d[chartMetric] || 0) / maxChartValue) * 100);
                        return (
                          <div key={d.id} className="space-y-1">
                            <div className="flex justify-between text-xs font-medium">
                              <span>{d.name}</span>
                              <span className="font-bold text-indigo-600">{(d[chartMetric] || 0).toLocaleString()} ({pct}%)</span>
                            </div>
                            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                              <div className="bg-indigo-600 h-full rounded-full transition-all duration-500" style={{ width: `${pct}%` }}></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {chartType === 'table' && (
                    <div className="overflow-x-auto border rounded-lg">
                      <table className="w-full text-xs text-left">
                        <thead className="bg-slate-100 text-slate-700 font-bold border-b">
                          <tr>
                            <th className="p-2.5">Vendor Name</th>
                            <th className="p-2.5">Stock Quantity</th>
                            <th className="p-2.5">Total Selling Value</th>
                            <th className="p-2.5">Overdue Store Charges</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y">
                          {chartData.map(d => (
                            <tr key={d.id} className="hover:bg-slate-50">
                              <td className="p-2.5 font-bold text-slate-800">{d.name}</td>
                              <td className="p-2.5 font-semibold text-indigo-600">{d.qty} Units</td>
                              <td className="p-2.5 text-slate-700">{(d.val || 0).toLocaleString()} Ks</td>
                              <td className="p-2.5 text-amber-600 font-bold">{(d.store || 0).toLocaleString()} Ks</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                </div>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {currentUser.role !== 'Vendor' && (
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
                  <h3 className="font-bold text-slate-800 border-b pb-2 text-sm flex items-center">
                    <Plus className="w-4 h-4 mr-2 text-indigo-600" />
                    Quick Operations
                  </h3>
                  <div className="space-y-2">
                    <button 
                      onClick={() => { setActiveTab('orders'); setShowOrderModal(true); }}
                      className="w-full text-left px-4 py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-xs font-semibold flex items-center justify-between transition-colors"
                    >
                      <span>+ Create New Order & Voucher</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => { setActiveTab('inventory'); setShowItemModal(true); }}
                      className="w-full text-left px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center justify-between transition-colors"
                    >
                      <span>+ Add Stock / Item for Vendor</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => setActiveTab('settlements')}
                      className="w-full text-left px-4 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg text-xs font-semibold flex items-center justify-between transition-colors"
                    >
                      <span>Process Vendor Settlement</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              <div className={`${currentUser.role === 'Vendor' ? 'lg:col-span-3' : 'lg:col-span-2'} bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4`}>
                <div className="flex justify-between items-center border-b pb-2">
                  <h3 className="font-bold text-slate-800 text-sm flex items-center">
                    <Truck className="w-4 h-4 mr-2 text-indigo-600" />
                    Active Waybills & Tracking Status
                  </h3>
                  <button onClick={() => setActiveTab('orders')} className="text-xs text-indigo-600 hover:underline">View All</button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-600">
                    <thead className="bg-slate-50 text-slate-500 font-semibold border-b">
                      <tr>
                        <th className="p-2">Order ID</th>
                        <th className="p-2">Customer</th>
                        <th className="p-2">Delivery Service</th>
                        <th className="p-2">Tracking Status</th>
                        <th className="p-2">COD Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {scopedOrders.slice(0, 5).map(ord => (
                        <tr key={ord.id} className="hover:bg-slate-50">
                          <td className="p-2 font-bold text-indigo-600">{ord.id}</td>
                          <td className="p-2">{ord.customerName}</td>
                          <td className="p-2">{ord.deliveryService}</td>
                          <td className="p-2">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                              ord.status === 'Delivered' ? 'bg-emerald-100 text-emerald-700' :
                              ord.status === 'In-Transit' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'
                            }`}>
                              {ord.status}
                            </span>
                          </td>
                          <td className="p-2 font-semibold">{(Number(ord.totalCod) || 0).toLocaleString()} Ks</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="space-y-4">
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex items-center space-x-2 w-full sm:w-auto">
                <div className="relative w-full sm:w-64">
                  <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input 
                    type="text"
                    placeholder="Search Order, Phone, Tracking..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => exportSelectedToExcel('orders', scopedOrders, selectedOrderIds)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-3 py-2 rounded-lg font-semibold flex items-center space-x-1 shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export Selected Excel (.xls) {selectedOrderIds.length > 0 ? `(${selectedOrderIds.length})` : ''}</span>
                </button>

                {currentUser.role !== 'Vendor' && (
                  <button 
                    onClick={() => setShowOrderModal(true)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs px-4 py-2 rounded-lg font-semibold flex items-center space-x-1 shadow-sm transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>New Order Voucher</span>
                  </button>
                )}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-600 font-semibold border-b">
                    <tr>
                      <th className="p-3 w-10 text-center">
                        <input 
                          type="checkbox"
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedOrderIds(scopedOrders.map(o => o.id));
                            } else {
                              setSelectedOrderIds([]);
                            }
                          }}
                          checked={selectedOrderIds.length > 0 && selectedOrderIds.length === scopedOrders.length}
                        />
                      </th>
                      <th className="p-3">Order ID</th>
                      <th className="p-3">Vendor</th>
                      <th className="p-3">Customer Info</th>
                      <th className="p-3">Delivery & Tracking</th>
                      <th className="p-3">COD Total</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {scopedOrders
                      .filter(o => o.id.toLowerCase().includes(searchTerm.toLowerCase()) || o.customerName.toLowerCase().includes(searchTerm.toLowerCase()))
                      .map(order => {
                        const vendor = vendors.find(v => v.id === order.vendorId);
                        const isLocked = (order.status === 'Delivered' && currentUser.role !== 'Admin') || currentUser.role === 'Vendor';
                        const isSelected = selectedOrderIds.includes(order.id);

                        return (
                          <tr key={order.id} className={`hover:bg-slate-50 ${order.cancelled ? 'bg-rose-50/50 opacity-75' : ''}`}>
                            <td className="p-3 text-center">
                              <input 
                                type="checkbox"
                                checked={isSelected}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedOrderIds([...selectedOrderIds, order.id]);
                                  } else {
                                    setSelectedOrderIds(selectedOrderIds.filter(id => id !== order.id));
                                  }
                                }}
                              />
                            </td>
                            <td className="p-3 font-bold text-indigo-600">
                              {order.id}
                              <div className="text-[10px] text-slate-400 font-normal">{order.createdAt}</div>
                            </td>
                            <td className="p-3 font-medium text-slate-700">{vendor ? vendor.name : order.vendorId}</td>
                            <td className="p-3">
                              <p className="font-semibold text-slate-800">{order.customerName}</p>
                              <p className="text-slate-500">{order.customerPhone}</p>
                            </td>
                            <td className="p-3">
                              <p className="font-semibold text-slate-700">{order.deliveryService}</p>
                              <p className="text-slate-500 font-mono text-[11px]">Trk: {order.trackingNo}</p>
                            </td>
                            <td className="p-3 font-bold text-slate-800">
                              {(Number(order.totalCod) || 0).toLocaleString()} Ks
                            </td>
                            <td className="p-3">
                              <select 
                                disabled={isLocked}
                                value={order.status}
                                onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                                className={`text-xs font-semibold px-2 py-1 rounded border ${
                                  order.cancelled ? 'bg-rose-100 text-rose-700 border-rose-200' :
                                  order.status === 'Delivered' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                  'bg-amber-50 text-amber-700 border-amber-200'
                                } ${isLocked ? 'cursor-not-allowed opacity-80' : 'cursor-pointer'}`}
                              >
                                <option value="Pending">Pending</option>
                                <option value="In-Transit">In-Transit</option>
                                <option value="Delivered">Delivered (Successful)</option>
                                <option value="Cancelled">Cancelled</option>
                              </select>
                              {currentUser.role === 'Admin' && !order.cancelled && (
                                <button 
                                  onClick={() => handleCancelVoucher(order.id)}
                                  className="block text-[10px] text-rose-600 hover:underline font-bold mt-1"
                                >
                                  ❌ Cancel Voucher
                                </button>
                              )}
                            </td>
                            <td className="p-3 text-right space-x-2">
                              <button 
                                onClick={() => { setSelectedOrder(order); setShowVoucherModal(true); }}
                                className="bg-slate-100 hover:bg-slate-200 text-slate-700 p-1.5 rounded text-[11px] font-semibold inline-flex items-center space-x-1"
                              >
                                <Printer className="w-3.5 h-3.5" />
                                <span>Voucher</span>
                              </button>
                            </td>
                          </tr>
                        );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'inventory' && (
          <div className="space-y-4">
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex items-center space-x-3 w-full sm:w-auto">
                {currentUser.role !== 'Vendor' && (
                  <select 
                    value={vendorFilter} 
                    onChange={(e) => setVendorFilter(e.target.value)}
                    className="border border-slate-300 rounded-lg text-xs px-3 py-1.5 bg-white font-medium"
                  >
                    <option value="ALL">All Vendors</option>
                    {vendors.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                  </select>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => exportSelectedToExcel('inventory_items', scopedItems, selectedItemIds)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-3 py-2 rounded-lg font-semibold flex items-center space-x-1 shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export Selected Excel (.xls) {selectedItemIds.length > 0 ? `(${selectedItemIds.length})` : ''}</span>
                </button>

                {currentUser.role !== 'Vendor' && (
                  <button 
                    onClick={() => setShowItemModal(true)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs px-4 py-2 rounded-lg font-semibold flex items-center space-x-1 shadow-sm"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add New Item Stock</span>
                  </button>
                )}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-600 font-semibold border-b">
                    <tr>
                      <th className="p-3 w-10 text-center">
                        <input 
                          type="checkbox"
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedItemIds(scopedItems.map(i => i.id));
                            } else {
                              setSelectedItemIds([]);
                            }
                          }}
                          checked={selectedItemIds.length > 0 && selectedItemIds.length === scopedItems.length}
                        />
                      </th>
                      <th className="p-3">SKU / Item</th>
                      <th className="p-3">Vendor</th>
                      <th className="p-3">Price / Cost</th>
                      <th className="p-3">In-Stock Qty</th>
                      <th className="p-3">Stock-In Date</th>
                      <th className="p-3">Store Charges (Est.)</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {scopedItems.map(item => {
                      const vendor = vendors.find(v => v.id === item.vendorId);
                      const storeCharge = calculateStoreCharge(item);
                      const isSelected = selectedItemIds.includes(item.id);

                      return (
                        <tr key={item.id} className="hover:bg-slate-50">
                          <td className="p-3 text-center">
                            <input 
                              type="checkbox"
                              checked={isSelected}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedItemIds([...selectedItemIds, item.id]);
                                } else {
                                  setSelectedItemIds(selectedItemIds.filter(id => id !== item.id));
                                }
                              }}
                            />
                          </td>
                          <td className="p-3">
                            <p className="font-bold text-slate-800">{item.name}</p>
                            <p className="text-[10px] text-slate-400 font-mono">{item.sku}</p>
                          </td>
                          <td className="p-3 text-slate-600 font-medium">{vendor ? vendor.name : item.vendorId}</td>
                          <td className="p-3">
                            <p className="font-semibold text-slate-800">{(Number(item.price) || 0).toLocaleString()} Ks</p>
                            <p className="text-[10px] text-slate-400">Cost: {(Number(item.cost) || 0).toLocaleString()} Ks</p>
                          </td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded font-bold ${
                              (Number(item.quantity) || 0) < 5 ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-800'
                            }`}>
                              {item.quantity} pcs
                            </span>
                          </td>
                          <td className="p-3 text-slate-500">{item.stockInDate}</td>
                          <td className="p-3">
                            {storeCharge > 0 ? (
                              <span className="text-amber-600 font-bold flex items-center">
                                <Clock className="w-3 h-3 mr-1" />
                                {storeCharge.toLocaleString()} Ks
                              </span>
                            ) : (
                              <span className="text-emerald-600 text-[11px]">Free Period</span>
                            )}
                          </td>
                          <td className="p-3 text-right">
                            {currentUser.role !== 'Vendor' && (
                              <button 
                                onClick={() => {
                                  const qty = prompt("Enter stock quantity to return to vendor:");
                                  if (qty && !isNaN(Number(qty))) {
                                    const numQty = Number(qty);
                                    setItems(prev => prev.map(i => i.id === item.id ? { ...i, quantity: Math.max(0, (Number(i.quantity) || 0) - numQty) } : i));
                                    setReturns(prev => [{
                                      id: `RET-${Date.now().toString().slice(-3)}`,
                                      itemId: item.id,
                                      vendorId: item.vendorId,
                                      itemName: item.name,
                                      qty: numQty,
                                      type: 'Vendor Return (Overstock)',
                                      reason: 'Manual Vendor Return',
                                      status: 'Returned to Vendor',
                                      date: new Date().toLocaleDateString()
                                    }, ...prev]);
                                    addLog(`Returned ${numQty} pcs of ${item.name} to Vendor ${item.vendorId}`);
                                  }
                                }}
                                className="text-xs text-indigo-600 hover:underline font-semibold"
                              >
                                Return Stock
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'returns' && (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex justify-between items-center">
              <div>
                <h3 className="font-bold text-slate-800 text-sm">Return & Damage Control</h3>
                <p className="text-xs text-slate-500">Track delivery returns and damaged stock returned to vendors</p>
              </div>

              <button 
                onClick={() => exportSelectedToExcel('returns', returns.filter(ret => currentUser.role !== 'Vendor' || ret.vendorId === currentUser.vendorId), selectedReturnIds)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-3 py-2 rounded-lg font-semibold flex items-center space-x-1 shadow-sm"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Selected Excel (.xls) {selectedReturnIds.length > 0 ? `(${selectedReturnIds.length})` : ''}</span>
              </button>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-600 font-semibold border-b">
                  <tr>
                    <th className="p-3 w-10 text-center">
                      <input 
                        type="checkbox"
                        onChange={(e) => {
                          const filtered = returns.filter(ret => currentUser.role !== 'Vendor' || ret.vendorId === currentUser.vendorId);
                          if (e.target.checked) {
                            setSelectedReturnIds(filtered.map(r => r.id));
                          } else {
                            setSelectedReturnIds([]);
                          }
                        }}
                      />
                    </th>
                    <th className="p-3">Return ID</th>
                    <th className="p-3">Item Name</th>
                    <th className="p-3">Return Type</th>
                    <th className="p-3">Quantity</th>
                    <th className="p-3">Reason</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {returns
                    .filter(ret => currentUser.role !== 'Vendor' || ret.vendorId === currentUser.vendorId)
                    .map(ret => {
                      const isSelected = selectedReturnIds.includes(ret.id);
                      return (
                        <tr key={ret.id} className="hover:bg-slate-50">
                          <td className="p-3 text-center">
                            <input 
                              type="checkbox"
                              checked={isSelected}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedReturnIds([...selectedReturnIds, ret.id]);
                                } else {
                                  setSelectedReturnIds(selectedReturnIds.filter(id => id !== ret.id));
                                }
                              }}
                            />
                          </td>
                          <td className="p-3 font-bold text-slate-700">{ret.id}</td>
                          <td className="p-3 font-semibold text-slate-800">{ret.itemName}</td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                              ret.type.includes('Damage') ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                            }`}>
                              {ret.type}
                            </span>
                          </td>
                          <td className="p-3 font-bold">{ret.qty}</td>
                          <td className="p-3 text-slate-500">{ret.reason}</td>
                          <td className="p-3 font-medium text-slate-700">{ret.status}</td>
                          <td className="p-3 text-slate-400">{ret.date}</td>
                        </tr>
                      );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'settlements' && currentUser.role !== 'Vendor' && (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex justify-between items-center">
              <div>
                <h3 className="font-bold text-slate-800 text-sm">Vendor Financial Settlements (COD vs Fees)</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Direct COD flow balance: (Total Delivered COD) - (T&N Handling Fee + Store Charges)
                </p>
              </div>

              <button 
                onClick={() => exportSelectedToExcel('vendors_list', vendors, [])}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-3 py-2 rounded-lg font-semibold flex items-center space-x-1 shadow-sm"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Settlements (.xls)</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {vendors.map(vendor => {
                const vendorOrders = orders.filter(o => o.vendorId === vendor.id && o.status === 'Delivered' && !o.cancelled);
                const totalCodCollected = vendorOrders.reduce((sum, o) => sum + (Number(o.totalCod) || 0), 0);
                const totalHandlingFee = vendorOrders.reduce((sum, o) => sum + (Number(o.tnHandlingFee) || 0), 0);
                
                const vendorItems = items.filter(i => i.vendorId === vendor.id);
                const totalStoreCharge = vendorItems.reduce((sum, i) => sum + calculateStoreCharge(i), 0);

                const netPayable = totalCodCollected - totalHandlingFee - totalStoreCharge;

                return (
                  <div key={vendor.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
                    <div className="flex justify-between items-start border-b pb-3">
                      <div>
                        <h4 className="font-bold text-slate-800 text-base">{vendor.name}</h4>
                        <p className="text-xs text-slate-400">{vendor.phone}</p>
                      </div>
                      <span className="bg-indigo-50 text-indigo-700 font-bold text-xs px-2.5 py-1 rounded-full">
                        {vendor.id}
                      </span>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between text-slate-600">
                        <span>Delivered COD Collected:</span>
                        <span className="font-semibold text-slate-800">{totalCodCollected.toLocaleString()} Ks</span>
                      </div>
                      <div className="flex justify-between text-slate-600">
                        <span>T&N Handling Fee Deduct:</span>
                        <span className="font-semibold text-red-600">- {totalHandlingFee.toLocaleString()} Ks</span>
                      </div>
                      <div className="flex justify-between text-slate-600">
                        <span>Warehouse Store Charges:</span>
                        <span className="font-semibold text-red-600">- {totalStoreCharge.toLocaleString()} Ks</span>
                      </div>
                      <div className="border-t pt-2 flex justify-between font-bold text-sm text-slate-900">
                        <span>Net Balance to Transfer:</span>
                        <span className="text-emerald-600">{netPayable.toLocaleString()} Ks</span>
                      </div>
                    </div>

                    <button 
                      onClick={() => {
                        exportSelectedToExcel(`settlement_${vendor.id}`, vendorOrders, vendorOrders.map(o => o.id));
                        addLog(`Exported settlement statement for Vendor ${vendor.name}`);
                      }}
                      className="w-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold py-2 rounded-lg transition-colors flex items-center justify-center space-x-1"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Export Settlement Report (.xls)</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'vendors' && (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex justify-between items-center">
              <div>
                <h3 className="font-bold text-slate-800 text-sm">Registered Vendors</h3>
                <p className="text-xs text-slate-500">Configure handling fees and store charge rules per vendor</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {vendors
                .filter(v => currentUser.role !== 'Vendor' || v.id === currentUser.vendorId)
                .map(v => (
                  <div key={v.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
                    <div className="flex justify-between items-center">
                      <h4 className="font-bold text-slate-800">{v.name}</h4>
                      <span className="text-xs font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded">{v.id}</span>
                    </div>
                    <p className="text-xs text-slate-500">📍 {v.address} | 📞 {v.phone}</p>
                    <div className="bg-slate-50 p-3 rounded-lg text-xs space-y-1 text-slate-600">
                      <div className="flex justify-between">
                        <span>Handling Fee / Order:</span>
                        <span className="font-bold text-slate-800">{v.handlingFee} Ks</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Free Storage Period:</span>
                        <span className="font-bold text-slate-800">{v.freeStorageDays} Days</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Overdue Store Charge / Day:</span>
                        <span className="font-bold text-slate-800">{v.dailyStoreFee} Ks</span>
                      </div>
                    </div>
                  </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'users' && currentUser.role === 'Admin' && (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex justify-between items-center">
              <div>
                <h3 className="font-bold text-slate-800 text-sm flex items-center">
                  <Users className="w-4 h-4 mr-2 text-indigo-600" />
                  System Users & Access Management
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">Create, edit and manage user credentials and roles</p>
              </div>

              <button 
                onClick={() => {
                  setEditingUser(null);
                  setNewUser({ username: '', password: '', name: '', role: 'Staff', vendorId: '' });
                  setShowUserModal(true);
                }}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs px-4 py-2 rounded-lg font-semibold flex items-center space-x-1 shadow-sm"
              >
                <UserPlus className="w-4 h-4" />
                <span>+ Create New User</span>
              </button>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
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
                <tbody className="divide-y divide-slate-100">
                  {usersList.map(u => (
                    <tr key={u.id} className="hover:bg-slate-50">
                      <td className="p-3 font-mono text-slate-400">{u.id}</td>
                      <td className="p-3 font-bold text-slate-800">{u.username}</td>
                      <td className="p-3 text-slate-700">{u.name}</td>
                      <td className="p-3">
                        <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
                          u.role === 'Admin' ? 'bg-indigo-100 text-indigo-700' :
                          u.role === 'Staff' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="p-3 text-right space-x-3">
                        <button 
                          onClick={() => {
                            setEditingUser(u);
                            setNewUser({ username: u.username, password: '', name: u.name, role: u.role, vendorId: u.vendorId || '' });
                            setShowUserModal(true);
                          }}
                          className="text-indigo-600 hover:underline font-semibold text-xs"
                        >
                          Edit
                        </button>
                        {u.username !== 'admin' && (
                          <button 
                            onClick={() => handleDeleteUser(u.id)}
                            className="text-rose-600 hover:underline font-bold text-xs"
                          >
                            Delete
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'logs' && currentUser.role === 'Admin' && (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex justify-between items-center">
              <div>
                <h3 className="font-bold text-slate-800 text-sm flex items-center">
                  <Activity className="w-4 h-4 mr-2 text-indigo-600" />
                  Audit Trail & Action Logs (Data Safety)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">Real-time log tracking user modifications and operations</p>
              </div>

              <button 
                onClick={() => exportSelectedToExcel('audit_logs', logs, [])}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-3 py-2 rounded-lg font-semibold flex items-center space-x-1 shadow-sm"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Logs (.xls)</span>
              </button>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-600 font-semibold border-b">
                  <tr>
                    <th className="p-3">Log ID</th>
                    <th className="p-3">User</th>
                    <th className="p-3">Role</th>
                    <th className="p-3">Action Details</th>
                    <th className="p-3">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {logs.map(log => (
                    <tr key={log.id} className="hover:bg-slate-50">
                      <td className="p-3 font-mono text-slate-400">{log.id}</td>
                      <td className="p-3 font-bold text-slate-800">{log.user}</td>
                      <td className="p-3">
                        <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium text-[10px]">
                          {log.role}
                        </span>
                      </td>
                      <td className="p-3 text-slate-700">{log.action}</td>
                      <td className="p-3 text-slate-400 font-mono text-[11px]">{log.timestamp}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </main>

      {showOrderModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-bold text-slate-800 text-base">New Order & Voucher Generation</h3>
              <button onClick={() => setShowOrderModal(false)} className="text-slate-400 hover:text-slate-600 text-lg">✕</button>
            </div>

            <form onSubmit={handleCreateOrder} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Select Vendor *</label>
                <select 
                  required
                  value={newOrder.vendorId}
                  onChange={(e) => setNewOrder({ ...newOrder, vendorId: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">-- Choose Vendor --</option>
                  {vendors.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Customer Name *</label>
                  <input 
                    type="text" required
                    value={newOrder.customerName}
                    onChange={(e) => setNewOrder({ ...newOrder, customerName: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg p-2"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Customer Phone *</label>
                  <input 
                    type="text" required
                    value={newOrder.customerPhone}
                    onChange={(e) => setNewOrder({ ...newOrder, customerPhone: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg p-2"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Delivery Address *</label>
                <textarea 
                  required rows={2}
                  value={newOrder.deliveryAddress}
                  onChange={(e) => setNewOrder({ ...newOrder, deliveryAddress: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg p-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Delivery Service</label>
                  <select 
                    value={newOrder.deliveryService}
                    onChange={(e) => setNewOrder({ ...newOrder, deliveryService: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg p-2"
                  >
                    <option value="Royal Express">Royal Express</option>
                    <option value="Ninja Van">Ninja Van</option>
                    <option value="Britium Express">Britium Express</option>
                    <option value="T&N Direct Delivery">T&N Direct Delivery</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Delivery Fee (Ks)</label>
                  <input 
                    type="number"
                    value={newOrder.deliveryFee}
                    onChange={(e) => setNewOrder({ ...newOrder, deliveryFee: Number(e.target.value) })}
                    className="w-full border border-slate-300 rounded-lg p-2"
                  />
                </div>
              </div>

              <div className="border-t pt-3 space-y-2">
                <label className="block font-semibold text-slate-700">Select Item Stock</label>
                {newOrder.items.map((it, idx) => (
                  <div key={idx} className="grid grid-cols-3 gap-2 bg-slate-50 p-2 rounded-lg">
                    <select 
                      required
                      value={it.itemId}
                      onChange={(e) => {
                        const updated = [...newOrder.items];
                        updated[idx].itemId = e.target.value;
                        setNewOrder({ ...newOrder, items: updated });
                      }}
                      className="border border-slate-300 rounded p-1.5 col-span-1"
                    >
                      <option value="">-- Select Item --</option>
                      {items.filter(i => !newOrder.vendorId || i.vendorId === newOrder.vendorId).map(i => (
                        <option key={i.id} value={i.id}>{i.name} ({i.quantity} left)</option>
                      ))}
                    </select>

                    <input 
                      type="number" placeholder="Qty" min="1" required
                      value={it.qty}
                      onChange={(e) => {
                        const updated = [...newOrder.items];
                        updated[idx].qty = Number(e.target.value);
                        setNewOrder({ ...newOrder, items: updated });
                      }}
                      className="border border-slate-300 rounded p-1.5"
                    />

                    <input 
                      type="number" placeholder="Discount (Ks)"
                      value={it.discount}
                      onChange={(e) => {
                        const updated = [...newOrder.items];
                        updated[idx].discount = Number(e.target.value);
                        setNewOrder({ ...newOrder, items: updated });
                      }}
                      className="border border-slate-300 rounded p-1.5"
                    />
                  </div>
                ))}
              </div>

              <div className="pt-3 flex space-x-2">
                <button 
                  type="button" onClick={() => setShowOrderModal(false)}
                  className="w-1/2 bg-slate-100 text-slate-700 py-2.5 rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="w-1/2 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-lg font-semibold shadow-md"
                >
                  Save & Print Voucher
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showItemModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-bold text-slate-800 text-base">Add Stock Item (Auto SKU & Storage Rules)</h3>
              <button onClick={() => setShowItemModal(false)} className="text-slate-400 hover:text-slate-600 text-lg">✕</button>
            </div>

            <form onSubmit={async (e) => {
              e.preventDefault();
              const vendorCode = newItem.vendorId === 'VND-101' ? 'A' : 'B';
              const autoSku = `SKU-VND-${vendorCode}-${Math.floor(1000 + Math.random() * 9000)}`;

              const itemObj = {
                id: `ITM-${Math.floor(100 + Math.random() * 900)}`,
                vendorId: newItem.vendorId,
                name: newItem.name,
                category: newItem.category || 'General',
                price: Number(newItem.price),
                cost: Number(newItem.cost),
                quantity: Number(newItem.quantity),
                damagedQty: 0,
                stockInDate: new Date().toISOString().split('T')[0],
                sku: autoSku,
                handlingFee: Number(newItem.handlingFee),
                storeChargePerDay: Number(newItem.storeChargePerDay),
                freeDays: Number(newItem.freeDays)
              };

              try {
                const response = await fetch(`${API_BASE_URL}/api/items`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(itemObj)
                });

                if (response.ok) {
                  setItems([itemObj, ...items]);
                  addLog(`Added new stock item ${itemObj.name} with auto SKU ${autoSku}`);
                  setShowItemModal(false);
                } else {
                  const errData = await response.json();
                  alert('Item သိမ်းဆည်းရာတွင် အမှားဖြစ်သွားပါသည်: ' + (errData.error || 'Unknown error'));
                }
              } catch (err) {
                console.error('API Error:', err);
                alert('Backend ဆီသို့ ချိတ်ဆက်၍မရပါ။');
              }
            }} className="space-y-3 text-xs">
              
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Vendor *</label>
                <select 
                  required value={newItem.vendorId}
                  onChange={(e) => setNewItem({ ...newItem, vendorId: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg p-2"
                >
                  <option value="">-- Choose Vendor --</option>
                  {vendors.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Item Name *</label>
                <input 
                  type="text" required value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg p-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Selling Price (Ks) *</label>
                  <input 
                    type="number" required value={newItem.price}
                    onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg p-2"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Capital Cost (Ks) *</label>
                  <input 
                    type="number" required value={newItem.cost}
                    onChange={(e) => setNewItem({ ...newItem, cost: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg p-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Initial Quantity *</label>
                  <input 
                    type="number" required value={newItem.quantity}
                    onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg p-2"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Handling Fee (Ks)</label>
                  <input 
                    type="number" value={newItem.handlingFee}
                    onChange={(e) => setNewItem({ ...newItem, handlingFee: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg p-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Store Charge / Day (Ks)</label>
                  <input 
                    type="number" value={newItem.storeChargePerDay}
                    onChange={(e) => setNewItem({ ...newItem, storeChargePerDay: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg p-2"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Free Storage Days</label>
                  <input 
                    type="number" value={newItem.freeDays}
                    onChange={(e) => setNewItem({ ...newItem, freeDays: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg p-2"
                  />
                </div>
              </div>

              <div className="pt-3 flex space-x-2">
                <button type="button" onClick={() => setShowItemModal(false)} className="w-1/2 bg-slate-100 py-2.5 rounded-lg font-semibold">Cancel</button>
                <button type="submit" className="w-1/2 bg-indigo-600 text-white py-2.5 rounded-lg font-semibold">Stock-In & Auto SKU</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showUserModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-bold text-slate-800 text-base">
                {editingUser ? 'Edit User Account' : 'Create New System User'}
              </h3>
              <button onClick={() => setShowUserModal(false)} className="text-slate-400 hover:text-slate-600 text-lg">✕</button>
            </div>

            <form onSubmit={handleSaveUser} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Username *</label>
                <input 
                  type="text" required value={newUser.username}
                  onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg p-2"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Password {editingUser && '(Leave blank to keep current)'}</label>
                <input 
                  type="password" value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg p-2"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Display Name</label>
                <input 
                  type="text" value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg p-2"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Role *</label>
                <select 
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg p-2"
                >
                  <option value="Admin">Admin (Full Control)</option>
                  <option value="Staff">Staff (Operations)</option>
                  <option value="Vendor">Vendor (View Only)</option>
                </select>
              </div>

              {newUser.role === 'Vendor' && (
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Associated Vendor</label>
                  <select 
                    value={newUser.vendorId}
                    onChange={(e) => setNewUser({ ...newUser, vendorId: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg p-2"
                  >
                    <option value="">-- Choose Vendor --</option>
                    {vendors.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                  </select>
                </div>
              )}

              <div className="pt-3 flex space-x-2">
                <button type="button" onClick={() => setShowUserModal(false)} className="w-1/2 bg-slate-100 py-2.5 rounded-lg font-semibold">Cancel</button>
                <button type="submit" className="w-1/2 bg-indigo-600 text-white py-2.5 rounded-lg font-semibold">
                  {editingUser ? 'Update User' : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showVoucherModal && selectedOrder && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-sm w-full p-6 shadow-2xl space-y-4 text-xs font-mono text-slate-800 border border-slate-200">
            
            <div className="text-center border-b pb-3">
              <h2 className="text-lg font-black tracking-wider text-slate-900">DELIVERY VOUCHER</h2>
              <p className="text-[11px] font-bold text-indigo-600">Order ID: {selectedOrder.id}</p>
              <p className="text-[10px] text-slate-400">{selectedOrder.createdAt}</p>
            </div>

            <div className="border-b pb-2 space-y-0.5">
              <p className="text-[10px] font-bold uppercase text-slate-400">Sender (Vendor):</p>
              <p className="font-bold text-slate-800">
                {vendors.find(v => v.id === selectedOrder.vendorId)?.name || selectedOrder.vendorId}
              </p>
              <p className="text-[10px] text-slate-500">Phone: {vendors.find(v => v.id === selectedOrder.vendorId)?.phone}</p>
            </div>

            <div className="border-b pb-2 space-y-0.5">
              <p className="text-[10px] font-bold uppercase text-slate-400">Deliver To:</p>
              <p className="font-bold text-slate-800">{selectedOrder.customerName}</p>
              <p className="text-slate-700">{selectedOrder.customerPhone}</p>
              <p className="text-slate-500 text-[10px]">{selectedOrder.deliveryAddress}</p>
            </div>

            <div className="border-b pb-2">
              <table className="w-full text-left text-[11px]">
                <thead>
                  <tr className="border-b text-slate-400">
                    <th className="py-1">Item</th>
                    <th className="py-1 text-center">Qty</th>
                    <th className="py-1 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {selectedOrder.items.map((it, i) => (
                    <tr key={i}>
                      <td className="py-1">{it.name}</td>
                      <td className="py-1 text-center">{it.qty}</td>
                      <td className="py-1 text-right">{(((Number(it.price) || 0) - (Number(it.discount) || 0)) * (Number(it.qty) || 1)).toLocaleString()} Ks</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="space-y-1 text-right">
              <div className="flex justify-between text-slate-500">
                <span>Items Subtotal:</span>
                <span>{(Number(selectedOrder.itemTotal) || 0).toLocaleString()} Ks</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Delivery Fee:</span>
                <span>{(Number(selectedOrder.deliveryFee) || 0).toLocaleString()} Ks</span>
              </div>
              <div className="flex justify-between font-extrabold text-sm text-slate-900 border-t pt-1">
                <span>Total COD to Pay:</span>
                <span className="text-indigo-600">{(Number(selectedOrder.totalCod) || 0).toLocaleString()} Ks</span>
              </div>
            </div>

            <div className="pt-3 border-t text-center space-y-1">
              <p className="text-[9px] text-slate-400 tracking-wider uppercase font-semibold">
                Supported by T&N Fulfillment Services
              </p>
              <p className="text-[8px] text-slate-300">Thank you for shopping with us!</p>
            </div>

            <div className="pt-2 flex space-x-2">
              <button 
                onClick={() => setShowVoucherModal(false)}
                className="w-1/2 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2 rounded font-sans font-semibold text-xs"
              >
                Close
              </button>
              <button 
                onClick={() => {
                  window.print();
                  addLog(`Printed voucher for ${selectedOrder.id}`);
                }}
                className="w-1/2 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded font-sans font-semibold text-xs flex items-center justify-center space-x-1"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Voucher</span>
              </button>
            </div>

          </div>
        </div>
      )}

      <footer className="bg-white border-t border-slate-200 py-3 text-center text-xs text-slate-500 mt-auto">
        T&N Fulfillment System • Supported by T&N
      </footer>
    </div>
  );
}