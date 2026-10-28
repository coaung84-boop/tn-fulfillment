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

  // Search States
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

  // Edit Inventory Item Modal State
  const [showEditItemModal, setShowEditItemModal] = useState(false);
  const [editingInventoryItem, setEditingInventoryItem] = useState(null);
  const [editInventoryForm, setEditInventoryForm] = useState({ name: '', category: '', price: '', quantity: '', handlingFee: '', storeChargePerDay: '', freeDays: '' });

  // Edit Return Modal State
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
    if (orderSearchVal.trim()) {
      const q = orderSearchVal.toLowerCase();
      if (orderSearchMode === 'ID') {
        res = res.filter(o => o.id.toLowerCase().includes(q) || o.customerName.toLowerCase().includes(q) || o.customerPhone.toLowerCase().includes(q) || o.trackingNo.toLowerCase().includes(q));
      } else if (orderSearchMode === 'DATE') {
        res = res.filter(o => o.createdAt.toLowerCase().includes(q));
      } else if (orderSearchMode === 'VENDOR') {
        res = res.filter(o => o.vendorId === orderSearchVal || (vendors.find(v => v.id === o.vendorId)?.name.toLowerCase().includes(q)));
      } else if (orderSearchMode === 'DELIVERY') {
        res = res.filter(o => getDeliveryName(o).toLowerCase().includes(q));
      }
    }
    return res;
  }, [orders, currentUser, deliveryFilter, orderSearchMode, orderSearchVal, vendors, deliveries]);

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

  const handleUpdateOrderStatus = async (orderId, newStatus, newTracking) => {
    const targetOrder = orders.find(o => o.id === orderId);
    if (!targetOrder) return;

    if (codCollectedVoucherIds.has(orderId)) {
      alert('ဤ Voucher သည် COD Cash Flow ပြီးစီးသွားပြီဖြစ်သဖြင့် Status ပြောင်းလဲ၍မရတော့ပါ။');
      return;
    }

    // Return Status မှ အခြား Active Status သို့ ပြောင်းလဲပါက Return Records များ ရှင်းလင်းပေးခြင်း
    const wasReturn = targetOrder.status === 'Delivery Return' || targetOrder.status === 'Partial Return';
    const isNowActive = newStatus === 'Pending' || newStatus === 'In-Transit' || newStatus === 'Delivered';

    if (wasReturn && isNowActive) {
      const relatedReturns = returns.filter(r => r.orderId === orderId);
      for (const ret of relatedReturns) {
        try {
          await fetch(`${API_BASE_URL}/api/returns/${ret.id}`, { method: 'DELETE' });
        } catch (e) {}
      }
      setReturns(prev => prev.filter(r => r.orderId !== orderId));
      addLog(`Synchronized: Removed related return records for order ${orderId} as status changed back to ${newStatus}`);
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

    if (isCancelled && !targetOrder.cancelled) {
      for (const ordItem of targetOrder.items) {
        const stockItem = items.find(i => i.id === ordItem.itemId);
        if (stockItem) {
          setItems(prev => prev.map(i => i.id === stockItem.id ? { ...i, quantity: (Number(i.quantity) || 0) + (Number(ordItem.qty) || 0) } : i));
        }
      }
      addLog(`Cancelled Order ${orderId}: Restored stock quantities back to Inventory.`);
    }

    const updatedFields = {
      ...targetOrder,
      status: newStatus,
      trackingNo: newTracking || targetOrder.trackingNo,
      cancelled: isCancelled,
      codCollected: isDelivered ? true : false,
      updatedBy: currentUser?.name || 'Staff'
    };

    try {
      await fetch(`${API_BASE_URL}/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedFields)
      });
    } catch (e) {}

    if (isDeliveryReturn && targetOrder.status !== 'Delivery Return') {
      const newReturnObj = {
        id: `RET-${Date.now().toString().slice(-3)}`,
        orderId: targetOrder.id,
        itemId: targetOrder.items[0]?.itemId || '',
        vendorId: targetOrder.vendorId,
        itemName: targetOrder.items.map(i => `${i.name} (${i.qty} pcs)`).join(', '),
        qty: targetOrder.items.reduce((sum, i) => sum + (Number(i.qty) || 1), 0),
        type: 'Delivery Return',
        reason: 'Customer Refused / Returned from Delivery',
        status: 'In Warehouse (Voucher Stock)',
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
    addLog(`Updated Order ${orderId} status to '${newStatus}'`);
  };

  const handleDeleteVoucher = async (orderId) => {
    if (codCollectedVoucherIds.has(orderId)) {
      alert('ဤ Voucher သည် COD ငွေအဝင်စာရင်း ပြီးစီးပြီးဖြစ်သဖြင့် ဖျက်၍မရပါ။');
      return;
    }
    const targetOrder = orders.find(o => o.id === orderId);

    // Partial Return Voucher များကို Delete လုပ်၍မရအောင် တားမြစ်ခြင်း
    if (targetOrder?.status === 'Partial Return') {
      alert('Partial Return ဖြစ်နေသော Voucher များကို ဖျက်၍မရပါ။ (Voucher ဆက်လက် လည်ပတ်နေဆဲဖြစ်ပါသည်)');
      return;
    }

    if (currentUser?.role !== 'Admin') {
      alert('ခွင့်ပြုချက်မရှိပါ: Admin အဆင့် လိုအပ်ပါသည်။');
      return;
    }

    if (confirm(`Voucher ${orderId} ကို ဖျက်ပစ်မည် သေချာပါသလား?`)) {
      for (const ordItem of targetOrder.items) {
        const stockItem = items.find(i => i.id === ordItem.itemId);
        if (stockItem) {
          setItems(prev => prev.map(i => i.id === stockItem.id ? { ...i, quantity: (Number(i.quantity) || 0) + (Number(ordItem.qty) || 0) } : i));
        }
      }

      const relatedReturns = returns.filter(r => r.orderId === orderId);
      for (const ret of relatedReturns) {
        try {
          await fetch(`${API_BASE_URL}/api/returns/${ret.id}`, { method: 'DELETE' });
        } catch (e) {}
      }
      setReturns(prev => prev.filter(r => r.orderId !== orderId));

      try {
        await fetch(`${API_BASE_URL}/api/orders/${orderId}`, { method: 'DELETE' });
      } catch (e) {}

      setOrders(prev => prev.filter(o => o.id !== orderId));
      addLog(`Admin deleted Voucher ${orderId} and synchronized stock & return records.`);
    }
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl max-w-md w-full p-8 space-y-4">
          <h1 className="text-xl font-bold text-center">T&N Fulfillment System</h1>
          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <input type="text" placeholder="Username" required value={loginInput.username} onChange={e => setLoginInput({ ...loginInput, username: e.target.value })} className="w-full border p-2 rounded" />
            <input type="password" placeholder="Password" required value={loginInput.password} onChange={e => setLoginInput({ ...loginInput, password: e.target.value })} className="w-full border p-2 rounded" />
            <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded font-bold">Sign In</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-xs">
      <header className="bg-slate-900 text-white p-3 flex justify-between items-center">
        <h1 className="font-bold text-sm">T&N Fulfillment System</h1>
        <button onClick={() => setCurrentUser(null)} className="bg-slate-800 p-1.5 rounded"><LogOut className="w-4 h-4" /></button>
      </header>
      <main className="p-4 flex-grow">
        <p className="font-bold text-slate-700">System Ready with Updated Stock & Return Logic</p>
      </main>
    </div>
  );
}