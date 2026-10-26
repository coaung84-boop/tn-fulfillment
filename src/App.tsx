import React, { useState, useEffect, useMemo } from 'react';
import { 
  Package, ShoppingCart, Truck, DollarSign, Users, FileText, 
  RotateCcw, ShieldCheck, Activity, Search, Plus, Edit, Trash2, 
  CheckCircle, Clock, AlertTriangle, Eye, Printer, Download, Upload,
  ArrowUpRight, ArrowDownRight, RefreshCw, Lock, UserCheck, Key,
  BarChart2, Filter, ChevronRight, LogOut, FileSpreadsheet, Tag, TrendingUp,
  PieChart, Table, ArrowUpDown, UserPlus, CheckSquare, Square, Bell, HardDrive, Shield, CreditCard
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
    items: [{ itemId: 'ITM-003', name: 'Oversized Cotton Tee', qty: 1, price: 18000, discount: 0, status: 'Pending' }],
    itemTotal: 18000,
    deliveryFee: 0,
    totalCod: 18000,
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
  const [deliveries, setDeliveries] = useState(INITIAL_DELIVERIES);
  const [items, setItems] = useState(INITIAL_ITEMS);
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [returns, setReturns] = useState(INITIAL_RETURNS);
  const [logs, setLogs] = useState(INITIAL_LOGS);
  const [cashLedger, setCashLedger] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [vendorFilter, setVendorFilter] = useState('ALL');

  const [selectedOrderIds, setSelectedOrderIds] = useState([]);
  const [selectedItemIds, setSelectedItemIds] = useState([]);
  const [selectedReturnIds, setSelectedReturnIds] = useState([]);
  const [selectedCashIds, setSelectedCashIds] = useState([]);

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
  const [showCashModal, setShowCashModal] = useState(false);
  
  // Advanced Cash Modal State
  const [cashFlowType, setCashFlowType] = useState('COD_IN'); // 'COD_IN' or 'VENDOR_OUT'
  const [selectedPartnerId, setSelectedPartnerId] = useState('');
  const [selectedVoucherIds, setSelectedVoucherIds] = useState([]);
  const [cashDescription, setCashDescription] = useState('');

  // Partial Return Modal State
  const [showPartialModal, setShowPartialModal] = useState(false);
  const [targetPartialOrder, setTargetPartialOrder] = useState(null);
  const [partialItemsForm, setPartialItemsForm] = useState([]);

  const [editingVendor, setEditingVendor] = useState(null);
  const [editingDelivery, setEditingDelivery] = useState(null);

  const [targetReturnItem, setTargetReturnItem] = useState(null);
  const [returnForm, setReturnForm] = useState({ qty: 1, reason: 'Overstock Return' });

  const [editingUser, setEditingUser] = useState(null);

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

        const resCash = await fetch(`${API_BASE_URL}/api/cash-ledger`);
        if (resCash.ok) {
          const dataCash = await resCash.json();
          if (Array.isArray(dataCash)) setCashLedger(dataCash);
        }

        const resNoti = await fetch(`${API_BASE_URL}/api/notifications`);
        if (resNoti.ok) {
          const dataNoti = await resNoti.json();
          if (Array.isArray(dataNoti)) setNotifications(dataNoti);
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

  const addNotification = async (title, message, type = 'info') => {
    const notiObj = {
      id: `NOTI-${Date.now().toString().slice(-4)}`,
      title,
      message,
      type,
      isRead: false,
      createdAt: new Date().toLocaleString()
    };
    try {
      await fetch(`${API_BASE_URL}/api/notifications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(notiObj)
      });
    } catch (e) {}
    setNotifications(prev => [notiObj, ...prev]);
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

  const handleCustomerPhoneChange = (phoneVal) => {
    setNewOrder(prev => {
      const updated = { ...prev, customerPhone: phoneVal };
      const matchedOrder = orders.find(o => o.customerPhone.trim() === phoneVal.trim());
      if (matchedOrder) {
        updated.customerName = matchedOrder.customerName;
        updated.deliveryAddress = matchedOrder.deliveryAddress;
      }
      return updated;
    });
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
    const totalStockValue = scopedItems.reduce((sum, i) => sum + ((Number(i.quantity) || 0) * (Number(i.price) || 0)), 0);

    return { totalOrders, pendingOrders, deliveredOrders, totalCodCollected, totalTnRevenue, totalStockValue };
  }, [scopedOrders, scopedItems]);

  const deliveryPerformanceStats = useMemo(() => {
    return deliveries.map(d => {
      const dOrders = orders.filter(o => o.deliveryService === d.name && !o.cancelled);
      const total = dOrders.length;
      const delivered = dOrders.filter(o => o.status === 'Delivered').length;
      const returned = dOrders.filter(o => o.status === 'Delivery Return' || o.status === 'Partial Return').length;
      const successRate = total > 0 ? Math.round((delivered / total) * 100) : 0;
      const returnRate = total > 0 ? Math.round((returned / total) * 100) : 0;
      return { id: d.id, name: d.name, total, delivered, returned, successRate, returnRate };
    });
  }, [deliveries, orders]);

  const chartData = useMemo(() => {
    if (chartMetric === 'del_orders' || chartMetric === 'del_cod' || chartMetric === 'del_success') {
      return deliveryPerformanceStats.map(d => ({
        id: d.id,
        name: d.name,
        qty: chartMetric === 'del_success' ? d.successRate : d.total,
        val: d.delivered,
        store: d.returnRate
      }));
    }

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
  }, [items, vendors, deliveryPerformanceStats, orders, chartMetric, sortOrder]);

  const maxChartValue = useMemo(() => {
    return Math.max(...chartData.map(d => Number(d[chartMetric.startsWith('del') ? 'qty' : chartMetric]) || 0), 1);
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

  const handleExportBackup = () => {
    const backupData = {
      version: '1.0',
      timestamp: new Date().toISOString(),
      usersList, vendors, deliveries, items, orders, returns, cashLedger, logs
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `TN_Fulfillment_Backup_${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    addLog('Exported full system JSON backup');
  };

  const handleImportBackup = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (parsed.orders && parsed.vendors) {
          if (parsed.usersList) setUsersList(parsed.usersList);
          if (parsed.vendors) setVendors(parsed.vendors);
          if (parsed.deliveries) setDeliveries(parsed.deliveries);
          if (parsed.items) setItems(parsed.items);
          if (parsed.orders) setOrders(parsed.orders);
          if (parsed.returns) setReturns(parsed.returns);
          if (parsed.cashLedger) setCashLedger(parsed.cashLedger);
          alert('Database Restore အောင်မြင်ပါသည်။');
          addLog('Restored system from JSON backup');
        } else {
          alert('Backup ဖိုင် ပုံစံ မှားယွင်းနေပါသည်။');
        }
      } catch (err) {
        alert('JSON ဖိုင်ကို ဖတ်၍မရပါ။');
      }
    };
    reader.readAsText(file);
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
      } catch (e) {}
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
        discount: Number(it.discount) || 0,
        status: 'Delivered'
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
      tnHandlingFee: 500,
      tnStoreFee: 0,
      codCollected: false,
      settlementStatus: 'Pending',
      createdAt: new Date().toLocaleString(),
      updatedBy: currentUser?.name || 'Staff'
    };

    try {
      await fetch(`${API_BASE_URL}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(createdOrder)
      });
      setOrders([createdOrder, ...orders]);

      for (const ordered of newOrder.items) {
        const targetItem = items.find(i => i.id === ordered.itemId);
        if (targetItem) {
          const newQty = Math.max(0, (Number(targetItem.quantity) || 0) - (Number(ordered.qty) || 1));
          await fetch(`${API_BASE_URL}/api/items/${targetItem.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ quantity: newQty })
          });
        }
      }

      setItems(prev => prev.map(item => {
        const ordered = newOrder.items.find(i => i.itemId === item.id);
        if (ordered) {
          return { ...item, quantity: Math.max(0, (Number(item.quantity) || 0) - (Number(ordered.qty) || 1)) };
        }
        return item;
      }));

      addNotification('New Order Created', `Order ID ${createdOrder.id} has been created.`, 'order');
      addLog(`Created new order ${createdOrder.id} for Vendor ${newOrder.vendorId}`);
      setShowOrderModal(false);
    } catch (err) {
      setOrders([createdOrder, ...orders]);
      setShowOrderModal(false);
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus, newTracking) => {
    const targetOrder = orders.find(o => o.id === orderId);
    
    if (newStatus === 'Cancelled' && currentUser?.role !== 'Admin') {
      alert('ခွင့်ပြုချက်မရှိပါ: Cancelled အခြေအနေသို့ ပြောင်းလဲရန် Admin အဆင့် လိုအပ်ပါသည်။');
      return;
    }

    if (targetOrder && targetOrder.status === 'Delivered' && currentUser?.role !== 'Admin') {
      alert('မေတ္တာရပ်ခံချက်: Delivered ဖြစ်ပြီးသား စာရင်းများကို Admin သာ ပြင်ဆင်ခွင့်ရှိပါသည်။');
      return;
    }

    if (newStatus === 'Partial Return') {
      setTargetPartialOrder(targetOrder);
      setPartialItemsForm(targetOrder.items.map(it => ({
        itemId: it.itemId,
        name: it.name,
        totalQty: it.qty,
        deliveredQty: it.qty,
        returnedQty: 0,
        price: it.price,
        discount: it.discount
      })));
      setShowPartialModal(true);
      return;
    }

    const isDelivered = newStatus === 'Delivered';
    const isCancelled = newStatus === 'Cancelled';
    const isDeliveryReturn = newStatus === 'Delivery Return';

    const updatedItems = targetOrder.items.map(it => ({
      ...it,
      status: isDelivered ? 'Delivered' : isDeliveryReturn ? 'Returned' : it.status
    }));

    const updatedFields = {
      status: newStatus,
      trackingNo: newTracking || targetOrder.trackingNo,
      cancelled: isCancelled || isDeliveryReturn,
      codCollected: isDelivered ? true : false,
      items: updatedItems,
      updatedBy: currentUser?.name || 'Staff'
    };

    if (isDeliveryReturn && targetOrder.status !== 'Delivery Return') {
      for (const ordItem of targetOrder.items) {
        const stockItem = items.find(i => i.id === ordItem.itemId);
        if (stockItem) {
          const restoredQty = (Number(stockItem.quantity) || 0) + (Number(ordItem.qty) || 1);
          try {
            await fetch(`${API_BASE_URL}/api/items/${stockItem.id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ quantity: restoredQty })
            });
          } catch (e) {}
        }
      }

      setItems(prev => prev.map(item => {
        const foundOrdItem = targetOrder.items.find(oi => oi.itemId === item.id);
        if (foundOrdItem) {
          return { ...item, quantity: (Number(item.quantity) || 0) + (Number(foundOrdItem.qty) || 1) };
        }
        return item;
      }));

      const newReturnObj = {
        id: `RET-${Date.now().toString().slice(-3)}`,
        orderId: targetOrder.id,
        itemId: targetOrder.items[0]?.itemId || '',
        vendorId: targetOrder.vendorId,
        itemName: targetOrder.items.map(i => `${i.name} (${i.qty} pcs)`).join(', '),
        qty: targetOrder.items.reduce((sum, i) => sum + (Number(i.qty) || 1), 0),
        type: 'Delivery Return',
        reason: 'Customer Refused / Returned from Delivery',
        status: 'In Warehouse',
        date: new Date().toLocaleDateString()
      };
      try {
        await fetch(`${API_BASE_URL}/api/returns`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newReturnObj)
        });
      } catch (e) {}
      setReturns(prev => [newReturnObj, ...prev]);
      addNotification('Delivery Return', `Order ${targetOrder.id} returned from delivery.`, 'return');
    }

    try {
      await fetch(`${API_BASE_URL}/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedFields)
      });
    } catch (err) {}

    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        return { ...o, ...updatedFields };
      }
      return o;
    }));
    addNotification('Order Updated', `Order ${orderId} status changed to ${newStatus}`, 'order');
    addLog(`Updated Order ${orderId} status to '${newStatus}'`);
  };

  const handleConfirmPartialReturn = async () => {
    if (!targetPartialOrder) return;

    let newItemTotal = 0;
    const updatedOrderItems = [];

    for (const pItem of partialItemsForm) {
      const deliveredQ = Number(pItem.deliveredQty) || 0;
      const returnedQ = Number(pItem.returnedQty) || 0;

      if (deliveredQ + returnedQ !== pItem.totalQty) {
        alert(`ပစ္စည်း "${pItem.name}" ၏ Delivered နှင့် Returned ပေါင်းစုအရေအတွက်သည် စုစုပေါင်းအရေအတွက် (${pItem.totalQty}) နှင့် ကိုက်ညီရပါမည်။`);
        return;
      }

      if (deliveredQ > 0) {
        newItemTotal += ((Number(pItem.price) || 0) - (Number(pItem.discount) || 0)) * deliveredQ;
        updatedOrderItems.push({
          itemId: pItem.itemId,
          name: pItem.name,
          qty: deliveredQ,
          price: pItem.price,
          discount: pItem.discount,
          status: 'Delivered'
        });
      }

      if (returnedQ > 0) {
        const stockItem = items.find(i => i.id === pItem.itemId);
        if (stockItem) {
          const newQty = (Number(stockItem.quantity) || 0) + returnedQ;
          try {
            await fetch(`${API_BASE_URL}/api/items/${stockItem.id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ quantity: newQty })
            });
          } catch (e) {}
          setItems(prev => prev.map(i => i.id === stockItem.id ? { ...i, quantity: newQty } : i));
        }

        const retObj = {
          id: `RET-${Date.now().toString().slice(-3)}-${Math.floor(Math.random()*100)}`,
          orderId: targetPartialOrder.id,
          itemId: pItem.itemId,
          vendorId: targetPartialOrder.vendorId,
          itemName: `${pItem.name} (${returnedQ} pcs)`,
          qty: returnedQ,
          type: 'Partial Return',
          reason: 'Customer Refused / Partial Delivery Return',
          status: 'In Warehouse',
          date: new Date().toLocaleDateString()
        };
        try {
          await fetch(`${API_BASE_URL}/api/returns`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(retObj)
          });
        } catch (e) {}
        setReturns(prev => [retObj, ...prev]);
      }
    }

    const newTotalCod = newItemTotal + (Number(targetPartialOrder.deliveryFee) || 0);

    const updatedFields = {
      status: 'Partial Return',
      items: updatedOrderItems.length > 0 ? updatedOrderItems : targetPartialOrder.items,
      itemTotal: newItemTotal,
      totalCod: newTotalCod,
      codCollected: true,
      updatedBy: currentUser?.name || 'Staff'
    };

    try {
      await fetch(`${API_BASE_URL}/api/orders/${targetPartialOrder.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedFields)
      });
    } catch (e) {}

    setOrders(prev => prev.map(o => o.id === targetPartialOrder.id ? { ...o, ...updatedFields } : o));
    addLog(`Processed Partial Return for Order ${targetPartialOrder.id}`);
    setShowPartialModal(false);
    setTargetPartialOrder(null);
  };

  const handleDeleteVoucher = async (orderId) => {
    if (currentUser?.role !== 'Admin') {
      alert('ခွင့်ပြုချက်မရှိပါ: Voucher များကို ဖျက်ရန် Admin အဆင့် လိုအပ်ပါသည်။');
      return;
    }
    const targetOrder = orders.find(o => o.id === orderId);
    if (!targetOrder?.cancelled) {
      alert('ခွင့်ပြုချက်မရှိပါ: Cancelled ဖြစ်နေသော Voucher များကိုသာ ဖျက်ခွင့်ရှိပါသည်။');
      return;
    }

    if (confirm(`သတိပေးချက်: Cancelled Voucher ${orderId} ကို စနစ်ထဲမှ အပြီးတိုင် ဖျက်ပစ်ရန် သေချာပါသလား?`)) {
      try {
        await fetch(`${API_BASE_URL}/api/orders/${orderId}`, { method: 'DELETE' });
        setOrders(prev => prev.filter(o => o.id !== orderId));
        setSelectedOrderIds(prev => prev.filter(id => id !== orderId));
        addLog(`Admin deleted Voucher ${orderId}`);
      } catch (err) {
        setOrders(prev => prev.filter(o => o.id !== orderId));
        setSelectedOrderIds(prev => prev.filter(id => id !== orderId));
      }
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

          <div className="flex items-center space-x-3">
            {/* Notification Bell */}
            <div className="relative">
              <button 
                onClick={() => setShowNotificationDropdown(!showNotificationDropdown)}
                className="relative bg-slate-800 hover:bg-slate-700 p-2 rounded-lg text-slate-200 transition-colors"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                {notifications.filter(n => !n.isRead).length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                    {notifications.filter(n => !n.isRead).length}
                  </span>
                )}
              </button>

              {showNotificationDropdown && (
                <div className="absolute right-0 mt-2 w-80 bg-white text-slate-800 rounded-xl shadow-2xl border border-slate-200 z-50 overflow-hidden">
                  <div className="bg-slate-100 p-3 font-bold text-xs border-b flex justify-between items-center">
                    <span>Notifications</span>
                    <button 
                      onClick={() => setNotifications(notifications.map(n => ({ ...n, isRead: true })))}
                      className="text-[10px] text-indigo-600 hover:underline"
                    >
                      Mark all read
                    </button>
                  </div>
                  <div className="max-h-64 overflow-y-auto divide-y text-xs">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-slate-400">No notifications</div>
                    ) : (
                      notifications.map(n => (
                        <div key={n.id} className={`p-3 hover:bg-slate-50 ${!n.isRead ? 'bg-indigo-50/50 font-semibold' : ''}`}>
                          <p className="text-slate-900">{n.title}</p>
                          <p className="text-slate-600 text-[11px] mt-0.5">{n.message}</p>
                          <p className="text-[9px] text-slate-400 mt-1">{n.createdAt}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Backup & Restore Buttons */}
            {currentUser.role === 'Admin' && (
              <div className="flex items-center space-x-1">
                <button 
                  onClick={handleExportBackup}
                  className="bg-slate-800 hover:bg-slate-700 text-emerald-400 text-xs px-2.5 py-2 rounded-lg font-semibold flex items-center space-x-1"
                  title="Download System JSON Backup"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Backup</span>
                </button>
                <label className="bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs px-2.5 py-2 rounded-lg font-semibold flex items-center space-x-1 cursor-pointer" title="Restore Backup JSON">
                  <Upload className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Restore</span>
                  <input type="file" accept=".json" onChange={handleImportBackup} className="hidden" />
                </label>
              </div>
            )}

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
              { id: 'settlements', label: 'Vendors', icon: CreditCard }, // Updated icon & name
              { id: 'deliveries', label: 'Delivery Services', icon: Truck },
              { id: 'cash_ledger', label: 'Cash Management', icon: DollarSign },
              { id: 'users', label: 'User Management', icon: Users, adminOnly: true },
              { id: 'logs', label: 'Action Logs', icon: Activity, adminOnly: true },
            ].map(tab => {
              if (tab.adminOnly && currentUser.role !== 'Admin') return null;
              if (currentUser.role === 'Vendor' && ['settlements', 'logs', 'users', 'deliveries', 'cash_ledger'].includes(tab.id)) return null;
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
                    <p className="text-xs text-slate-400 mt-1">Handling (Pending onwards) + Store</p>
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
                        <option value="del_orders">Delivery Orders Volume (Units)</option>
                        <option value="del_cod">Delivery COD Collectible (Ks)</option>
                        <option value="del_success">Delivery Success Rate (%)</option>
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
                         chartMetric === 'del_orders' ? `Total Orders: ${hoveredPoint.qty} Waybills` :
                         chartMetric === 'del_success' ? `Success Rate: ${hoveredPoint.qty}%` :
                         `Store Charges: ${(hoveredPoint.store || 0).toLocaleString()} Ks`}
                      </p>
                    </div>
                  )}

                  {chartType === 'line' && (
                    <div className="h-44 w-full flex items-end justify-between gap-4 border-b border-indigo-100 pb-2 relative">
                      <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <path
                          d={`M ${chartData.map((d, i) => {
                            const val = chartMetric.startsWith('del') ? d.qty : (d[chartMetric] || 0);
                            const x = (i / (chartData.length - 1 || 1)) * 100;
                            const y = 100 - ((val / maxChartValue) * 80);
                            return `${i === 0 ? '' : 'L '} ${x} ${y}`;
                          }).join(' ')}`}
                          fill="none"
                          stroke="#6366f1"
                          strokeWidth="2.5"
                          vectorEffect="non-scaling-stroke"
                        />
                      </svg>
                      {chartData.map((d) => {
                        const val = chartMetric.startsWith('del') ? d.qty : (d[chartMetric] || 0);
                        const heightPct = Math.max(15, (val / maxChartValue) * 100);
                        return (
                          <div 
                            key={d.id} 
                            onMouseEnter={() => setHoveredPoint(d)}
                            onMouseLeave={() => setHoveredPoint(null)}
                            className="flex-1 flex flex-col items-center group cursor-pointer z-10"
                          >
                            <div className="text-[10px] font-bold text-indigo-600 mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              {(val || 0).toLocaleString()}
                            </div>
                            <div 
                              className="w-3.5 h-3.5 bg-indigo-600 rounded-full border-2 border-white shadow-md group-hover:scale-150 transition-transform"
                              style={{ marginBottom: `${heightPct * 1.2}px` }}
                            ></div>
                            <span className="text-xs font-semibold text-slate-600 truncate max-w-[100px]">{d.name}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {chartType === 'bar' && (
                    <div className="h-44 w-full flex items-end justify-around gap-4 border-b border-indigo-100 pb-2 relative">
                      {chartData.map(d => {
                        const val = chartMetric.startsWith('del') ? d.qty : (d[chartMetric] || 0);
                        const heightPct = Math.max(10, (val / maxChartValue) * 100);
                        return (
                          <div 
                            key={d.id}
                            onMouseEnter={() => setHoveredPoint(d)}
                            onMouseLeave={() => setHoveredPoint(null)}
                            className="flex-1 h-full flex flex-col items-center justify-end group cursor-pointer"
                          >
                            <span className="text-[10px] font-bold text-indigo-600 mb-1">{(val || 0).toLocaleString()}</span>
                            <div 
                              className="w-full max-w-[60px] bg-indigo-500 group-hover:bg-indigo-600 rounded-t-lg transition-all shadow-md"
                              style={{ height: `${heightPct}%`, minHeight: '8px' }}
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
                        const val = chartMetric.startsWith('del') ? d.qty : (d[chartMetric] || 0);
                        const pct = Math.round((val / maxChartValue) * 100);
                        return (
                          <div key={d.id} className="space-y-1">
                            <div className="flex justify-between text-xs font-medium">
                              <span>{d.name}</span>
                              <span className="font-bold text-indigo-600">{(val || 0).toLocaleString()} ({pct}%)</span>
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
                            <th className="p-2.5">{chartMetric.startsWith('del') ? 'Delivery Service Name' : 'Vendor Name'}</th>
                            <th className="p-2.5">{chartMetric === 'del_orders' ? 'Total Waybills' : chartMetric === 'del_success' ? 'Success Rate (%)' : 'Stock Quantity'}</th>
                            <th className="p-2.5">{chartMetric.startsWith('del') ? 'Delivered Qty' : 'Total Selling Value'}</th>
                            <th className="p-2.5">{chartMetric.startsWith('del') ? 'Return Rate (%)' : 'Overdue Store Charges'}</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y">
                          {chartData.map(d => (
                            <tr key={d.id} className="hover:bg-slate-50">
                              <td className="p-2.5 font-bold text-slate-800">{d.name}</td>
                              <td className="p-2.5 font-semibold text-indigo-600">{chartMetric.startsWith('del') ? `${d.qty}${chartMetric === 'del_success' ? '%' : ' Orders'}` : `${d.qty} Units`}</td>
                              <td className="p-2.5 text-slate-700">{chartMetric.startsWith('del') ? `${d.val} Orders` : `${(d.val || 0).toLocaleString()} Ks`}</td>
                              <td className="p-2.5 text-amber-600 font-bold">{chartMetric.startsWith('del') ? `${d.store}%` : `${(d.store || 0).toLocaleString()} Ks`}</td>
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
                      <span>Create New Order & Voucher</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => { setActiveTab('inventory'); setShowItemModal(true); }}
                      className="w-full text-left px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center justify-between transition-colors"
                    >
                      <span>Add Stock / Item for Vendor</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => setActiveTab('cash_ledger')}
                      className="w-full text-left px-4 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg text-xs font-semibold flex items-center justify-between transition-colors"
                    >
                      <span>Cash Management & Payout</span>
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
                      <th className="p-3 text-right">Voucher / Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {scopedOrders
                      .filter(o => o.id.toLowerCase().includes(searchTerm.toLowerCase()) || o.customerName.toLowerCase().includes(searchTerm.toLowerCase()))
                      .map(order => {
                        const vendor = vendors.find(v => v.id === order.vendorId);
                        const isLocked = currentUser.role === 'Vendor' || (currentUser.role !== 'Admin' && (order.status === 'Delivered' || order.status === 'Cancelled'));
                        const isSelected = selectedOrderIds.includes(order.id);

                        return (
                          <tr key={order.id} className={`hover:bg-slate-50 ${order.cancelled ? 'bg-rose-50/50 opacity-80' : ''}`}>
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
                              <p className="text-slate-400 font-mono text-[10px]">Trk: {order.trackingNo}</p>
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
                                  order.status === 'Partial Return' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                                  'bg-amber-50 text-amber-700 border-amber-200'
                                } ${isLocked ? 'cursor-not-allowed opacity-80' : 'cursor-pointer'}`}
                              >
                                <option value="Pending">Pending</option>
                                <option value="In-Transit">In-Transit</option>
                                <option value="Delivered">Delivered</option>
                                <option value="Partial Return">Partial Return</option>
                                <option value="Delivery Return">Delivery Return</option>
                                {currentUser.role === 'Admin' && <option value="Cancelled">Cancelled</option>}
                              </select>
                            </td>
                            <td className="p-3 text-right space-x-1.5 whitespace-nowrap">
                              <button 
                                onClick={() => { setSelectedOrder(order); setShowVoucherModal(true); }}
                                className="bg-slate-100 hover:bg-slate-200 text-slate-700 p-1.5 rounded text-[11px] font-semibold inline-flex items-center space-x-1"
                                title="Print / View Voucher"
                              >
                                <Printer className="w-3.5 h-3.5" />
                                <span>Voucher</span>
                              </button>

                              {currentUser.role === 'Admin' && order.cancelled && (
                                <button 
                                  onClick={() => handleDeleteVoucher(order.id)}
                                  className="bg-rose-50 hover:bg-rose-100 text-rose-700 p-1.5 rounded text-[11px] font-semibold inline-flex items-center space-x-1"
                                  title="Delete Permanent (Cancelled Only)"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                  <span>Delete</span>
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
                    onClick={() => {
                      setIsExistingItemMode(true);
                      setNewItem({ vendorId: '', existingItemId: '', name: '', category: 'General', price: '', quantity: '', handlingFee: '500', storeChargePerDay: '30', freeDays: '7' });
                      setShowItemModal(true);
                    }}
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
                      <th className="p-3">Selling Price</th>
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
                                  setTargetReturnItem(item);
                                  setReturnForm({ qty: 1, reason: 'Overstock / Damaged Return' });
                                  setShowReturnModal(true);
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

        {/* Vendors Tab (Renamed from Vendors (Financial)) */}
        {activeTab === 'settlements' && currentUser.role !== 'Vendor' && (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex justify-between items-center">
              <div>
                <h3 className="font-bold text-slate-800 text-sm">Vendors Management</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Manage vendors, bank accounts, net payable calculations, and statements. (Payouts managed via Cash Management)
                </p>
              </div>

              {currentUser.role === 'Admin' && (
                <button 
                  onClick={() => {
                    setEditingVendor(null);
                    setNewVendor({ name: '', phone: '', address: '', bankAccount: '' });
                    setShowVendorModal(true);
                  }}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs px-4 py-2 rounded-lg font-semibold flex items-center space-x-1 shadow-sm"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  <span>Register New Vendor</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {vendors.map(vendor => {
                const vendorDeliveredOrders = orders.filter(o => o.vendorId === vendor.id && (o.status === 'Delivered' || o.status === 'Partial Return') && !o.cancelled);
                const vendorActiveOrders = orders.filter(o => o.vendorId === vendor.id && !o.cancelled); 
                
                const totalCodCollected = vendorDeliveredOrders.reduce((sum, o) => sum + (Number(o.totalCod) || 0), 0);
                const totalHandlingFee = vendorActiveOrders.reduce((sum, o) => sum + (Number(o.tnHandlingFee) || 0), 0);
                
                const vendorItems = items.filter(i => i.vendorId === vendor.id);
                const totalStoreCharge = vendorItems.reduce((sum, i) => sum + calculateStoreCharge(i), 0);

                const netPayable = totalCodCollected - totalHandlingFee - totalStoreCharge;

                return (
                  <div key={vendor.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
                    <div className="flex justify-between items-start border-b pb-3">
                      <div>
                        <h4 className="font-bold text-slate-800 text-base">{vendor.name}</h4>
                        <p className="text-xs text-slate-400">📍 {vendor.address} | 📞 {vendor.phone}</p>
                        {vendor.bankAccount && <p className="text-[11px] text-indigo-600 font-mono mt-0.5">🏦 {vendor.bankAccount}</p>}
                      </div>
                      <div className="text-right">
                        <span className="bg-indigo-50 text-indigo-700 font-bold text-xs px-2.5 py-1 rounded-full">
                          {vendor.id}
                        </span>
                        {currentUser.role === 'Admin' && (
                          <div className="mt-2 space-x-2">
                            <button 
                              onClick={() => {
                                setEditingVendor(vendor);
                                setNewVendor({ name: vendor.name, phone: vendor.phone, address: vendor.address, bankAccount: vendor.bankAccount });
                                setShowVendorModal(true);
                              }}
                              className="text-xs text-indigo-600 hover:underline font-semibold"
                            >
                              Edit
                            </button>
                            <button 
                              onClick={() => handleDeleteVendor(vendor.id)}
                              className="text-xs text-rose-600 hover:underline font-semibold"
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between text-slate-600">
                        <span>Delivered COD Collected:</span>
                        <span className="font-semibold text-slate-800">{totalCodCollected.toLocaleString()} Ks</span>
                      </div>
                      <div className="flex justify-between text-slate-600">
                        <span>T&N Handling Fee Deduct (Active orders):</span>
                        <span className="font-semibold text-red-600">- {totalHandlingFee.toLocaleString()} Ks</span>
                      </div>
                      <div className="flex justify-between text-slate-600">
                        <span>Warehouse Store Charges:</span>
                        <span className="font-semibold text-red-600">- {totalStoreCharge.toLocaleString()} Ks</span>
                      </div>
                      <div className="border-t pt-2 flex justify-between font-bold text-sm text-slate-900">
                        <span>Net Balance Payable:</span>
                        <span className="text-emerald-600">{netPayable.toLocaleString()} Ks</span>
                      </div>
                    </div>

                    <button 
                      onClick={() => {
                        exportSelectedToExcel(`settlement_${vendor.id}`, vendorDeliveredOrders, vendorDeliveredOrders.map(o => o.id));
                        addLog(`Exported settlement statement for Vendor ${vendor.name}`);
                      }}
                      className="w-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold py-2 rounded-lg transition-colors flex items-center justify-center space-x-1"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Export Statement Report (.xls)</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Deliveries Tab */}
        {activeTab === 'deliveries' && currentUser.role !== 'Vendor' && (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex justify-between items-center">
              <div>
                <h3 className="font-bold text-slate-800 text-sm">Delivery Services Management</h3>
                <p className="text-xs text-slate-500">Manage delivery partners, track sent lists, pending lists, and COD receivable amounts.</p>
              </div>

              {currentUser.role === 'Admin' && (
                <button 
                  onClick={() => {
                    setEditingDelivery(null);
                    setNewDelivery({ name: '', phone: '', address: '', bankAccount: '' });
                    setShowDeliveryModal(true);
                  }}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs px-4 py-2 rounded-lg font-semibold flex items-center space-x-1 shadow-sm"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  <span>Register New Delivery Service</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {deliveries.map(del => {
                const delOrders = orders.filter(o => o.deliveryService === del.name && !o.cancelled);
                const sentList = delOrders.filter(o => o.status === 'Delivered' || o.status === 'Partial Return');
                const pendingList = delOrders.filter(o => o.status === 'Pending' || o.status === 'In-Transit');
                const codReceivable = sentList.filter(o => o.codCollected).reduce((sum, o) => sum + (Number(o.totalCod) || 0), 0);

                return (
                  <div key={del.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
                    <div className="flex justify-between items-start border-b pb-3">
                      <div>
                        <h4 className="font-bold text-slate-800 text-base">{del.name}</h4>
                        <p className="text-xs text-slate-400">📞 {del.phone} | 📍 {del.address}</p>
                        {del.bankAccount && <p className="text-[11px] text-indigo-600 font-mono mt-0.5">🏦 {del.bankAccount}</p>}
                      </div>
                      <div className="space-x-2">
                        <span className="bg-indigo-50 text-indigo-700 font-bold text-xs px-2.5 py-1 rounded-full">{del.id}</span>
                        {currentUser.role === 'Admin' && (
                          <div className="mt-2 text-right space-x-2">
                            <button 
                              onClick={() => {
                                setEditingDelivery(del);
                                setNewDelivery({ name: del.name, phone: del.phone, address: del.address, bankAccount: del.bankAccount });
                                setShowDeliveryModal(true);
                              }}
                              className="text-xs text-indigo-600 hover:underline font-semibold"
                            >
                              Edit
                            </button>
                            <button 
                              onClick={() => handleDeleteDelivery(del.id, del.name)}
                              className="text-xs text-rose-600 hover:underline font-semibold"
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between text-slate-600">
                        <span>စာရင်းပို့ပြီး (Delivered Orders):</span>
                        <span className="font-bold text-emerald-600">{sentList.length} Waybills</span>
                      </div>
                      <div className="flex justify-between text-slate-600">
                        <span>ပို့ရန်ကျန်စာရင်း (Pending / In-Transit):</span>
                        <span className="font-bold text-amber-600">{pendingList.length} Waybills</span>
                      </div>
                      <div className="flex justify-between text-slate-600">
                        <span>ရရန်ရှိ COD စာရင်း (COD Receivable):</span>
                        <span className="font-bold text-slate-800">{codReceivable.toLocaleString()} Ks</span>
                      </div>
                    </div>

                    <button 
                      onClick={() => {
                        exportSelectedToExcel(`delivery_${del.id}`, delOrders, delOrders.map(o => o.id));
                        addLog(`Exported delivery report for ${del.name}`);
                      }}
                      className="w-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold py-2 rounded-lg transition-colors flex items-center justify-center space-x-1"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Export Delivery Report (.xls)</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Cash Management Tab */}
        {activeTab === 'cash_ledger' && currentUser.role !== 'Vendor' && (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex justify-between items-center">
              <div>
                <h3 className="font-bold text-slate-800 text-sm">Cash Management & Voucher-based Settlement Ledger</h3>
                <p className="text-xs text-slate-500">Record actual cash inflow (COD flow by Delivery vouchers) and actual payout (Vendor payout by vouchers)</p>
              </div>

              <div className="flex space-x-2">
                <button 
                  onClick={() => exportSelectedToExcel('cash_ledger', cashLedger, selectedCashIds)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-3 py-2 rounded-lg font-semibold flex items-center space-x-1 shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export Payment Excel (.xls)</span>
                </button>
                <button 
                  onClick={() => {
                    setCashFlowType('COD_IN');
                    setSelectedPartnerId('');
                    setSelectedVoucherIds([]);
                    setCashDescription('');
                    setShowCashModal(true);
                  }}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs px-4 py-2 rounded-lg font-semibold flex items-center space-x-1 shadow-sm"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  <span>Add Cash Transaction</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <p className="text-xs font-semibold text-slate-500 uppercase">Total COD Inflow (Actual)</p>
                <p className="text-2xl font-bold text-emerald-600 mt-1">
                  {cashLedger.filter(c => c.type === 'COD_IN').reduce((s, c) => s + c.amount, 0).toLocaleString()} Ks
                </p>
              </div>
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <p className="text-xs font-semibold text-slate-500 uppercase">Total Vendor Outflow (Actual)</p>
                <p className="text-2xl font-bold text-rose-600 mt-1">
                  {cashLedger.filter(c => c.type === 'VENDOR_OUT' || c.type === 'EXPENSE').reduce((s, c) => s + c.amount, 0).toLocaleString()} Ks
                </p>
              </div>
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <p className="text-xs font-semibold text-slate-500 uppercase">Net T&N Cash Balance</p>
                <p className="text-2xl font-bold text-indigo-600 mt-1">
                  {(
                    cashLedger.filter(c => c.type === 'COD_IN').reduce((s, c) => s + c.amount, 0) -
                    cashLedger.filter(c => c.type === 'VENDOR_OUT' || c.type === 'EXPENSE').reduce((s, c) => s + c.amount, 0)
                  ).toLocaleString()} Ks
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-600 font-semibold border-b">
                  <tr>
                    <th className="p-3 w-10 text-center">
                      <input 
                        type="checkbox"
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedCashIds(cashLedger.map(c => c.id));
                          } else {
                            setSelectedCashIds([]);
                          }
                        }}
                      />
                    </th>
                    <th className="p-3">ID</th>
                    <th className="p-3">Type</th>
                    <th className="p-3">Reference / Voucher</th>
                    <th className="p-3">Description</th>
                    <th className="p-3">Amount</th>
                    <th className="p-3">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {cashLedger.map(c => {
                    const isSelected = selectedCashIds.includes(c.id);
                    return (
                      <tr key={c.id} className="hover:bg-slate-50">
                        <td className="p-3 text-center">
                          <input 
                            type="checkbox"
                            checked={isSelected}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedCashIds([...selectedCashIds, c.id]);
                              } else {
                                setSelectedCashIds(selectedCashIds.filter(id => id !== c.id));
                              }
                            }}
                          />
                        </td>
                        <td className="p-3 font-mono text-slate-500">{c.id}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            c.type === 'COD_IN' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                          }`}>
                            {c.type}
                          </span>
                        </td>
                        <td className="p-3 font-bold text-indigo-600">{c.referenceId || '-'}</td>
                        <td className="p-3 text-slate-700">{c.description}</td>
                        <td className={`p-3 font-bold ${c.type === 'COD_IN' ? 'text-emerald-600' : 'text-rose-600'}`}>
                          {c.type === 'COD_IN' ? '+' : '-'} {c.amount.toLocaleString()} Ks
                        </td>
                        <td className="p-3 text-slate-400">{c.date}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
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
                <UserPlus className="w-4 h-4 mr-1" />
                <span>Create New User</span>
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

      {/* Advanced Cash Transaction Modal (Voucher-based COD & Vendor Payout Flow) */}
      {showCashModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-bold text-slate-800 text-base">Add Cash Transaction (Voucher Flow)</h3>
              <button onClick={() => setShowCashModal(false)} className="text-slate-400 hover:text-slate-600 text-lg">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Transaction Flow Type *</label>
                <select 
                  value={cashFlowType}
                  onChange={(e) => {
                    setCashFlowType(e.target.value);
                    setSelectedPartnerId('');
                    setSelectedVoucherIds([]);
                  }}
                  className="w-full border border-slate-300 rounded-lg p-2 bg-white"
                >
                  <option value="COD_IN">COD Flow (Delivery Collection)</option>
                  <option value="VENDOR_OUT">Vendor Payout Flow (Settlement)</option>
                </select>
              </div>

              {cashFlowType === 'COD_IN' ? (
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Select Delivery Service *</label>
                  <select 
                    value={selectedPartnerId}
                    onChange={(e) => {
                      setSelectedPartnerId(e.target.value);
                      setSelectedVoucherIds([]);
                    }}
                    className="w-full border border-slate-300 rounded-lg p-2 bg-white"
                  >
                    <option value="">-- Choose Delivery Service --</option>
                    {deliveries.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
                  </select>
                </div>
              ) : (
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Select Vendor *</label>
                  <select 
                    value={selectedPartnerId}
                    onChange={(e) => {
                      setSelectedPartnerId(e.target.value);
                      setSelectedVoucherIds([]);
                    }}
                    className="w-full border border-slate-300 rounded-lg p-2 bg-white"
                  >
                    <option value="">-- Choose Vendor --</option>
                    {vendors.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                  </select>
                </div>
              )}

              {/* Voucher Selection Table */}
              {selectedPartnerId && (
                <div className="space-y-2">
                  <label className="block font-semibold text-slate-700">Select Outstanding Vouchers for Actual Payment:</label>
                  <div className="border rounded-lg max-h-48 overflow-y-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-100 text-slate-600 sticky top-0">
                        <tr>
                          <th className="p-2 w-10 text-center">Select</th>
                          <th className="p-2">Order ID</th>
                          <th className="p-2">Customer / Details</th>
                          <th className="p-2 text-right">Amount (Ks)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {cashFlowType === 'COD_IN' ? (
                          orders
                            .filter(o => o.deliveryService === selectedPartnerId && (o.status === 'Delivered' || o.status === 'Partial Return') && !o.cancelled)
                            .map(ord => {
                              const isChecked = selectedVoucherIds.includes(ord.id);
                              return (
                                <tr key={ord.id} className="hover:bg-slate-50">
                                  <td className="p-2 text-center">
                                    <input 
                                      type="checkbox"
                                      checked={isChecked}
                                      onChange={(e) => {
                                        if (e.target.checked) {
                                          setSelectedVoucherIds([...selectedVoucherIds, ord.id]);
                                        } else {
                                          setSelectedVoucherIds(selectedVoucherIds.filter(id => id !== ord.id));
                                        }
                                      }}
                                    />
                                  </td>
                                  <td className="p-2 font-bold text-indigo-600">{ord.id}</td>
                                  <td className="p-2">{ord.customerName} ({ord.customerPhone})</td>
                                  <td className="p-2 text-right font-semibold">{(Number(ord.totalCod) || 0).toLocaleString()} Ks</td>
                                </tr>
                              );
                            })
                        ) : (
                          orders
                            .filter(o => o.vendorId === selectedPartnerId && (o.status === 'Delivered' || o.status === 'Partial Return') && !o.cancelled)
                            .map(ord => {
                              const isChecked = selectedVoucherIds.includes(ord.id);
                              const netOrderVal = (Number(ord.totalCod) || 0) - (Number(ord.tnHandlingFee) || 0);
                              return (
                                <tr key={ord.id} className="hover:bg-slate-50">
                                  <td className="p-2 text-center">
                                    <input 
                                      type="checkbox"
                                      checked={isChecked}
                                      onChange={(e) => {
                                        if (e.target.checked) {
                                          setSelectedVoucherIds([...selectedVoucherIds, ord.id]);
                                        } else {
                                          setSelectedVoucherIds(selectedVoucherIds.filter(id => id !== ord.id));
                                        }
                                      }}
                                    />
                                  </td>
                                  <td className="p-2 font-bold text-indigo-600">{ord.id}</td>
                                  <td className="p-2">{ord.customerName} (COD: {(Number(ord.totalCod) || 0).toLocaleString()})</td>
                                  <td className="p-2 text-right font-semibold text-rose-600">{netOrderVal.toLocaleString()} Ks</td>
                                </tr>
                              );
                            })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description / Notes</label>
                <textarea 
                  rows={2} value={cashDescription}
                  onChange={(e) => setCashDescription(e.target.value)}
                  placeholder="Optional notes for actual payment transaction..."
                  className="w-full border border-slate-300 rounded-lg p-2"
                />
              </div>

              <div className="pt-3 flex space-x-2">
                <button type="button" onClick={() => setShowCashModal(false)} className="w-1/2 bg-slate-100 py-2.5 rounded-lg font-semibold">Cancel</button>
                <button 
                  type="button" 
                  onClick={async () => {
                    if (!selectedPartnerId || selectedVoucherIds.length === 0) {
                      alert('ကျေးဇူးပြု၍ Partner နှင့် Voucher များကို အနည်းဆုံး တစ်ခု ရွေးချယ်ပါ။');
                      return;
                    }

                    let totalAmount = 0;
                    if (cashFlowType === 'COD_IN') {
                      orders.forEach(o => {
                        if (selectedVoucherIds.includes(o.id)) {
                          totalAmount += Number(o.totalCod) || 0;
                        }
                      });
                    } else {
                      orders.forEach(o => {
                        if (selectedVoucherIds.includes(o.id)) {
                          totalAmount += (Number(o.totalCod) || 0) - (Number(o.tnHandlingFee) || 0);
                        }
                      });
                    }

                    const cObj = {
                      id: `CASH-${Date.now().toString().slice(-4)}`,
                      type: cashFlowType,
                      referenceId: `${selectedPartnerId} [${selectedVoucherIds.join(', ')}]`,
                      amount: totalAmount,
                      description: cashDescription || `${cashFlowType} for ${selectedVoucherIds.length} vouchers`,
                      date: new Date().toLocaleDateString(),
                      createdBy: currentUser?.name || 'Staff'
                    };

                    try {
                      await fetch(`${API_BASE_URL}/api/cash-ledger`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(cObj)
                      });
                      setCashLedger([cObj, ...cashLedger]);
                      setShowCashModal(false);
                      addLog(`Recorded actual cash payment ${cashFlowType} of ${totalAmount} Ks`);
                    } catch (err) {
                      setCashLedger([cObj, ...cashLedger]);
                      setShowCashModal(false);
                    }
                  }}
                  className="w-1/2 bg-indigo-600 text-white py-2.5 rounded-lg font-semibold"
                >
                  Confirm Actual Payment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Partial Return Confirmation Modal */}
      {showPartialModal && targetPartialOrder && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <div>
                <h3 className="font-bold text-slate-800 text-sm">Partial Return Confirmation</h3>
                <p className="text-[11px] text-slate-500">Order ID: {targetPartialOrder.id} ({targetPartialOrder.customerName})</p>
              </div>
              <button onClick={() => setShowPartialModal(false)} className="text-slate-400 hover:text-slate-600 text-lg">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <p className="text-slate-600">ကျေးဇူးပြု၍ ပစ္စည်းတစ်ခုချင်းစီအလိုက် ပို့ဆောင်နိုင်ခဲ့သော အရေအတွက် (Delivered Qty) နှင့် ပြန်လည်ရောက်ရှိလာသော အရေအတွက် (Returned Qty) ကို စစ်ဆေးအတည်ပြုပါ။</p>

              <div className="border rounded-lg overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-600 border-b">
                    <tr>
                      <th className="p-2.5">Item Name</th>
                      <th className="p-2.5 text-center">Total Qty</th>
                      <th className="p-2.5 text-center">Delivered Qty</th>
                      <th className="p-2.5 text-center">Returned Qty</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {partialItemsForm.map((pIt, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="p-2.5 font-bold text-slate-800">{pIt.name}</td>
                        <td className="p-2.5 text-center font-semibold">{pIt.totalQty}</td>
                        <td className="p-2.5 text-center">
                          <input 
                            type="number" min="0" max={pIt.totalQty}
                            value={pIt.deliveredQty}
                            onChange={(e) => {
                              const dVal = Number(e.target.value) || 0;
                              const updated = [...partialItemsForm];
                              updated[idx].deliveredQty = dVal;
                              updated[idx].returnedQty = Math.max(0, pIt.totalQty - dVal);
                              setPartialItemsForm(updated);
                            }}
                            className="w-16 border rounded text-center p-1 font-bold text-emerald-600"
                          />
                        </td>
                        <td className="p-2.5 text-center">
                          <input 
                            type="number" min="0" max={pIt.totalQty}
                            value={pIt.returnedQty}
                            onChange={(e) => {
                              const rVal = Number(e.target.value) || 0;
                              const updated = [...partialItemsForm];
                              updated[idx].returnedQty = rVal;
                              updated[idx].deliveredQty = Math.max(0, pIt.totalQty - rVal);
                              setPartialItemsForm(updated);
                            }}
                            className="w-16 border rounded text-center p-1 font-bold text-rose-600"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="pt-2 flex space-x-2">
                <button 
                  onClick={() => setShowPartialModal(false)}
                  className="w-1/2 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2.5 rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleConfirmPartialReturn}
                  className="w-1/2 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-lg font-semibold shadow-md"
                >
                  Confirm & Update
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Return Stock Modal */}
      {showReturnModal && targetReturnItem && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-bold text-slate-800 text-sm">Return Stock to Vendor</h3>
              <button onClick={() => setShowReturnModal(false)} className="text-slate-400 hover:text-slate-600 text-lg">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <p className="font-bold text-indigo-600">{targetReturnItem.name}</p>
              <p className="text-slate-500">Current In-Stock: {targetReturnItem.quantity} pcs</p>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Return Quantity *</label>
                <input 
                  type="number" min="1" max={targetReturnItem.quantity}
                  value={returnForm.qty}
                  onChange={(e) => setReturnForm({ ...returnForm, qty: Number(e.target.value) })}
                  className="w-full border border-slate-300 rounded-lg p-2"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Reason / Note *</label>
                <textarea 
                  rows={2} required
                  value={returnForm.reason}
                  onChange={(e) => setReturnForm({ ...returnForm, reason: e.target.value })}
                  placeholder="e.g. Expired, Damaged packaging, Overstock..."
                  className="w-full border border-slate-300 rounded-lg p-2"
                />
              </div>

              <div className="pt-3 flex space-x-2">
                <button onClick={() => setShowReturnModal(false)} className="w-1/2 bg-slate-100 py-2.5 rounded-lg font-semibold">Cancel</button>
                <button 
                  onClick={async () => {
                    const numQty = Number(returnForm.qty);
                    if (numQty <= 0 || numQty > targetReturnItem.quantity) {
                      alert('အရေအတွက် မှားယွင်းနေပါသည်။');
                      return;
                    }
                    const newReturnObj = {
                      id: `RET-${Date.now().toString().slice(-3)}`,
                      orderId: '',
                      itemId: targetReturnItem.id,
                      vendorId: targetReturnItem.vendorId,
                      itemName: targetReturnItem.name,
                      qty: numQty,
                      type: 'Vendor Return (Manual)',
                      reason: returnForm.reason,
                      status: 'Returned to Vendor',
                      date: new Date().toLocaleDateString()
                    };

                    try {
                      await fetch(`${API_BASE_URL}/api/returns`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(newReturnObj)
                      });

                      const newQty = Math.max(0, (Number(targetReturnItem.quantity) || 0) - numQty);
                      await fetch(`${API_BASE_URL}/api/items/${targetReturnItem.id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ quantity: newQty })
                      });

                      setItems(prev => prev.map(i => i.id === targetReturnItem.id ? { ...i, quantity: newQty } : i));
                      setReturns(prev => [newReturnObj, ...prev]);
                      addLog(`Returned ${numQty} pcs of ${targetReturnItem.name} to Vendor. Reason: ${returnForm.reason}`);
                      setShowReturnModal(false);
                    } catch (err) {}
                  }}
                  className="w-1/2 bg-rose-600 hover:bg-rose-700 text-white py-2.5 rounded-lg font-semibold"
                >
                  Confirm Return
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Order Modal */}
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
                  <label className="block font-semibold text-slate-700 mb-1">Customer Phone (Auto-memory) *</label>
                  <input 
                    type="text" required placeholder="09xxxxxxxxx"
                    value={newOrder.customerPhone}
                    onChange={(e) => handleCustomerPhoneChange(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg p-2"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Customer Name *</label>
                  <input 
                    type="text" required placeholder="Customer Name"
                    value={newOrder.customerName}
                    onChange={(e) => setNewOrder({ ...newOrder, customerName: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg p-2"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Delivery Address *</label>
                <textarea 
                  required rows={2} placeholder="Full address"
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
                    {deliveries.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
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

      {/* Add Stock Item Modal */}
      {showItemModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-bold text-slate-800 text-base">Add Stock Item</h3>
              <button onClick={() => setShowItemModal(false)} className="text-slate-400 hover:text-slate-600 text-lg">✕</button>
            </div>

            <div className="flex bg-slate-100 p-1 rounded-lg text-xs font-semibold">
              <button 
                type="button"
                onClick={() => setIsExistingItemMode(true)}
                className={`flex-1 py-1.5 rounded-md transition-all ${isExistingItemMode ? 'bg-white shadow text-indigo-600' : 'text-slate-600'}`}
              >
                Existing Item (Restock)
              </button>
              <button 
                type="button"
                onClick={() => setIsExistingItemMode(false)}
                className={`flex-1 py-1.5 rounded-md transition-all ${!isExistingItemMode ? 'bg-white shadow text-indigo-600' : 'text-slate-600'}`}
              >
                Brand New Item
              </button>
            </div>

            <form onSubmit={async (e) => {
              e.preventDefault();
              if (isExistingItemMode) {
                const targetExisting = items.find(i => i.id === newItem.existingItemId);
                if (!targetExisting) {
                  alert('ကျေးဇူးပြု၍ ပစ္စည်းကို ရွေးချယ်ပါ။');
                  return;
                }
                const addQty = Number(newItem.quantity) || 0;
                const newQty = (Number(targetExisting.quantity) || 0) + addQty;

                try {
                  await fetch(`${API_BASE_URL}/api/items/${targetExisting.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ quantity: newQty })
                  });
                  setItems(items.map(i => i.id === targetExisting.id ? { ...i, quantity: newQty } : i));
                  addLog(`Restocked ${addQty} pcs to existing item ${targetExisting.name}`);
                  setShowItemModal(false);
                } catch (err) {}
              } else {
                if (!newItem.vendorId || !newItem.name) {
                  alert('Vendor နှင့် ပစ္စည်းနာမည် ထည့်ရန် လိုအပ်ပါသည်။');
                  return;
                }
                const vendorCode = newItem.vendorId === 'VND-101' ? 'A' : 'B';
                const autoSku = `SKU-VND-${vendorCode}-${Math.floor(1000 + Math.random() * 9000)}`;

                const itemObj = {
                  id: `ITM-${Math.floor(100 + Math.random() * 900)}`,
                  vendorId: newItem.vendorId,
                  name: newItem.name,
                  category: newItem.category || 'General',
                  price: Number(newItem.price) || 0,
                  cost: 0,
                  quantity: Number(newItem.quantity) || 0,
                  damagedQty: 0,
                  stockInDate: new Date().toISOString().split('T')[0],
                  sku: autoSku,
                  handlingFee: Number(newItem.handlingFee) || 500,
                  storeChargePerDay: Number(newItem.storeChargePerDay) || 30,
                  freeDays: Number(newItem.freeDays) || 7
                };

                try {
                  await fetch(`${API_BASE_URL}/api/items`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(itemObj)
                  });
                  setItems([itemObj, ...items]);
                  addLog(`Added new stock item ${itemObj.name} with auto SKU ${autoSku}`);
                  setShowItemModal(false);
                } catch (err) {}
              }
            }} className="space-y-3 text-xs">
              
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Select Vendor (Dropdown) *</label>
                <select 
                  required value={newItem.vendorId}
                  onChange={(e) => setNewItem({ ...newItem, vendorId: e.target.value, existingItemId: '' })}
                  className="w-full border border-slate-300 rounded-lg p-2 bg-white"
                >
                  <option value="">-- Choose Vendor --</option>
                  {vendors.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                </select>
              </div>

              {isExistingItemMode ? (
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Select Existing Item *</label>
                  <select 
                    required value={newItem.existingItemId}
                    onChange={(e) => {
                      const selectedId = e.target.value;
                      const found = items.find(i => i.id === selectedId);
                      setNewItem({ 
                        ...newItem, 
                        existingItemId: selectedId,
                        price: found ? found.price : ''
                      });
                    }}
                    className="w-full border border-slate-300 rounded-lg p-2 bg-white"
                  >
                    <option value="">-- Choose Item Stock --</option>
                    {items
                      .filter(i => newItem.vendorId && i.vendorId === newItem.vendorId)
                      .map(i => <option key={i.id} value={i.id}>{i.name} (Current: {i.quantity} pcs)</option>)}
                  </select>
                </div>
              ) : (
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">New Item Name *</label>
                  <input 
                    type="text" required value={newItem.name}
                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg p-2"
                  />
                </div>
              )}

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Selling Price (Ks) *</label>
                <input 
                  type="number" required value={newItem.price}
                  onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg p-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">{isExistingItemMode ? 'Restock Quantity *' : 'Initial Quantity *'}</label>
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

              <div className="pt-3 flex space-x-2">
                <button type="button" onClick={() => setShowItemModal(false)} className="w-1/2 bg-slate-100 py-2.5 rounded-lg font-semibold">Cancel</button>
                <button type="submit" className="w-1/2 bg-indigo-600 text-white py-2.5 rounded-lg font-semibold">
                  {isExistingItemMode ? 'Confirm Restock' : 'Stock-In & Auto SKU'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Register / Edit Vendor Modal */}
      {showVendorModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-bold text-slate-800 text-base">{editingVendor ? 'Edit Vendor Info' : 'Register New Vendor'}</h3>
              <button onClick={() => setShowVendorModal(false)} className="text-slate-400 hover:text-slate-600 text-lg">✕</button>
            </div>

            <form onSubmit={handleSaveVendor} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Vendor Shop Name *</label>
                <input 
                  type="text" required value={newVendor.name}
                  onChange={(e) => setNewVendor({ ...newVendor, name: e.target.value })}
                  placeholder="e.g. Trendy Beauty Shop"
                  className="w-full border border-slate-300 rounded-lg p-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Phone Number *</label>
                  <input 
                    type="text" required value={newVendor.phone}
                    onChange={(e) => setNewVendor({ ...newVendor, phone: e.target.value })}
                    placeholder="09xxxxxxxxx"
                    className="w-full border border-slate-300 rounded-lg p-2"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Bank / KPay Account *</label>
                  <input 
                    type="text" required value={newVendor.bankAccount}
                    onChange={(e) => setNewVendor({ ...newVendor, bankAccount: e.target.value })}
                    placeholder="KBZPay: 09..."
                    className="w-full border border-slate-300 rounded-lg p-2"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Business Address *</label>
                <textarea 
                  required rows={2} value={newVendor.address}
                  onChange={(e) => setNewVendor({ ...newVendor, address: e.target.value })}
                  placeholder="Full location address"
                  className="w-full border border-slate-300 rounded-lg p-2"
                />
              </div>

              <div className="pt-3 flex space-x-2">
                <button type="button" onClick={() => setShowVendorModal(false)} className="w-1/2 bg-slate-100 py-2.5 rounded-lg font-semibold">Cancel</button>
                <button type="submit" className="w-1/2 bg-indigo-600 text-white py-2.5 rounded-lg font-semibold">{editingVendor ? 'Update Vendor' : 'Register Vendor'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Register / Edit Delivery Modal */}
      {showDeliveryModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-bold text-slate-800 text-base">{editingDelivery ? 'Edit Delivery Service' : 'Register New Delivery Service'}</h3>
              <button onClick={() => setShowDeliveryModal(false)} className="text-slate-400 hover:text-slate-600 text-lg">✕</button>
            </div>

            <form onSubmit={handleSaveDelivery} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Delivery Service Name *</label>
                <input 
                  type="text" required value={newDelivery.name}
                  onChange={(e) => setNewDelivery({ ...newDelivery, name: e.target.value })}
                  placeholder="e.g. Royal Express"
                  className="w-full border border-slate-300 rounded-lg p-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Phone Number *</label>
                  <input 
                    type="text" required value={newDelivery.phone}
                    onChange={(e) => setNewDelivery({ ...newDelivery, phone: e.target.value })}
                    placeholder="09xxxxxxxxx"
                    className="w-full border border-slate-300 rounded-lg p-2"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Bank / KPay Account *</label>
                  <input 
                    type="text" required value={newDelivery.bankAccount}
                    onChange={(e) => setNewDelivery({ ...newDelivery, bankAccount: e.target.value })}
                    placeholder="KBZPay: 09..."
                    className="w-full border border-slate-300 rounded-lg p-2"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Hub Address *</label>
                <textarea 
                  required rows={2} value={newDelivery.address}
                  onChange={(e) => setNewDelivery({ ...newDelivery, address: e.target.value })}
                  placeholder="Hub location address"
                  className="w-full border border-slate-300 rounded-lg p-2"
                />
              </div>

              <div className="pt-3 flex space-x-2">
                <button type="button" onClick={() => setShowDeliveryModal(false)} className="w-1/2 bg-slate-100 py-2.5 rounded-lg font-semibold">Cancel</button>
                <button type="submit" className="w-1/2 bg-indigo-600 text-white py-2.5 rounded-lg font-semibold">{editingDelivery ? 'Update Delivery' : 'Register Delivery'}</button>
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