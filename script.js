const API = 'api.php';

const FULL_COLS = [
  { key: 'LCN', label: 'LCN', group: 'app', cls: 'g-app' },
  { key: 'Application_Date', label: 'Date', group: 'app', cls: 'g-app' },
  { key: 'Application_Type', label: 'Type', group: 'app', cls: 'g-app' },
  { key: 'Trade_Name', label: 'Trade Name', group: 'app', cls: 'g-app' },
  { key: 'Office_Classification', label: 'Classification', group: 'app', cls: 'g-app' },
  { key: 'Office_Address', label: 'Address', group: 'app', cls: 'g-app' },
  { key: 'Payment_Mode', label: 'Payment Mode', group: 'app', cls: 'g-app' },
  { key: 'Payment_Option', label: 'Payment Option', group: 'app', cls: 'g-app' },
  { key: 'Delivery_Option', label: 'Delivery', group: 'app', cls: 'g-app' },
  { key: 'Emp_Estab_Male', label: 'Estab. Male', group: 'app', cls: 'g-app' },
  { key: 'Emp_Estab_Female', label: 'Estab. Female', group: 'app', cls: 'g-app' },
  { key: 'Emp_Taguig_Male', label: 'Taguig Male', group: 'app', cls: 'g-app' },
  { key: 'Emp_Taguig_Female', label: 'Taguig Female', group: 'app', cls: 'g-app' },
  { key: 'Truck_Vehicle_Count', label: 'Trucks', group: 'app', cls: 'g-app' },
  { key: 'Van_Vehicle_Count', label: 'Vans', group: 'app', cls: 'g-app' },
  { key: 'Motorcycle_Vehicle_Count', label: 'Motorcycles', group: 'app', cls: 'g-app' },
  { key: 'Other_Vehicle_Count', label: 'Other Vehicles', group: 'app', cls: 'g-app' },
  { key: 'TIN', label: 'TIN', group: 'tax', cls: 'g-tax' },
  { key: 'Taxpayer_CorporateName', label: 'Corporate Name', group: 'tax', cls: 'g-tax' },
  { key: 'Taxpayer_FullName', label: 'Taxpayer Name', group: 'tax', cls: 'g-tax' },
  { key: 'Business_Organization_Type', label: 'Org Type', group: 'tax', cls: 'g-tax' },
  { key: 'Owner_Gender', label: 'Gender', group: 'tax', cls: 'g-tax' },
  { key: 'Auth_Rep_ID', label: 'Auth Rep ID', group: 'auth', cls: 'g-auth' },
  { key: 'Auth_Rep_FullName', label: 'Auth Rep Name', group: 'auth', cls: 'g-auth' },
  { key: 'Auth_Rep_Position', label: 'Position', group: 'auth', cls: 'g-auth' },
  { key: 'Auth_Rep_MobileNumber', label: 'Auth Rep Mobile', group: 'auth', cls: 'g-auth' },
  { key: 'Auth_Rep_Email', label: 'Auth Rep Email', group: 'auth', cls: 'g-auth' },
  { key: 'Safety_Officer_ID', label: 'Safety Officer ID', group: 'saf', cls: 'g-saf' },
  { key: 'Safety_Officer_FullName', label: 'Safety Officer Name', group: 'saf', cls: 'g-saf' },
  { key: 'Safety_Officer_MobileNumber', label: 'Safety Mobile', group: 'saf', cls: 'g-saf' },
  { key: 'Safety_Officer_Email', label: 'Safety Email', group: 'saf', cls: 'g-saf' },
  { key: 'PSIC', label: 'PSIC', group: 'ops', cls: 'g-ops' },
  { key: 'Line_of_Business', label: 'Line of Business', group: 'ops', cls: 'g-ops' },
  { key: 'Nature_of_Business', label: 'Nature', group: 'ops', cls: 'g-ops' },
  { key: 'Number_of_Units', label: 'Units', group: 'ops', cls: 'g-ops' },
  { key: 'LOB_Gross_Sales', label: 'Gross Sales', group: 'ops', cls: 'g-ops' },
];

const GROUP_LABELS = {
  app: { label: 'Application', color: '#1E4E9E' },
  tax: { label: 'Taxpayer', color: '#0369A1' },
  auth: { label: 'Auth Rep', color: '#6D28D9' },
  saf: { label: 'Safety Officer', color: '#047857' },
  ops: { label: 'LOB / Operations', color: '#B91C1C' },
};

const TABS = [
  {
    key: 'fullView',
    label: 'Application',
    icon: '<i class="fa-solid fa-table"></i>',
    isFullView: true,
  },
];

const ADD_GROUPS = [
  { title: '1. Application', icon: 'fa-file-contract', fields: ['LCN', 'Application_Type', 'Payment_Mode', 'Payment_Option', 'Delivery_Option'] },
  {
    title: '2. Business / Taxpayer',
    icon: 'fa-building',
    fields: [
      'TIN',
      'Taxpayer_CorporateName',
      'Taxpayer_FullName',
      'Trade_Name',
      'Business_Organization_Type',
      'Owner_Gender',
      'Office_Classification',
      'Office_Address',
    ],
  },
  {
    title: '3. Authorized Representative',
    icon: 'fa-user-tie',
    fields: ['Auth_Rep_FullName', 'Auth_Rep_Position', 'Auth_Rep_Telephone', 'Auth_Rep_MobileNumber', 'Auth_Rep_Email'],
  },
  { title: '4. Safety Officer', icon: 'fa-user-shield', fields: ['Safety_Officer_FullName', 'Safety_Officer_Telephone', 'Safety_Officer_MobileNumber', 'Safety_Officer_Email'] },
  {
    title: '5. Demographics & Assets',
    icon: 'fa-truck-ramp-box',
    fields: ['Emp_Estab_Male', 'Emp_Estab_Female', 'Emp_Taguig_Male', 'Emp_Taguig_Female', 'Truck_Vehicle_Count', 'Van_Vehicle_Count', 'Motorcycle_Vehicle_Count', 'Other_Vehicle_Count'],
  },
];

const EDIT_PKS = new Set(['LCN', 'TIN', 'Auth_Rep_ID', 'Safety_Officer_ID', 'PSIC']);

const FIELD_META = {
  LCN: { label: 'LCN', required: true, typeDef: 'text' },
  Application_Date: { label: 'Application Date', required: true, typeDef: 'date' },
  Application_Type: { label: 'Application Type', required: true, typeDef: { type: 'select', opts: ['', 'New', 'Renewal', 'Transfer', 'Amendment'] } },
  Payment_Mode: { label: 'Payment Mode', required: false, typeDef: { type: 'select', opts: ['', 'Annual', 'Bi-Annual', 'Quarterly'] } },
  Payment_Option: { label: 'Payment Option', required: false, typeDef: { type: 'select', opts: ['', 'Online', 'Cash/Check', 'Card', 'eWallet'] } },
  Delivery_Option: { label: 'Delivery Option', required: false, typeDef: { type: 'select', opts: ['', 'Pick-Up', 'Pickup', 'Courier'] } },
  TIN: { label: 'TIN', required: true, typeDef: 'text' },
  Taxpayer_CorporateName: { label: 'Corporate Name', required: false, typeDef: 'text' },
  Taxpayer_FullName: { label: 'Taxpayer Full Name', required: false, typeDef: 'text' },
  Trade_Name: { label: 'Trade Name', required: false, typeDef: 'text' },
  Business_Organization_Type: { label: 'Business Org Type', required: true, typeDef: { type: 'select', opts: ['', 'Sole Proprietorship', 'One Person Corporation', 'Partnership', 'Cooperative', 'Corporation'] } },
  Owner_Gender: { label: 'Owner Gender', required: false, typeDef: { type: 'select', opts: ['', 'Male', 'Female'] } },
  Office_Classification: { label: 'Office Classification', required: true, typeDef: { type: 'select', opts: ['', 'Main/Principal/Head Office', 'Main/Principal/HeadOffice', 'Branch', 'Administrative Office', 'Sales Office', 'Showroom', 'Virtual Office', 'Warehouse'] } },
  Office_Address: { label: 'Office Address', required: false, typeDef: 'text' },
  Auth_Rep_ID: { label: 'Auth Rep ID', required: false, typeDef: 'text' },
  Auth_Rep_FullName: { label: 'Auth Rep Full Name', required: true, typeDef: 'text' },
  Auth_Rep_Position: { label: 'Auth Rep Position', required: true, typeDef: 'text' },
  Auth_Rep_Telephone: { label: 'Auth Rep Telephone', required: false, typeDef: 'text' },
  Auth_Rep_MobileNumber: { label: 'Auth Rep Mobile', required: false, typeDef: 'text' },
  Auth_Rep_Email: { label: 'Auth Rep Email', required: false, typeDef: 'text' },
  Safety_Officer_ID: { label: 'Safety Officer ID', required: false, typeDef: 'text' },
  Safety_Officer_FullName: { label: 'Safety Officer Full Name', required: true, typeDef: 'text' },
  Safety_Officer_Telephone: { label: 'Safety Officer Telephone', required: false, typeDef: 'text' },
  Safety_Officer_MobileNumber: { label: 'Safety Officer Mobile', required: false, typeDef: 'text' },
  Safety_Officer_Email: { label: 'Safety Officer Email', required: false, typeDef: 'text' },
  Emp_Estab_Male: { label: 'Emp. Estab. (Male)', required: false, typeDef: 'number' },
  Emp_Estab_Female: { label: 'Emp. Estab. (Female)', required: false, typeDef: 'number' },
  Emp_Taguig_Male: { label: 'Emp. Taguig (Male)', required: false, typeDef: 'number' },
  Emp_Taguig_Female: { label: 'Emp. Taguig (Female)', required: false, typeDef: 'number' },
  Truck_Vehicle_Count: { label: 'Trucks', required: false, typeDef: 'number' },
  Van_Vehicle_Count: { label: 'Vans', required: false, typeDef: 'number' },
  Motorcycle_Vehicle_Count: { label: 'Motorcycles', required: false, typeDef: 'number' },
  Other_Vehicle_Count: { label: 'Other Vehicles', required: false, typeDef: 'number' },
};

let activeTab = 0;
let allRows = [];
let selectedRow = null;
let formMode = 'add';

function init() {
  buildTabs();
  loadTable();
}

function buildTabs() {
  document.getElementById('navTabs').innerHTML = TABS.map((tab, i) =>
    `<button
      class="tab-btn full-view ${i === activeTab ? 'active' : ''}"
      onclick="switchTab(${i})"
    >${tab.icon} ${tab.label}</button>`
  ).join('');
}

function switchTab(i) {
  activeTab = i;
  selectedRow = null;
  setRowActions(false);
  document.getElementById('searchInput').value = '';
  buildTabs();
  loadTable();
}

async function loadTable() {
  renderTable([]);
  document.getElementById('recordCount').textContent = 'Loading…';
  try {
    await loadFullView();
  } catch {
    document.getElementById('recordCount').textContent = 'Failed to load records.';
  }
}

async function loadFullView() {
  const [apps, taxpayers, authReps, safetyOfficers, lobs, operations] = await Promise.all([
    api('GET', 'applications'),
    api('GET', 'taxpayers'),
    api('GET', 'authReps'),
    api('GET', 'safetyOfficers'),
    api('GET', 'lobs'),
    api('GET', 'operations'),
  ]);

  const taxMap = Object.fromEntries((taxpayers || []).map(r => [r.TIN, r]));
  const authMap = Object.fromEntries((authReps || []).map(r => [r.Auth_Rep_ID, r]));
  const safMap = Object.fromEntries((safetyOfficers || []).map(r => [r.Safety_Officer_ID, r]));
  const lobMap = Object.fromEntries((lobs || []).map(r => [r.PSIC, r]));

  const opsMap = {};
  (operations || []).forEach(op => {
    if (!opsMap[op.LCN]) opsMap[op.LCN] = [];
    opsMap[op.LCN].push(op);
  });

  const joined = [];
  (apps || []).forEach(app => {
    const tax = taxMap[app.TIN] || {};
    const auth = authMap[app.Auth_Rep_ID] || {};
    const saf = safMap[app.Safety_Officer_ID] || {};
    const ops = opsMap[app.LCN] || [{}];

    ops.forEach(op => {
      const lob = lobMap[op.PSIC] || {};
      joined.push({ ...app, ...tax, ...auth, ...saf, ...op, ...lob });
    });
  });

  allRows = joined;
  renderTable(allRows);
}

function filterTable() {
  const q = document.getElementById('searchInput').value.toLowerCase();
  const rows = q
    ? allRows.filter(r => Object.values(r).some(v => String(v || '').toLowerCase().includes(q)))
    : allRows;
  renderTable(rows, !!q);
}

function renderTable(rows, filtered = false) {
  const colKeys = FULL_COLS.map(col => col.key);

  const groups = [];
  let lastGroup = null;
  let span = 0;

  FULL_COLS.forEach((col, i) => {
    if (col.group !== lastGroup) {
      if (lastGroup) groups.push({ group: lastGroup, span });
      lastGroup = col.group;
      span = 1;
    } else {
      span++;
    }
    if (i === FULL_COLS.length - 1) {
      groups.push({ group: lastGroup, span });
    }
  });

  let head = '<thead>';
  head += '<tr>';
  groups.forEach(g => {
    const info = GROUP_LABELS[g.group];
    head += `<th colspan="${g.span}" class="col-group-header" style="background: ${info.color}">${info.label}</th>`;
  });
  head += '</tr>';

  head += '<tr>';
  FULL_COLS.forEach(col => {
    head += `<th class="${col.cls}">${esc(col.label)}</th>`;
  });
  head += '</tr>';
  head += '</thead>';

  let body = '<tbody>';
  if (!rows.length) {
    body += `<tr class="no-data"><td colspan="${colKeys.length}">No records found</td></tr>`;
  } else {
    rows.forEach((row, i) => {
      const isSelected = selectedRow && selectedRow.LCN === row.LCN && selectedRow.PSIC === row.PSIC;

      const cells = colKeys.map(key => {
        let value = row[key] ?? '';
        if (key === 'LOB_Gross_Sales' && value !== '') {
          value = '₱' + Number(value).toLocaleString();
        }
        return `<td title="${esc(String(value))}">${esc(String(value))}</td>`;
      }).join('');

      body += `
        <tr class="${isSelected ? 'selected' : ''}" onclick="selectRow(${i})">
          ${cells}
        </tr>`;
    });
  }

  body += '</tbody>';

  document.getElementById('mainTable').innerHTML = head + body;

  const total = allRows.length;
  document.getElementById('recordCount').textContent = filtered
    ? `${rows.length} of ${total} records`
    : `${total} record${total !== 1 ? 's' : ''}`;

  document.getElementById('tabHint').textContent = `Application — ${FULL_COLS.length} columns · 1 row per application × LOB`;
}

function selectRow(i) {
  const q = document.getElementById('searchInput').value.toLowerCase();
  const rows = q
    ? allRows.filter(r => Object.values(r).some(v => String(v || '').toLowerCase().includes(q)))
    : allRows;
  selectedRow = rows[i] ?? null;
  setRowActions(!!selectedRow);
  renderTable(rows, !!q);
}

function setRowActions(enabled) {
  document.getElementById('btnView').disabled = !enabled;
  document.getElementById('btnEdit').disabled = !enabled;
  document.getElementById('btnDelete').disabled = !enabled;
}

function openAdd() {
  selectedRow = null;
  formMode = 'add';
  setRowActions(false);

  document.getElementById('formTitle').textContent = 'New Application';
  document.getElementById('formSubmit').textContent = 'Submit Application';
  document.getElementById('formSubmit').style.display = 'inline-block';
  document.getElementById('formBody').innerHTML = buildUnifiedForm();
  addLobRow();

  document.getElementById('formModal').style.display = 'flex';
}

function openEdit() {
  if (!selectedRow) { toast('Select a record first.', true); return; }

  formMode = 'edit';

  document.getElementById('formTitle').textContent = `Edit Application — ${esc(selectedRow.LCN || '')}`;
  document.getElementById('formSubmit').textContent = 'Update Application';
  document.getElementById('formSubmit').style.display = 'inline-block';
  document.getElementById('formBody').innerHTML = buildUnifiedForm(selectedRow);

  addLobRow({
    PSIC: selectedRow.PSIC,
    Line_of_Business: selectedRow.Line_of_Business,
    Nature_of_Business: selectedRow.Nature_of_Business,
    Number_of_Units: selectedRow.Number_of_Units,
    LOB_Gross_Sales: selectedRow.LOB_Gross_Sales,
  });

  document.getElementById('formModal').style.display = 'flex';
}

function openView() {
  if (!selectedRow) { toast('Select a record first.', true); return; }

  formMode = 'view';

  document.getElementById('formTitle').textContent = `View Application — ${esc(selectedRow.LCN || '')}`;
  document.getElementById('formSubmit').style.display = 'none';
  document.getElementById('formBody').innerHTML = buildUnifiedForm(selectedRow);

  const lobContainer = document.getElementById('lobContainer');
  if (lobContainer) lobContainer.innerHTML = '';

  const lcnRows = allRows.filter(r => r.LCN === selectedRow.LCN);
  lcnRows.forEach(r => {
    addLobRow({
      PSIC: r.PSIC,
      Line_of_Business: r.Line_of_Business,
      Nature_of_Business: r.Nature_of_Business,
      Number_of_Units: r.Number_of_Units,
      LOB_Gross_Sales: r.LOB_Gross_Sales,
    });
  });

  document.getElementById('formModal').style.display = 'flex';
}

const DB_ALIASES = {
  Taxpayer_CorporateName: 'Taxpayer_CorporateName',
};

function buildUnifiedForm(data = {}) {
  let html = '';

  ADD_GROUPS.forEach(group => {
    html += `
      <div class="form-group">
        <div class="fg-title">
          <i class="fa-solid ${group.icon}"></i> ${group.title}
        </div>
        <div class="form-grid">`;

    group.fields.forEach(col => {
      const meta = FIELD_META[col];
      if (!meta) return;

      const isWide = ['Office_Address', 'Nature_of_Business'].includes(col) || col.includes('Email');
      const dbKey = DB_ALIASES[col] ?? col;
      const value = data[dbKey] ?? data[col] ?? '';
      const locked = formMode === 'view' || (formMode === 'edit' && col === 'LCN') ? 'disabled' : '';

      html += `
        <div class="field ${isWide ? 'full' : ''}">
          <label for="f_${col}">
            ${meta.label}${meta.required && formMode !== 'view' ? ' <span class="req">*</span>' : ''}
          </label>
          ${mkInput('f_', col, meta, value, locked)}
        </div>`;
    });

    html += `</div></div>`;
  });

  html += `
    <div class="form-group">
      <div class="fg-title">
        <i class="fa-solid fa-chart-pie"></i> 6. Lines of Business &amp; Operations
      </div>
      <div id="lobContainer"></div>
      ${formMode === 'add'
        ? `<button type="button" class="btn btn-outline" style="margin-top: 8px;" onclick="addLobRow()">
            <i class="fa-solid fa-plus"></i> Add Line of Business
           </button>`
        : ''}
    </div>`;

  return html;
}

function addLobRow(data = {}) {
  const container = document.getElementById('lobContainer');
  const row = document.createElement('div');
  row.className = 'lob-row';

  const isLocked = formMode === 'view' ? 'disabled' : '';
  const isPSICLocked = formMode !== 'add' ? 'disabled' : '';

  row.innerHTML = `
    <div class="field">
      <label>PSIC ${formMode !== 'view' ? '<span class="req">*</span>' : ''}</label>
      <input type="text" class="lob-psic" value="${esc(String(data.PSIC ?? ''))}" ${isPSICLocked} required minlength="5" maxlength="5" oninput="this.value = this.value.slice(0, 5)" placeholder="5-char PSIC" />
    </div>
    <div class="field">
      <label>Line of Business ${formMode !== 'view' ? '<span class="req">*</span>' : ''}</label>
      <input type="text" class="lob-line" value="${esc(String(data.Line_of_Business ?? ''))}" ${isLocked} required />
    </div>
    <div class="field">
      <label>Nature ${formMode !== 'view' ? '<span class="req">*</span>' : ''}</label>
      <input type="text" class="lob-nature" value="${esc(String(data.Nature_of_Business ?? ''))}" ${isLocked} required />
    </div>
    <div class="field">
      <label>Units ${formMode !== 'view' ? '<span class="req">*</span>' : ''}</label>
      <input type="number" class="lob-units" value="${esc(String(data.Number_of_Units ?? ''))}" ${isLocked} required />
    </div>
    <div class="field">
      <label>Gross Sales (₱) ${formMode !== 'view' ? '<span class="req">*</span>' : ''}</label>
      <input type="number" class="lob-sales" value="${esc(String(data.LOB_Gross_Sales ?? ''))}" ${isLocked} required />
    </div>
    ${formMode === 'add'
      ? `<button type="button" class="btn btn-danger" onclick="this.closest('.lob-row').remove()">
           <i class="fa-solid fa-xmark"></i>
         </button>`
      : '<div></div>'}`;

  container.appendChild(row);
}

function submitForm() {
  if (formMode === 'add') submitAdd();
  else if (formMode === 'edit') submitEdit();
}

async function submitAdd() {
  let valid = true;
  const values = {};

  document.querySelectorAll('[id^="f_"]').forEach(el => {
    const key = el.id.slice(2);
    if (key === 'TIN' && el.value.length !== 12) { markInvalid(el); valid = false; }
    else if ((key === 'Auth_Rep_MobileNumber' || key === 'Safety_Officer_MobileNumber') && el.value && el.value.length !== 11) { markInvalid(el); valid = false; }
    else if (el.required && !el.value.trim()) { markInvalid(el); valid = false; }
    else { markValid(el); }

    values[key] = el.type === 'number' ? Number(el.value) : el.value;
  });

  const lobRows = [...document.querySelectorAll('.lob-row')];
  if (!lobRows.length) { toast('Add at least one Line of Business.', true); return; }

  const seenPSIC = new Set();
  const lobs = [];

  lobRows.forEach(row => {
    const psic = row.querySelector('.lob-psic');
    const line = row.querySelector('.lob-line');
    const nature = row.querySelector('.lob-nature');
    const units = row.querySelector('.lob-units');
    const sales = row.querySelector('.lob-sales');

    [psic, line, nature, units, sales].forEach(el => {
      if (!el.value.trim()) { markInvalid(el); valid = false; }
      else markValid(el);
    });

    if (psic.value && psic.value.trim().length !== 5) {
      markInvalid(psic);
      toast(`PSIC must be exactly 5 characters.`, true);
      valid = false;
    } else if (psic.value && seenPSIC.has(psic.value.trim())) {
      markInvalid(psic);
      toast(`Duplicate PSIC "${psic.value.trim()}"`, true);
      valid = false;
    } else if (psic.value) {
      seenPSIC.add(psic.value.trim());
    }

    lobs.push({
      PSIC: psic.value,
      Line_of_Business: line.value,
      Nature_of_Business: nature.value,
      Number_of_Units: Number(units.value),
      LOB_Gross_Sales: Number(sales.value),
    });
  });

  if (!valid) { toast('Please fill all required fields correctly.', true); return; }

  const payload = {
    app: {
      LCN: values.LCN,
      Application_Date: new Date().toISOString().slice(0, 10),
      Application_Type: values.Application_Type,
      Payment_Mode: values.Payment_Mode,
      Payment_Option: values.Payment_Option,
      Delivery_Option: values.Delivery_Option,
      Trade_Name: values.Trade_Name,
      Office_Address: values.Office_Address,
      Office_Classification: values.Office_Classification,
      Emp_Estab_Male: values.Emp_Estab_Male,
      Emp_Estab_Female: values.Emp_Estab_Female,
      Emp_Taguig_Male: values.Emp_Taguig_Male,
      Emp_Taguig_Female: values.Emp_Taguig_Female,
      Truck_Vehicle_Count: values.Truck_Vehicle_Count,
      Van_Vehicle_Count: values.Van_Vehicle_Count,
      Motorcycle_Vehicle_Count: values.Motorcycle_Vehicle_Count,
      Other_Vehicle_Count: values.Other_Vehicle_Count,
    },
    taxpayer: {
      TIN: values.TIN,
      Taxpayer_CorporateName: values.Taxpayer_CorporateName,
      Taxpayer_FullName: values.Taxpayer_FullName,
      Business_Organization_Type: values.Business_Organization_Type,
      Owner_Gender: values.Owner_Gender,
    },
    authRep: {
      Auth_Rep_FullName: values.Auth_Rep_FullName,
      Auth_Rep_Position: values.Auth_Rep_Position,
      Auth_Rep_Telephone: values.Auth_Rep_Telephone,
      Auth_Rep_MobileNumber: values.Auth_Rep_MobileNumber,
      Auth_Rep_Email: values.Auth_Rep_Email,
    },
    safetyOfficer: {
      Safety_Officer_FullName: values.Safety_Officer_FullName,
      Safety_Officer_Telephone: values.Safety_Officer_Telephone,
      Safety_Officer_MobileNumber: values.Safety_Officer_MobileNumber,
      Safety_Officer_Email: values.Safety_Officer_Email,
    },
    lobs,
  };

  const btn = document.getElementById('formSubmit');
  btn.disabled = true;
  btn.textContent = 'Submitting…';

  try {
    const result = await api('POST', 'applications', payload);
    if (result?.error) { toast(result.error, true); return; }
    toast('Application submitted!');
    closeModal('formModal');
    loadTable();
  } catch {
  } finally {
    btn.disabled = false;
    btn.textContent = 'Submit Application';
  }
}

async function submitEdit() {
  let valid = true;
  const values = { LCN: selectedRow.LCN };

  document.querySelectorAll('[id^="f_"]').forEach(el => {
    const key = el.id.slice(2);

    if (el.tagName === 'SPAN') {
      values[key] = selectedRow[key] ?? '';
      return;
    }

    if (el.disabled) {
      values[key] = selectedRow[key] ?? '';
      return;
    }

    if (key === 'TIN') {
      if (el.value.length !== 12) { markInvalid(el); valid = false; }
      else markValid(el);
    } else if (key === 'Auth_Rep_MobileNumber' || key === 'Safety_Officer_MobileNumber') {
      if (el.value && el.value.length !== 11) { markInvalid(el); valid = false; }
      else markValid(el);
    } else if (el.required && !el.value.trim()) {
      markInvalid(el);
      valid = false;
    } else {
      markValid(el);
    }

    values[key] = el.type === 'number' ? Number(el.value) : el.value;
  });

  const lobRow = document.querySelector('.lob-row');
  let lobData = {};

  if (lobRow) {
    const lineEl = lobRow.querySelector('.lob-line');
    const natureEl = lobRow.querySelector('.lob-nature');
    const unitsEl = lobRow.querySelector('.lob-units');
    const salesEl = lobRow.querySelector('.lob-sales');

    [lineEl, natureEl, unitsEl, salesEl].forEach(el => {
      if (!el.value.trim()) { markInvalid(el); valid = false; }
      else markValid(el);
    });

    lobData = {
      LCN: selectedRow.LCN,
      PSIC: selectedRow.PSIC,
      Line_of_Business: lineEl.value,
      Nature_of_Business: natureEl.value,
      Number_of_Units: Number(unitsEl.value),
      LOB_Gross_Sales: Number(salesEl.value),
    };
  }

  if (!valid) { toast('Please check the highlighted fields.', true); return; }

  const payload = {
    app: {
      LCN: selectedRow.LCN,
      Application_Type: values.Application_Type,
      Payment_Mode: values.Payment_Mode,
      Payment_Option: values.Payment_Option,
      Delivery_Option: values.Delivery_Option,
      Trade_Name: values.Trade_Name,
      Office_Address: values.Office_Address,
      Office_Classification: values.Office_Classification,
      Emp_Estab_Male: values.Emp_Estab_Male,
      Emp_Estab_Female: values.Emp_Estab_Female,
      Emp_Taguig_Male: values.Emp_Taguig_Male,
      Emp_Taguig_Female: values.Emp_Taguig_Female,
      Truck_Vehicle_Count: values.Truck_Vehicle_Count,
      Van_Vehicle_Count: values.Van_Vehicle_Count,
      Motorcycle_Vehicle_Count: values.Motorcycle_Vehicle_Count,
      Other_Vehicle_Count: values.Other_Vehicle_Count,
    },
    taxpayer: {
      TIN: values.TIN,
      Taxpayer_CorporateName: values.Taxpayer_CorporateName,
      Taxpayer_FullName: values.Taxpayer_FullName,
      Business_Organization_Type: values.Business_Organization_Type,
      Owner_Gender: values.Owner_Gender,
    },
    authRep: {
      Auth_Rep_ID: selectedRow.Auth_Rep_ID,
      Auth_Rep_FullName: values.Auth_Rep_FullName,
      Auth_Rep_Position: values.Auth_Rep_Position,
      Auth_Rep_Telephone: values.Auth_Rep_Telephone,
      Auth_Rep_MobileNumber: values.Auth_Rep_MobileNumber,
      Auth_Rep_Email: values.Auth_Rep_Email,
    },
    safetyOfficer: {
      Safety_Officer_ID: selectedRow.Safety_Officer_ID,
      Safety_Officer_FullName: values.Safety_Officer_FullName,
      Safety_Officer_Telephone: values.Safety_Officer_Telephone,
      Safety_Officer_MobileNumber: values.Safety_Officer_MobileNumber,
      Safety_Officer_Email: values.Safety_Officer_Email,
    },
    lob: lobData,
  };

  const btn = document.getElementById('formSubmit');
  btn.disabled = true;
  btn.textContent = 'Saving…';

  try {
    const result = await api('PUT', 'fullApplication', payload);
    if (result?.error) { toast(result.error, true); return; }
    toast('Application updated.');
    closeModal('formModal');
    selectedRow = null;
    setRowActions(false);
    loadTable();
  } catch {
  } finally {
    btn.disabled = false;
    btn.textContent = 'Update Application';
  }
}

function openDelete() {
  if (!selectedRow) { toast('Select a record first.', true); return; }

  document.getElementById('delTitle').textContent = `Delete Application — ${esc(selectedRow.LCN || '')}`;

  document.getElementById('delDesc').textContent = 'One request removes all related data in a single transaction.';

  document.getElementById('delMeta').innerHTML =
    `<strong>Will be permanently deleted:</strong><br>` +
    `&nbsp;✕&nbsp; Application &nbsp;<strong>${esc(selectedRow.LCN || '')}</strong><br>` +
    `&nbsp;✕&nbsp; All Est. Operations for this LCN<br>` +
    `&nbsp;✕&nbsp; Auth Rep &nbsp;<strong>${esc(selectedRow.Auth_Rep_ID || '')}</strong>` +
    ` <span style="font-size: 0.75rem; color: var(--gray-500);">(skipped if shared)</span><br>` +
    `&nbsp;✕&nbsp; Safety Officer &nbsp;<strong>${esc(selectedRow.Safety_Officer_ID || '')}</strong>` +
    ` <span style="font-size: 0.75rem; color: var(--gray-500);">(skipped if shared)</span><br>` +
    `&nbsp;✕&nbsp; Taxpayer / TIN &nbsp;<strong>${esc(selectedRow.TIN || '')}</strong>` +
    ` <span style="font-size: 0.75rem; color: var(--gray-500);">(skipped if shared)</span>`;

  document.getElementById('delMeta').style.display = 'block';
  document.getElementById('deleteModal').style.display = 'flex';
}

async function confirmDelete() {
  const btn = document.getElementById('delConfirm');
  const lcn = selectedRow?.LCN;

  btn.disabled = true;
  btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Deleting…';

  try {
    const result = await api('DELETE', 'fullApplication', selectedRow);
    if (result?.error) { toast(result.error, true); return; }

    closeModal('deleteModal');
    selectedRow = null;
    setRowActions(false);
    toast(`Application ${lcn} deleted.`);
    loadTable();
  } catch {
  } finally {
    btn.disabled = false;
    btn.innerHTML = 'Delete';
  }
}

function mkInput(prefix, col, meta, value = '', disabled = '') {
  const id = prefix + col;
  const req = meta.required && formMode !== 'view' ? 'required' : '';
  const td = meta.typeDef;

  if (col === 'TIN') {
    if (disabled) {
      return `<span id="${id}" class="field-readonly">${esc(String(value || '—'))}</span>`;
    }
    return `<input
      type="text" id="${id}" value="${esc(String(value))}"
      ${req}
      placeholder="12-digit TIN" maxlength="12"
      oninput="this.value = this.value.replace(/[^0-9]/g, '').slice(0, 12)"
    />`;
  }

  if (td && typeof td === 'object' && td.type === 'select') {
    const normalize = s => {
      const str = String(s ?? '').trim();
      return str.toUpperCase() === 'NULL' ? '' : str;
    };

    const currentRaw = normalize(value);
    const currentNorm = currentRaw.toLowerCase().replace(/\s+/g, ' ');

    if (disabled) {
      const display = currentRaw || '—';
      return `<span id="${id}" class="field-readonly">${esc(display)}</span>`;
    }

    let anySelected = false;
    const options = td.opts.map(opt => {
      const optVal = opt ?? '';
      const optNorm = normalize(optVal).toLowerCase().replace(/\s+/g, ' ');
      const isSelected = optNorm === currentNorm;
      if (isSelected) anySelected = true;

      const label = optVal || '— select —';
      return `<option value="${esc(optVal)}" ${isSelected ? 'selected' : ''}>${label}</option>`;
    }).join('');

    const fallback = (!anySelected && currentRaw)
      ? `<option value="${esc(currentRaw)}" selected>${esc(currentRaw)}</option>`
      : '';

    return `<select id="${id}" ${req}>${options}${fallback}</select>`;
  }

  if (col === 'Auth_Rep_MobileNumber' || col === 'Safety_Officer_MobileNumber') {
    if (disabled) {
      return `<span id="${id}" class="field-readonly">${esc(String(value || '—'))}</span>`;
    }
    return `<input
      type="text" id="${id}" value="${esc(String(value))}"
      ${req}
      placeholder="11-digit mobile number" maxlength="11" minlength="11"
      oninput="this.value = this.value.replace(/[^0-9]/g, '').slice(0, 11)"
    />`;
  }

  const type = typeof td === 'string' ? td : 'text';
  const minAttr = type === 'number' ? 'min="0"' : '';
  if (disabled) {
    return `<span id="${id}" class="field-readonly">${esc(String(value || '—'))}</span>`;
  }
  return `<input
    type="${type}" id="${id}" value="${esc(String(value))}"
    ${req} ${minAttr} placeholder="${esc(meta.label)}"
  />`;
}

async function api(method, table, body = null) {
  try {
    const options = {
      method,
      headers: { 'Content-Type': 'application/json' },
    };
    if (body) options.body = JSON.stringify(body);

    const response = await fetch(`${API}?table=${table}`, options);
    return await response.json();
  } catch {
    toast('Could not reach the server — make sure api.php is running.', true);
    throw new Error('network');
  }
}

function closeModal(id) {
  document.getElementById(id).style.display = 'none';
}

function esc(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '<')
    .replace(/>/g, '>')
    .replace(/"/g, '"');
}

function markInvalid(el) { el.style.borderColor = 'var(--red)'; }
function markValid(el) { el.style.borderColor = ''; }

let toastTimer;

function toast(message, isError = false) {
  clearTimeout(toastTimer);
  document.querySelector('.toast')?.remove();

  const el = document.createElement('div');
  el.className = `toast ${isError ? 'err' : 'ok'}`;
  el.textContent = message;

  document.body.appendChild(el);
  toastTimer = setTimeout(() => el.remove(), 4000);
}

init();

