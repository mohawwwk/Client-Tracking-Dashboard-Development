// ── ECO Mock Backend ── data.js ────────────────────── 
// All data lives in localStorage. Helpers read/write it. 

const DB = { 
  CLIENTS: 'eco_clients', 
  ORDERS:  'eco_orders', 
  SESSION: 'eco_session', 
}; 

// ── Seed data (runs once) ───────────────────────────── 
function seedIfEmpty() { 
  if (localStorage.getItem(DB.CLIENTS)) return; 

  const clients = [ 
    { id: 'C001', name: 'Rahul Kapoor',   email: 'rahul@example.com',  password: 'client123', phone: '9876543210', joinedAt: '2024-01-15' }, 
    { id: 'C002', name: 'Priya Sharma',   email: 'priya@example.com',  password: 'client123', phone: '9876500001', joinedAt: '2024-02-20' }, 
    { id: 'C003', name: 'Amit Verma',     email: 'amit@example.com',   password: 'client123', phone: '9876500002', joinedAt: '2024-03-05' }, 
  ]; 

  const orders = [ 
    { 
      id: 'ORD-2024-001', clientId: 'C001', 
      title: 'Custom Kintsugi Bowl Set (6 pcs)', 
      createdAt: '2024-03-01', 
      advancePaid: 8000, totalAmount: 20000, 
      stages: { 
        payment:       { status: 'done',        date: '2024-03-01' }, 
        procurement:   { status: 'done',        date: '2024-03-05' }, 
        manufacturing: { status: 'in-progress', date: '2024-03-10' }, 
        delivery:      { status: 'pending',     date: null }, 
      }, 
      progress: 65, 
      delay: { hasDelay: true, reason: 'Gold lacquer material delayed by supplier', reportedAt: '2024-03-18' }, 
      shipment: { status: 'pending', trackingId: null, expectedDate: '2024-04-20' }, 
      notes: 'Client requested 24k gold filling on all fractures', 
    }, 
    { 
      id: 'ORD-2024-002', clientId: 'C001', 
      title: 'Kintsugi Repair – Antique Vase', 
      createdAt: '2024-01-10', 
      advancePaid: 5000, totalAmount: 5000, 
      stages: { 
        payment:       { status: 'done', date: '2024-01-10' }, 
        procurement:   { status: 'done', date: '2024-01-12' }, 
        manufacturing: { status: 'done', date: '2024-01-28' }, 
        delivery:      { status: 'done', date: '2024-02-03' }, 
      }, 
      progress: 100, 
      delay: { hasDelay: false, reason: '', reportedAt: null }, 
      shipment: { status: 'delivered', trackingId: 'TRK9920011', expectedDate: '2024-02-04' }, 
      notes: 'Completed and delivered on time', 
    }, 
    { 
      id: 'ORD-2024-003', clientId: 'C002', 
      title: 'Kintsugi Wall Art Panel', 
      createdAt: '2024-02-20', 
      advancePaid: 12000, totalAmount: 30000, 
      stages: { 
        payment:       { status: 'done',    date: '2024-02-20' }, 
        procurement:   { status: 'done',    date: '2024-02-26' }, 
        manufacturing: { status: 'pending', date: null }, 
        delivery:      { status: 'pending', date: null }, 
      }, 
      progress: 30, 
      delay: { hasDelay: false, reason: '', reportedAt: null }, 
      shipment: { status: 'pending', trackingId: null, expectedDate: '2024-05-10' }, 
      notes: '', 
    }, 
    { 
      id: 'ORD-2024-004', clientId: 'C003', 
      title: 'Tea Ceremony Set Repair', 
      createdAt: '2024-03-10', 
      advancePaid: 3000, totalAmount: 8000, 
      stages: { 
        payment:       { status: 'done',    date: '2024-03-10' }, 
        procurement:   { status: 'pending', date: null }, 
        manufacturing: { status: 'pending', date: null }, 
        delivery:      { status: 'pending', date: null }, 
      }, 
      progress: 15, 
      delay: { hasDelay: false, reason: '', reportedAt: null }, 
      shipment: { status: 'pending', trackingId: null, expectedDate: '2024-05-30' }, 
      notes: '', 
    }, 
  ]; 

  localStorage.setItem(DB.CLIENTS, JSON.stringify(clients)); 
  localStorage.setItem(DB.ORDERS,  JSON.stringify(orders)); 
} 

// ── Auth ────────────────────────────────────────────── 
const ADMIN = { email: 'admin@ekokintsugi.com', password: 'eco@admin2024', role: 'admin' }; 

function login(email, password) { 
  if (email === ADMIN.email && password === ADMIN.password) { 
    localStorage.setItem(DB.SESSION, JSON.stringify({ role: 'admin', id: 'ADMIN', name: 'Admin' })); 
    return { ok: true, role: 'admin' }; 
  } 
  const clients = getClients(); 
  const c = clients.find(x => x.email === email && x.password === password); 
  if (c) { 
    localStorage.setItem(DB.SESSION, JSON.stringify({ role: 'client', id: c.id, name: c.name })); 
    return { ok: true, role: 'client' }; 
  } 
  return { ok: false }; 
} 

function logout() { localStorage.removeItem(DB.SESSION); } 
function getSession() { 
  try { return JSON.parse(localStorage.getItem(DB.SESSION)); } catch { return null; } 
} 

// ── Clients CRUD ────────────────────────────────────── 
function getClients() { 
  try { return JSON.parse(localStorage.getItem(DB.CLIENTS)) || []; } catch { return []; } 
} 
function saveClients(arr) { localStorage.setItem(DB.CLIENTS, JSON.stringify(arr)); } 

function addClient(data) { 
  const clients = getClients(); 
  const id = 'C' + String(clients.length + 1).padStart(3, '0'); 
  clients.push({ id, ...data, joinedAt: today() }); 
  saveClients(clients); 
  return id; 
} 

function updateClient(id, data) { 
  const clients = getClients().map(c => c.id === id ? { ...c, ...data } : c); 
  saveClients(clients); 
} 

function deleteClient(id) { 
  saveClients(getClients().filter(c => c.id !== id)); 
  saveOrders(getOrders().filter(o => o.clientId !== id)); 
} 

function getClientById(id) { return getClients().find(c => c.id === id); } 

// ── Orders CRUD ─────────────────────────────────────── 
function getOrders() { 
  try { return JSON.parse(localStorage.getItem(DB.ORDERS)) || []; } catch { return []; } 
} 
function saveOrders(arr) { localStorage.setItem(DB.ORDERS, JSON.stringify(arr)); } 

function getOrdersByClient(clientId) { 
  return getOrders().filter(o => o.clientId === clientId); 
} 

function addOrder(data) { 
  const orders = getOrders(); 
  const id = 'ORD-' + new Date().getFullYear() + '-' + String(orders.length + 1).padStart(3, '0'); 
  const order = { 
    id, ...data, 
    createdAt: today(), 
    stages: { 
      payment:       { status: 'pending', date: null }, 
      procurement:   { status: 'pending', date: null }, 
      manufacturing: { status: 'pending', date: null }, 
      delivery:      { status: 'pending', date: null }, 
    }, 
    progress: 0, 
    delay: { hasDelay: false, reason: '', reportedAt: null }, 
    shipment: { status: 'pending', trackingId: null, expectedDate: data.expectedDate || '' }, 
  }; 
  orders.push(order); 
  saveOrders(orders); 
  return id; 
} 

function updateOrder(id, patch) { 
  saveOrders(getOrders().map(o => o.id === id ? deepMerge(o, patch) : o)); 
} 

function deleteOrder(id) { saveOrders(getOrders().filter(o => o.id !== id)); } 
function getOrderById(id) { return getOrders().find(o => o.id === id); } 

// ── Stats ───────────────────────────────────────────── 
function getStats() { 
  const orders = getOrders(); 
  return { 
    total:     orders.length, 
    active:    orders.filter(o => o.progress > 0 && o.progress < 100).length, 
    completed: orders.filter(o => o.progress === 100).length, 
    avgProgress: orders.length 
      ? Math.round(orders.reduce((s, o) => s + o.progress, 0) / orders.length) 
      : 0, 
  }; 
} 

function getClientStats(clientId) { 
  const orders = getOrdersByClient(clientId); 
  const totalPaid = orders.reduce((s, o) => s + (o.advancePaid || 0), 0); 
  const totalDue  = orders.reduce((s, o) => s + Math.max(0, (o.totalAmount || 0) - (o.advancePaid || 0)), 0); 
  return { 
    total: orders.length, 
    active: orders.filter(o => o.progress > 0 && o.progress < 100).length, 
    completed: orders.filter(o => o.progress === 100).length, 
    avgProgress: orders.length 
      ? Math.round(orders.reduce((s, o) => s + o.progress, 0) / orders.length) 
      : 0, 
    totalPaid, totalDue, 
  }; 
} 

// ── Helpers ─────────────────────────────────────────── 
function today() { return new Date().toISOString().slice(0, 10); } 

function deepMerge(target, source) { 
  const out = { ...target }; 
  for (const k in source) { 
    if (source[k] && typeof source[k] === 'object' && !Array.isArray(source[k])) 
      out[k] = deepMerge(target[k] || {}, source[k]); 
    else out[k] = source[k]; 
  } 
  return out; 
} 

function fmt(dateStr) { 
  if (!dateStr) return '—'; 
  return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }); 
} 

function fmtCurrency(n) { 
  return '₹' + Number(n).toLocaleString('en-IN'); 
} 

// Run seed on load 
seedIfEmpty(); 
