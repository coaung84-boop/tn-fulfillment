import React, { useState, useEffect, useMemo } from 'react';
import { 
  Package, ShoppingCart, Truck, DollarSign, Users, FileText, 
  RotateCcw, ShieldCheck, Activity, Search, Plus, Edit, Trash2, 
  CheckCircle, Clock, AlertTriangle, Eye, Printer, Download, Upload,
  ArrowUpRight, ArrowDownRight, RefreshCw, Lock, UserCheck, Key,
  BarChart2, Filter, ChevronRight, LogOut, FileSpreadsheet, Tag, TrendingUp,
  PieChart, Table, ArrowUpDown, UserPlus, CheckSquare, Square, Bell, Wallet, Database, X
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
  const [cashTxList, setCashTxList] = useState([]);

  // Notifications State (Web App Alerts)
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

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
  const [showCashModal, setShowCashModal] = useState(false);

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

  const [newCashTx, setNewCashTx] = useState({
    type: 'COLLECTION', // 'COLLECTION' or 'PAYOUT'
    entityId: '',
    amount: '',
    paymentMethod: 'KPay',
    referenceNo: '',
    note: ''
  });

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

  const pushAlert = (title, message, type = 'info') => {
    const alertObj = {
      id: Date.now(),
      title,
      message,
      type,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setNotifications(prev => [alertObj, ...prev]);
  };

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
          if (Array.isArray(dataItems) && dataItems.length > 0) {
            setItems(dataItems);
            dataItems.forEach(i => {
              if (i.quantity < 5) {
                pushAlert('Low Stock Alert', `Item "${i.name}" (Qty: ${i.quantity}) is running low!`, 'warning');
              }
            });
          }
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

        const resCash = await fetch(`${API_BASE_URL}/api/cash-transactions`);
        if (resCash.ok) {
          const dataCash = await resCash.json();
          if (Array.isArray(dataCash)) setCashTxList(dataCash);
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

  const downloadFullDataBackup = () => {
    const fullBackup = {
      exportDate: new Date().toISOString(),
      system: 'T&N Fulfillment Management System',
      users: usersList,
      vendors: vendors,
      deliveries: deliveries,
      inventory: items,
      orders: orders,
      returns: returns,
      cashTransactions: cashTxList,
      logs: logs
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(fullBackup, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `TN_FULL_SYSTEM_BACKUP_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    pushAlert('Data Backup Downloaded', 'Full database JSON backup has been safely saved.', 'success');
    addLog('Admin created & downloaded a Full System Data Backup file');
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
      pushAlert('Welcome Back', `Logged in as ${found.name} (${found.role})`, 'info');
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

  // CASH MANAGEMENT CALCULATIONS (FEATURE 3)
  const cashStats = useMemo(() => {
    const totalCollectedFromDelivery = cashTxList
      .filter(t => t.type === 'COLLECTION')
      .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

    const totalPaidOutToVendors = cashTxList
      .filter(t => t.type === 'PAYOUT')
      .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

    const currentCashInHand = totalCollectedFromDelivery - totalPaidOutToVendors;

    const totalDeliveredCod = orders
      .filter(o => (o.status === 'Delivered' || o.status === 'Partial Return') && !o.cancelled)
      .reduce((sum, o) => sum + (Number(o.totalCod) || 0), 0);

    const totalPendingCodFromDelivery = Math.max(0, totalDeliveredCod - totalCollectedFromDelivery);

    return { totalCollectedFromDelivery, totalPaidOutToVendors, currentCashInHand, totalPendingCodFromDelivery };
  }, [cashTxList, orders]);

  // DELIVERY PERFORMANCE ANALYTICS (FEATURE 1)
  const deliveryPerformance = useMemo(() => {
    return deliveries.map(d => {
      const dOrders = orders.filter(o => o.deliveryService === d.name);
      const total = dOrders.length;
      const delivered = dOrders.filter(o => o.status === 'Delivered' || o.status === 'Partial Return').length;
      const returned = dOrders.filter(o => o.status === 'Delivery Return' || o.cancelled).length;
      const pending = dOrders.filter(o => o.status === 'Pending' || o.status === 'In-Transit').length;
      const successRate = total > 0 ? Math.round((delivered / total) * 100) : 0;
      const returnRate = total > 0 ? Math.round((returned / total) * 100) : 0;
      const totalCod = dOrders.filter(o => o.status === 'Delivered' || o.status === 'Partial Return').reduce((sum, o) => sum + (Number(o.totalCod) || 0), 0);

      return { id: d.id, name: d.name, total, delivered, returned, pending, successRate, returnRate, totalCod };
    });
  }, [deliveries, orders]);

  const stats = useMemo(() => {
    const totalOrders = scopedOrders.length;
    const pendingOrders = scopedOrders.filter(o => o.status === 'Pending' || o.status === 'In-Transit').length;
    const deliveredOrders = scopedOrders.filter(o => o.status === 'Delivered').length;
    const totalCodCollected = scopedOrders.filter(o => o.codCollected && !o.cancelled).reduce((sum, o) => sum + (Number(o.totalCod) || 0), 0);
    const totalTnRevenue = scopedOrders.filter(o => !o.cancelled).reduce((sum, o) => sum + (Number(o.tnHandlingFee) || 0) + (Number(o.tnStoreFee) || 0), 0);
    const totalStockValue = scopedItems.reduce((sum, i) => sum + ((Number(i.quantity) || 0) * (Number(i.price) || 0)), 0);

    return { totalOrders, pendingOrders, deliveredOrders, totalCodCollected, totalTnRevenue, totalStockValue };
  }, [scopedOrders, scopedItems]);

  const chartData = useMemo(() => {
    if (chartMetric === 'del_orders' || chartMetric === 'del_cod') {
      return deliveries.map(d => {
        const dOrders = orders.filter(o => o.deliveryService === d.name && !o.cancelled);
        const qty = dOrders.length;
        const cod = dOrders.filter(o => o.codCollected).reduce((sum, o) => sum + (Number(o.totalCod) || 0), 0);
        return {
          id: d.id,
          name: d.name,
          qty,
          val: cod,
          store: 0
        };
      });
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
  }, [items, vendors, deliveries, orders, chartMetric, sortOrder]);

  const maxChartValue = useMemo(() => {
    return Math.max(...chartData.map(d => Number(d[chartMetric === 'del_orders' ? 'qty' : chartMetric === 'del_cod' ? 'val' : chartMetric]) || 0), 1);
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

  const handleSaveCashTx = async (e) => {
    e.preventDefault();
    if (!newCashTx.entityId || !newCashTx.amount) return;

    let entityName = '';
    if (newCashTx.type === 'COLLECTION') {
      const d = deliveries.find(del => del.id === newCashTx.entityId);
      entityName = d ? d.name : newCashTx.entityId;
    } else {
      const v = vendors.find(ven => ven.id === newCashTx.entityId);
      entityName = v ? v.name : newCashTx.entityId;
    }

    const txObj = {
      id: `TX-${Date.now().toString().slice(-4)}`,
      type: newCashTx.type,
      entityId: newCashTx.entityId,
      entityName: entityName,
      amount: Number(newCashTx.amount),
      paymentMethod: newCashTx.paymentMethod,
      referenceNo: newCashTx.referenceNo || '-',
      note: newCashTx.note || '-',
      createdAt: new Date().toLocaleString(),
      createdBy: currentUser?.name || 'Staff'
    };

    try {
      await fetch(`${API_BASE_URL}/api/cash-transactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(txObj)
      });
    } catch (e) {}

    setCashTxList(prev => [txObj, ...prev]);
    pushAlert('Cash Entry Saved', `${txObj.type === 'COLLECTION' ? 'Collected' : 'Paid Out'} ${txObj.amount.toLocaleString()} Ks for ${entityName}`, 'success');
    addLog(`Recorded Cash Transaction: ${txObj.type} of ${txObj.amount} Ks (${entityName})`);
    setShowCashModal(false);
    setNewCashTx({ type: 'COLLECTION', entityId: '', amount: '', paymentMethod: 'KPay', referenceNo: '', note: '' });
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
      pushAlert('User Updated', `Updated credentials for ${newUser.username}`, 'info');
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
      pushAlert('User Created', `Created account ${userObj.username}`, 'success');
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
      pushAlert('User Deleted', `User ID ${userId} removed`, 'warning');
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
    } catch (err) {}

    setOrders([createdOrder, ...orders]);
    pushAlert('New Order Created', `Order ${createdOrder.id} generated for ${createdOrder.customerName}`, 'success');
    addLog(`Created new order ${createdOrder.id} for Vendor ${newOrder.vendorId}`);
    setShowOrderModal(false);
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

    try {
      await fetch(`${API_BASE_URL}/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedFields)
      });
    } catch (err) {}

    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, ...updatedFields } : o));
    pushAlert('Status Updated', `Order ${orderId} status set to ${newStatus}`, 'info');
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
            
            {/* FEATURE 4: FULL BACKUP BUTTON */}
            {currentUser.role === 'Admin' && (
              <button
                onClick={downloadFullDataBackup}
                className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-indigo-300 text-xs px-3 py-1.5 rounded-lg font-semibold flex items-center space-x-1"
                title="Download Full Database Backup"
              >
                <Database className="w-3.5 h-3.5 text-indigo-400" />
                <span>Full Backup</span>
              </button>
            )}

            {/* FEATURE 2: WEB APP ALERTS BELL */}
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="bg-slate-800 hover:bg-slate-700 p-2 rounded-lg border border-slate-700 relative text-slate-300"
              >
                <Bell className="w-4 h-4" />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[9px] font-bold px-1.5 py-0.2 rounded-full">
                    {notifications.length}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-72 bg-white text-slate-800 rounded-xl shadow-2xl border border-slate-200 p-3 z-50 text-xs space-y-2">
                  <div className="flex justify-between items-center border-b pb-1.5">
                    <span className="font-bold">System Alerts</span>
                    <button onClick={() => setNotifications([])} className="text-[10px] text-indigo-600 hover:underline">Clear</button>
                  </div>
                  <div className="max-h-60 overflow-y-auto space-y-1.5">
                    {notifications.length === 0 ? (
                      <p className="text-slate-400 text-center py-2 text-[11px]">No alerts right now</p>
                    ) : (
                      notifications.map(n => (
                        <div key={n.id} className={`p-2 rounded border text-[11px] ${
                          n.type === 'warning' ? 'bg-amber-50 border-amber-200 text-amber-900' :
                          n.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-slate-50 border-slate-200'
                        }`}>
                          <div className="flex justify-between font-bold">
                            <span>{n.title}</span>
                            <span className="text-[9px] text-slate-400 font-normal">{n.time}</span>
                          </div>
                          <p className="mt-0.5">{n.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

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
              { id: 'cash', label: 'Cash & Financial Flow', icon: Wallet, adminOnly: true }, // FEATURE 3
              { id: 'settlements', label: 'Vendors (Financial)', icon: DollarSign },
              { id: 'deliveries', label: 'Delivery Services', icon: Truck },
              { id: 'users', label: 'User Management', icon: Users, adminOnly: true },
              { id: 'logs', label: 'Action Logs', icon: Activity, adminOnly: true },
            ].map(tab => {
              if (tab.adminOnly && currentUser.role !== 'Admin') return null;
              if (currentUser.role === 'Vendor' && ['settlements', 'logs', 'users', 'deliveries', 'cash'].includes(tab.id)) return null;
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
                    <p className="text-xs font-semibold text-slate-500 uppercase">T&N Cash Net Balance</p>
                    <p className="text-2xl font-bold text-emerald-600 mt-1">{cashStats.currentCashInHand.toLocaleString()} Ks</p>
                    <p className="text-xs text-slate-400 mt-1">Cash in hand after payout</p>
                  </div>
                  <div className="bg-emerald-50 p-3 rounded-lg text-emerald-600">
                    <Wallet className="w-6 h-6" />
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
                    <p className="text-xs font-semibold text-slate-500 uppercase">Pending Delivery COD</p>
                    <p className="text-2xl font-bold text-amber-600 mt-1">{cashStats.totalPendingCodFromDelivery.toLocaleString()} Ks</p>
                    <p className="text-xs text-slate-400 mt-1">Receivable from Delivery partners</p>
                  </div>
                  <div className="bg-amber-50 p-3 rounded-lg text-amber-600">
                    <Truck className="w-6 h-6" />
                  </div>
                </div>
              </div>
            )}

            {/* FEATURE 1: DELIVERY PERFORMANCE ANALYTICS UI */}
            {currentUser.role !== 'Vendor' && (
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex justify-between items-center border-b pb-2">
                  <h3 className="font-bold text-slate-800 text-sm flex items-center">
                    <BarChart2 className="w-4 h-4 mr-2 text-indigo-600" />
                    Delivery Service Performance Analytics & Success Rates
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {deliveryPerformance.map(dp => (
                    <div key={dp.id} className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-slate-800 text-sm">{dp.name}</span>
                        <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                          {dp.total} Waybills
                        </span>
                      </div>

                      <div className="space-y-1.5 text-xs">
                        <div className="flex justify-between">
                          <span className="text-slate-500">Success Rate:</span>
                          <span className="font-bold text-emerald-600">{dp.successRate}%</span>
                        </div>
                        <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                          <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${dp.successRate}%` }}></div>
                        </div>

                        <div className="flex justify-between pt-1 text-[11px]">
                          <span className="text-slate-500">Delivered: <b>{dp.delivered}</b></span>
                          <span className="text-slate-500">Returned: <b className="text-rose-600">{dp.returned}</b></span>
                          <span className="text-slate-500">Pending: <b className="text-amber-600">{dp.pending}</b></span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}

        {/* FEATURE 3: CASH & FINANCIAL FLOW MANAGEMENT TAB */}
        {activeTab === 'cash' && currentUser.role === 'Admin' && (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex justify-between items-center">
              <div>
                <h3 className="font-bold text-slate-800 text-sm flex items-center">
                  <Wallet className="w-4 h-4 mr-2 text-indigo-600" />
                  Cash Flow & Financial Settlement Management
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">Track COD collections from deliveries and payouts transferred to vendors.</p>
              </div>

              <button 
                onClick={() => setShowCashModal(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs px-4 py-2 rounded-lg font-semibold flex items-center space-x-1 shadow-sm"
              >
                <Plus className="w-4 h-4 mr-1" />
                <span>Record Cash Entry</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <p className="text-xs font-semibold text-slate-500">Total COD Collected (From Delivery)</p>
                <p className="text-xl font-bold text-emerald-600 mt-1">{cashStats.totalCollectedFromDelivery.toLocaleString()} Ks</p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <p className="text-xs font-semibold text-slate-500">Total Paid Out (To Vendors)</p>
                <p className="text-xl font-bold text-rose-600 mt-1">{cashStats.totalPaidOutToVendors.toLocaleString()} Ks</p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <p className="text-xs font-semibold text-slate-500">Current Cash In Hand</p>
                <p className="text-xl font-bold text-indigo-600 mt-1">{cashStats.currentCashInHand.toLocaleString()} Ks</p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <p className="text-xs font-semibold text-slate-500">Pending Delivery Receivable</p>
                <p className="text-xl font-bold text-amber-600 mt-1">{cashStats.totalPendingCodFromDelivery.toLocaleString()} Ks</p>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-600 font-semibold border-b">
                  <tr>
                    <th className="p-3">Tx ID</th>
                    <th className="p-3">Type</th>
                    <th className="p-3">Delivery / Vendor Partner</th>
                    <th className="p-3">Amount (Ks)</th>
                    <th className="p-3">Payment Method</th>
                    <th className="p-3">Ref No / Note</th>
                    <th className="p-3">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {cashTxList.map(tx => (
                    <tr key={tx.id} className="hover:bg-slate-50">
                      <td className="p-3 font-mono text-slate-400">{tx.id}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          tx.type === 'COLLECTION' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                        }`}>
                          {tx.type === 'COLLECTION' ? 'Received (From Delivery)' : 'Payout (To Vendor)'}
                        </span>
                      </td>
                      <td className="p-3 font-bold text-slate-800">{tx.entityName}</td>
                      <td className="p-3 font-bold">{tx.amount.toLocaleString()} Ks</td>
                      <td className="p-3 text-slate-600">{tx.paymentMethod}</td>
                      <td className="p-3 text-slate-500">{tx.referenceNo} ({tx.note})</td>
                      <td className="p-3 text-slate-400 font-mono text-[11px]">{tx.createdAt}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Existing Tabs: Orders, Inventory, Returns, Settlements, Deliveries, Users, Logs... */}
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
                  <span>Export Selected Excel (.xls)</span>
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
                          onChange={(e) => setSelectedOrderIds(e.target.checked ? scopedOrders.map(o => o.id) : [])}
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
                        return (
                          <tr key={order.id} className="hover:bg-slate-50">
                            <td className="p-3 text-center">
                              <input 
                                type="checkbox"
                                checked={selectedOrderIds.includes(order.id)}
                                onChange={(e) => setSelectedOrderIds(e.target.checked ? [...selectedOrderIds, order.id] : selectedOrderIds.filter(id => id !== order.id))}
                              />
                            </td>
                            <td className="p-3 font-bold text-indigo-600">{order.id}</td>
                            <td className="p-3 font-medium text-slate-700">{vendor ? vendor.name : order.vendorId}</td>
                            <td className="p-3 font-semibold">{order.customerName} ({order.customerPhone})</td>
                            <td className="p-3">{order.deliveryService} ({order.trackingNo})</td>
                            <td className="p-3 font-bold">{(Number(order.totalCod) || 0).toLocaleString()} Ks</td>
                            <td className="p-3">
                              <select 
                                value={order.status}
                                onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                                className="text-xs font-semibold px-2 py-1 rounded border border-slate-300"
                              >
                                <option value="Pending">Pending</option>
                                <option value="In-Transit">In-Transit</option>
                                <option value="Delivered">Delivered</option>
                                <option value="Partial Return">Partial Return</option>
                                <option value="Delivery Return">Delivery Return</option>
                                {currentUser.role === 'Admin' && <option value="Cancelled">Cancelled</option>}
                              </select>
                            </td>
                            <td className="p-3 text-right space-x-1">
                              <button 
                                onClick={() => { setSelectedOrder(order); setShowVoucherModal(true); }}
                                className="bg-slate-100 text-slate-700 px-2 py-1 rounded text-xs font-semibold"
                              >
                                Voucher
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

      </main>

      {/* CASH TRANSACTION MODAL (FEATURE 3) */}
      {showCashModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-bold text-slate-800 text-base">Record Cash & Financial Transaction</h3>
              <button onClick={() => setShowCashModal(false)} className="text-slate-400 hover:text-slate-600 text-lg">✕</button>
            </div>

            <form onSubmit={handleSaveCashTx} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Transaction Type *</label>
                <select 
                  value={newCashTx.type}
                  onChange={(e) => setNewCashTx({ ...newCashTx, type: e.target.value, entityId: '' })}
                  className="w-full border border-slate-300 rounded-lg p-2"
                >
                  <option value="COLLECTION">COD Received (From Delivery Partner)</option>
                  <option value="PAYOUT">Vendor Settlement Payout (To Vendor)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {newCashTx.type === 'COLLECTION' ? 'Select Delivery Service *' : 'Select Vendor *'}
                </label>
                <select 
                  required value={newCashTx.entityId}
                  onChange={(e) => setNewCashTx({ ...newCashTx, entityId: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg p-2 bg-white"
                >
                  <option value="">-- Select Partner --</option>
                  {newCashTx.type === 'COLLECTION' 
                    ? deliveries.map(d => <option key={d.id} value={d.id}>{d.name}</option>)
                    : vendors.map(v => <option key={v.id} value={v.id}>{v.name}</option>)
                  }
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Amount (Ks) *</label>
                <input 
                  type="number" required placeholder="0"
                  value={newCashTx.amount}
                  onChange={(e) => setNewCashTx({ ...newCashTx, amount: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg p-2 font-bold text-indigo-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Payment Method</label>
                  <select 
                    value={newCashTx.paymentMethod}
                    onChange={(e) => setNewCashTx({ ...newCashTx, paymentMethod: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg p-2"
                  >
                    <option value="KPay">KBZPay</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Cash">Cash in Hand</option>
                    <option value="WavePay">WavePay</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Reference / Tx ID</label>
                  <input 
                    type="text" placeholder="Ref No."
                    value={newCashTx.referenceNo}
                    onChange={(e) => setNewCashTx({ ...newCashTx, referenceNo: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg p-2"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Note / Description</label>
                <textarea 
                  rows={2} placeholder="Optional notes"
                  value={newCashTx.note}
                  onChange={(e) => setNewCashTx({ ...newCashTx, note: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg p-2"
                />
              </div>

              <div className="pt-3 flex space-x-2">
                <button type="button" onClick={() => setShowCashModal(false)} className="w-1/2 bg-slate-100 py-2.5 rounded-lg font-semibold">Cancel</button>
                <button type="submit" className="w-1/2 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-lg font-semibold">Save Entry</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <footer className="bg-white border-t border-slate-200 py-3 text-center text-xs text-slate-500 mt-auto">
        T&N Fulfillment System • Enterprise Edition
      </footer>
    </div>
  );
}