import React, { useState, useEffect, useMemo } from 'react';
import { 
  Package, ShoppingCart, Truck, DollarSign, Users, 
  RotateCcw, ShieldCheck, Activity, Search, Plus, Trash2, 
  Clock, AlertTriangle, Printer, Download, Upload,
  ChevronRight, LogOut, FileSpreadsheet, Tag,
  BarChart2, UserPlus, Bell, CreditCard, Menu
} from 'lucide-react';

const API_BASE_URL = 'https://tn-backend-j1vg.onrender.com';

interface User {
  id: string;
  username: string;
  password?: string;
  name: string;
  role: string;
  vendorId?: string;
}

interface Vendor {
  id: string;
  name: string;
  phone: string;
  address: string;
  bankAccount: string;
  freeStorageDays?: number;
  dailyStoreFee?: number;
}

interface Delivery {
  id: string;
  name: string;
  phone: string;
  address: string;
  bankAccount: string;
}

interface InventoryItem {
  id: string;
  vendorId: string;
  name: string;
  category?: string;
  price: number;
  quantity: number;
  sku: string;
  stockInDate: string;
  handlingFee?: number;
  storeChargePerDay?: number;
  freeDays?: number;
}

interface OrderItem {
  itemId: string;
  name: string;
  qty: number;
  price: number;
  discount: number;
  status?: string;
}

interface Order {
  id: string;
  vendorId: string;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  deliveryService: string;
  deliveryServiceId?: string;
  trackingNo: string;
  status: string;
  cancelled: boolean;
  items: OrderItem[];
  itemTotal: number;
  deliveryFee: number;
  totalCod: number;
  tnHandlingFee?: number;
  tnStoreFee?: number;
  codCollected?: boolean;
  settlementStatus?: string;
  createdAt: string;
  updatedBy?: string;
}

interface ReturnItem {
  id: string;
  orderId?: string;
  itemId?: string;
  vendorId: string;
  itemName: string;
  qty: number;
  type: string;
  reason: string;
  status: string;
  date: string;
}

interface CashRecord {
  id: string;
  type: string;
  referenceId: string;
  amount: number;
  description: string;
  date: string;
  createdBy: string;
}

interface LogRecord {
  id: string;
  user: string;
  role: string;
  action: string;
  timestamp: string;
}

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

const INITIAL_USERS: User[] = [
  { id: 'USR-001', username: "admin", password: "admin123", name: "System Admin", role: "Admin", vendorId: "" },
  { id: 'USR-002', username: "staff", password: "staff123", name: "Operations Staff", role: "Staff", vendorId: "" },
];

const INITIAL_DELIVERIES: Delivery[] = [
  { id: 'DEL-101', name: 'Royal Express', phone: '095000111', address: 'Yangon Main Hub', bankAccount: 'KBZPay: 095000111 (Royal)' },
  { id: 'DEL-102', name: 'Ninja Van', phone: '096000222', address: 'Mandalay Hub', bankAccount: 'KBZPay: 096000222 (Ninja)' },
];

export default function App() {
  const [usersList, setUsersList] = useState<User[]>(INITIAL_USERS);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loginInput, setLoginInput] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');

  const [activeTab, setActiveTab] = useState('dashboard');
  
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [deliveries, setDeliveries] = useState<Delivery[]>(INITIAL_DELIVERIES);
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [returns, setReturns] = useState<ReturnItem[]>([]);
  const [logs, setLogs] = useState<LogRecord[]>([
    { id: 'LOG-101', user: 'System', role: 'Admin', action: 'System Initialized', timestamp: new Date().toLocaleString() }
  ]);
  const [cashLedger, setCashLedger] = useState<CashRecord[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
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

  const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>([]);
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);
  const [selectedReturnIds, setSelectedReturnIds] = useState<string[]>([]);
  const [selectedCashIds, setSelectedCashIds] = useState<string[]>([]);

  // Modals
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showVoucherModal, setShowVoucherModal] = useState(false);
  const [showItemModal, setShowItemModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showVendorModal, setShowVendorModal] = useState(false);
  const [showDeliveryModal, setShowDeliveryModal] = useState(false);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [showCashModal, setShowCashModal] = useState(false);

  // Edit Inventory
  const [showEditItemModal, setShowEditItemModal] = useState(false);
  const [editingInventoryItem, setEditingInventoryItem] = useState<InventoryItem | null>(null);
  const [editInventoryForm, setEditInventoryForm] = useState({ name: '', category: '', price: 0, quantity: 0 });

  // Edit Return
  const [showEditReturnModal, setShowEditReturnModal] = useState(false);
  const [editingReturnItem, setEditingReturnItem] = useState<ReturnItem | null>(null);
  const [editReturnForm, setEditReturnForm] = useState({ itemName: '', qty: 1, reason: '' });

  // Cash Modal State
  const [cashFlowType, setCashFlowType] = useState('COD_IN');
  const [selectedPartnerId, setSelectedPartnerId] = useState('');
  const [selectedVoucherIds, setSelectedVoucherIds] = useState<string[]>([]);
  const [cashTransactionNo, setCashTransactionNo] = useState('');
  const [cashDescription, setCashDescription] = useState('');

  // Partial Modal
  const [showPartialModal, setShowPartialModal] = useState(false);
  const [targetPartialOrder, setTargetPartialOrder] = useState<Order | null>(null);
  const [partialItemsForm, setPartialItemsForm] = useState<any[]>([]);

  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);
  const [editingDelivery, setEditingDelivery] = useState<Delivery | null>(null);
  const [targetReturnItem, setTargetReturnItem] = useState<InventoryItem | null>(null);
  const [returnForm, setReturnForm] = useState({ qty: 1, reason: 'Overstock Return' });
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const [newUser, setNewUser] = useState({ username: '', password: '', name: '', role: 'Staff', vendorId: '' });
  const [newVendor, setNewVendor] = useState({ name: '', phone: '', address: '', bankAccount: '' });
  const [newDelivery, setNewDelivery] = useState({ id: '', name: '', phone: '', address: '', bankAccount: '' });
  const [newItem, setNewItem] = useState({ vendorId: '', name: '', category: 'General', price: 0, quantity: 0 });

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
          const data = await resUsers.json();
          if (Array.isArray(data) && data.length > 0) setUsersList(data);
        }
        const resVendors = await fetch(`${API_BASE_URL}/api/vendors`);
        if (resVendors.ok) {
          const data = await resVendors.json();
          if (Array.isArray(data)) setVendors(data);
        }
        const resDeliveries = await fetch(`${API_BASE_URL}/api/deliveries`);
        if (resDeliveries.ok) {
          const data = await resDeliveries.json();
          if (Array.isArray(data)) setDeliveries(data);
        }
        const resItems = await fetch(`${API_BASE_URL}/api/inventory`);
        if (resItems.ok) {
          const data = await resItems.json();
          if (Array.isArray(data)) setItems(data);
        }
        const resOrders = await fetch(`${API_BASE_URL}/api/orders`);
        if (resOrders.ok) {
          const data = await resOrders.json();
          if (Array.isArray(data)) setOrders(data);
        }
        const resReturns = await fetch(`${API_BASE_URL}/api/returns`);
        if (resReturns.ok) {
          const data = await resReturns.json();
          if (Array.isArray(data)) setReturns(data);
        }
        const resCash = await fetch(`${API_BASE_URL}/api/cash-ledger`);
        if (resCash.ok) {
          const data = await resCash.json();
          if (Array.isArray(data)) setCashLedger(data);
        }
      } catch (err) {
        console.error('Data Sync Error:', err);
      }
    }
    fetchData();
  }, []);

  const addLog = (actionText: string) => {
    if (!currentUser) return;
    const newLog: LogRecord = {
      id: `LOG-${Date.now().toString().slice(-4)}`,
      user: currentUser.name,
      role: currentUser.role,
      action: actionText,
      timestamp: new Date().toLocaleString()
    };
    setLogs(prev => [newLog, ...prev]);
  };

  const addNotification = async (title: string, message: string, type = 'info') => {
    const notiObj: NotificationItem = {
      id: `NOTI-${Date.now().toString().slice(-4)}`,
      title,
      message,
      type,
      isRead: false,
      createdAt: new Date().toLocaleString()
    };
    setNotifications(prev => [notiObj, ...prev]);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const found = usersList.find(u => u.username === loginInput.username && u.password === loginInput.password);
    if (found) {
      setCurrentUser(found);
      setLoginError('');
    } else {
      setLoginError('Username သို့မဟုတ် Password မှားယွင်းနေပါသည်။');
    }
  };

  const getDeliveryName = (order: Order) => {
    if (order.deliveryServiceId) {
      const found = deliveries.find(d => d.id === order.deliveryServiceId);
      if (found) return found.name;
    }
    return order.deliveryService || 'Unassigned';
  };

  const codCollectedVoucherIds = useMemo(() => {
    const ids = new Set<string>();
    cashLedger.filter(c => c.type === 'COD_IN').forEach(c => {
      if (c.referenceId) {
        const matches = c.referenceId.match(/TN-ORD-\d+/g);
        if (matches) matches.forEach(id => ids.add(id));
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
      }
    }
    return res;
  }, [items, currentUser, invSearchMode, invSearchVal]);

  const scopedOrders = useMemo(() => {
    let res = orders;
    if (currentUser && currentUser.role === 'Vendor') {
      res = res.filter(o => o.vendorId === currentUser.vendorId);
    }
    if (orderSearchVal.trim()) {
      const q = orderSearchVal.toLowerCase();
      if (orderSearchMode === 'ID') {
        res = res.filter(o => o.id.toLowerCase().includes(q) || o.customerName.toLowerCase().includes(q) || o.customerPhone.toLowerCase().includes(q));
      }
    }
    return res;
  }, [orders, currentUser, orderSearchMode, orderSearchVal]);

  const scopedReturns = useMemo(() => {
    let res = returns;
    if (currentUser && currentUser.role === 'Vendor') {
      res = res.filter(r => r.vendorId === currentUser.vendorId);
    }
    return res;
  }, [returns, currentUser]);

  const scopedCashLedger = useMemo(() => cashLedger, [cashLedger]);

  function calculateStoreCharge(item: InventoryItem) {
    const stockIn = new Date(item.stockInDate);
    const diffDays = Math.floor((new Date().getTime() - stockIn.getTime()) / (1000 * 60 * 60 * 24));
    const freeDays = item.freeDays ?? 7;
    const dailyFee = item.storeChargePerDay ?? 30;

    if (diffDays > freeDays) {
      return (diffDays - freeDays) * dailyFee * (item.quantity || 0);
    }
    return 0;
  }

  const handleDeleteVoucher = async (orderId: string) => {
    if (codCollectedVoucherIds.has(orderId)) {
      alert('ဤ Voucher သည် COD ငွေအဝင်စာရင်း ပြီးစီးပြီးဖြစ်သဖြင့် ဖျက်၍မရပါ။');
      return;
    }
    const targetOrder = orders.find(o => o.id === orderId);
    if (targetOrder?.status === 'Partial Return') {
      alert('Partial Return ဖြစ်နေသော Voucher များကို ဖျက်၍မရပါ။');
      return;
    }
    if (currentUser?.role !== 'Admin') {
      alert('ခွင့်ပြုချက်မရှိပါ: Admin သာ ဖျက်ပိုင်ခွင့်ရှိပါသည်။');
      return;
    }

    if (confirm(`Voucher ${orderId} ကို ဖျက်ပစ်မည် သေချာပါသလား?`)) {
      if (targetOrder) {
        for (const ordItem of targetOrder.items) {
          const stockItem = items.find(i => i.id === ordItem.itemId);
          if (stockItem) {
            setItems(prev => prev.map(i => i.id === stockItem.id ? { ...i, quantity: (i.quantity || 0) + (ordItem.qty || 0) } : i));
          }
        }
      }

      setReturns(prev => prev.filter(r => r.orderId !== orderId));
      setOrders(prev => prev.filter(o => o.id !== orderId));
      addLog(`Deleted Voucher ${orderId}`);
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    const targetOrder = orders.find(o => o.id === orderId);
    if (!targetOrder) return;

    if (codCollectedVoucherIds.has(orderId)) {
      alert('ဤ Voucher သည် COD Cash Flow ပြီးစီးသွားပြီဖြစ်သဖြင့် Status ပြောင်း၍မရပါ။');
      return;
    }

    const wasReturn = targetOrder.status === 'Delivery Return' || targetOrder.status === 'Partial Return';
    const isNowActive = newStatus === 'Pending' || newStatus === 'In-Transit' || newStatus === 'Delivered';

    if (wasReturn && isNowActive) {
      setReturns(prev => prev.filter(r => r.orderId !== orderId));
      addLog(`Synchronized: Removed return records for ${orderId} as status changed back to ${newStatus}`);
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

    const updatedOrder = { ...targetOrder, status: newStatus };
    setOrders(prev => prev.map(o => o.id === orderId ? updatedOrder : o));
    addLog(`Updated Order ${orderId} status to ${newStatus}`);
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 font-sans">
        <div className="bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl border border-slate-700 space-y-6">
          <div className="text-center space-y-2">
            <div className="bg-indigo-600 text-white p-3 rounded-2xl inline-block shadow-lg font-black text-xl">T&N</div>
            <h1 className="text-2xl font-bold text-slate-900">T&N Fulfillment System</h1>
            <p className="text-xs text-slate-500">Vendor & Logistics Management</p>
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
                type="text" required value={loginInput.username}
                onChange={(e) => setLoginInput({ ...loginInput, username: e.target.value })}
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Password</label>
              <input 
                type="password" required value={loginInput.password}
                onChange={(e) => setLoginInput({ ...loginInput, password: e.target.value })}
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm"
              />
            </div>
            <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg text-sm">
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
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="bg-indigo-600 p-2 rounded-lg font-extrabold text-xl">T&N</div>
            <div>
              <h1 className="font-bold text-lg">T&N Fulfillment System</h1>
              <p className="text-xs text-slate-400">Logistics & Vendor Management</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-xs text-indigo-300 font-bold">{currentUser.name} ({currentUser.role})</span>
            <button onClick={() => setCurrentUser(null)} className="bg-slate-800 hover:bg-slate-700 p-2 rounded-lg text-slate-300">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="bg-slate-800 border-t border-slate-700 px-4">
          <div className="max-w-7xl mx-auto flex space-x-1 overflow-x-auto text-xs py-2">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: BarChart2 },
              { id: 'orders', label: 'Orders & Vouchers', icon: ShoppingCart },
              { id: 'inventory', label: 'Vendor Inventory', icon: Package },
              { id: 'returns', label: 'Returns & Damage', icon: RotateCcw },
              { id: 'settlements', label: 'Vendors', icon: CreditCard },
              { id: 'deliveries', label: 'Delivery Services', icon: Truck },
              { id: 'cash_ledger', label: 'Cash Management', icon: DollarSign },
              { id: 'users', label: 'Users', icon: Users, adminOnly: true },
              { id: 'logs', label: 'Logs', icon: Activity, adminOnly: true },
            ].map(tab => {
              if (tab.adminOnly && currentUser.role !== 'Admin') return null;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md ${activeTab === tab.id ? 'bg-indigo-600 text-white font-semibold' : 'text-slate-300 hover:bg-slate-700'}`}
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-xl border shadow-sm">
              <p className="text-xs text-slate-500 uppercase font-semibold">Total Orders</p>
              <p className="text-2xl font-bold text-slate-800 mt-1">{orders.length}</p>
            </div>
            <div className="bg-white p-5 rounded-xl border shadow-sm">
              <p className="text-xs text-slate-500 uppercase font-semibold">Vendor Inventory Items</p>
              <p className="text-2xl font-bold text-indigo-600 mt-1">{items.length}</p>
            </div>
            <div className="bg-white p-5 rounded-xl border shadow-sm">
              <p className="text-xs text-slate-500 uppercase font-semibold">Total Returns</p>
              <p className="text-2xl font-bold text-amber-600 mt-1">{returns.length}</p>
            </div>
          </div>
        )}

        {/* ORDERS & VOUCHERS TAB */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-xl border shadow-sm flex justify-between items-center">
              <div className="relative w-64">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input 
                  type="text" placeholder="Search Order ID / Name..."
                  value={orderSearchVal} onChange={(e) => setOrderSearchVal(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 border rounded-lg text-xs"
                />
              </div>
              <button onClick={() => setShowOrderModal(true)} className="bg-indigo-600 text-white text-xs px-4 py-2 rounded-lg font-semibold flex items-center space-x-1">
                <Plus className="w-4 h-4" /><span>New Order Voucher</span>
              </button>
            </div>

            <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-600 font-semibold border-b">
                  <tr>
                    <th className="p-3">Order ID</th>
                    <th className="p-3">Customer</th>
                    <th className="p-3">Delivery</th>
                    <th className="p-3">COD Total</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {scopedOrders.map(order => (
                    <tr key={order.id} className="hover:bg-slate-50">
                      <td className="p-3 font-bold text-indigo-600">{order.id}</td>
                      <td className="p-3 font-semibold">{order.customerName} ({order.customerPhone})</td>
                      <td className="p-3">{getDeliveryName(order)}</td>
                      <td className="p-3 font-bold">{(order.totalCod || 0).toLocaleString()} Ks</td>
                      <td className="p-3">
                        <select 
                          value={order.status}
                          onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                          className="text-xs font-semibold px-2 py-1 rounded border bg-amber-50 text-amber-700"
                        >
                          <option value="Pending">Pending</option>
                          <option value="In-Transit">In-Transit</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Partial Return">Partial Return</option>
                          <option value="Delivery Return">Delivery Return</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className="p-3 text-right space-x-2">
                        <button onClick={() => { setSelectedOrder(order); setShowVoucherModal(true); }} className="bg-slate-100 p-1.5 rounded font-semibold text-xs">Voucher</button>
                        {currentUser.role === 'Admin' && order.status !== 'Partial Return' && (
                          <button onClick={() => handleDeleteVoucher(order.id)} className="bg-rose-50 text-rose-700 p-1.5 rounded font-semibold text-xs">Delete</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* INVENTORY TAB */}
        {activeTab === 'inventory' && (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-xl border shadow-sm flex justify-between items-center">
              <input type="text" placeholder="Search Inventory..." value={invSearchVal} onChange={(e) => setInvSearchVal(e.target.value)} className="border p-1.5 rounded text-xs w-64" />
              <button onClick={() => setShowItemModal(true)} className="bg-indigo-600 text-white text-xs px-4 py-2 rounded-lg font-semibold flex items-center space-x-1">
                <Plus className="w-4 h-4" /><span>Add Stock Item</span>
              </button>
            </div>
            <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 border-b">
                  <tr><th className="p-3">SKU / Item</th><th className="p-3">Price</th><th className="p-3">In-Stock Qty</th><th className="p-3">Stock Date</th></tr>
                </thead>
                <tbody className="divide-y">
                  {scopedItems.map(item => (
                    <tr key={item.id} className="hover:bg-slate-50">
                      <td className="p-3 font-bold">{item.name} <span className="text-[10px] text-slate-400 font-mono">({item.sku})</span></td>
                      <td className="p-3 font-semibold">{(item.price || 0).toLocaleString()} Ks</td>
                      <td className="p-3 font-bold text-indigo-600">{item.quantity} pcs</td>
                      <td className="p-3 text-slate-400">{item.stockInDate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* RETURNS TAB */}
        {activeTab === 'returns' && (
          <div className="bg-white rounded-xl border shadow-sm overflow-hidden p-4">
            <h3 className="font-bold text-sm mb-3">Return & Damage Records</h3>
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 border-b">
                <tr><th className="p-3">Return ID / Ref Order</th><th className="p-3">Item Name</th><th className="p-3">Qty</th><th className="p-3">Type</th><th className="p-3">Date</th></tr>
              </thead>
              <tbody className="divide-y">
                {scopedReturns.map(ret => (
                  <tr key={ret.id} className="hover:bg-slate-50">
                    <td className="p-3 font-bold">{ret.id} <span className="text-[10px] text-indigo-600">({ret.orderId || '-'})</span></td>
                    <td className="p-3 font-semibold">{ret.itemName}</td>
                    <td className="p-3 font-bold">{ret.qty}</td>
                    <td className="p-3"><span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded text-[10px] font-bold">{ret.type}</span></td>
                    <td className="p-3 text-slate-400">{ret.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {/* PDF PRINTABLE VOUCHER MODAL */}
      {showVoucherModal && selectedOrder && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 print:p-0 print:bg-white">
          <style>{`
            @media print {
              body * { visibility: hidden; }
              #voucher-print-area, #voucher-print-area * { visibility: visible; }
              #voucher-print-area {
                position: fixed; left: 0; top: 0; width: 100%;
                max-width: 100% !important; margin: 0 !important;
                padding: 16px !important; border: none !important;
                box-shadow: none !important; background: white !important;
              }
            }
          `}</style>
          <div id="voucher-print-area" className="bg-white rounded-xl max-w-sm w-full p-6 shadow-2xl space-y-4 text-xs font-mono text-slate-800 border">
            <div className="text-center border-b pb-3">
              <h2 className="text-lg font-black tracking-wider text-slate-900">DELIVERY VOUCHER</h2>
              <p className="text-[11px] font-bold text-indigo-600">Order ID: {selectedOrder.id}</p>
              <p className="text-[10px] text-slate-400">{selectedOrder.createdAt}</p>
            </div>
            <div className="border-b pb-2 space-y-0.5">
              <p className="text-[10px] font-bold uppercase text-slate-400">Deliver To:</p>
              <p className="font-bold text-slate-800">{selectedOrder.customerName}</p>
              <p className="text-slate-700">{selectedOrder.customerPhone}</p>
              <p className="text-slate-500 text-[10px]">{selectedOrder.deliveryAddress}</p>
              <p className="text-indigo-600 font-bold text-[11px] pt-1">Delivery: {getDeliveryName(selectedOrder)}</p>
            </div>
            <div className="space-y-1 text-right pt-2 border-t">
              <div className="flex justify-between font-extrabold text-sm text-slate-900"><span>Total COD to Pay:</span><span className="text-indigo-600">{(selectedOrder.totalCod || 0).toLocaleString()} Ks</span></div>
            </div>
            <div className="pt-2 flex space-x-2 print:hidden">
              <button onClick={() => setShowVoucherModal(false)} className="w-1/2 bg-slate-100 py-2 rounded font-sans font-semibold text-xs">Close</button>
              <button onClick={() => window.print()} className="w-1/2 bg-indigo-600 text-white py-2 rounded font-sans font-semibold text-xs flex items-center justify-center space-x-1">
                <Printer className="w-3.5 h-3.5" /><span>Print / Save PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <footer className="bg-white border-t py-3 text-center text-xs text-slate-500 mt-auto">
        T&N Fulfillment System • Supported by T&N
      </footer>
    </div>
  );
}