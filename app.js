// ── ECO Shared Helpers ──────────────────────────────────────────────

// ── Auth Guards ──────────────────────────────────────────────────────
function requireAuth() {
  const session = getSession();
  if (!session) {
    window.location.href = 'index.html';
    return null;
  }
  return session;
}

function requireAdmin() {
  const session = requireAuth();
  if (session && session.role !== 'admin') {
    window.location.href = 'dashboard.html';
    return null;
  }
  return session;
}

// ── Sidebar & Navigation ─────────────────────────────────────────────
function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('overlay');
  sidebar.classList.toggle('open');
  overlay.classList.toggle('visible');
}

function closeSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('overlay');
  if (sidebar) sidebar.classList.remove('open');
  if (overlay) overlay.classList.remove('visible');
}

function handleLogout() {
  logout();
  window.location.href = 'index.html';
}

// ── UI Helpers ───────────────────────────────────────────────────────
function fmtDate(d) {
  if (!d) return '—';
  const dt = new Date(d);
  return dt.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

function fmtCurrency(n) {
  return '₹' + Number(n).toLocaleString('en-IN');
}

// ── Notification System ──────────────────────────────────────────────
function toggleNotif() {
  const p = document.getElementById('notifPanel');
  const btn = document.getElementById('notifBtn');
  if (p) p.classList.toggle('visible');
  if (btn) btn.classList.remove('notif-dot');
}

// Close notif panel on outside click
document.addEventListener('click', (e) => {
  const panel = document.getElementById('notifPanel');
  const btn = document.getElementById('notifBtn');
  if (panel && btn && !panel.contains(e.target) && !btn.contains(e.target)) {
    panel.classList.remove('visible');
  }
});

// ── Modal Helpers ────────────────────────────────────────────────────
function openModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.classList.add('visible');
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.classList.remove('visible');
}
