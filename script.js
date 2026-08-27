const STORAGE_KEY = 'pavtiPustak.receipts';
const BOOK_KEY = 'pavtiPustak.bookNo';

const form = document.getElementById('receiptForm');
const recNo = document.getElementById('recNo');
const recDate = document.getElementById('recDate');
const recFrom = document.getElementById('recFrom');
const recWords = document.getElementById('recWords');
const recAmount = document.getElementById('recAmount');
const recMode = document.getElementById('recMode');
const recPurpose = document.getElementById('recPurpose');
const ledgerList = document.getElementById('ledgerList');
const bookNoEl = document.getElementById('bookNo');
const clearAllBtn = document.getElementById('clearAll');
const printBtn = document.getElementById('printBtn');
const printArea = document.getElementById('printArea');

function loadReceipts() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch { return []; }
}

function saveReceipts(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

function nextSerial(list) {
  return String(list.length + 1).padStart(3, '0');
}

function updateBookNo(list) {
  const bookNo = Math.floor(list.length / 25) + 1; // 25 leaves per "book"
  bookNoEl.textContent = String(bookNo).padStart(2, '0');
}

function today() {
  const d = new Date();
  return d.toISOString().split('T')[0];
}

function render() {
  const list = loadReceipts();
  updateBookNo(list);
  recNo.value = nextSerial(list);

  if (list.length === 0) {
    ledgerList.innerHTML = '<p class="empty-note">No leaves torn off yet. Your first pavti will appear here as a carbon copy.</p>';
    return;
  }

  ledgerList.innerHTML = list
    .slice()
    .reverse()
    .map(r => `
      <div class="copy-card" data-id="${r.id}">
        <span class="paid-stamp">RECEIVED</span>
        <div class="copy-card-top">
          <span>No. ${r.serial}</span>
          <span>${formatDate(r.date)}</span>
        </div>
        <p class="copy-card-from">${escapeHtml(r.from)}</p>
        <p class="copy-card-purpose">${escapeHtml(r.purpose || 'General payment')} &middot; ${escapeHtml(r.words)}</p>
        <div class="copy-card-bottom">
          <span class="copy-card-amount">₹${Number(r.amount).toLocaleString('en-IN', {minimumFractionDigits: 2})}</span>
          <span class="copy-card-mode">${escapeHtml(r.mode)}</span>
        </div>
        <button class="copy-card-del" data-id="${r.id}" title="Remove this entry">remove</button>
      </div>
    `)
    .join('');
}

function formatDate(iso) {
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const list = loadReceipts();
  const entry = {
    id: Date.now(),
    serial: recNo.value,
    date: recDate.value,
    from: recFrom.value.trim(),
    words: recWords.value.trim(),
    amount: recAmount.value,
    mode: recMode.value,
    purpose: recPurpose.value.trim()
  };
  list.push(entry);
  saveReceipts(list);
  render();
  form.reset();
  recDate.value = today();
});

ledgerList.addEventListener('click', (e) => {
  if (e.target.matches('.copy-card-del')) {
    const id = Number(e.target.dataset.id);
    const list = loadReceipts().filter(r => r.id !== id);
    saveReceipts(list);
    render();
  }
});

clearAllBtn.addEventListener('click', () => {
  if (confirm('Clear the entire receipt book? This cannot be undone.')) {
    saveReceipts([]);
    render();
  }
});

printBtn.addEventListener('click', () => {
  const amount = recAmount.value || '0.00';
  printArea.innerHTML = `
    <div style="border:2px solid #a8402b; padding:24px; max-width:600px; margin:0 auto;">
      <h2 style="font-family:'Special Elite',monospace; margin:0 0 4px;">Pavti Pustak</h2>
      <p style="margin:0 0 16px; font-size:12px; color:#555;">Book No. ${bookNoEl.textContent} &middot; Receipt No. ${recNo.value}</p>
      <p><strong>Date:</strong> ${recDate.value ? formatDate(recDate.value) : '—'}</p>
      <p><strong>Received with thanks from:</strong> ${escapeHtml(recFrom.value || '—')}</p>
      <p><strong>Sum of rupees:</strong> ${escapeHtml(recWords.value || '—')}</p>
      <p><strong>Amount:</strong> ₹${Number(amount).toLocaleString('en-IN', {minimumFractionDigits:2})}</p>
      <p><strong>Mode:</strong> ${recMode.value}</p>
      <p><strong>Being payment towards:</strong> ${escapeHtml(recPurpose.value || '—')}</p>
      <p style="margin-top:40px; text-align:right;">Signature: ______________________</p>
    </div>
  `;
  window.print();
});

// init
recDate.value = today();
render();
