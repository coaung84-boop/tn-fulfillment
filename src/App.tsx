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

  // 💡 INVENTORY CANCEL HANDLER
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

  // 💡 RETURN CANCEL HANDLER
  const handleCancelReturnItem = async (ret) => {
    if (ret.orderId && codCollectedVoucherIds.has(ret.orderId)) {
      alert('ဤ Return နှင့် သက်ဆိုင်သော Voucher မှာ ငွေစာရင်း (COD Flow) ရှင်းလင်းပြီးဖြစ်သဖြင့် Cancel လုပ်၍မရတော့ပါ။');
      return;
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

  // 💡 ORDER STATUS UPDATE HANDLER
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
            <div className="bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700 flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <div className="text-xs">
                <p className="text-indigo-300 font-bold">{currentUser.name}</p>
                <p className="text-[10px] text-slate-400 uppercase">Role: {currentUser.role}</p>
              </div>
            </div>

            <button 
              onClick={() => { addLog('Logged out'); setCurrentUser(null); }}
              className="bg-slate-800 hover:bg-slate-700 text-rose-400 p-2.5 rounded-lg transition-colors flex items-center justify-center"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
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
              { id: 'settlements', label: 'Vendors', icon: CreditCard }, 
              { id: 'deliveries', label: 'Delivery Services', icon: Truck },
              { id: 'cash_ledger', label: 'Cash Management', icon: DollarSign },
            ].map(tab => {
              if (currentUser.role === 'Vendor' && ['settlements', 'deliveries', 'cash_ledger'].includes(tab.id)) return null;
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

                      // 💡 1. ဤ Item တွင် Transaction (Order/Return) ရှိမရှိ စစ်ဆေးခြင်း
                      const hasTransactions = orders.some(o => 
                        !o.cancelled && o.items.some(oi => oi.itemId === item.id)
                      ) || returns.some(r => r.itemId === item.id);

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

                            {/* 💡 Today ဖြစ်လျှင် Edit လုပ်ခွင့်ပေးမည် */}
                            {currentUser.role !== 'Vendor' && isTodayBatch && (
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

                            {/* 💡 Today ဖြစ်ပြီး Transaction မရှိသေးမှသာ Cancel ခွင့်ပြုမည် */}
                            {currentUser.role !== 'Vendor' && isTodayBatch && !hasTransactions && (
                              <button 
                                onClick={() => handleCancelInventoryItem(item)}
                                className="text-xs text-rose-600 hover:underline font-semibold"
                              >
                                Cancel
                              </button>
                            )}

                            {/* 💡 Today မဟုတ်ပါက (Past Date) Edit ရော Cancel ပါ ပိတ်ထားမည် */}
                            {currentUser.role !== 'Vendor' && !isTodayBatch && (
                              <span className="text-[10px] text-slate-400 font-medium">🔒 Locked (Past Date)</span>
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

      </main>
    </div>
  );
}