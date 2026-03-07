const SMART_STORAGE_KEY = 'kili_smart_data_v1';
const SMART_RATE_LIMIT_KEY = 'kili_smart_rate_limit_v1';

const DEFAULT_DATA = {
  agrovets: [
    {
      id: 'ag-juja',
      name: 'Juja Agrovet Hub',
      county: 'Kiambu',
      lat: -1.108,
      lng: 37.016,
      phone: '+254700100001',
      products: [
        { name: 'Mancozeb 80WP', stock: 28, price: 920 },
        { name: 'Copper Oxychloride', stock: 18, price: 860 },
        { name: 'Neem Bio-Pesticide', stock: 16, price: 1050 }
      ],
      notices: []
    },
    {
      id: 'ag-nakuru',
      name: 'Nakuru Farm Inputs Centre',
      county: 'Nakuru',
      lat: -0.303,
      lng: 36.08,
      phone: '+254700100002',
      products: [
        { name: 'Ridomil Gold', stock: 12, price: 1470 },
        { name: 'Foliar Plus', stock: 35, price: 620 },
        { name: 'Neem Bio-Pesticide', stock: 10, price: 1020 }
      ],
      notices: []
    },
    {
      id: 'ag-eldoret',
      name: 'Eldoret Crop Care Agrovet',
      county: 'Uasin Gishu',
      lat: 0.52,
      lng: 35.269,
      phone: '+254700100003',
      products: [
        { name: 'Foliar Plus', stock: 24, price: 640 },
        { name: 'Copper Oxychloride', stock: 8, price: 900 },
        { name: 'Calcium Booster', stock: 20, price: 710 }
      ],
      notices: []
    }
  ],
  specialists: [
    {
      id: 'sp-1',
      name: 'Dr. Mercy Njoroge',
      specialization: 'Crop Disease & Pest Management',
      availability: 'available',
      county: 'Kiambu',
      phone: '+254711200001'
    },
    {
      id: 'sp-2',
      name: 'Eng. Daniel Kiprotich',
      specialization: 'Irrigation & Greenhouse Systems',
      availability: 'available',
      county: 'Nakuru',
      phone: '+254711200002'
    },
    {
      id: 'sp-3',
      name: 'Dr. Beatrice Achieng',
      specialization: 'Soil Fertility & Plant Nutrition',
      availability: 'busy',
      county: 'Kisumu',
      phone: '+254711200003'
    }
  ],
  advisories: [
    {
      id: 'adv-1',
      source: 'Specialist',
      title: 'Early blight watch in humid zones',
      message: 'Scout tomatoes twice weekly and remove infected leaves early.',
      region: 'National',
      createdAt: '2026-03-01'
    }
  ],
  consultations: []
};

const DISEASE_PROFILES = [
  {
    id: 'early-blight',
    keywords: ['blight', 'brown', 'ring', 'spot', 'lesion'],
    crops: ['tomato', 'potato'],
    diagnosis: 'Possible Early Blight (Alternaria)',
    treatment: [
      'Apply Mancozeb 80WP as per label instructions.',
      'Remove heavily infected leaves and improve air circulation.'
    ],
    prevention: [
      'Avoid overhead irrigation late in the day.',
      'Rotate crops and sanitize field tools.'
    ],
    products: ['Mancozeb 80WP', 'Copper Oxychloride']
  },
  {
    id: 'powdery-mildew',
    keywords: ['white', 'powder', 'mildew', 'dust'],
    crops: ['cucumber', 'melon', 'squash', 'tomato'],
    diagnosis: 'Possible Powdery Mildew',
    treatment: [
      'Apply recommended sulfur or bio-fungicide product.',
      'Prune dense canopy to reduce humidity around leaves.'
    ],
    prevention: [
      'Use tolerant varieties where possible.',
      'Maintain balanced fertilization and spacing.'
    ],
    products: ['Neem Bio-Pesticide', 'Copper Oxychloride']
  },
  {
    id: 'nutrient-deficiency',
    keywords: ['yellow', 'chlorosis', 'stunted', 'weak', 'pale'],
    crops: ['maize', 'tomato', 'cabbage', 'kale'],
    diagnosis: 'Possible Nutrient Deficiency Stress',
    treatment: [
      'Apply foliar feed and review soil nutrition program.',
      'Test soil pH and nutrient levels for precision correction.'
    ],
    prevention: [
      'Follow seasonal soil testing and balanced fertilization.',
      'Maintain irrigation consistency to support nutrient uptake.'
    ],
    products: ['Foliar Plus', 'Calcium Booster']
  }
];

const ADMIN_CREDENTIALS = {
  agrovetadmin: { password: 'Agrovet@123', role: 'agrovet' },
  specialistadmin: { password: 'Specialist@123', role: 'specialist' },
  systemadmin: { password: 'SysAdmin@123', role: 'system' }
};

let smartData = loadSmartData();
let latestDiagnosis = null;
let latestImage = null;
let userPosition = null;

const diagnosisForm = document.getElementById('diagnosis-form');
const imageInput = document.getElementById('crop-image');
const cameraInput = document.getElementById('crop-camera');
const imagePreviewWrap = document.getElementById('image-preview-wrap');
const imagePreview = document.getElementById('image-preview');
const imageMeta = document.getElementById('image-meta');
const diagnosisResult = document.getElementById('diagnosis-result');
const productsWrap = document.getElementById('recommended-products');
const agrovetList = document.getElementById('agrovet-list');
const detectLocationBtn = document.getElementById('detect-location-btn');
const locationStatus = document.getElementById('location-status');
const specialistList = document.getElementById('specialist-list');
const consultationForm = document.getElementById('consultation-form');
const consultFeedback = document.getElementById('consult-feedback');
const advisoryList = document.getElementById('advisory-list');

const adminLoginForm = document.getElementById('admin-login-form');
const adminAuthWrap = document.getElementById('admin-auth-wrap');
const adminDashboard = document.getElementById('admin-dashboard');
const adminRoleLabel = document.getElementById('admin-role-label');
const adminLoginFeedback = document.getElementById('admin-login-feedback');
const adminFeedback = document.getElementById('admin-feedback');
const agrovetPanel = document.getElementById('agrovet-admin-panel');
const specialistPanel = document.getElementById('specialist-admin-panel');
const adminLogout = document.getElementById('admin-logout');

const agrovetSelect = document.getElementById('agrovet-select');
const specialistSelect = document.getElementById('specialist-select');
const agrovetStockForm = document.getElementById('agrovet-stock-form');
const agrovetNoticeForm = document.getElementById('agrovet-notice-form');
const specialistUpdateForm = document.getElementById('specialist-update-form');
const specialistAdvisoryForm = document.getElementById('specialist-advisory-form');

initSmartAssist();

function initSmartAssist() {
  bindDiagnosisInputs();
  bindFarmerFlows();
  bindAdminFlows();
  renderSpecialists();
  renderAdvisories();
  hydrateAdminSession();
  renderAgrovetOptions();
  renderSpecialistOptions();
}

function bindDiagnosisInputs() {
  imageInput?.addEventListener('change', async (event) => {
    const file = event.target.files?.[0];
    if (file) {
      await consumeImageFile(file);
      cameraInput.value = '';
    }
  });

  cameraInput?.addEventListener('change', async (event) => {
    const file = event.target.files?.[0];
    if (file) {
      await consumeImageFile(file);
      imageInput.value = '';
    }
  });
}

function bindFarmerFlows() {
  diagnosisForm?.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (isSpamSubmission(diagnosisForm)) {
      showDiagnosisMessage('Submission blocked. Please remove hidden field content and try again.');
      return;
    }

    if (!latestImage) {
      showDiagnosisMessage('Please upload or capture a crop image first.');
      return;
    }

    if (isRateLimited('diagnosis', 12)) {
      showDiagnosisMessage('Please wait a few seconds before another diagnosis request.');
      return;
    }

    const cropType = document.getElementById('crop-type')?.value.trim() || '';
    const symptoms = document.getElementById('symptoms')?.value.trim() || '';

    const result = await analyzeCropIssue({ cropType, symptoms, image: latestImage });
    latestDiagnosis = result;
    renderDiagnosisResult(result);
    renderRecommendedProducts(result.products);
    renderAgrovets(result.products);
  });

  detectLocationBtn?.addEventListener('click', () => {
    if (!navigator.geolocation) {
      locationStatus.textContent = 'Geolocation not supported on this device/browser.';
      return;
    }

    locationStatus.textContent = 'Detecting location...';
    navigator.geolocation.getCurrentPosition(
      (position) => {
        userPosition = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        locationStatus.textContent = `Location detected (${userPosition.lat.toFixed(4)}, ${userPosition.lng.toFixed(4)}).`;
        renderAgrovets(latestDiagnosis?.products || []);
      },
      () => {
        locationStatus.textContent = 'Could not detect location. Use manual location field instead.';
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  });

  consultationForm?.addEventListener('submit', (event) => {
    event.preventDefault();

    if (isSpamSubmission(consultationForm) || isRateLimited('consultation', 10)) {
      showFeedback(consultFeedback, 'Please wait and try again.');
      return;
    }

    const payload = {
      id: `consult-${Date.now()}`,
      name: document.getElementById('consult-name')?.value.trim(),
      contact: document.getElementById('consult-contact')?.value.trim(),
      county: document.getElementById('consult-county')?.value.trim(),
      mode: document.getElementById('consult-mode')?.value,
      details: document.getElementById('consult-details')?.value.trim(),
      createdAt: new Date().toISOString()
    };

    if (!payload.name || !payload.contact || !payload.county || !payload.mode || !payload.details) {
      showFeedback(consultFeedback, 'Please fill all consultation fields.');
      return;
    }

    smartData.consultations.unshift(payload);
    persistSmartData();
    consultationForm.reset();
    showFeedback(consultFeedback, 'Consultation request sent. A specialist will reach out shortly.');
  });
}

function bindAdminFlows() {
  adminLoginForm?.addEventListener('submit', (event) => {
    event.preventDefault();

    const username = document.getElementById('admin-username')?.value.trim().toLowerCase();
    const password = document.getElementById('admin-password')?.value;
    const account = ADMIN_CREDENTIALS[username];

    if (!account || account.password !== password) {
      showFeedback(adminLoginFeedback, 'Invalid admin credentials.');
      return;
    }

    const session = { role: account.role, username, at: Date.now() };
    sessionStorage.setItem('kili_admin_session', JSON.stringify(session));
    adminLoginForm.reset();
    adminLoginFeedback.hidden = true;
    renderAdminSession(session);
  });

  adminLogout?.addEventListener('click', () => {
    sessionStorage.removeItem('kili_admin_session');
    adminDashboard.hidden = true;
    adminAuthWrap.hidden = false;
  });

  agrovetStockForm?.addEventListener('submit', (event) => {
    event.preventDefault();

    const agrovetId = agrovetSelect.value;
    const productName = document.getElementById('product-name')?.value.trim();
    const stock = Number(document.getElementById('product-stock')?.value || 0);
    const price = Number(document.getElementById('product-price')?.value || 0);

    const agrovet = smartData.agrovets.find((item) => item.id === agrovetId);
    if (!agrovet || !productName) {
      showFeedback(adminFeedback, 'Select agrovet and product details.');
      return;
    }

    const existing = agrovet.products.find((item) => item.name.toLowerCase() === productName.toLowerCase());
    if (existing) {
      existing.stock = stock;
      existing.price = price;
    } else {
      agrovet.products.push({ name: productName, stock, price });
    }

    persistSmartData();
    agrovetStockForm.reset();
    showFeedback(adminFeedback, `Stock updated for ${agrovet.name}.`);

    if (latestDiagnosis?.products?.length) {
      renderAgrovets(latestDiagnosis.products);
    }
  });

  agrovetNoticeForm?.addEventListener('submit', (event) => {
    event.preventDefault();

    const title = document.getElementById('agrovet-notice-title')?.value.trim();
    const message = document.getElementById('agrovet-notice-body')?.value.trim();
    const agrovet = smartData.agrovets.find((item) => item.id === agrovetSelect.value);

    if (!title || !message || !agrovet) {
      showFeedback(adminFeedback, 'Complete notice details first.');
      return;
    }

    smartData.advisories.unshift({
      id: `adv-${Date.now()}`,
      source: `Agrovet: ${agrovet.name}`,
      title,
      message,
      region: agrovet.county,
      createdAt: new Date().toISOString().slice(0, 10)
    });

    persistSmartData();
    agrovetNoticeForm.reset();
    showFeedback(adminFeedback, 'Agrovet notice published.');
    renderAdvisories();
  });

  specialistUpdateForm?.addEventListener('submit', (event) => {
    event.preventDefault();

    const specialistId = specialistSelect.value;
    const availability = document.getElementById('specialist-availability')?.value;
    const specialist = smartData.specialists.find((item) => item.id === specialistId);

    if (!specialist) {
      showFeedback(adminFeedback, 'Select specialist.');
      return;
    }

    specialist.availability = availability;
    persistSmartData();
    showFeedback(adminFeedback, `Availability updated for ${specialist.name}.`);
    renderSpecialists();
  });

  specialistAdvisoryForm?.addEventListener('submit', (event) => {
    event.preventDefault();

    const title = document.getElementById('specialist-advisory-title')?.value.trim();
    const message = document.getElementById('specialist-advisory-body')?.value.trim();
    const region = document.getElementById('specialist-advisory-region')?.value.trim() || 'National';

    if (!title || !message) {
      showFeedback(adminFeedback, 'Add advisory title and message.');
      return;
    }

    smartData.advisories.unshift({
      id: `adv-${Date.now()}`,
      source: 'Specialist',
      title,
      message,
      region,
      createdAt: new Date().toISOString().slice(0, 10)
    });

    persistSmartData();
    specialistAdvisoryForm.reset();
    showFeedback(adminFeedback, 'Specialist advisory published.');
    renderAdvisories();
  });
}

async function consumeImageFile(file) {
  if (!file.type.startsWith('image/')) {
    showDiagnosisMessage('Only image files are allowed.');
    return;
  }

  if (file.size > 6 * 1024 * 1024) {
    showDiagnosisMessage('Image too large. Please upload a file below 6MB.');
    return;
  }

  const optimized = await optimizeImage(file, 1200, 0.84);
  latestImage = {
    fileName: file.name,
    mimeType: 'image/jpeg',
    blob: optimized.blob,
    dataUrl: optimized.dataUrl,
    width: optimized.width,
    height: optimized.height
  };

  imagePreviewWrap.hidden = false;
  imagePreview.src = optimized.dataUrl;
  imageMeta.textContent = `Optimized image size: ${optimized.width}x${optimized.height}`;
  diagnosisResult.hidden = true;
}

async function analyzeCropIssue(context) {
  if (window.KilimonetSmartApi?.diagnose) {
    try {
      const apiResult = await window.KilimonetSmartApi.diagnose(context);
      if (apiResult?.diagnosis && Array.isArray(apiResult.products)) {
        return apiResult;
      }
    } catch {
      // Fall back to local diagnosis.
    }
  }

  const text = `${context.cropType} ${context.symptoms} ${context.image.fileName}`.toLowerCase();
  let best = null;
  let bestScore = -1;

  for (const profile of DISEASE_PROFILES) {
    let score = 0;
    for (const keyword of profile.keywords) {
      if (text.includes(keyword)) {
        score += 1;
      }
    }
    for (const crop of profile.crops) {
      if (context.cropType.toLowerCase().includes(crop)) {
        score += 2;
      }
    }
    if (score > bestScore) {
      best = profile;
      bestScore = score;
    }
  }

  const chosen = best || DISEASE_PROFILES[2];
  return {
    diagnosis: chosen.diagnosis,
    confidence: Math.min(96, 62 + Math.max(0, bestScore) * 6),
    treatment: chosen.treatment,
    prevention: chosen.prevention,
    products: chosen.products
  };
}

function renderDiagnosisResult(result) {
  diagnosisResult.hidden = false;
  diagnosisResult.innerHTML = `
    <h3>Diagnosis Result</h3>
    <p><strong>Likely issue:</strong> ${escapeHtml(result.diagnosis)}</p>
    <p><strong>Confidence:</strong> ${result.confidence}% (indicative)</p>
    <p><strong>Treatment recommendations:</strong></p>
    <ul>${result.treatment.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>
    <p><strong>Prevention guidance:</strong></p>
    <ul>${result.prevention.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>
  `;
}

function renderRecommendedProducts(products) {
  if (!products?.length) {
    productsWrap.innerHTML = '';
    return;
  }
  productsWrap.innerHTML = products.map((item) => `<span class="chip">${escapeHtml(item)}</span>`).join('');
}

function renderAgrovets(requiredProducts) {
  const locationText = (document.getElementById('farmer-location')?.value || '').trim().toLowerCase();
  const products = requiredProducts?.length ? requiredProducts : [];

  const list = smartData.agrovets
    .map((agrovet) => {
      const available = agrovet.products.filter((product) => {
        if (product.stock <= 0) {
          return false;
        }
        return products.length === 0 || products.some((name) => name.toLowerCase() === product.name.toLowerCase());
      });

      let distance = null;
      if (userPosition) {
        distance = haversineKm(userPosition.lat, userPosition.lng, agrovet.lat, agrovet.lng);
      }

      const countyMatch = !locationText || agrovet.county.toLowerCase().includes(locationText);
      return { ...agrovet, available, distance, countyMatch };
    })
    .filter((item) => item.available.length > 0 && (userPosition || item.countyMatch));

  if (userPosition) {
    list.sort((a, b) => (a.distance ?? 999) - (b.distance ?? 999));
  }

  if (!list.length) {
    agrovetList.innerHTML = '<p class="meta-text">No matching agrovet stock found yet. Try updating location or contact support.</p>';
    return;
  }

  agrovetList.innerHTML = list
    .map((item) => {
      const productLines = item.available
        .map((p) => `<li>${escapeHtml(p.name)} - ${p.stock} in stock - KES ${p.price}</li>`)
        .join('');
      const distanceText = item.distance != null ? `${item.distance.toFixed(1)} km away` : item.county;
      const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${item.lat},${item.lng}`;
      const firstProduct = encodeURIComponent(item.available[0]?.name || 'input');
      const reserveLink = `mailto:${encodeURIComponent('kilimonetinagrtech@gmail.com')}?subject=Product%20Reservation&body=Please%20reserve%20${firstProduct}%20at%20${encodeURIComponent(item.name)}.`;

      return `
        <article class="finder-item">
          <h3>${escapeHtml(item.name)}</h3>
          <p><strong>Location:</strong> ${escapeHtml(item.county)} | <strong>Distance:</strong> ${distanceText}</p>
          <p><strong>Phone:</strong> <a href="tel:${item.phone.replace(/\s+/g, '')}">${escapeHtml(item.phone)}</a></p>
          <ul>${productLines}</ul>
          <div class="finder-actions">
            <a class="btn btn-secondary" href="tel:${item.phone.replace(/\s+/g, '')}">Call Agrovet</a>
            <a class="btn btn-secondary" href="${mapsUrl}" target="_blank" rel="noreferrer">Directions</a>
            <a class="btn btn-secondary" href="${reserveLink}">Reserve Product</a>
          </div>
        </article>
      `;
    })
    .join('');
}

function renderSpecialists() {
  specialistList.innerHTML = smartData.specialists
    .map((specialist) => {
      return `
        <article class="specialist-item">
          <h3>${escapeHtml(specialist.name)}</h3>
          <p><strong>Specialization:</strong> ${escapeHtml(specialist.specialization)}</p>
          <p><strong>Status:</strong> ${escapeHtml(specialist.availability)}</p>
          <p><strong>County:</strong> ${escapeHtml(specialist.county)}</p>
          <p><a href="tel:${specialist.phone.replace(/\s+/g, '')}">${escapeHtml(specialist.phone)}</a></p>
        </article>
      `;
    })
    .join('');
}

function renderAdvisories() {
  const list = smartData.advisories.slice(0, 12);
  if (!list.length) {
    advisoryList.innerHTML = '<p class="meta-text">No advisories published yet.</p>';
    return;
  }

  advisoryList.innerHTML = list
    .map((item) => `
      <article class="advisory-item">
        <h3>${escapeHtml(item.title)}</h3>
        <p>${escapeHtml(item.message)}</p>
        <p><strong>Source:</strong> ${escapeHtml(item.source)} | <strong>Region:</strong> ${escapeHtml(item.region)} | <strong>Date:</strong> ${escapeHtml(item.createdAt)}</p>
      </article>
    `)
    .join('');
}

function renderAgrovetOptions() {
  const options = smartData.agrovets
    .map((item) => `<option value="${item.id}">${escapeHtml(item.name)} (${escapeHtml(item.county)})</option>`)
    .join('');
  agrovetSelect.innerHTML = `<option value="">Select agrovet</option>${options}`;
}

function renderSpecialistOptions() {
  const options = smartData.specialists
    .map((item) => `<option value="${item.id}">${escapeHtml(item.name)} (${escapeHtml(item.specialization)})</option>`)
    .join('');
  specialistSelect.innerHTML = `<option value="">Select specialist</option>${options}`;
}

function hydrateAdminSession() {
  const session = parseJson(sessionStorage.getItem('kili_admin_session'));
  if (session?.role) {
    renderAdminSession(session);
  }
}

function renderAdminSession(session) {
  adminAuthWrap.hidden = true;
  adminDashboard.hidden = false;
  adminRoleLabel.textContent = `Signed in as ${session.username} (${session.role} admin)`;

  const allowAgrovet = session.role === 'agrovet' || session.role === 'system';
  const allowSpecialist = session.role === 'specialist' || session.role === 'system';
  agrovetPanel.hidden = !allowAgrovet;
  specialistPanel.hidden = !allowSpecialist;
}

function loadSmartData() {
  const stored = parseJson(localStorage.getItem(SMART_STORAGE_KEY));
  if (!stored || !stored.agrovets || !stored.specialists) {
    localStorage.setItem(SMART_STORAGE_KEY, JSON.stringify(DEFAULT_DATA));
    return structuredClone(DEFAULT_DATA);
  }
  return stored;
}

function persistSmartData() {
  localStorage.setItem(SMART_STORAGE_KEY, JSON.stringify(smartData));
}

function isSpamSubmission(form) {
  const hp = form?.querySelector('.hp');
  return !!hp?.value;
}

function isRateLimited(scope, seconds) {
  const map = parseJson(localStorage.getItem(SMART_RATE_LIMIT_KEY)) || {};
  const now = Date.now();
  const prev = map[scope] || 0;
  if (now - prev < seconds * 1000) {
    return true;
  }
  map[scope] = now;
  localStorage.setItem(SMART_RATE_LIMIT_KEY, JSON.stringify(map));
  return false;
}

function showFeedback(element, message) {
  if (!element) {
    return;
  }
  element.hidden = false;
  element.textContent = message;
}

function showDiagnosisMessage(message) {
  diagnosisResult.hidden = false;
  diagnosisResult.innerHTML = `<p>${escapeHtml(message)}</p>`;
}

function haversineKm(lat1, lon1, lat2, lon2) {
  const toRad = (deg) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 2 * 6371 * Math.asin(Math.sqrt(a));
}

function parseJson(value) {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

function escapeHtml(input) {
  return String(input)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function optimizeImage(file, maxDimension, quality) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const image = new Image();
      image.onload = () => {
        let { width, height } = image;
        if (width > maxDimension || height > maxDimension) {
          const ratio = Math.min(maxDimension / width, maxDimension / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas not supported'));
          return;
        }

        ctx.drawImage(image, 0, 0, width, height);
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Image conversion failed'));
              return;
            }
            resolve({
              blob,
              width,
              height,
              dataUrl: canvas.toDataURL('image/jpeg', quality)
            });
          },
          'image/jpeg',
          quality
        );
      };
      image.onerror = () => reject(new Error('Invalid image file'));
      image.src = reader.result;
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}
