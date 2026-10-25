useEffect(() => {
    async function fetchData() {
      try {
        const resVendors = await fetch(`${API_BASE_URL}/api/vendors`);
        if (resVendors.ok) {
          const dataVendors = await resVendors.json();
          if (Array.isArray(dataVendors) && dataVendors.length > 0) setVendors(dataVendors);
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

  const handleSaveVendor = async (e) => {
    e.preventDefault();
    if (!newVendor.name || !newVendor.phone) return;

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
      const response = await fetch(`${API_BASE_URL}/api/vendors`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(vendorObj)
      });

      if (response.ok) {
        setVendors([...vendors, vendorObj]);
        addLog(`Registered new vendor: ${vendorObj.name}`);
        setShowVendorModal(false);
        setNewVendor({ name: '', phone: '', address: '', bankAccount: '' });
      } else {
        const errData = await response.json();
        alert('Vendor သိမ်းဆည်းရာတွင် အမှားဖြစ်သွားပါသည်: ' + (errData.error || 'Unknown error'));
      }
    } catch (err) {
      console.error('API Error:', err);
      alert('Backend ချိတ်ဆက်မှု အမှားရှိပါသည်။');
    }
  };