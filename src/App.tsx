import React, { useState, useEffect, useMemo } from 'react';
import { 
  Package, ShoppingCart, Truck, DollarSign, Users, FileText, 
  RotateCcw, ShieldCheck, Activity, Search, Plus, Edit, Trash2, 
  CheckCircle, Clock, AlertTriangle, Eye, Printer, Download, Upload,
  ArrowUpRight, ArrowDownRight, RefreshCw, Lock, UserCheck, Key,
  BarChart2, Filter, ChevronRight, LogOut, FileSpreadsheet, Tag, TrendingUp,
  PieChart, Table, ArrowUpDown, UserPlus, CheckSquare, Square, Bell, HardDrive, Shield, CreditCard, Menu
} from 'lucide-react';

const API_BASE_URL = 'https://tn-backend-j1vg.onrender.com';

const INITIAL_USERS = [
  { id: 'USR-001', username: "admin", password: "admin123", name: "System Admin", role: "Admin", vendorId: "" },
  { id: 'USR-002', username: "staff", password: "staff123", name: "Operations Staff", role: "Staff", vendorId: "" },
];

const INITIAL_VENDORS = [];
const INITIAL_DELIVERIES = [
  { id: 'DEL-101', name: 'Royal Express', phone: '095000111', address: 'Yangon Main Hub', bankAccount: 'KBZPay: 095000111 (Royal)' },
  { id: 'DEL-102', name: 'Ninja Van', phone: '096000222', address: 'Mandalay Hub', bankAccount: 'KBZPay: 096000222 (Ninja)' },
];

const INITIAL_ITEMS = [];
const INITIAL_ORDERS = [];
const INITIAL_RETURNS = [];
const INITIAL_LOGS = [
  { id: 'LOG-101', user: 'System', role: 'Admin', action: 'System Clean Slate Initialized', timestamp: new Date().toLocaleString() }
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
  const [showSystemMenu, setShowSystemMenu] = useState(false);

  // Tab-specific Unified Search States ("Search by...")
  const [orderSearchMode, setOrderSearchMode] = useState('ID');
  const [orderSearchVal, setOrderSearchVal] = useState('');
  const [showOrderSearchDropdown, setShowOrderSearchDropdown] = useState(false);

  const [invSearchMode, setInvSearchMode] = useState('ID');
  const [invSearchVal, setInvSearchVal] = useState('');
  const [showInvSearchDropdown, setShowInvSearchDropdown] = useState(false);

  const [retSearchMode, setRetSearchMode] = useState('ID');
  const [retSearchVal, setRetSearchVal] = useState('');
  const [showRetSearchDropdown, setShowRetSearchDropdown] = useState(false);

  const [cashSearchMode, setCashSearchMode] = useState('ID');
  const [cashSearchVal, setCashSearchVal] = useState('');
  const [showCashSearchDropdown, setShowCashSearchDropdown] = useState(false);

  const [deliveryFilter, setDeliveryFilter] = useState('ALL');

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

  // Edit Inventory Item Modal State (All fields editable)
  const [showEditItemModal, setShowEditItemModal] = useState(false);
  const [editingInventoryItem, setEditingInventoryItem] = useState(null);
  const [editInventoryForm, setEditInventoryForm] = useState({ name: '', category: '', price: '', quantity: '', handlingFee: '', storeChargePerDay: '', freeDays: '' });

  // Edit Return Modal State (Item Name and Quantity editable)
  const [showEditReturnModal, setShowEditReturnModal] = useState(false);
  const [editingReturnItem, setEditingReturnItem] = useState(null);
  const [editReturnForm, setEditReturnForm] = useState({ itemName: '', qty: 1, reason: '' });
  
  // Advanced Cash Modal State
  const [cashFlowType, setCashFlowType] = useState('COD_IN');
  const [selectedPartnerId, setSelectedPartnerId] = useState('');
  const [selectedVoucherIds, setSelectedVoucherIds] = useState([]);
  const [cashTransactionNo, setCashTransactionNo] = useState('');
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
  const [newDelivery, setNewDelivery] = useState({ id: '', name: '', phone: '', address: '', bankAccount: '' });

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
    deliveryServiceId: '',
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
          if (Array.isArray(dataDeliveries)) setDeliveries(dataDeliveries);
        }

        const resItems = await fetch(`${API_BASE_URL}/api/inventory`);
        if (resItems.ok) {
          const dataItems = await resItems.json();
          if (Array.isArray(dataItems)) setItems(dataItems);
        }

        const resOrders = await fetch(`${API_BASE_URL}/api/orders`);
        if (resOrders.ok) {
          const dataOrders = await resOrders.json();
          if (Array.isArray(dataOrders)) setOrders(dataOrders);
        }

        const resReturns = await fetch(`${API_BASE_URL}/api/returns`);
        if (resReturns.ok) {
          const dataReturns = await resReturns.json();
          if (Array.isArray(dataReturns)) setReturns(dataReturns);
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
    } else {
      setLoginError('Username သို့မဟုတ် Password မှားယွင်းနေပါသည်။');
    }
  };

  const getDeliveryName = (order) => {
    if (order.deliveryServiceId) {
      const found = deliveries.find(d => d.id === order.deliveryServiceId);
      if (found) return found.name;
    }
    const foundByName = deliveries.find(d => d.name === order.deliveryService);
    if (foundByName) return foundByName.name;
    return order.deliveryService || 'Unassigned';
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

  const codCollectedVoucherIds = useMemo(() => {
    const ids = new Set();
    cashLedger.filter(c => c.type === 'COD_IN').forEach(c => {
      if (c.referenceId) {
        const matches = c.referenceId.match(/TN-ORD-\d+/g);
        if (matches) {
          matches.forEach(id => ids.add(id));
        }
      }
    });
    return ids;
  }, [cashLedger]);

  const recordedVoucherIds = useMemo(() => {
    const ids = new Set();
    cashLedger.filter(c => c.type === 'VENDOR_OUT').forEach(c => {
      if (c.referenceId) {
        const matches = c.referenceId.match(/TN-ORD-\d+/g);
        if (matches) {
          matches.forEach(id => ids.add(id));
        }
      }
    });
    return ids;
  }, [cashLedger]);

  const scopedItems = useMemo(() => {
    let res = items;
    if (currentUser && currentUser.role === 'Vendor') {
      res = res.filter(i => i.vendorId === currentUser.vendorId);
    }
    if (invSearchVal.trim()) {
      const q = invSearchVal.toLowerCase();
      if (invSearchMode === 'ID') {
        res = res.filter(i => i.id.toLowerCase().includes(q) || i.sku.toLowerCase().includes(q) || i.name.toLowerCase().includes(q));
      } else if (invSearchMode === 'DATE') {
        res = res.filter(i => i.stockInDate.includes(q));
      } else if (invSearchMode === 'VENDOR') {
        res = res.filter(i => i.vendorId === invSearchVal || (vendors.find(v => v.id === i.vendorId)?.name.toLowerCase().includes(q)));
      }
    }
    return res;
  }, [items, currentUser, invSearchMode, invSearchVal, vendors]);

  const scopedOrders = useMemo(() => {
    let res = orders;
    if (currentUser && currentUser.role === 'Vendor') {
      res = res.filter(o => o.vendorId === currentUser.vendorId);
    }
    if (deliveryFilter !== 'ALL') {
      res = res.filter(o => getDeliveryName(o) === deliveryFilter || o.deliveryServiceId === deliveryFilter);
    }
    if (orderSearchVal.trim() || orderSearchMode === 'STATUS' || orderSearchMode === 'COD_FLOW' || orderSearchMode === 'VENDOR_PAY') {
      const q = orderSearchVal.toLowerCase();
      if (orderSearchMode === 'ID') {
        res = res.filter(o => o.id.toLowerCase().includes(q) || o.customerName.toLowerCase().includes(q) || o.customerPhone.toLowerCase().includes(q) || o.trackingNo.toLowerCase().includes(q));
      } else if (orderSearchMode === 'DATE') {
        res = res.filter(o => o.createdAt.toLowerCase().includes(q));
      } else if (orderSearchMode === 'VENDOR') {
        res = res.filter(o => o.vendorId === orderSearchVal || (vendors.find(v => v.id === o.vendorId)?.name.toLowerCase().includes(q)));
      } else if (orderSearchMode === 'DELIVERY') {
        res = res.filter(o => getDeliveryName(o).toLowerCase().includes(q));
      } else if (orderSearchMode === 'STATUS') {
        if (orderSearchVal) {
          res = res.filter(o => o.status === orderSearchVal);
        }
      } else if (orderSearchMode === 'COD_FLOW') {
        if (orderSearchVal === 'DONE') {
          res = res.filter(o => codCollectedVoucherIds.has(o.id));
        } else if (orderSearchVal === 'PENDING') {
          res = res.filter(o => !codCollectedVoucherIds.has(o.id));
        }
      } else if (orderSearchMode === 'VENDOR_PAY') {
        if (orderSearchVal === 'DONE') {
          res = res.filter(o => recordedVoucherIds.has(o.id));
        } else if (orderSearchVal === 'PENDING') {
          res = res.filter(o => !recordedVoucherIds.has(o.id));
        }
      }
    }
    return res;
  }, [orders, currentUser, deliveryFilter, orderSearchMode, orderSearchVal, vendors, deliveries, codCollectedVoucherIds, recordedVoucherIds]);

  const scopedReturns = useMemo(() => {
    let res = returns;
    if (currentUser && currentUser.role === 'Vendor') {
      res = res.filter(r => r.vendorId === currentUser.vendorId);
    }
    if (retSearchVal.trim()) {
      const q = retSearchVal.toLowerCase();
      if (retSearchMode === 'ID') {
        res = res.filter(r => r.id.toLowerCase().includes(q) || r.itemName.toLowerCase().includes(q) || (r.orderId && r.orderId.toLowerCase().includes(q)));
      } else if (retSearchMode === 'DATE') {
        res = res.filter(r => r.date.toLowerCase().includes(q));
      } else if (retSearchMode === 'VENDOR') {
        res = res.filter(r => r.vendorId === retSearchVal || (vendors.find(v => v.id === r.vendorId)?.name.toLowerCase().includes(q)));
      } else if (retSearchMode === 'REASON') {
        res = res.filter(r => r.reason.toLowerCase().includes(q));
      }
    }
    return res;
  }, [returns, currentUser, retSearchMode, retSearchVal, vendors]);

  const scopedCashLedger = useMemo(() => {
    let res = cashLedger;
    if (cashSearchVal.trim()) {
      const q = cashSearchVal.toLowerCase();
      if (cashSearchMode === 'ID') {
        res = res.filter(c => c.id.toLowerCase().includes(q) || (c.referenceId && c.referenceId.toLowerCase().includes(q)) || (c.description && c.description.toLowerCase().includes(q)));
      } else if (cashSearchMode === 'DATE') {
        res = res.filter(c => c.date.toLowerCase().includes(q));
      } else if (cashSearchMode === 'TYPE') {
        res = res.filter(c => c.type.toLowerCase().includes(q));
      }
    }
    return res;
  }, [cashLedger, cashSearchMode, cashSearchVal]);

  function calculateStoreCharge(item, targetDate = new Date()) {
    const vendor = vendors.find(v => v.id === item.vendorId);
    const stockIn = new Date(item.stockInDate);
    const diffDays = Math.floor((targetDate.getTime() - stockIn.getTime()) / (1000 * 60 * 60 * 24));
    const freeDays = item.freeDays !== undefined ? Number(item.freeDays) : (vendor ? vendor.freeStorageDays : 7);
    const dailyFee = item.storeChargePerDay !== undefined ? Number(item.storeChargePerDay) : (vendor ? vendor.dailyStoreFee : 30);

    if (diffDays > freeDays) {
      const extraDays = diffDays - freeDays;
      return extraDays * dailyFee * (Number(item.quantity) || 0);
    }
    return 0;
  }

  function calculateOrderStoreCharges(order) {
    let totalStore = 0;
    const orderDate = new Date(order.createdAt || Date.now());
    order.items.forEach(ordItem => {
      const stockItem = items.find(i => i.id === ordItem.itemId);
      if (stockItem) {
        const stockIn = new Date(stockItem.stockInDate);
        const diffDays = Math.floor((orderDate.getTime() - stockIn.getTime()) / (1000 * 60 * 60 * 24));
        const freeDays = stockItem.freeDays !== undefined ? Number(stockItem.freeDays) : 7;
        const dailyFee = stockItem.storeChargePerDay !== undefined ? Number(stockItem.storeChargePerDay) : 30;
        if (diffDays > freeDays) {
          const extraDays = diffDays - freeDays;
          totalStore += extraDays * dailyFee * ordItem.qty;
        }
      }
    });
    return totalStore;
  }

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
      const dOrders = orders.filter(o => (o.deliveryServiceId === d.id || getDeliveryName(o) === d.name) && !o.cancelled);
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

  const exportVendorStatement = (vendorId) => {
    const vendor = vendors.find(v => v.id === vendorId);
    if (!vendor) return;
    const vOrders = orders.filter(o => o.vendorId === vendorId && (o.status === 'Delivered' || o.status === 'Partial Return') && !o.cancelled);
    
    const reportRows = vOrders.map(o => {
      const storeCharge = calculateOrderStoreCharges(o);
      const handlingFee = Number(o.tnHandlingFee) || 0;
      const cod = Number(o.totalCod) || 0;
      const netPayable = cod - handlingFee - storeCharge;
      return {
        "Order ID": o.id,
        "Date": o.createdAt,
        "Customer Name": o.customerName,
        "Customer Phone": o.customerPhone,
        "Delivery Service": getDeliveryName(o),
        "COD Amount (Ks)": cod,
        "Handling Fee (Ks)": handlingFee,
        "Store Charges (Ks)": storeCharge,
        "Net Payable (Ks)": netPayable
      };
    });

    if (reportRows.length === 0) {
      alert('ဤ Vendor အတွက် Statement ထုတ်ရန် Delivered အော်ဒါစာရင်း မရှိသေးပါ။');
      return;
    }

    const headers = Object.keys(reportRows[0]).join("\t");
    const rows = reportRows.map(r => Object.values(r).join("\t")).join("\n");
    const blob = new Blob([headers + "\n" + rows], { type: 'application/vnd.ms-excel' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `TN_Vendor_Payout_Statement_${vendor.name}_${Date.now()}.xls`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    addLog(`Exported official client Vendor Statement report (.xls) for ${vendor.name}`);
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

    try {
      if (editingUser) {
        const updatedUser = {
          ...editingUser,
          username: newUser.username,
          password: newUser.password || editingUser.password,
          name: newUser.name,
          role: newUser.role,
          vendorId: newUser.role === 'Vendor' ? newUser.vendorId : ''
        };
        await fetch(`${API_BASE_URL}/api/users/${editingUser.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedUser)
        }).catch(() => fetch(`${API_BASE_URL}/api/users`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedUser)
        }));
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
        await fetch(`${API_BASE_URL}/api/users`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(userObj)
        });
        setUsersList([...usersList, userObj]);
        addLog(`Created new user account: ${userObj.username}`);
      }
    } catch (err) {
      console.error('User save error:', err);
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

    try {
      if (editingVendor) {
        const updated = { ...editingVendor, ...newVendor };
        await fetch(`${API_BASE_URL}/api/vendors/${editingVendor.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updated)
        }).catch(() => fetch(`${API_BASE_URL}/api/vendors`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updated)
        }));
        setVendors(vendors.map(v => v.id === editingVendor.id ? updated : v));
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
        await fetch(`${API_BASE_URL}/api/vendors`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(vendorObj)
        });
        setVendors([...vendors, vendorObj]);
        addLog(`Registered new vendor: ${vendorObj.name}`);
      }
    } catch (err) {
      console.error('Vendor save error:', err);
    }
    setShowVendorModal(false);
    setNewVendor({ name: '', phone: '', address: '', bankAccount: '' });
  };

  const handleDeleteVendor = async (vendorId) => {
    const hasItems = items.some(i => i.vendorId === vendorId && Number(i.quantity) > 0);
    const hasOrders = orders.some(o => o.vendorId === vendorId);
    if (hasItems || hasOrders) {
      alert('ဤ Vendor တွင် လက်ကျန်ပစ္စည်းများ သို့မဟုတ် အော်ဒါစာရင်းများ ရှိနေသေးသဖြင့် ဖျက်၍မရပါ။');
      return;
    }
    if (confirm('ဤ Vendor ကို အပြီးတိုင် ဖျက်ရန် သေချာပါသလား?')) {
      try {
        await fetch(`${API_BASE_URL}/api/vendors/${vendorId}`, { method: 'DELETE' });
      } catch (e) {}
      setVendors(vendors.filter(v => v.id !== vendorId));
      addLog(`Deleted vendor ID ${vendorId}`);
    }
  };

  const handleSaveDelivery = async (e) => {
    e.preventDefault();
    if (!newDelivery.name || !newDelivery.phone) return;

    try {
      if (editingDelivery) {
        const updatedObj = { ...editingDelivery, ...newDelivery };
        await fetch(`${API_BASE_URL}/api/deliveries/${editingDelivery.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedObj)
        }).catch(() => fetch(`${API_BASE_URL}/api/deliveries`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedObj)
        }));
        setDeliveries(deliveries.map(d => d.id === editingDelivery.id ? updatedObj : d));
        setOrders(prev => prev.map(o => {
          if (o.deliveryServiceId === editingDelivery.id || o.deliveryService === editingDelivery.name) {
            return { ...o, deliveryService: newDelivery.name, deliveryServiceId: editingDelivery.id };
          }
          return o;
        }));
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
        await fetch(`${API_BASE_URL}/api/deliveries`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(deliveryObj)
        });
        setDeliveries([...deliveries, deliveryObj]);
        addLog(`Registered new delivery service: ${deliveryObj.name}`);
      }
    } catch (err) {
      console.error('Delivery save error:', err);
    }
    setShowDeliveryModal(false);
    setNewDelivery({ id: '', name: '', phone: '', address: '', bankAccount: '' });
  };

  const handleDeleteDelivery = async (delId, delName) => {
    const hasOrders = orders.some(o => (o.deliveryServiceId === delId || o.deliveryService === delName) && !o.cancelled);
    if (hasOrders) {
      alert('ဤ Delivery တွင် ဆက်စပ်အော်ဒါစာရင်းများ ရှိနေသေးသဖြင့် ဖျက်၍မရပါ။');
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

  const handleCancelInventoryItem = async (item) => {
    const todayDateStr = new Date().toISOString().split('T')[0];
    if (item.stockInDate !== todayDateStr) {
      alert('ယနေ့ (Today) ထည့်သွင်းထားသော Stock Batch မဟုတ်ပါက Cancel လုပ်ပိုင်ခွင့် မရှိပါ။');
      return;
    }

    const hasTransactions = orders.some(o => 
      !o.cancelled && o.items.some(oi => oi.itemId === item.id)
    ) || returns.some(r => r.itemId === item.id);

    if (hasTransactions) {
      alert('ဤ Stock ထဲမှ Transaction (Order / Return) များ ထွက်ရှိထားပြီးဖြစ်သဖြင့် Cancel (ဖျက်သိမ်း) ခွင့် မရှိပါ။ Edit သာ ပြုလုပ်နိုင်ပါသည်။');
      return;
    }

    if (confirm(`သတိပေးချက်: Stock item "${item.name}" ကို Cancel လုပ်၍ စာရင်းမှ ဖျက်ပစ်မည် သေချာပါသလား?`)) {
      
      const isDeliveryRet = item.sku && item.sku.endsWith('-RET');
      const isPartialRet = item.sku && item.sku.endsWith('-PRET');

      if (isDeliveryRet) {
        const targetReturn = returns.find(r => {
          const ord = orders.find(o => o.id === r.orderId);
          if (!ord) return false;
          return ord.items.some(oi => {
            const mainIt = items.find(x => x.id === oi.itemId);
            return mainIt && item.sku === `${mainIt.sku}-RET`;
          });
        });

        if (targetReturn && targetReturn.orderId) {
          const targetOrder = orders.find(o => o.id === targetReturn.orderId);
          if (targetOrder) {
            const updatedOrder = {
              ...targetOrder,
              status: 'Delivered',
              cancelled: false,
              codCollected: true,
              updatedBy: currentUser?.name || 'Staff'
            };
            try {
              await fetch(`${API_BASE_URL}/api/orders/${targetOrder.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedOrder)
              });
            } catch (e) {}
            setOrders(prev => prev.map(o => o.id === targetOrder.id ? updatedOrder : o));
          }
          try {
            await fetch(`${API_BASE_URL}/api/returns/${targetReturn.id}`, { method: 'DELETE' });
          } catch (e) {}
          setReturns(prev => prev.filter(r => r.id !== targetReturn.id));
        }
      } 
      else if (isPartialRet) {
        const baseSku = item.sku.replace('-PRET', '');
        const originalStockItem = items.find(x => x.sku === baseSku);

        if (originalStockItem) {
          const hasVendorReturn = returns.some(r => {
            if (r.type !== 'Vendor Return (Manual)') return false;
            if (r.itemId === originalStockItem.id) return true;
            const matchedIt = items.find(x => x.id === r.itemId);
            if (matchedIt && (matchedIt.sku === baseSku || matchedIt.sku === `${baseSku}-PRET`)) return true;
            return false;
          });

          if (hasVendorReturn) {
            alert('ဤ Partial Return ပစ္စည်းသည် Vendor ထံသို့ Manual Return ပြုလုပ်ပြီးသွားပြီဖြစ်သဖြင့် Cancel (ဖျက်သိမ်း) လုပ်၍ မရတော့ပါ။');
            return;
          }

          const targetReturn = returns.find(r => r.itemId === originalStockItem.id && r.type === 'Partial Return');
          if (targetReturn && targetReturn.orderId) {
            const targetOrder = orders.find(o => o.id === targetReturn.orderId);
            if (targetOrder) {
              let newItemTotal = 0;
              const restoredOrderItems = targetOrder.items.map(it => {
                if (it.itemId === originalStockItem.id) {
                  const restoredQty = it.qty + targetReturn.qty;
                  newItemTotal += ((Number(it.price) || 0) - (Number(it.discount) || 0)) * restoredQty;
                  return { ...it, qty: restoredQty };
                } else {
                  newItemTotal += ((Number(it.price) || 0) - (Number(it.discount) || 0)) * it.qty;
                  return it;
                }
              });

              const newTotalCod = newItemTotal + (Number(targetOrder.deliveryFee) || 0);
              const remainingReturns = returns.filter(r => r.orderId === targetOrder.id && r.id !== targetReturn.id);
              const newStatus = remainingReturns.length === 0 ? 'Delivered' : 'Partial Return';

              const updatedOrder = {
                ...targetOrder,
                status: newStatus,
                items: restoredOrderItems,
                itemTotal: newItemTotal,
                totalCod: newTotalCod,
                codCollected: true,
                updatedBy: currentUser?.name || 'Staff'
              };

              try {
                await fetch(`${API_BASE_URL}/api/orders/${targetOrder.id}`, {
                  method: 'PUT',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(updatedOrder)
                });
              } catch (e) {}
              setOrders(prev => prev.map(o => o.id === targetOrder.id ? updatedOrder : o));
            }

            try {
              await fetch(`${API_BASE_URL}/api/returns/${targetReturn.id}`, { method: 'DELETE' });
            } catch (e) {}
            setReturns(prev => prev.filter(r => r.id !== targetReturn.id));
          }
        }
      }

      try {
        await fetch(`${API_BASE_URL}/api/inventory/${item.id}`, { method: 'DELETE' });
      } catch (e) {}
      
      setItems(prev => prev.filter(i => i.id !== item.id));
      addLog(`Cancelled and removed inventory item ${item.name} (SKU: ${item.sku}).`);
    }
  };

  const handleCancelReturnItem = async (ret) => {
    if (ret.orderId && codCollectedVoucherIds.has(ret.orderId)) {
      alert('ဤ Return နှင့် သက်ဆိုင်သော Voucher မှာ ငွေစာရင်း (COD Flow) ရှင်းလင်းပြီးဖြစ်သဖြင့် Cancel လုပ်၍မရတော့ပါ။');
      return;
    }

    if (ret.type === 'Partial Return') {
      const baseStockItem = items.find(x => x.id === ret.itemId);
      const targetSku = baseStockItem ? baseStockItem.sku : '';
      
      const hasVendorReturn = returns.some(r => {
        if (r.type !== 'Vendor Return (Manual)') return false;
        if (r.itemId === ret.itemId) return true;
        if (targetSku) {
          const matchedIt = items.find(x => x.id === r.itemId);
          if (matchedIt && (matchedIt.sku === targetSku || matchedIt.sku === `${targetSku}-PRET`)) return true;
        }
        return false;
      });

      if (hasVendorReturn) {
        alert('ဤ Partial Return ပစ္စည်းသည် Vendor ထံသို့ Manual Return ပြုလုပ်ပြီးသွားပြီဖြစ်သဖြင့် Cancel (ဖျက်သိမ်း) လုပ်၍ မရတော့ပါ။');
        return;
      }
    }

    const targetOrder = orders.find(o => o.id === ret.orderId);
    if (targetOrder && targetOrder.status === 'Delivered') {
      alert('ဤအော်ဒါ၏ Status မှာ Delivered ဖြစ်သွားပြီဖြစ်သဖြင့် Return ကို Cancel လုပ်၍မရတော့ပါ။');
      return;
    }

     if (confirm(`Return record ${ret.id} ကို Cancel လုပ်မည် သေချာပါသလား?`)) {
      try {
        await fetch(`${API_BASE_URL}/api/returns/${ret.id}`, { method: 'DELETE' });
      } catch (e) {}

      if (targetOrder) {
        if (targetOrder.status === 'Delivery Return') {
          setItems(prev => prev.filter(i => {
            const matchesOriginal = targetOrder.items.some(oi => i.sku === `${items.find(x => x.id === oi.itemId)?.sku}-RET`);
            return !matchesOriginal;
          }));

          const updatedOrder = {
            ...targetOrder,
            status: 'Delivered',
            cancelled: false,
            codCollected: true,
            updatedBy: currentUser?.name || 'Staff'
          };

          try {
            await fetch(`${API_BASE_URL}/api/orders/${targetOrder.id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(updatedOrder)
            });
          } catch (e) {}

          setOrders(prev => prev.map(o => o.id === targetOrder.id ? updatedOrder : o));

        } else if (targetOrder.status === 'Partial Return') {
          const targetStockItem = items.find(x => x.id === ret.itemId);
          
          setItems(prev => prev.filter(i => {
            if (targetStockItem && i.sku === `${targetStockItem.sku}-PRET`) {
              return false;
            }
            return true;
          }));

          let newItemTotal = 0;
          const restoredOrderItems = targetOrder.items.map(it => {
            if (it.itemId === ret.itemId) {
              const restoredQty = it.qty + ret.qty;
              newItemTotal += ((Number(it.price) || 0) - (Number(it.discount) || 0)) * restoredQty;
              return { ...it, qty: restoredQty };
            } else {
              newItemTotal += ((Number(it.price) || 0) - (Number(it.discount) || 0)) * it.qty;
              return it;
            }
          });

          const newTotalCod = newItemTotal + (Number(targetOrder.deliveryFee) || 0);
          const remainingReturns = returns.filter(r => r.orderId === targetOrder.id && r.id !== ret.id);
          const newStatus = remainingReturns.length === 0 ? 'Delivered' : 'Partial Return';

          const updatedOrder = {
            ...targetOrder,
            status: newStatus,
            items: restoredOrderItems,
            itemTotal: newItemTotal,
            totalCod: newTotalCod,
            codCollected: true,
            updatedBy: currentUser?.name || 'Staff'
          };

          try {
            await fetch(`${API_BASE_URL}/api/orders/${targetOrder.id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(updatedOrder)
            });
          } catch (e) {}

          setOrders(prev => prev.map(o => o.id === targetOrder.id ? updatedOrder : o));
        }
      } else {
        if (ret.itemId) {
          setItems(prev => prev.map(i => {
            if (i.id === ret.itemId) {
              return { ...i, quantity: (Number(i.quantity) || 0) + (Number(ret.qty) || 0) };
            }
            return i;
          }));
        }
      }

      setReturns(prev => prev.filter(r => r.id !== ret.id));
      addLog(`Cancelled return record ${ret.id} and restored inventory/order statuses correctly.`);
    }
  };

  const handleCreateOrder = async (e) => {
    e.preventDefault();
    if (!newOrder.vendorId || newOrder.items.length === 0) return;

    const matchedDelivery = deliveries.find(d => d.id === newOrder.deliveryServiceId || d.name === newOrder.deliveryServiceId);
    const selectedDeliveryName = matchedDelivery ? matchedDelivery.name : (newOrder.deliveryServiceId || 'Royal Express');
    const selectedDeliveryId = matchedDelivery ? matchedDelivery.id : '';

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
      deliveryService: selectedDeliveryName,
      deliveryServiceId: selectedDeliveryId,
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
    } catch (err) {
      console.error('Order save error:', err);
    }

    setOrders([createdOrder, ...orders]);
    for (const ordered of newOrder.items) {
      const targetItem = items.find(i => i.id === ordered.itemId);
      if (targetItem) {
        const newQty = Math.max(0, (Number(targetItem.quantity) || 0) - (Number(ordered.qty) || 1));
        setItems(prev => prev.map(i => i.id === targetItem.id ? { ...i, quantity: newQty } : i));
      }
    }

    addNotification('New Order Created', `Order ID ${createdOrder.id} has been created.`, 'order');
    addLog(`Created new order ${createdOrder.id} for Vendor ${newOrder.vendorId}`);
    setShowOrderModal(false);
  };

  const handleUpdateOrderStatus = async (orderId, newStatus, newTracking) => {
    const targetOrder = orders.find(o => o.id === orderId);
    if (!targetOrder) return;
    
    if (codCollectedVoucherIds.has(orderId)) {
      alert('ဤ Voucher သည် COD Cash အဝင်စာရင်း (COD Flow) ပြီးစီးသွားပြီဖြစ်သဖြင့် Status ပြောင်းလဲ၍မရတော့ပါ။');
      return;
    }

    if (newStatus === 'Cancelled' && currentUser?.role !== 'Admin') {
      alert('ခွင့်ပြုချက်မရှိပါ: Cancelled အခြေအနေသို့ ပြောင်းလဲရန် Admin အဆင့် လိုအပ်ပါသည်။');
      return;
    }

    if (targetOrder.status === 'Delivered' && currentUser?.role !== 'Admin') {
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

    const wasCancelled = targetOrder.status === 'Cancelled';
    const wasDeliveryReturn = targetOrder.status === 'Delivery Return';

    const isDelivered = newStatus === 'Delivered';
    const isCancelled = newStatus === 'Cancelled';
    const isDeliveryReturn = newStatus === 'Delivery Return';

    if (wasCancelled && !isCancelled) {
      for (const ordItem of targetOrder.items) {
        const stockItem = items.find(i => i.id === ordItem.itemId);
        if (stockItem) {
          setItems(prev => prev.map(i => {
            if (i.id === stockItem.id) {
              return { ...i, quantity: Math.max(0, (Number(i.quantity) || 0) - (Number(ordItem.qty) || 0)) };
            }
            return i;
          }));
        }
      }
      addLog(`Re-activated Cancelled Order ${orderId} to '${newStatus}': Deducted restored stock back from main Inventory.`);
    }

    if (wasDeliveryReturn && !isDeliveryReturn) {
      setItems(prev => prev.filter(i => {
        const matchesOriginal = targetOrder.items.some(oi => {
          const mainItem = items.find(x => x.id === oi.itemId);
          return mainItem && i.sku === `${mainItem.sku}-RET`;
        });
        return !matchesOriginal;
      }));

      setReturns(prev => prev.filter(r => r.orderId !== orderId));
      addLog(`Changed Order ${orderId} from Delivery Return to '${newStatus}': Cleared Return Batch (-RET) and Return Records.`);
    }

    if (isCancelled && !wasCancelled) {
      for (const ordItem of targetOrder.items) {
        const stockItem = items.find(i => i.id === ordItem.itemId);
        if (stockItem) {
          setItems(prev => prev.map(i => i.id === stockItem.id ? { ...i, quantity: (Number(i.quantity) || 0) + (Number(ordItem.qty) || 0) } : i));
        }
      }
      addLog(`Cancelled Order ${orderId}: Restored stock quantities back to main Inventory.`);
    }

    const updatedItems = targetOrder.items.map(it => ({
      ...it,
      status: isDelivered ? 'Delivered' : isDeliveryReturn ? 'Returned' : it.status
    }));

    const updatedFields = {
      ...targetOrder,
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
    } catch (e) {}

    if (isDeliveryReturn && !wasDeliveryReturn) {
      for (const ordItem of targetOrder.items) {
        const stockItem = items.find(i => i.id === ordItem.itemId);
        if (stockItem) {
          const todayStr = new Date().toISOString().split('T')[0];
          const newBatchItem = {
            id: `ITM-${Date.now().toString().slice(-4)}-${Math.floor(Math.random()*100)}`,
            vendorId: targetOrder.vendorId,
            name: `${stockItem.name} (Returned Batch)`,
            category: stockItem.category,
            price: stockItem.price,
            cost: 0,
            quantity: ordItem.qty,
            damagedQty: 0,
            stockInDate: todayStr,
            sku: `${stockItem.sku}-RET`,
            handlingFee: stockItem.handlingFee,
            storeChargePerDay: stockItem.storeChargePerDay,
            freeDays: stockItem.freeDays
          };
          setItems(prev => [newBatchItem, ...prev]);
        }
      }

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
    }

    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, ...updatedFields } : o));
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
          const todayStr = new Date().toISOString().split('T')[0];
          const newBatchItem = {
            id: `ITM-${Date.now().toString().slice(-4)}-${Math.floor(Math.random()*100)}`,
            vendorId: targetPartialOrder.vendorId,
            name: `${pItem.name} (Partial Ret)`,
            category: stockItem.category,
            price: stockItem.price,
            cost: 0,
            quantity: returnedQ,
            damagedQty: 0,
            stockInDate: todayStr,
            sku: `${stockItem.sku}-PRET`,
            handlingFee: stockItem.handlingFee,
            storeChargePerDay: stockItem.storeChargePerDay,
            freeDays: stockItem.freeDays
          };
          setItems(prev => [newBatchItem, ...prev]);
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
      ...targetPartialOrder,
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
    const targetOrder = orders.find(o => o.id === orderId);
    
    if (targetOrder?.status === 'Partial Return') {
      alert('Partial Return အခြေအနေရှိသော Voucher များကို ဖျက်ဆီးခွင့် လုံးဝ မရှိပါ။');
      return;
    }

    if (codCollectedVoucherIds.has(orderId)) {
      alert('ဤ Voucher သည် COD ငွေအဝင်စာရင်း ပြီးစီးပြီးဖြစ်သဖြင့် ဖျက်၍မရပါ။');
      return;
    }

    if (currentUser?.role !== 'Admin') {
      alert('ခွင့်ပြုချက်မရှိပါ: Voucher များကို ဖျက်ရန် Admin အဆင့် လိုအပ်ပါသည်။');
      return;
    }

    if (!targetOrder?.cancelled) {
      alert('ခွင့်ပြုချက်မရှိပါ: Cancelled ဖြစ်နေသော Voucher များကိုသာ ဖျက်ခွင့်ရှိပါသည်။');
      return;
    }

    if (confirm(`သတိပေးချက်: Cancelled Voucher ${orderId} ကို စနစ်ထဲမှ အပြီးတိုင် ဖျက်ပစ်ရန် သေချာပါသလား?`)) {
      try {
        await fetch(`${API_BASE_URL}/api/orders/${orderId}`, { method: 'DELETE' });
      } catch (e) {}
      setOrders(prev => prev.filter(o => o.id !== orderId));
      setSelectedOrderIds(prev => prev.filter(id => id !== orderId));
      addLog(`Admin deleted Voucher ${orderId}`);
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

            <div className="bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700 flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <div className="text-xs">
                <p className="text-indigo-300 font-bold">{currentUser.name}</p>
                <p className="text-[10px] text-slate-400 uppercase">Role: {currentUser.role}</p>
              </div>
            </div>

            <div className="relative">
              <button 
                onClick={() => setShowSystemMenu(!showSystemMenu)}
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white p-2.5 rounded-lg transition-colors flex items-center justify-center"
                title="System Menu (Backup, Restore, Logout)"
              >
                <Menu className="w-4 h-4" />
              </button>

              {showSystemMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white text-slate-800 rounded-xl shadow-2xl border border-slate-200 z-50 overflow-hidden text-xs py-1">
                  {currentUser.role === 'Admin' && (
                    <>
                      <button 
                        onClick={() => { setShowSystemMenu(false); handleExportBackup(); }}
                        className="w-full text-left px-4 py-2 hover:bg-slate-100 flex items-center space-x-2 text-slate-700"
                      >
                        <Download className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Backup Database</span>
                      </button>
                      <label className="w-full text-left px-4 py-2 hover:bg-slate-100 flex items-center space-x-2 text-slate-700 cursor-pointer">
                        <Upload className="w-3.5 h-3.5 text-amber-600" />
                        <span>Restore Database</span>
                        <input type="file" accept=".json" onChange={(e) => { setShowSystemMenu(false); handleImportBackup(e); }} className="hidden" />
                      </label>
                      <div className="border-t my-1"></div>
                    </>
                  )}
                  <button 
                    onClick={() => { setShowSystemMenu(false); addLog('Logged out'); setCurrentUser(null); }}
                    className="w-full text-left px-4 py-2 hover:bg-rose-50 text-rose-600 font-semibold flex items-center space-x-2"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>

        <div className="bg-slate-800 border-t border-slate-700 px-4">
          <div className="max-w-7xl mx-auto flex space-x-1 overflow-x-auto text-xs font-medium py-2">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: BarChart2 },
              { id: 'orders', label: 'Orders & Vouchers', icon: ShoppingCart },
              { id: 'inventory', label: 'Vendor Inventory', icon: Package },
              { id: 'returns', label: 'Returns & Damage', icon: RotateCcw },
              { id: 'settlements', label: 'Vendors', icon: CreditCard }, 
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
                    <p className="text-xs text-slate-400 mt-1">Handling + Store</p>
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
                      <button onClick={() => setChartType('line')} className={`p-1.5 rounded ${chartType === 'line' ? 'bg-white shadow text-indigo-600 font-bold' : 'text-slate-500'}`}><TrendingUp className="w-4 h-4" /></button>
                      <button onClick={() => setChartType('bar')} className={`p-1.5 rounded ${chartType === 'bar' ? 'bg-white shadow text-indigo-600 font-bold' : 'text-slate-500'}`}><BarChart2 className="w-4 h-4" /></button>
                      <button onClick={() => setChartType('pie')} className={`p-1.5 rounded ${chartType === 'pie' ? 'bg-white shadow text-indigo-600 font-bold' : 'text-slate-500'}`}><PieChart className="w-4 h-4" /></button>
                      <button onClick={() => setChartType('table')} className={`p-1.5 rounded ${chartType === 'table' ? 'bg-white shadow text-indigo-600 font-bold' : 'text-slate-500'}`}><Table className="w-4 h-4" /></button>
                    </div>

                    <button 
                      onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                      className="p-1.5 border border-slate-300 rounded-lg bg-slate-50 text-slate-600 hover:bg-slate-100 flex items-center space-x-1 text-xs"
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
                      {chartData.map((d) => {
                        const val = chartMetric.startsWith('del') ? d.qty : (d[chartMetric] || 0);
                        const heightPct = Math.max(15, (val / maxChartValue) * 100);
                        return (
                          <div key={d.id} onMouseEnter={() => setHoveredPoint(d)} onMouseLeave={() => setHoveredPoint(null)} className="flex-1 flex flex-col items-center group cursor-pointer z-10">
                            <div className="text-[10px] font-bold text-indigo-600 mb-1 opacity-0 group-hover:opacity-100 transition-opacity">{(val || 0).toLocaleString()}</div>
                            <div className="w-3.5 h-3.5 bg-indigo-600 rounded-full border-2 border-white shadow-md group-hover:scale-150 transition-transform" style={{ marginBottom: `${heightPct * 1.2}px` }}></div>
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
                          <div key={d.id} onMouseEnter={() => setHoveredPoint(d)} onMouseLeave={() => setHoveredPoint(null)} className="flex-1 h-full flex flex-col items-center justify-end group cursor-pointer">
                            <span className="text-[10px] font-bold text-indigo-600 mb-1">{(val || 0).toLocaleString()}</span>
                            <div className="w-full max-w-[60px] bg-indigo-500 group-hover:bg-indigo-600 rounded-t-lg transition-all shadow-md" style={{ height: `${heightPct}%`, minHeight: '8px' }}></div>
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
                            <div className="flex justify-between text-xs font-medium"><span>{d.name}</span><span className="font-bold text-indigo-600">{(val || 0).toLocaleString()} ({pct}%)</span></div>
                            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden"><div className="bg-indigo-600 h-full rounded-full transition-all duration-500" style={{ width: `${pct}%` }}></div></div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {chartType === 'table' && (
                    <div className="overflow-x-auto border rounded-lg">
                      <table className="w-full text-xs text-left">
                        <thead className="bg-slate-100 text-slate-700 font-bold border-b">
                          <tr><th className="p-2.5">{chartMetric.startsWith('del') ? 'Delivery Service Name' : 'Vendor Name'}</th><th className="p-2.5">{chartMetric === 'del_orders' ? 'Total Waybills' : chartMetric === 'del_success' ? 'Success Rate (%)' : 'Stock Quantity'}</th><th className="p-2.5">{chartMetric.startsWith('del') ? 'Delivered Qty' : 'Total Selling Value'}</th><th className="p-2.5">{chartMetric.startsWith('del') ? 'Return Rate (%)' : 'Overdue Store Charges'}</th></tr>
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
          </div>
        )}

        {/* ORDERS & VOUCHERS TAB */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                <div className="relative">
                  <button 
                    onClick={() => setShowOrderSearchDropdown(!showOrderSearchDropdown)}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs px-3 py-2 rounded-lg border border-slate-300 flex items-center space-x-1"
                  >
                    <span>Search by: <strong className="text-indigo-600">{orderSearchMode}</strong></span>
                    <ChevronRight className="w-3.5 h-3.5 ml-1" />
                  </button>

                  {showOrderSearchDropdown && (
                    <div className="absolute left-0 mt-1 w-48 bg-white border border-slate-200 rounded-lg shadow-xl z-20 text-xs py-1">
                      {['ID', 'DATE', 'VENDOR', 'DELIVERY', 'STATUS', 'COD_FLOW', 'VENDOR_PAY'].map(mode => (
                        <button
                          key={mode}
                          onClick={() => { setOrderSearchMode(mode); setOrderSearchVal(''); setShowOrderSearchDropdown(false); }}
                          className={`w-full text-left px-3 py-2 hover:bg-indigo-50 font-medium ${orderSearchMode === mode ? 'text-indigo-600 font-bold bg-indigo-50/50' : 'text-slate-700'}`}
                        >
                          {mode === 'ID' ? 'ID / Customer / Phone' : mode === 'DATE' ? 'Date' : mode === 'VENDOR' ? 'Vendor Name' : mode === 'DELIVERY' ? 'Delivery Service' : mode === 'STATUS' ? 'Current Status' : mode === 'COD_FLOW' ? 'COD Flow Status' : 'Vendor Pay Status'}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {orderSearchMode === 'ID' && (
                  <div className="relative w-full sm:w-64">
                    <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                    <input 
                      type="text" placeholder="Type ID, Phone, Name..."
                      value={orderSearchVal}
                      onChange={(e) => setOrderSearchVal(e.target.value)}
                      className="w-full pl-9 pr-3 py-1.5 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                )}

                {orderSearchMode === 'DATE' && (
                  <input 
                    type="date" value={orderSearchVal}
                    onChange={(e) => setOrderSearchVal(e.target.value)}
                    className="border border-slate-300 rounded-lg text-xs px-3 py-1.5 bg-white"
                  />
                )}

                {orderSearchMode === 'VENDOR' && (
                  <select 
                    value={orderSearchVal}
                    onChange={(e) => setOrderSearchVal(e.target.value)}
                    className="border border-slate-300 rounded-lg text-xs px-3 py-1.5 bg-white font-medium"
                  >
                    <option value="">-- Select Vendor --</option>
                    {vendors.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                  </select>
                )}

                {orderSearchMode === 'DELIVERY' && (
                  <select 
                    value={orderSearchVal}
                    onChange={(e) => setOrderSearchVal(e.target.value)}
                    className="border border-slate-300 rounded-lg text-xs px-3 py-1.5 bg-white font-medium"
                  >
                    <option value="">-- Select Delivery --</option>
                    {deliveries.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
                  </select>
                )}

                {orderSearchMode === 'STATUS' && (
                  <select 
                    value={orderSearchVal}
                    onChange={(e) => setOrderSearchVal(e.target.value)}
                    className="border border-slate-300 rounded-lg text-xs px-3 py-1.5 bg-white font-medium"
                  >
                    <option value="">-- All Statuses --</option>
                    <option value="Pending">Pending</option>
                    <option value="In-Transit">In-Transit</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Partial Return">Partial Return</option>
                    <option value="Delivery Return">Delivery Return</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                )}

                {orderSearchMode === 'COD_FLOW' && (
                  <select 
                    value={orderSearchVal}
                    onChange={(e) => setOrderSearchVal(e.target.value)}
                    className="border border-slate-300 rounded-lg text-xs px-3 py-1.5 bg-white font-medium"
                  >
                    <option value="">-- All COD Flow Status --</option>
                    <option value="DONE">COD Flow Done (Collected)</option>
                    <option value="PENDING">COD Flow Pending (Not Collected)</option>
                  </select>
                )}

                {orderSearchMode === 'VENDOR_PAY' && (
                  <select 
                    value={orderSearchVal}
                    onChange={(e) => setOrderSearchVal(e.target.value)}
                    className="border border-slate-300 rounded-lg text-xs px-3 py-1.5 bg-white font-medium"
                  >
                    <option value="">-- All Vendor Pay Status --</option>
                    <option value="DONE">Vendor Paid Done (Payout Recorded)</option>
                    <option value="PENDING">Vendor Paid Pending (Not Paid Yet)</option>
                  </select>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => exportSelectedToExcel('orders', scopedOrders, selectedOrderIds)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-3 py-2 rounded-lg font-semibold flex items-center space-x-1 shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export Excel (.xls) {selectedOrderIds.length > 0 ? `(${selectedOrderIds.length})` : ''}</span>
                </button>

                {currentUser.role !== 'Vendor' && (
                  <button 
                    onClick={() => {
                      setNewOrder({
                        vendorId: '',
                        customerName: '',
                        customerPhone: '',
                        deliveryAddress: '',
                        deliveryServiceId: deliveries[0]?.id || '',
                        trackingNo: '',
                        deliveryFee: 0,
                        items: [{ itemId: '', qty: 1, discount: 0 }]
                      });
                      setShowOrderModal(true);
                    }}
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
                      <th className="p-3 w-10 text-center"><input type="checkbox" onChange={(e) => setSelectedOrderIds(e.target.checked ? scopedOrders.map(o => o.id) : [])} checked={selectedOrderIds.length > 0 && selectedOrderIds.length === scopedOrders.length} /></th>
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
                    {scopedOrders.map(order => {
                      const vendor = vendors.find(v => v.id === order.vendorId);
                      const currentDeliveryName = getDeliveryName(order);
                      const isCodDone = codCollectedVoucherIds.has(order.id);
                      const isLocked = currentUser.role === 'Vendor' || isCodDone || (currentUser.role !== 'Admin' && (order.status === 'Delivered' || order.status === 'Cancelled'));
                      const isSelected = selectedOrderIds.includes(order.id);

                      return (
                        <tr key={order.id} className={`hover:bg-slate-50 ${order.cancelled ? 'bg-rose-50/50 opacity-80' : ''}`}>
                          <td className="p-3 text-center"><input type="checkbox" checked={isSelected} onChange={(e) => setSelectedOrderIds(e.target.checked ? [...selectedOrderIds, order.id] : selectedOrderIds.filter(id => id !== order.id))} /></td>
                          <td className="p-3 font-bold text-indigo-600">
                            {order.id}
                            {isCodDone && <span className="ml-1 text-[9px] bg-emerald-100 text-emerald-700 px-1 rounded font-semibold">COD Flow Done</span>}
                            <div className="text-[10px] text-slate-400 font-normal">{order.createdAt}</div>
                          </td>
                          <td className="p-3 font-medium text-slate-700">{vendor ? vendor.name : order.vendorId}</td>
                          <td className="p-3"><p className="font-semibold text-slate-800">{order.customerName}</p><p className="text-slate-500">{order.customerPhone}</p></td>
                          <td className="p-3"><p className="font-semibold text-slate-700">{currentDeliveryName}</p><p className="text-slate-400 font-mono text-[10px]">Trk: {order.trackingNo}</p></td>
                          <td className="p-3 font-bold text-slate-800">{(Number(order.totalCod) || 0).toLocaleString()} Ks</td>
                          <td className="p-3">
                            <select 
                              disabled={isLocked}
                              value={order.status}
                              onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                              className={`text-xs font-semibold px-2 py-1 rounded border ${order.cancelled ? 'bg-rose-100 text-rose-700 border-rose-200' : order.status === 'Delivered' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : order.status === 'Partial Return' ? 'bg-purple-50 text-purple-700 border-purple-200' : 'bg-amber-50 text-amber-700 border-amber-200'} ${isLocked ? 'cursor-not-allowed opacity-80' : 'cursor-pointer'}`}
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
                            <button onClick={() => { setSelectedOrder(order); setShowVoucherModal(true); }} className="bg-slate-100 hover:bg-slate-200 text-slate-700 p-1.5 rounded text-[11px] font-semibold inline-flex items-center space-x-1">
                              <Printer className="w-3.5 h-3.5" /><span>Voucher</span>
                            </button>
                            {currentUser.role === 'Admin' && order.cancelled && order.status !== 'Partial Return' && !isCodDone && (
                              <button onClick={() => handleDeleteVoucher(order.id)} className="bg-rose-50 hover:bg-rose-100 text-rose-700 p-1.5 rounded text-[11px] font-semibold inline-flex items-center space-x-1">
                                <Trash2 className="w-3.5 h-3.5" /><span>Delete</span>
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

        {/* VENDOR INVENTORY TAB */}
        {activeTab === 'inventory' && (
          <div className="space-y-4">
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                <div className="relative">
                  <button 
                    onClick={() => setShowInvSearchDropdown(!showInvSearchDropdown)}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs px-3 py-2 rounded-lg border border-slate-300 flex items-center space-x-1"
                  >
                    <span>Search by: <strong className="text-indigo-600">{invSearchMode}</strong></span>
                    <ChevronRight className="w-3.5 h-3.5 ml-1" />
                  </button>

                  {showInvSearchDropdown && (
                    <div className="absolute left-0 mt-1 w-44 bg-white border border-slate-200 rounded-lg shadow-xl z-20 text-xs py-1">
                      {['ID', 'DATE', 'VENDOR'].map(mode => (
                        <button
                          key={mode}
                          onClick={() => { setInvSearchMode(mode); setInvSearchVal(''); setShowInvSearchDropdown(false); }}
                          className={`w-full text-left px-3 py-2 hover:bg-indigo-50 font-medium ${invSearchMode === mode ? 'text-indigo-600 font-bold bg-indigo-50/50' : 'text-slate-700'}`}
                        >
                          {mode === 'ID' ? 'SKU / Item Name' : mode === 'DATE' ? 'Stock-In Date' : 'Vendor Name'}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {invSearchMode === 'ID' && (
                  <div className="relative w-full sm:w-64">
                    <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                    <input 
                      type="text" placeholder="Search SKU, Item name..."
                      value={invSearchVal}
                      onChange={(e) => setInvSearchVal(e.target.value)}
                      className="w-full pl-9 pr-3 py-1.5 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                )}

                {invSearchMode === 'DATE' && (
                  <input 
                    type="date" value={invSearchVal}
                    onChange={(e) => setInvSearchVal(e.target.value)}
                    className="border border-slate-300 rounded-lg text-xs px-3 py-1.5 bg-white"
                  />
                )}

                {invSearchMode === 'VENDOR' && (
                  <select 
                    value={invSearchVal}
                    onChange={(e) => setInvSearchVal(e.target.value)}
                    className="border border-slate-300 rounded-lg text-xs px-3 py-1.5 bg-white font-medium"
                  >
                    <option value="">-- Select Vendor --</option>
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
                  <span>Export Excel (.xls) {selectedItemIds.length > 0 ? `(${selectedItemIds.length})` : ''}</span>
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
                      <th className="p-3 w-10 text-center"><input type="checkbox" onChange={(e) => setSelectedItemIds(e.target.checked ? scopedItems.map(i => i.id) : [])} checked={selectedItemIds.length > 0 && selectedItemIds.length === scopedItems.length} /></th>
                      <th className="p-3">SKU / Item</th>
                      <th className="p-3">Vendor</th>
                      <th className="p-3">Selling Price</th>
                      <th className="p-3">In-Stock Qty</th>
                      <th className="p-3">Stock-In Date</th>
                      <th className="p-3">Store Charges (Est.)</th>
                      <th className="p-3 text-right">Actions (Return / Edit / Cancel)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {scopedItems.map(item => {
                      const vendor = vendors.find(v => v.id === item.vendorId);
                      const storeCharge = calculateStoreCharge(item);
                      const isSelected = selectedItemIds.includes(item.id);
                      const todayDateStr = new Date().toISOString().split('T')[0];
                      const isTodayBatch = item.stockInDate === todayDateStr;

                      const hasTransactions = (Array.isArray(orders) && orders.some(o => 
                        !o.cancelled && Array.isArray(o.items) && o.items.some(oi => oi && oi.itemId === item.id)
                      )) || (Array.isArray(returns) && returns.some(r => r && r.itemId === item.id));

                      return (
                        <tr key={item.id} className="hover:bg-slate-50">
                          <td className="p-3 text-center">
                            <input 
                              type="checkbox" 
                              checked={isSelected} 
                              onChange={(e) => setSelectedItemIds(e.target.checked ? [...selectedItemIds, item.id] : selectedItemIds.filter(id => id !== item.id))} 
                            />
                          </td>
                          <td className="p-3">
                            <p className="font-bold text-slate-800">{item.name}</p>
                            <p className="text-[10px] text-slate-400 font-mono">{item.sku}</p>
                          </td>
                          <td className="p-3 text-slate-600 font-medium">{vendor ? vendor.name : item.vendorId}</td>
                          <td className="p-3"><p className="font-semibold text-slate-800">{(Number(item.price) || 0).toLocaleString()} Ks</p></td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded font-bold ${(Number(item.quantity) || 0) < 5 ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-800'}`}>
                              {item.quantity} pcs
                            </span>
                          </td>
                          <td className="p-3 text-slate-500 font-mono text-[11px]">{item.stockInDate}</td>
                          <td className="p-3">
                            {storeCharge > 0 ? (
                              <span className="text-amber-600 font-bold flex items-center"><Clock className="w-3 h-3 mr-1" />{storeCharge.toLocaleString()} Ks</span>
                            ) : (
                              <span className="text-emerald-600 text-[11px]">Free Period</span>
                            )}
                          </td>
                          <td className="p-3 text-right space-x-2 whitespace-nowrap">
                            <button 
                              onClick={() => { setTargetReturnItem(item); setReturnForm({ qty: 1, reason: 'Overstock Return' }); setShowReturnModal(true); }}
                              className="text-xs text-amber-600 hover:underline font-semibold"
                            >
                              Return Stock
                            </button>

                            {currentUser.role !== 'Vendor' && isTodayBatch && !item.sku?.endsWith('-RET') && !item.sku?.endsWith('-PRET') && (
                              <button 
                                onClick={() => {
                                  setEditingInventoryItem(item);
                                  setEditInventoryForm({
                                    name: item.name,
                                    category: item.category || 'General',
                                    price: item.price,
                                    quantity: item.quantity,
                                    handlingFee: item.handlingFee || 500,
                                    storeChargePerDay: item.storeChargePerDay || 30,
                                    freeDays: item.freeDays || 7
                                  });
                                  setShowEditItemModal(true);
                                }}
                                className="text-xs text-indigo-600 hover:underline font-semibold"
                              >
                                Edit
                              </button>
                            )}

                            {currentUser.role !== 'Vendor' && isTodayBatch && !hasTransactions && (
                              <button 
                                onClick={() => handleCancelInventoryItem(item)}
                                className="text-xs text-rose-600 hover:underline font-semibold"
                              >
                                Cancel
                              </button>
                            )}

                            {currentUser.role !== 'Vendor' && !isTodayBatch && (
                              <span className="text-[10px] text-slate-400">🔒 Locked (Past Date)</span>
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

        {/* RETURNS & DAMAGE TAB */}
        {activeTab === 'returns' && (
          <div className="space-y-4">
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                <div className="relative">
                  <button 
                    onClick={() => setShowRetSearchDropdown(!showRetSearchDropdown)}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs px-3 py-2 rounded-lg border border-slate-300 flex items-center space-x-1"
                  >
                    <span>Search by: <strong className="text-indigo-600">{retSearchMode}</strong></span>
                    <ChevronRight className="w-3.5 h-3.5 ml-1" />
                  </button>

                  {showRetSearchDropdown && (
                    <div className="absolute left-0 mt-1 w-44 bg-white border border-slate-200 rounded-lg shadow-xl z-20 text-xs py-1">
                      {['ID', 'DATE', 'VENDOR', 'REASON'].map(mode => (
                        <button
                          key={mode}
                          onClick={() => { setRetSearchMode(mode); setRetSearchVal(''); setShowRetSearchDropdown(false); }}
                          className={`w-full text-left px-3 py-2 hover:bg-indigo-50 font-medium ${retSearchMode === mode ? 'text-indigo-600 font-bold bg-indigo-50/50' : 'text-slate-700'}`}
                        >
                          {mode === 'ID' ? 'Return ID / Item' : mode === 'DATE' ? 'Date' : mode === 'VENDOR' ? 'Vendor Name' : 'Reason'}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {retSearchMode === 'ID' && (
                  <div className="relative w-full sm:w-64">
                    <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                    <input 
                      type="text" placeholder="Search Return ID, Item name..."
                      value={retSearchVal}
                      onChange={(e) => setRetSearchVal(e.target.value)}
                      className="w-full pl-9 pr-3 py-1.5 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                )}

                {retSearchMode === 'DATE' && (
                  <input 
                    type="text" placeholder="e.g. 10/22/2026"
                    value={retSearchVal}
                    onChange={(e) => setRetSearchVal(e.target.value)}
                    className="border border-slate-300 rounded-lg text-xs px-3 py-1.5 bg-white"
                  />
                )}

                {retSearchMode === 'VENDOR' && (
                  <select 
                    value={retSearchVal}
                    onChange={(e) => setRetSearchVal(e.target.value)}
                    className="border border-slate-300 rounded-lg text-xs px-3 py-1.5 bg-white font-medium"
                  >
                    <option value="">-- Select Vendor --</option>
                    {vendors.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                  </select>
                )}

                {retSearchMode === 'REASON' && (
                  <input 
                    type="text" placeholder="Search reason..."
                    value={retSearchVal}
                    onChange={(e) => setRetSearchVal(e.target.value)}
                    className="border border-slate-300 rounded-lg text-xs px-3 py-1.5 bg-white"
                  />
                )}
              </div>

              <button 
                onClick={() => exportSelectedToExcel('returns', scopedReturns, selectedReturnIds)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-3 py-2 rounded-lg font-semibold flex items-center space-x-1 shadow-sm"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Excel (.xls) {selectedReturnIds.length > 0 ? `(${selectedReturnIds.length})` : ''}</span>
              </button>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-600 font-semibold border-b">
                  <tr>
                    <th className="p-3 w-10 text-center"><input type="checkbox" onChange={(e) => setSelectedReturnIds(e.target.checked ? scopedReturns.map(r => r.id) : [])} /></th>
                    <th className="p-3">Return ID</th>
                    <th className="p-3">Item Name</th>
                    <th className="p-3">Return Type</th>
                    <th className="p-3">Quantity</th>
                    <th className="p-3">Reason</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Date</th>
                    <th className="p-3 text-right">Actions (Today Only: Edit/Cancel)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {scopedReturns.map(ret => {
                    const isSelected = selectedReturnIds.includes(ret.id);
                    const todayDateStr = new Date().toLocaleDateString();
                    const isTodayReturn = ret.date === todayDateStr;
                    const isCodDone = ret.orderId ? codCollectedVoucherIds.has(ret.orderId) : false;

                    return (
                      <tr key={ret.id} className="hover:bg-slate-50">
                        <td className="p-3 text-center"><input type="checkbox" checked={isSelected} onChange={(e) => setSelectedReturnIds(e.target.checked ? [...selectedReturnIds, ret.id] : selectedReturnIds.filter(id => id !== ret.id))} /></td>
                        <td className="p-3 font-bold text-slate-700">{ret.id}</td>
                        <td className="p-3 font-semibold text-slate-800">{ret.itemName}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${ret.type.includes('Damage') ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                            {ret.type}
                          </span>
                        </td>
                        <td className="p-3 font-bold">{ret.qty}</td>
                        <td className="p-3 text-slate-500">{ret.reason}</td>
                        <td className="p-3 font-medium text-slate-700">{ret.status}</td>
                        <td className="p-3 text-slate-400 font-mono text-[11px]">{ret.date}</td>
                        <td className="p-3 text-right space-x-2">
                          {isTodayReturn && !isCodDone ? (
                            <button 
                              onClick={() => handleCancelReturnItem(ret)}
                              className="text-xs text-rose-600 hover:underline font-semibold"
                            >
                              Cancel
                            </button>
                          ) : (
                            <span className="text-[10px] text-slate-400 font-medium">
                              {isCodDone ? '🔒 Locked (COD Settled)' : '🔒 Locked (Past Date)'}
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Vendors Tab */}
        {activeTab === 'settlements' && currentUser.role !== 'Vendor' && (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex justify-between items-center">
              <div>
                <h3 className="font-bold text-slate-800 text-sm">Vendors Management & Client Payout Reports</h3>
                <p className="text-xs text-slate-500 mt-0.5">Manage vendors, bank accounts, net payable calculations, and official client payout statements (.xls).</p>
              </div>

              {currentUser.role === 'Admin' && (
                <button 
                  onClick={() => { setEditingVendor(null); setNewVendor({ name: '', phone: '', address: '', bankAccount: '' }); setShowVendorModal(true); }}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs px-4 py-2 rounded-lg font-semibold flex items-center space-x-1 shadow-sm"
                >
                  <Plus className="w-4 h-4 mr-1" /><span>Register New Vendor</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {vendors.length === 0 ? (
                <div className="col-span-2 bg-white p-8 rounded-xl border border-slate-200 text-center text-slate-400 text-xs">
                  လက်ရှိတွင် Register လုပ်ထားသော Vendor စာရင်း မရှိသေးပါ။ "Register New Vendor" ဖြင့် အသစ်စတင်ထည့်သွင်းနိုင်ပါသည်။
                </div>
              ) : (
                vendors.map(vendor => {
                  const vendorDeliveredOrders = orders.filter(o => o.vendorId === vendor.id && (o.status === 'Delivered' || o.status === 'Partial Return') && !o.cancelled);
                  const vendorActiveOrders = orders.filter(o => o.vendorId === vendor.id && !o.cancelled); 
                  const totalCodCollected = vendorDeliveredOrders.reduce((sum, o) => sum + (Number(o.totalCod) || 0), 0);
                  const totalHandlingFee = vendorActiveOrders.reduce((sum, o) => sum + (Number(o.tnHandlingFee) || 0), 0);
                  const totalStoreCharge = vendorDeliveredOrders.reduce((sum, o) => sum + calculateOrderStoreCharges(o), 0);
                  
                  const initialNetPayable = totalCodCollected - totalHandlingFee - totalStoreCharge;

                  const vendorPaidOut = cashLedger
                    .filter(c => c.type === 'VENDOR_OUT' && c.referenceId && c.referenceId.includes(vendor.id))
                    .reduce((sum, c) => sum + (Number(c.amount) || 0), 0);

                  const netPayable = initialNetPayable - vendorPaidOut;

                  return (
                    <div key={vendor.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
                      <div className="flex justify-between items-start border-b pb-3">
                        <div>
                          <h4 className="font-bold text-slate-800 text-base">{vendor.name}</h4>
                          <p className="text-xs text-slate-400">📍 {vendor.address} | 📞 {vendor.phone}</p>
                          {vendor.bankAccount && <p className="text-[11px] text-indigo-600 font-mono mt-0.5">🏦 {vendor.bankAccount}</p>}
                        </div>
                        <div className="text-right">
                          <span className="bg-indigo-50 text-indigo-700 font-bold text-xs px-2.5 py-1 rounded-full">{vendor.id}</span>
                          {currentUser.role === 'Admin' && (
                            <div className="mt-2 space-x-2">
                              <button onClick={() => { setEditingVendor(vendor); setNewVendor({ name: vendor.name, phone: vendor.phone, address: vendor.address, bankAccount: vendor.bankAccount }); setShowVendorModal(true); }} className="text-xs text-indigo-600 hover:underline font-semibold">Edit</button>
                              <button onClick={() => handleDeleteVendor(vendor.id)} className="text-xs text-rose-600 hover:underline font-semibold">Delete</button>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between text-slate-600"><span>Delivered COD Collected:</span><span className="font-semibold text-slate-800">{totalCodCollected.toLocaleString()} Ks</span></div>
                        <div className="flex justify-between text-slate-600"><span>T&N Handling Fee Deduct:</span><span className="font-semibold text-red-600">- {totalHandlingFee.toLocaleString()} Ks</span></div>
                        <div className="flex justify-between text-slate-600"><span>Warehouse Store Charges:</span><span className="font-semibold text-red-600">- {totalStoreCharge.toLocaleString()} Ks</span></div>
                        <div className="flex justify-between text-slate-600 border-t pt-1"><span>Net Payable (Initial):</span><span className="font-semibold text-slate-800">{initialNetPayable.toLocaleString()} Ks</span></div>
                        <div className="flex justify-between text-slate-600"><span>Vendor Out Paid (Cash Management):</span><span className="font-semibold text-rose-600">- {vendorPaidOut.toLocaleString()} Ks</span></div>
                        <div className="border-t pt-2 flex justify-between font-bold text-sm text-slate-900"><span>Remaining Balance Payable:</span><span className="text-emerald-600">{netPayable.toLocaleString()} Ks</span></div>
                      </div>

                      <div className="flex space-x-2">
                        <button onClick={() => exportVendorStatement(vendor.id)} className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold py-2 rounded-lg transition-colors flex items-center justify-center space-x-1 shadow-sm">
                          <Download className="w-3.5 h-3.5" /><span>Client Payout Report (.xls)</span>
                        </button>
                        <button onClick={() => { exportSelectedToExcel(`settlement_${vendor.id}`, vendorDeliveredOrders, vendorDeliveredOrders.map(o => o.id)); addLog(`Exported full settlement statement (.xls) for Vendor ${vendor.name}`); }} className="bg-slate-900 hover:bg-slate-800 text-white text-xs px-3 py-2 rounded-lg transition-colors flex items-center justify-center">
                          <FileSpreadsheet className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
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
                <button onClick={() => { setEditingDelivery(null); setNewDelivery({ id: '', name: '', phone: '', address: '', bankAccount: '' }); setShowDeliveryModal(true); }} className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs px-4 py-2 rounded-lg font-semibold flex items-center space-x-1 shadow-sm">
                  <Plus className="w-4 h-4 mr-1" /><span>Register New Delivery Service</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {deliveries.map(del => {
                const delOrders = orders.filter(o => (o.deliveryServiceId === del.id || getDeliveryName(o) === del.name) && !o.cancelled);
                const sentList = delOrders.filter(o => o.status === 'Delivered' || o.status === 'Partial Return');
                const pendingList = delOrders.filter(o => o.status === 'Pending' || o.status === 'In-Transit');
                
                const totalDeliveredCod = sentList.reduce((sum, o) => sum + (Number(o.totalCod) || 0), 0);
                const collectedCod = sentList
                  .filter(o => codCollectedVoucherIds.has(o.id))
                  .reduce((sum, o) => sum + (Number(o.totalCod) || 0), 0);
                const codReceivable = totalDeliveredCod - collectedCod;

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
                            <button onClick={() => { setEditingDelivery(del); setNewDelivery({ id: del.id, name: del.name, phone: del.phone, address: del.address, bankAccount: del.bankAccount }); setShowDeliveryModal(true); }} className="text-xs text-indigo-600 hover:underline font-semibold">Edit</button>
                            <button onClick={() => handleDeleteDelivery(del.id, del.name)} className="text-xs text-rose-600 hover:underline font-semibold">Delete</button>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between text-slate-600"><span>စာရင်းပို့ပြီး (Delivered Orders):</span><span className="font-bold text-emerald-600">{sentList.length} Waybills</span></div>
                      <div className="flex justify-between text-slate-600"><span>ပို့ရန်ကျန်စာရင်း (Pending / In-Transit):</span><span className="font-bold text-amber-600">{pendingList.length} Waybills</span></div>
                      <div className="flex justify-between text-slate-600"><span>စုစုပေါင်း Delivered COD:</span><span className="font-semibold text-slate-800">{totalDeliveredCod.toLocaleString()} Ks</span></div>
                      <div className="flex justify-between text-slate-600"><span>COD Collected (COD_IN Cash):</span><span className="font-semibold text-emerald-600">- {collectedCod.toLocaleString()} Ks</span></div>
                      <div className="border-t pt-1 flex justify-between font-bold text-sm text-slate-900"><span>ရရန်ရှိ COD စာရင်း (COD Receivable):</span><span className="text-indigo-600">{codReceivable.toLocaleString()} Ks</span></div>
                    </div>

                    <button onClick={() => { exportSelectedToExcel(`delivery_${del.id}`, delOrders, delOrders.map(o => o.id)); addLog(`Exported delivery report (.xls) for ${del.name}`); }} className="w-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold py-2 rounded-lg transition-colors flex items-center justify-center space-x-1">
                      <Download className="w-3.5 h-3.5" /><span>Export Delivery Report (.xls)</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* CASH MANAGEMENT TAB */}
        {activeTab === 'cash_ledger' && currentUser.role !== 'Vendor' && (
          <div className="space-y-4">
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                <div className="relative">
                  <button 
                    onClick={() => setShowCashSearchDropdown(!showCashSearchDropdown)}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs px-3 py-2 rounded-lg border border-slate-300 flex items-center space-x-1"
                  >
                    <span>Search by: <strong className="text-indigo-600">{cashSearchMode}</strong></span>
                    <ChevronRight className="w-3.5 h-3.5 ml-1" />
                  </button>

                  {showCashSearchDropdown && (
                    <div className="absolute left-0 mt-1 w-44 bg-white border border-slate-200 rounded-lg shadow-xl z-20 text-xs py-1">
                      {['ID', 'DATE', 'TYPE'].map(mode => (
                        <button
                          key={mode}
                          onClick={() => { setCashSearchMode(mode); setCashSearchVal(''); setShowCashSearchDropdown(false); }}
                          className={`w-full text-left px-3 py-2 hover:bg-indigo-50 font-medium ${cashSearchMode === mode ? 'text-indigo-600 font-bold bg-indigo-50/50' : 'text-slate-700'}`}
                        >
                          {mode === 'ID' ? 'ID / Reference No' : mode === 'DATE' ? 'Date' : 'Flow Type (COD_IN/VENDOR_OUT)'}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {cashSearchMode === 'ID' && (
                  <div className="relative w-full sm:w-64">
                    <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                    <input 
                      type="text" placeholder="Search ID, Ref No, Description..."
                      value={cashSearchVal}
                      onChange={(e) => setCashSearchVal(e.target.value)}
                      className="w-full pl-9 pr-3 py-1.5 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                )}

                {cashSearchMode === 'DATE' && (
                  <input 
                    type="text" placeholder="e.g. 10/22/2026"
                    value={cashSearchVal}
                    onChange={(e) => setCashSearchVal(e.target.value)}
                    className="border border-slate-300 rounded-lg text-xs px-3 py-1.5 bg-white"
                  />
                )}

                {cashSearchMode === 'TYPE' && (
                  <select 
                    value={cashSearchVal}
                    onChange={(e) => setCashSearchVal(e.target.value)}
                    className="border border-slate-300 rounded-lg text-xs px-3 py-1.5 bg-white font-medium"
                  >
                    <option value="">-- All Types --</option>
                    <option value="COD_IN">COD_IN</option>
                    <option value="VENDOR_OUT">VENDOR_OUT</option>
                  </select>
                )}
              </div>

              <div className="flex space-x-2">
                <button onClick={() => exportSelectedToExcel('cash_ledger', scopedCashLedger, selectedCashIds)} className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-3 py-2 rounded-lg font-semibold flex items-center space-x-1 shadow-sm">
                  <Download className="w-3.5 h-3.5" /><span>Export Excel (.xls)</span>
                </button>
                <button onClick={() => { setCashFlowType('COD_IN'); setSelectedPartnerId(''); setSelectedVoucherIds([]); setCashTransactionNo(''); setCashDescription(''); setShowCashModal(true); }} className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs px-4 py-2 rounded-lg font-semibold flex items-center space-x-1 shadow-sm">
                  <Plus className="w-4 h-4 mr-1" /><span>Add Cash Transaction</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <p className="text-xs font-semibold text-slate-500 uppercase">Total COD Inflow (Actual)</p>
                <p className="text-2xl font-bold text-emerald-600 mt-1">{cashLedger.filter(c => c.type === 'COD_IN').reduce((s, c) => s + c.amount, 0).toLocaleString()} Ks</p>
              </div>
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <p className="text-xs font-semibold text-slate-500 uppercase">Total Vendor Outflow (Actual)</p>
                <p className="text-2xl font-bold text-rose-600 mt-1">{cashLedger.filter(c => c.type === 'VENDOR_OUT' || c.type === 'EXPENSE').reduce((s, c) => s + c.amount, 0).toLocaleString()} Ks</p>
              </div>
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <p className="text-xs font-semibold text-slate-500 uppercase">Net T&N Cash Balance</p>
                <p className="text-2xl font-bold text-indigo-600 mt-1">{(cashLedger.filter(c => c.type === 'COD_IN').reduce((s, c) => s + c.amount, 0) - cashLedger.filter(c => c.type === 'VENDOR_OUT' || c.type === 'EXPENSE').reduce((s, c) => s + c.amount, 0)).toLocaleString()} Ks</p>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-600 font-semibold border-b">
                  <tr>
                    <th className="p-3 w-10 text-center"><input type="checkbox" onChange={(e) => setSelectedCashIds(e.target.checked ? scopedCashLedger.map(c => c.id) : [])} /></th>
                    <th className="p-3">ID</th>
                    <th className="p-3">Type</th>
                    <th className="p-3">Reference / Voucher</th>
                    <th className="p-3">Note / Description</th>
                    <th className="p-3">Amount</th>
                    <th className="p-3">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {scopedCashLedger.map(c => {
                    const isSelected = selectedCashIds.includes(c.id);
                    return (
                      <tr key={c.id} className="hover:bg-slate-50">
                        <td className="p-3 text-center"><input type="checkbox" checked={isSelected} onChange={(e) => setSelectedCashIds(e.target.checked ? [...selectedCashIds, c.id] : selectedCashIds.filter(id => id !== c.id))} /></td>
                        <td className="p-3 font-mono text-slate-500">{c.id}</td>
                        <td className="p-3"><span className={`px-2 py-0.5 rounded text-[10px] font-bold ${c.type === 'COD_IN' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>{c.type}</span></td>
                        <td className="p-3 font-bold text-indigo-600">{c.referenceId || '-'}</td>
                        <td className="p-3 text-slate-700">{c.description || '-'}</td>
                        <td className={`p-3 font-bold ${c.type === 'COD_IN' ? 'text-emerald-600' : 'text-rose-600'}`}>{c.type === 'COD_IN' ? '+' : '-'} {c.amount.toLocaleString()} Ks</td>
                        <td className="p-3 text-slate-400 font-mono text-[11px]">{c.date}</td>
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
                <h3 className="font-bold text-slate-800 text-sm flex items-center"><Users className="w-4 h-4 mr-2 text-indigo-600" />System Users & Access Management</h3>
                <p className="text-xs text-slate-500 mt-0.5">Create, edit and manage user credentials and roles</p>
              </div>
              <button onClick={() => { setEditingUser(null); setNewUser({ username: '', password: '', name: '', role: 'Staff', vendorId: '' }); setShowUserModal(true); }} className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs px-4 py-2 rounded-lg font-semibold flex items-center space-x-1 shadow-sm">
                <UserPlus className="w-4 h-4 mr-1" /><span>Create New User</span>
              </button>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-600 font-semibold border-b">
                  <tr><th className="p-3">User ID</th><th className="p-3">Username</th><th className="p-3">Display Name</th><th className="p-3">Role</th><th className="p-3 text-right">Actions</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {usersList.map(u => (
                    <tr key={u.id} className="hover:bg-slate-50">
                      <td className="p-3 font-mono text-slate-400">{u.id}</td>
                      <td className="p-3 font-bold text-slate-800">{u.username}</td>
                      <td className="p-3 text-slate-700">{u.name}</td>
                      <td className="p-3"><span className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${u.role === 'Admin' ? 'bg-indigo-100 text-indigo-700' : u.role === 'Staff' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'}`}>{u.role}</span></td>
                      <td className="p-3 text-right space-x-3">
                        <button onClick={() => { setEditingUser(u); setNewUser({ username: u.username, password: '', name: u.name, role: u.role, vendorId: u.vendorId || '' }); setShowUserModal(true); }} className="text-indigo-600 hover:underline font-semibold text-xs">Edit</button>
                        {u.username !== 'admin' && <button onClick={() => handleDeleteUser(u.id)} className="text-rose-600 hover:underline font-bold text-xs">Delete</button>}
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
                <h3 className="font-bold text-slate-800 text-sm flex items-center"><Activity className="w-4 h-4 mr-2 text-indigo-600" />Audit Trail & Action Logs</h3>
                <p className="text-xs text-slate-500 mt-0.5">Real-time log tracking user modifications and operations</p>
              </div>
              <button onClick={() => exportSelectedToExcel('audit_logs', logs, [])} className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-3 py-2 rounded-lg font-semibold flex items-center space-x-1 shadow-sm">
                <Download className="w-3.5 h-3.5" /><span>Export Logs (.xls)</span>
              </button>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-600 font-semibold border-b">
                  <tr><th className="p-3">Log ID</th><th className="p-3">User</th><th className="p-3">Role</th><th className="p-3">Action Details</th><th className="p-3">Timestamp</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {logs.map(log => (
                    <tr key={log.id} className="hover:bg-slate-50">
                      <td className="p-3 font-mono text-slate-400">{log.id}</td>
                      <td className="p-3 font-bold text-slate-800">{log.user}</td>
                      <td className="p-3"><span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium text-[10px]">{log.role}</span></td>
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

      {/* EDIT INVENTORY ITEM MODAL (Updated with Handling Fee) */}
      {showEditItemModal && editingInventoryItem && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-bold text-slate-800 text-sm">Edit Inventory Item (Today's Batch)</h3>
              <button onClick={() => setShowEditItemModal(false)} className="text-slate-400 hover:text-slate-600 text-lg">✕</button>
            </div>

            <form onSubmit={async (e) => {
              e.preventDefault();
              const updatedItem = {
                ...editingInventoryItem,
                name: editInventoryForm.name,
                category: editInventoryForm.category,
                price: Number(editInventoryForm.price) || 0,
                quantity: Number(editInventoryForm.quantity) || 0,
                handlingFee: Number(editInventoryForm.handlingFee) || 500, // 💡 Handling Fee ထည့်သွင်းခြင်း
                storeChargePerDay: Number(editInventoryForm.storeChargePerDay) || 30,
                freeDays: Number(editInventoryForm.freeDays) || 7
              };
              try {
                await fetch(`${API_BASE_URL}/api/inventory/${editingInventoryItem.id}`, {
                  method: 'PUT',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(updatedItem)
                }).catch(() => fetch(`${API_BASE_URL}/api/inventory`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(updatedItem)
                }));
              } catch (err) {}
              setItems(items.map(i => i.id === editingInventoryItem.id ? updatedItem : i));
              addLog(`Updated inventory item details for ${updatedItem.name} (SKU: ${updatedItem.sku})`);
              setShowEditItemModal(false);
              setEditingInventoryItem(null);
            }} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Item Name *</label>
                <input 
                  type="text" required value={editInventoryForm.name}
                  onChange={(e) => setEditInventoryForm({ ...editInventoryForm, name: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg p-2"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Category</label>
                <input 
                  type="text" value={editInventoryForm.category}
                  onChange={(e) => setEditInventoryForm({ ...editInventoryForm, category: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg p-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Selling Price (Ks) *</label>
                  <input 
                    type="number" required value={editInventoryForm.price}
                    onChange={(e) => setEditInventoryForm({ ...editInventoryForm, price: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg p-2"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Quantity *</label>
                  <input 
                    type="number" required value={editInventoryForm.quantity}
                    onChange={(e) => setEditInventoryForm({ ...editInventoryForm, quantity: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg p-2"
                  />
                </div>
              </div>

              {/* 💡 Handling Fee ပါ ထည့်သွင်းပြင်ဆင်နိုင်ရန် Input Box */}
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Handling Fee (Ks)</label>
                  <input 
                    type="number" value={editInventoryForm.handlingFee}
                    onChange={(e) => setEditInventoryForm({ ...editInventoryForm, handlingFee: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg p-2"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Free Storage Days</label>
                  <input 
                    type="number" value={editInventoryForm.freeDays}
                    onChange={(e) => setEditInventoryForm({ ...editInventoryForm, freeDays: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg p-2"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Daily Store (Ks/day)</label>
                  <input 
                    type="number" value={editInventoryForm.storeChargePerDay}
                    onChange={(e) => setEditInventoryForm({ ...editInventoryForm, storeChargePerDay: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg p-2"
                  />
                </div>
              </div>

              <div className="pt-3 flex space-x-2">
                <button type="button" onClick={() => setShowEditItemModal(false)} className="w-1/2 bg-slate-100 py-2.5 rounded-lg font-semibold">Cancel</button>
                <button type="submit" className="w-1/2 bg-indigo-600 text-white py-2.5 rounded-lg font-semibold">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT RETURN MODAL */}
      {showEditReturnModal && editingReturnItem && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-bold text-slate-800 text-sm">Edit Return Record ({editingReturnItem.id})</h3>
              <button onClick={() => setShowEditReturnModal(false)} className="text-slate-400 hover:text-slate-600 text-lg">✕</button>
            </div>

            <form onSubmit={async (e) => {
              e.preventDefault();
              const oldQty = Number(editingReturnItem.qty) || 0;
              const newQty = Number(editReturnForm.qty) || 0;
              const qtyDiff = newQty - oldQty;

              if (editingReturnItem.itemId && qtyDiff !== 0) {
                setItems(prev => prev.map(i => {
                  if (i.id === editingReturnItem.itemId) {
                    return { ...i, quantity: Math.max(0, (Number(i.quantity) || 0) - qtyDiff) };
                  }
                  return i;
                }));
              }

              const updatedRet = {
                ...editingReturnItem,
                itemName: editReturnForm.itemName,
                qty: newQty,
                reason: editReturnForm.reason
              };

              try {
                await fetch(`${API_BASE_URL}/api/returns/${editingReturnItem.id}`, {
                  method: 'PUT',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(updatedRet)
                }).catch(() => fetch(`${API_BASE_URL}/api/returns`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(updatedRet)
                }));
              } catch (err) {}

              setReturns(returns.map(r => r.id === editingReturnItem.id ? updatedRet : r));
              addLog(`Updated return record ${updatedRet.id}: Item Name -> ${updatedRet.itemName}, Qty -> ${updatedRet.qty}`);
              setShowEditReturnModal(false);
              setEditingReturnItem(null);
            }} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Item Name *</label>
                <input 
                  type="text" required value={editReturnForm.itemName}
                  onChange={(e) => setEditReturnForm({ ...editReturnForm, itemName: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg p-2 font-semibold"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Return Quantity *</label>
                <input 
                  type="number" min="1" required value={editReturnForm.qty}
                  onChange={(e) => setEditReturnForm({ ...editReturnForm, qty: Number(e.target.value) })}
                  className="w-full border border-slate-300 rounded-lg p-2 font-bold text-indigo-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Reason / Note</label>
                <textarea 
                  rows={2} value={editReturnForm.reason}
                  onChange={(e) => setEditReturnForm({ ...editReturnForm, reason: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg p-2"
                />
              </div>

              <div className="pt-3 flex space-x-2">
                <button type="button" onClick={() => setShowEditReturnModal(false)} className="w-1/2 bg-slate-100 py-2.5 rounded-lg font-semibold">Cancel</button>
                <button type="submit" className="w-1/2 bg-indigo-600 text-white py-2.5 rounded-lg font-semibold">Update Return</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Advanced Cash Transaction Modal */}
      {showCashModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-bold text-slate-800 text-base">Add Cash Transaction (COD Flow & Payout Logic)</h3>
              <button onClick={() => setShowCashModal(false)} className="text-slate-400 hover:text-slate-600 text-lg">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Transaction Flow Type *</label>
                <select 
                  value={cashFlowType}
                  onChange={(e) => { setCashFlowType(e.target.value); setSelectedPartnerId(''); setSelectedVoucherIds([]); }}
                  className="w-full border border-slate-300 rounded-lg p-2 bg-white"
                >
                  <option value="COD_IN">1. COD Flow (Delivery Collection - COD In)</option>
                  <option value="VENDOR_OUT">2. Vendor Payout Flow (Must have COD Collected first)</option>
                </select>
              </div>

              {cashFlowType === 'COD_IN' ? (
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Select Delivery Service *</label>
                  <select 
                    value={selectedPartnerId}
                    onChange={(e) => { setSelectedPartnerId(e.target.value); setSelectedVoucherIds([]); }}
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
                    onChange={(e) => { setSelectedPartnerId(e.target.value); setSelectedVoucherIds([]); }}
                    className="w-full border border-slate-300 rounded-lg p-2 bg-white"
                  >
                    <option value="">-- Choose Vendor --</option>
                    {vendors.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                  </select>
                </div>
              )}

              {selectedPartnerId && (
                <div className="space-y-2">
                  <label className="block font-semibold text-slate-700">
                    {cashFlowType === 'COD_IN' ? 'Select Delivered Vouchers to collect COD:' : 'Select Vouchers that have already completed COD Collection (COD_IN done):'}
                  </label>
                  <div className="border rounded-lg max-h-56 overflow-y-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-100 text-slate-600 sticky top-0">
                        <tr>
                          <th className="p-2.5 w-10 text-center">Select</th>
                          <th className="p-2.5">Order ID & Customer</th>
                          {cashFlowType === 'VENDOR_OUT' && (<><th className="p-2.5 text-right">COD</th><th className="p-2.5 text-right">Handling</th><th className="p-2.5 text-right">Store Chg</th></>)}
                          <th className="p-2.5 text-right">{cashFlowType === 'COD_IN' ? 'COD Amount' : 'Net Payable'}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {cashFlowType === 'COD_IN' ? (
                          orders
                            .filter(o => (o.deliveryServiceId === selectedPartnerId || getDeliveryName(o) === selectedPartnerId) && (o.status === 'Delivered' || o.status === 'Partial Return') && !o.cancelled && !codCollectedVoucherIds.has(o.id))
                            .map(ord => {
                              const isChecked = selectedVoucherIds.includes(ord.id);
                              return (
                                <tr key={ord.id} className="hover:bg-slate-50">
                                  <td className="p-2.5 text-center"><input type="checkbox" checked={isChecked} onChange={(e) => setSelectedVoucherIds(e.target.checked ? [...selectedVoucherIds, ord.id] : selectedVoucherIds.filter(id => id !== ord.id))} /></td>
                                  <td className="p-2.5 font-bold text-indigo-600">{ord.id}<div className="text-[10px] font-normal text-slate-500">{ord.customerName} ({ord.customerPhone})</div></td>
                                  <td className="p-2.5 text-right font-semibold">{(Number(ord.totalCod) || 0).toLocaleString()} Ks</td>
                                </tr>
                              );
                            })
                        ) : (
                          orders
                            .filter(o => o.vendorId === selectedPartnerId && (o.status === 'Delivered' || o.status === 'Partial Return') && !o.cancelled && codCollectedVoucherIds.has(o.id) && !recordedVoucherIds.has(o.id))
                            .map(ord => {
                              const isChecked = selectedVoucherIds.includes(ord.id);
                              const cod = Number(ord.totalCod) || 0;
                              const handling = Number(ord.tnHandlingFee) || 0;
                              const storeChg = calculateOrderStoreCharges(ord);
                              const netOrderVal = cod - handling - storeChg;
                              return (
                                <tr key={ord.id} className="hover:bg-slate-50">
                                  <td className="p-2.5 text-center"><input type="checkbox" checked={isChecked} onChange={(e) => setSelectedVoucherIds(e.target.checked ? [...selectedVoucherIds, ord.id] : selectedVoucherIds.filter(id => id !== ord.id))} /></td>
                                  <td className="p-2.5 font-bold text-indigo-600">{ord.id}<div className="text-[10px] font-normal text-slate-500">{ord.customerName}</div></td>
                                  <td className="p-2.5 text-right font-medium">{cod.toLocaleString()}</td>
                                  <td className="p-2.5 text-right text-red-600">-{handling.toLocaleString()}</td>
                                  <td className="p-2.5 text-right text-red-600">-{storeChg.toLocaleString()}</td>
                                  <td className="p-2.5 text-right font-bold text-emerald-600">{netOrderVal.toLocaleString()} Ks</td>
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
                <label className="block font-semibold text-slate-700 mb-1">Bank / KPay Transaction No. / Ref No. *</label>
                <input type="text" required value={cashTransactionNo} onChange={(e) => setCashTransactionNo(e.target.value)} placeholder="e.g. KPay-TXN-99882233" className="w-full border border-slate-300 rounded-lg p-2 font-mono" />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Note / Description (Optional)</label>
                <textarea rows={2} value={cashDescription} onChange={(e) => setCashDescription(e.target.value)} placeholder="Optional notes..." className="w-full border border-slate-300 rounded-lg p-2" />
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
                    if (!cashTransactionNo.trim()) {
                      alert('ကျေးဇူးပြု၍ Transaction No. ထည့်သွင်းပါ။');
                      return;
                    }

                    let totalAmount = 0;
                    if (cashFlowType === 'COD_IN') {
                      orders.forEach(o => { if (selectedVoucherIds.includes(o.id)) totalAmount += Number(o.totalCod) || 0; });
                    } else {
                      orders.forEach(o => {
                        if (selectedVoucherIds.includes(o.id)) {
                          const cod = Number(o.totalCod) || 0;
                          const handling = Number(o.tnHandlingFee) || 0;
                          const storeChg = calculateOrderStoreCharges(o);
                          totalAmount += (cod - handling - storeChg);
                        }
                      });
                    }

                    const cObj = {
                      id: `CASH-${Date.now().toString().slice(-4)}`,
                      type: cashFlowType,
                      referenceId: `${selectedPartnerId} [${selectedVoucherIds.join(', ')}] (Ref: ${cashTransactionNo})`,
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
                    } catch (e) {}

                    setCashLedger([cObj, ...cashLedger]);
                    setShowCashModal(false);
                    addLog(`Recorded actual cash payment ${cashFlowType} of ${totalAmount} Ks with Ref: ${cashTransactionNo}`);
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
              <p className="text-slate-600">ကျေးဇူးပြု၍ ပစ္စည်းတစ်ခုချင်းစီအလိုက် Delivered Qty နှင့် Returned Qty ကို စစ်ဆေးအတည်ပြုပါ။</p>

              <div className="border rounded-lg overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-600 border-b">
                    <tr><th className="p-2.5">Item Name</th><th className="p-2.5 text-center">Total Qty</th><th className="p-2.5 text-center">Delivered Qty</th><th className="p-2.5 text-center">Returned Qty</th></tr>
                  </thead>
                  <tbody className="divide-y">
                    {partialItemsForm.map((pIt, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="p-2.5 font-bold text-slate-800">{pIt.name}</td>
                        <td className="p-2.5 text-center font-semibold">{pIt.totalQty}</td>
                        <td className="p-2.5 text-center"><input type="number" min="0" max={pIt.totalQty} value={pIt.deliveredQty} onChange={(e) => { const dVal = Number(e.target.value) || 0; const updated = [...partialItemsForm]; updated[idx].deliveredQty = dVal; updated[idx].returnedQty = Math.max(0, pIt.totalQty - dVal); setPartialItemsForm(updated); }} className="w-16 border rounded text-center p-1 font-bold text-emerald-600" /></td>
                        <td className="p-2.5 text-center"><input type="number" min="0" max={pIt.totalQty} value={pIt.returnedQty} onChange={(e) => { const rVal = Number(e.target.value) || 0; const updated = [...partialItemsForm]; updated[idx].returnedQty = rVal; updated[idx].deliveredQty = Math.max(0, pIt.totalQty - rVal); setPartialItemsForm(updated); }} className="w-16 border rounded text-center p-1 font-bold text-rose-600" /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="pt-2 flex space-x-2">
                <button onClick={() => setShowPartialModal(false)} className="w-1/2 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2.5 rounded-lg font-semibold">Cancel</button>
                <button onClick={handleConfirmPartialReturn} className="w-1/2 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-lg font-semibold shadow-md">Confirm & Update</button>
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
                <input type="number" min="1" max={targetReturnItem.quantity} value={returnForm.qty} onChange={(e) => setReturnForm({ ...returnForm, qty: Number(e.target.value) })} className="w-full border border-slate-300 rounded-lg p-2" />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Reason / Note *</label>
                <textarea rows={2} required value={returnForm.reason} onChange={(e) => setReturnForm({ ...returnForm, reason: e.target.value })} placeholder="e.g. Expired, Damaged..." className="w-full border border-slate-300 rounded-lg p-2" />
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
                    } catch (e) {}

                    const newQty = Math.max(0, (Number(targetReturnItem.quantity) || 0) - numQty);
                    setItems(prev => prev.map(i => i.id === targetReturnItem.id ? { ...i, quantity: newQty } : i));
                    setReturns(prev => [newReturnObj, ...prev]);
                    addLog(`Returned ${numQty} pcs of ${targetReturnItem.name} to Vendor. Reason: ${returnForm.reason}`);
                    setShowReturnModal(false);
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
                <select required value={newOrder.vendorId} onChange={(e) => setNewOrder({ ...newOrder, vendorId: e.target.value })} className="w-full border border-slate-300 rounded-lg p-2">
                  <option value="">-- Choose Vendor --</option>
                  {vendors.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Customer Phone *</label>
                  <input type="text" required placeholder="09xxxxxxxxx" value={newOrder.customerPhone} onChange={(e) => handleCustomerPhoneChange(e.target.value)} className="w-full border border-slate-300 rounded-lg p-2" />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Customer Name *</label>
                  <input type="text" required placeholder="Name" value={newOrder.customerName} onChange={(e) => setNewOrder({ ...newOrder, customerName: e.target.value })} className="w-full border border-slate-300 rounded-lg p-2" />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Delivery Address *</label>
                <textarea required rows={2} placeholder="Full address" value={newOrder.deliveryAddress} onChange={(e) => setNewOrder({ ...newOrder, deliveryAddress: e.target.value })} className="w-full border border-slate-300 rounded-lg p-2" />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Delivery Service *</label>
                  <select required value={newOrder.deliveryServiceId} onChange={(e) => setNewOrder({ ...newOrder, deliveryServiceId: e.target.value })} className="w-full border border-slate-300 rounded-lg p-2">
                    <option value="">-- Select Delivery --</option>
                    {deliveries.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Delivery Fee (Ks)</label>
                  <input type="number" value={newOrder.deliveryFee} onChange={(e) => setNewOrder({ ...newOrder, deliveryFee: Number(e.target.value) })} className="w-full border border-slate-300 rounded-lg p-2" />
                </div>
              </div>

             {/* Select Item Stock Section */}
              <div className="border-t pt-3 space-y-2">
                <div className="flex justify-between items-center">
                  <label className="block font-semibold text-slate-700">Select Item Stock *</label>
                  {/* Item ၁ မျိုးမက ထည့်ရန် ခလုတ် */}
                  <button 
                    type="button"
                    onClick={() => {
                      setNewOrder({
                        ...newOrder,
                        items: [...newOrder.items, { itemId: '', qty: 1, discount: 0 }]
                      });
                    }}
                    className="text-indigo-600 hover:text-indigo-800 text-xs font-bold flex items-center space-x-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Add Item</span>
                  </button>
                </div>

               {newOrder.items.map((it, idx) => {
                  const selectedItemIdsSoFar = newOrder.items
                    .map((itemObj, i) => i !== idx ? itemObj.itemId : null)
                    .filter(Boolean);

                  return (
                    <div key={idx} className="grid grid-cols-12 gap-1.5 bg-slate-50 p-2 rounded-lg items-center">
                      {/* Item Select Dropdown */}
                      <select 
                        required 
                        value={it.itemId} 
                        onChange={(e) => { 
                          const updated = [...newOrder.items]; 
                          updated[idx].itemId = e.target.value; 
                          setNewOrder({ ...newOrder, items: updated }); 
                        }} 
                        className="border border-slate-300 rounded p-1.5 text-xs col-span-5 bg-white font-medium"
                      >
                        <option value="">-- Choose Item --</option>
                        {items
                          .filter(i => (!newOrder.vendorId || i.vendorId === newOrder.vendorId) && !selectedItemIdsSoFar.includes(i.id))
                          .map(i => (
                            <option key={i.id} value={i.id}>
                              {i.name} ({i.quantity} left)
                            </option>
                          ))}
                      </select>

                      {/* Qty Input */}
                      <input 
                        type="number" 
                        placeholder="Qty" 
                        min="1" 
                        required 
                        value={it.qty} 
                        onChange={(e) => { 
                          const updated = [...newOrder.items]; 
                          updated[idx].qty = Number(e.target.value); 
                          setNewOrder({ ...newOrder, items: updated }); 
                        }} 
                        className="border border-slate-300 rounded p-1.5 text-xs col-span-3 text-center" 
                      />

                      {/* Discount Input */}
                      <input 
                        type="number" 
                        placeholder="Disc (Ks)" 
                        value={it.discount} 
                        onChange={(e) => { 
                          const updated = [...newOrder.items]; 
                          updated[idx].discount = Number(e.target.value); 
                          setNewOrder({ ...newOrder, items: updated }); 
                        }} 
                        className="border border-slate-300 rounded p-1.5 text-xs col-span-3 text-center" 
                      />

                      {/* Remove Trash Icon */}
                      <div className="col-span-1 text-center">
                        {newOrder.items.length > 1 && (
                          <button 
                            type="button" 
                            onClick={() => {
                              const updated = newOrder.items.filter((_, i) => i !== idx);
                              setNewOrder({ ...newOrder, items: updated });
                            }}
                            className="text-rose-500 hover:text-rose-700 p-1"
                            title="Remove Item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}

              <div className="pt-3 flex space-x-2">
                <button type="button" onClick={() => setShowOrderModal(false)} className="w-1/2 bg-slate-100 text-slate-700 py-2.5 rounded-lg font-semibold">Cancel</button>
                <button type="submit" className="w-1/2 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-lg font-semibold shadow-md">Save & Print Voucher</button>
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
              <button type="button" onClick={() => setIsExistingItemMode(true)} className={`flex-1 py-1.5 rounded-md transition-all ${isExistingItemMode ? 'bg-white shadow text-indigo-600' : 'text-slate-600'}`}>Existing Item (Restock)</button>
              <button type="button" onClick={() => setIsExistingItemMode(false)} className={`flex-1 py-1.5 rounded-md transition-all ${!isExistingItemMode ? 'bg-white shadow text-indigo-600' : 'text-slate-600'}`}>Brand New Item</button>
            </div>

            <form onSubmit={async (e) => {
              e.preventDefault();
              const todayStr = new Date().toISOString().split('T')[0];

              if (isExistingItemMode) {
                const targetExisting = items.find(i => i.id === newItem.existingItemId);
                if (!targetExisting) {
                  alert('ကျေးဇူးပြု၍ ပစ္စည်းကို ရွေးချယ်ပါ။');
                  return;
                }
                const addQty = Number(newItem.quantity) || 0;
                const newBatchItem = {
                  id: `ITM-${Date.now().toString().slice(-4)}-${Math.floor(Math.random()*100)}`,
                  vendorId: targetExisting.vendorId,
                  name: `${targetExisting.name} (Restock)`,
                  category: targetExisting.category,
                  price: targetExisting.price,
                  cost: 0,
                  quantity: addQty,
                  damagedQty: 0,
                  stockInDate: todayStr,
                  sku: `${targetExisting.sku}-RESTOCK`,
                  handlingFee: Number(newItem.handlingFee) || targetExisting.handlingFee || 500,
                  storeChargePerDay: Number(newItem.storeChargePerDay) || targetExisting.storeChargePerDay || 30,
                  freeDays: Number(newItem.freeDays) || targetExisting.freeDays || 7
                };
                try {
                  await fetch(`${API_BASE_URL}/api/inventory`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newBatchItem)
                  });
                } catch (err) {}
                setItems([newBatchItem, ...items]);
                addLog(`Added restock batch of ${addQty} pcs for ${targetExisting.name}`);
                setShowItemModal(false);
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
                  stockInDate: todayStr,
                  sku: autoSku,
                  handlingFee: Number(newItem.handlingFee) || 500,
                  storeChargePerDay: Number(newItem.storeChargePerDay) || 30,
                  freeDays: Number(newItem.freeDays) || 7
                };
                try {
                  await fetch(`${API_BASE_URL}/api/inventory`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(itemObj)
                  });
                } catch (err) {}
                setItems([itemObj, ...items]);
                addLog(`Added new stock item ${itemObj.name} with date ${todayStr}`);
                setShowItemModal(false);
              }
            }} className="space-y-3 text-xs">
              
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Select Vendor *</label>
                <select required value={newItem.vendorId} onChange={(e) => setNewItem({ ...newItem, vendorId: e.target.value, existingItemId: '' })} className="w-full border border-slate-300 rounded-lg p-2 bg-white">
                  <option value="">-- Choose Vendor --</option>
                  {vendors.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                </select>
              </div>

              {isExistingItemMode ? (
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Select Existing Item *</label>
                  <select required value={newItem.existingItemId} onChange={(e) => { 
                    const selectedId = e.target.value; 
                    const found = items.find(i => i.id === selectedId); 
                    setNewItem({ 
                      ...newItem, 
                      existingItemId: selectedId, 
                      price: found ? found.price : '',
                      storeChargePerDay: found ? (found.storeChargePerDay || '30') : '30',
                      freeDays: found ? (found.freeDays || '7') : '7'
                    }); 
                  }} className="w-full border border-slate-300 rounded-lg p-2 bg-white">
                    <option value="">-- Choose Item Stock --</option>
                    {items.filter(i => newItem.vendorId && i.vendorId === newItem.vendorId).map(i => <option key={i.id} value={i.id}>{i.name} (Batch Date: {i.stockInDate})</option>)}
                  </select>
                </div>
              ) : (
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">New Item Name *</label>
                  <input type="text" required value={newItem.name} onChange={(e) => setNewItem({ ...newItem, name: e.target.value })} className="w-full border border-slate-300 rounded-lg p-2" />
                </div>
              )}

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Selling Price (Ks) *</label>
                <input type="number" required value={newItem.price} onChange={(e) => setNewItem({ ...newItem, price: e.target.value })} className="w-full border border-slate-300 rounded-lg p-2" />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">{isExistingItemMode ? 'Restock Quantity *' : 'Initial Quantity *'}</label>
                  <input type="number" required value={newItem.quantity} onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })} className="w-full border border-slate-300 rounded-lg p-2" />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Handling Fee (Ks)</label>
                  <input type="number" value={newItem.handlingFee} onChange={(e) => setNewItem({ ...newItem, handlingFee: e.target.value })} className="w-full border border-slate-300 rounded-lg p-2" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Free Storage Days</label>
                  <input type="number" value={newItem.freeDays} onChange={(e) => setNewItem({ ...newItem, freeDays: e.target.value })} placeholder="7" className="w-full border border-slate-300 rounded-lg p-2" />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Daily Store Charge (Ks/day)</label>
                  <input type="number" value={newItem.storeChargePerDay} onChange={(e) => setNewItem({ ...newItem, storeChargePerDay: e.target.value })} placeholder="30" className="w-full border border-slate-300 rounded-lg p-2" />
                </div>
              </div>

              <div className="pt-3 flex space-x-2">
                <button type="button" onClick={() => setShowItemModal(false)} className="w-1/2 bg-slate-100 py-2.5 rounded-lg font-semibold">Cancel</button>
                <button type="submit" className="w-1/2 bg-indigo-600 text-white py-2.5 rounded-lg font-semibold">{isExistingItemMode ? 'Confirm Restock' : 'Stock-In & SKU'}</button>
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
                <input type="text" required value={newVendor.name} onChange={(e) => setNewVendor({ ...newVendor, name: e.target.value })} className="w-full border border-slate-300 rounded-lg p-2" />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Phone Number *</label>
                  <input type="text" required value={newVendor.phone} onChange={(e) => setNewVendor({ ...newVendor, phone: e.target.value })} className="w-full border border-slate-300 rounded-lg p-2" />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Bank / KPay Account *</label>
                  <input type="text" required value={newVendor.bankAccount} onChange={(e) => setNewVendor({ ...newVendor, bankAccount: e.target.value })} className="w-full border border-slate-300 rounded-lg p-2" />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Business Address *</label>
                <textarea required rows={2} value={newVendor.address} onChange={(e) => setNewVendor({ ...newVendor, address: e.target.value })} className="w-full border border-slate-300 rounded-lg p-2" />
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
                <input type="text" required value={newDelivery.name} onChange={(e) => setNewDelivery({ ...newDelivery, name: e.target.value })} className="w-full border border-slate-300 rounded-lg p-2" />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Phone Number *</label>
                  <input type="text" required value={newDelivery.phone} onChange={(e) => setNewDelivery({ ...newDelivery, phone: e.target.value })} className="w-full border border-slate-300 rounded-lg p-2" />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Bank / KPay Account *</label>
                  <input type="text" required value={newDelivery.bankAccount} onChange={(e) => setNewDelivery({ ...newDelivery, bankAccount: e.target.value })} className="w-full border border-slate-300 rounded-lg p-2" />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Hub Address *</label>
                <textarea required rows={2} value={newDelivery.address} onChange={(e) => setNewDelivery({ ...newDelivery, address: e.target.value })} className="w-full border border-slate-300 rounded-lg p-2" />
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
              <h3 className="font-bold text-slate-800 text-base">{editingUser ? 'Edit User Account' : 'Create New System User'}</h3>
              <button onClick={() => setShowUserModal(false)} className="text-slate-400 hover:text-slate-600 text-lg">✕</button>
            </div>

            <form onSubmit={handleSaveUser} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Username *</label>
                <input type="text" required value={newUser.username} onChange={(e) => setNewUser({ ...newUser, username: e.target.value })} className="w-full border border-slate-300 rounded-lg p-2" />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Password {editingUser && '(Leave blank to keep current)'}</label>
                <input type="password" value={newUser.password} onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} className="w-full border border-slate-300 rounded-lg p-2" />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Display Name</label>
                <input type="text" value={newUser.name} onChange={(e) => setNewUser({ ...newUser, name: e.target.value })} className="w-full border border-slate-300 rounded-lg p-2" />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Role *</label>
                <select value={newUser.role} onChange={(e) => setNewUser({ ...newUser, role: e.target.value })} className="w-full border border-slate-300 rounded-lg p-2">
                  <option value="Admin">Admin (Full Control)</option>
                  <option value="Staff">Staff (Operations)</option>
                  <option value="Vendor">Vendor (View Only)</option>
                </select>
              </div>

              {newUser.role === 'Vendor' && (
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Associated Vendor</label>
                  <select value={newUser.vendorId} onChange={(e) => setNewUser({ ...newUser, vendorId: e.target.value })} className="w-full border border-slate-300 rounded-lg p-2">
                    <option value="">-- Choose Vendor --</option>
                    {vendors.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                  </select>
                </div>
              )}

              <div className="pt-3 flex space-x-2">
                <button type="button" onClick={() => setShowUserModal(false)} className="w-1/2 bg-slate-100 py-2.5 rounded-lg font-semibold">Cancel</button>
                <button type="submit" className="w-1/2 bg-indigo-600 text-white py-2.5 rounded-lg font-semibold">{editingUser ? 'Update User' : 'Create User'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showVoucherModal && selectedOrder && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 print:p-0 print:bg-white">
          <style>{`
            @media print {
              body * {
                visibility: hidden;
              }
              #voucher-print-area, #voucher-print-area * {
                visibility: visible;
              }
              #voucher-print-area {
                position: fixed;
                left: 0;
                top: 0;
                width: 100%;
                max-width: 100% !important;
                margin: 0 !important;
                padding: 16px !important;
                border: none !important;
                box-shadow: none !important;
                background: white !important;
              }
            }
          `}</style>

          <div id="voucher-print-area" className="bg-white rounded-xl max-w-sm w-full p-6 shadow-2xl space-y-4 text-xs font-mono text-slate-800 border border-slate-200">
            
            <div className="text-center border-b pb-3">
              <h2 className="text-lg font-black tracking-wider text-slate-900">DELIVERY VOUCHER</h2>
              <p className="text-[11px] font-bold text-indigo-600">Order ID: {selectedOrder.id}</p>
              <p className="text-[10px] text-slate-400">{selectedOrder.createdAt}</p>
            </div>

            <div className="border-b pb-2 space-y-0.5">
              <p className="text-[10px] font-bold uppercase text-slate-400">Sender (Vendor):</p>
              <p className="font-bold text-slate-800">{vendors.find(v => v.id === selectedOrder.vendorId)?.name || selectedOrder.vendorId}</p>
            </div>

            <div className="border-b pb-2 space-y-0.5">
              <p className="text-[10px] font-bold uppercase text-slate-400">Deliver To:</p>
              <p className="font-bold text-slate-800">{selectedOrder.customerName}</p>
              <p className="text-slate-700">{selectedOrder.customerPhone}</p>
              <p className="text-slate-500 text-[10px]">{selectedOrder.deliveryAddress}</p>
              <p className="text-indigo-600 font-bold text-[11px] pt-1">Delivery: {getDeliveryName(selectedOrder)}</p>
            </div>

            <div className="border-b pb-2">
              <table className="w-full text-left text-[11px]">
                <thead>
                  <tr className="border-b text-slate-400"><th className="py-1">Item</th><th className="py-1 text-center">Qty</th><th className="py-1 text-right">Amount</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {selectedOrder.items.map((it, i) => (
                    <tr key={i}><td className="py-1">{it.name}</td><td className="py-1 text-center">{it.qty}</td><td className="py-1 text-right">{(((Number(it.price) || 0) - (Number(it.discount) || 0)) * (Number(it.qty) || 1)).toLocaleString()} Ks</td></tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="space-y-1 text-right">
              <div className="flex justify-between text-slate-500"><span>Items Subtotal:</span><span>{(Number(selectedOrder.itemTotal) || 0).toLocaleString()} Ks</span></div>
              <div className="flex justify-between text-slate-500"><span>Delivery Fee:</span><span>{(Number(selectedOrder.deliveryFee) || 0).toLocaleString()} Ks</span></div>
              <div className="flex justify-between font-extrabold text-sm text-slate-900 border-t pt-1"><span>Total COD to Pay:</span><span className="text-indigo-600">{(Number(selectedOrder.totalCod) || 0).toLocaleString()} Ks</span></div>
            </div>

            <div className="pt-3 border-t text-center space-y-1">
              <p className="text-[9px] text-slate-400 tracking-wider uppercase font-semibold">Supported by T&N Fulfillment Services</p>
            </div>

            <div className="pt-2 flex space-x-2 print:hidden">
              <button onClick={() => setShowVoucherModal(false)} className="w-1/2 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2 rounded font-sans font-semibold text-xs">Close</button>
              <button onClick={() => { window.print(); addLog(`Printed voucher for ${selectedOrder.id}`); }} className="w-1/2 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded font-sans font-semibold text-xs flex items-center justify-center space-x-1">
                <Printer className="w-3.5 h-3.5" /><span>Print / Save PDF</span>
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