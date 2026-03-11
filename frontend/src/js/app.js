// ==============================
// GroceryScan — Frontend Logic
// ==============================

// Dynamic API URL - works for both localhost and mobile access
const API_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:3001' 
    : `http://${window.location.hostname}:3001`;
const DETECT_INTERVAL_MS = 800; // Detection every 0.8s - faster for better responsiveness

// DOM Elements
const video = document.getElementById('video');
const overlayCanvas = document.getElementById('overlay-canvas');
const captureCanvas = document.getElementById('capture-canvas');
const placeholder = document.getElementById('camera-placeholder');
const btnStart = document.getElementById('btn-start');
const btnStop = document.getElementById('btn-stop');
const resultsList = document.getElementById('results-list');
const historyList = document.getElementById('history-list');
const totalBadge = document.getElementById('total-badge');
const fpsDisplay = document.getElementById('fps-display');
const itemCountDisplay = document.getElementById('item-count');
const latencyDisplay = document.getElementById('latency-display');
const statusDot = document.querySelector('.status-dot');
const statusText = document.querySelector('.status-text');

const overlayCtx = overlayCanvas.getContext('2d');
const captureCtx = captureCanvas.getContext('2d');

// State
let stream = null;
let detectInterval = null;
let isRunning = false;
let frameCount = 0;
let fpsTimer = null;
let historyEntries = [];

// Item emoji mapping
const ITEM_EMOJIS = {
    apple: '🍎',
    orange: '🍊',
    banana: '🍌',
    broccoli: '🥦',
    carrot: '🥕',
    'hot dog': '🌭',
    pizza: '🍕',
    donut: '🍩',
    cake: '🎂',
    sandwich: '🥪',
    bottle: '🍶',
    'wine glass': '🍷',
    cup: '☕',
    fork: '🍴',
    knife: '🔪',
    spoon: '🥄',
    bowl: '🥣',
    'dining table': '🪑',
    'cell phone': '📱',
    book: '📚',
    'potted plant': '🪴',
};

// ======== Color palette for bounding boxes ========
const BOX_COLORS = [
    '#6366f1', '#8b5cf6', '#06b6d4', '#10b981',
    '#f59e0b', '#ef4444', '#ec4899', '#14b8a6',
];

function getBoxColor(index) {
    return BOX_COLORS[index % BOX_COLORS.length];
}

// ======== Mobile Detection ========
function isMobileDevice() {
    return /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
           (navigator.maxTouchPoints && navigator.maxTouchPoints > 2);
}

// ======== Connection check ========
async function checkConnection() {
    try {
        const resp = await fetch(`${API_URL}/health`);
        const data = await resp.json();
        if (data.status === 'ok') {
            statusDot.className = 'status-dot connected';
            statusText.textContent = 'Backend Connected';
            return true;
        }
    } catch (e) {
        statusDot.className = 'status-dot error';
        statusText.textContent = 'Backend Offline';
        return false;
    }
}

// ======== Start Detection ========
async function startDetection() {
    // Check backend first
    const connected = await checkConnection();
    if (!connected) {
        alert('Cannot connect to backend at ' + API_URL + '. Make sure the NestJS server is running.');
        return;
    }

    try {
        // Simple camera request - let browser handle permissions
        console.log('🎥 Requesting camera access...');
        const mobile = isMobileDevice();
        console.log('📱 Mobile device detected:', mobile);
        
        let videoConstraints = mobile ? {
            width: { ideal: 640 },
            height: { ideal: 480 },
            facingMode: 'environment'
        } : {
            width: { ideal: 1280 },
            height: { ideal: 720 },
            facingMode: 'environment'
        };

        console.log('📹 Video constraints:', videoConstraints);

        // Direct camera request
        stream = await navigator.mediaDevices.getUserMedia({
            video: videoConstraints,
            audio: false,
        });

        console.log('✅ Camera access granted!');

        video.srcObject = stream;
        
        if (mobile) {
            video.setAttribute('playsinline', 'true');
            video.setAttribute('webkit-playsinline', 'true');
            video.setAttribute('muted', 'true');
        }
        
        await video.play();

        placeholder.classList.add('hidden');
        btnStart.disabled = true;
        btnStop.disabled = false;
        isRunning = true;

        resizeCanvases();
        detectInterval = setInterval(captureAndDetect, DETECT_INTERVAL_MS);

        frameCount = 0;
        fpsTimer = setInterval(() => {
            fpsDisplay.textContent = frameCount;
            frameCount = 0;
        }, 1000);
    } catch (err) {
        console.error('Camera error:', err);
        
        // Simple, clear error messages without complex checks
        let errorMessage = '';
        
        if (err.name === 'NotAllowedError') {
            errorMessage = 'Camera access was denied. Please allow camera access and try again.';
        } else if (err.name === 'NotFoundError') {
            errorMessage = 'No camera found on this device.';
        } else if (err.name === 'NotReadableError') {
            errorMessage = 'Camera is being used by another app. Please close other camera apps and try again.';
        } else if (err.name === 'OverconstrainedError') {
            // Try with basic constraints as fallback
            try {
                stream = await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: false
                });
                
                video.srcObject = stream;
                if (isMobileDevice()) {
                    video.setAttribute('playsinline', 'true');
                    video.setAttribute('webkit-playsinline', 'true');
                    video.setAttribute('muted', 'true');
                }
                await video.play();
                
                placeholder.classList.add('hidden');
                btnStart.disabled = true;
                btnStop.disabled = false;
                isRunning = true;
                resizeCanvases();
                detectInterval = setInterval(captureAndDetect, DETECT_INTERVAL_MS);
                return; // Success with fallback
            } catch (fallbackErr) {
                errorMessage = 'Camera settings not supported. Please try a different browser or device.';
            }
        } else {
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                errorMessage = 'Camera is not supported on this device or browser.';
            } else {
                errorMessage = 'Camera access failed. Please refresh the page and try again.';
            }
        }
        
        alert(errorMessage);
    }
}

// ======== Stop Detection ========
function stopDetection() {
    isRunning = false;

    if (detectInterval) {
        clearInterval(detectInterval);
        detectInterval = null;
    }

    if (fpsTimer) {
        clearInterval(fpsTimer);
        fpsTimer = null;
    }

    if (stream) {
        stream.getTracks().forEach((t) => t.stop());
        stream = null;
    }

    video.srcObject = null;
    overlayCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
    placeholder.classList.remove('hidden');
    btnStart.disabled = false;
    btnStop.disabled = true;
    fpsDisplay.textContent = '—';
    latencyDisplay.textContent = '—';
}

// ======== Resize canvases to match video ========
function resizeCanvases() {
    const rect = video.getBoundingClientRect();
    overlayCanvas.width = rect.width;
    overlayCanvas.height = rect.height;
    captureCanvas.width = video.videoWidth || 640;
    captureCanvas.height = video.videoHeight || 480;
}

// ======== Capture frame and send to API ========
async function captureAndDetect() {
    if (!isRunning || !video.videoWidth) return;

    resizeCanvases();

    // Draw video frame to capture canvas
    captureCtx.drawImage(video, 0, 0, captureCanvas.width, captureCanvas.height);

    // Get base64
    const base64 = captureCanvas.toDataURL('image/jpeg', 0.7);

    const startTime = performance.now();

    try {
        const resp = await fetch(`${API_URL}/detect`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ image: base64 }),
        });

        const data = await resp.json();
        const latency = Math.round(performance.now() - startTime);

        frameCount++;
        latencyDisplay.textContent = `${latency}ms`;
        itemCountDisplay.textContent = data.count;
        totalBadge.textContent = data.count;

        // Draw boxes
        drawDetections(data.items);

        // Update results panel
        updateResultsList(data.items);

        // Add to history
        if (data.items.length > 0) {
            addToHistory(data.items);
        }
    } catch (err) {
        console.error('Detection error:', err);
    }
}

// ======== Draw bounding boxes ========
function drawDetections(items) {
    overlayCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);

    const scaleX = overlayCanvas.width / captureCanvas.width;
    const scaleY = overlayCanvas.height / captureCanvas.height;

    items.forEach((item, i) => {
        const [x, y, w, h] = item.bbox;
        const sx = x * scaleX;
        const sy = y * scaleY;
        const sw = w * scaleX;
        const sh = h * scaleY;

        const color = getBoxColor(i);

        // Draw box
        overlayCtx.strokeStyle = color;
        overlayCtx.lineWidth = 2.5;
        overlayCtx.setLineDash([]);
        overlayCtx.strokeRect(sx, sy, sw, sh);

        // Corner accents
        const cornerLen = Math.min(sw, sh) * 0.15;
        overlayCtx.lineWidth = 4;
        // Top-left
        overlayCtx.beginPath();
        overlayCtx.moveTo(sx, sy + cornerLen);
        overlayCtx.lineTo(sx, sy);
        overlayCtx.lineTo(sx + cornerLen, sy);
        overlayCtx.stroke();
        // Top-right
        overlayCtx.beginPath();
        overlayCtx.moveTo(sx + sw - cornerLen, sy);
        overlayCtx.lineTo(sx + sw, sy);
        overlayCtx.lineTo(sx + sw, sy + cornerLen);
        overlayCtx.stroke();
        // Bottom-left
        overlayCtx.beginPath();
        overlayCtx.moveTo(sx, sy + sh - cornerLen);
        overlayCtx.lineTo(sx, sy + sh);
        overlayCtx.lineTo(sx + cornerLen, sy + sh);
        overlayCtx.stroke();
        // Bottom-right
        overlayCtx.beginPath();
        overlayCtx.moveTo(sx + sw - cornerLen, sy + sh);
        overlayCtx.lineTo(sx + sw, sy + sh);
        overlayCtx.lineTo(sx + sw, sy + sh - cornerLen);
        overlayCtx.stroke();

        // Label background
        const label = `${item.label} ${Math.round(item.score * 100)}%`;
        overlayCtx.font = '600 13px Inter, sans-serif';
        const textWidth = overlayCtx.measureText(label).width;
        const padding = 6;
        const labelHeight = 22;
        const labelY = sy > labelHeight + 4 ? sy - labelHeight - 4 : sy;

        overlayCtx.fillStyle = color;
        overlayCtx.globalAlpha = 0.9;
        overlayCtx.beginPath();
        overlayCtx.roundRect(sx, labelY, textWidth + padding * 2, labelHeight, 4);
        overlayCtx.fill();
        overlayCtx.globalAlpha = 1;

        // Label text
        overlayCtx.fillStyle = '#ffffff';
        overlayCtx.fillText(label, sx + padding, labelY + 15);
    });
}

// ======== Update results list ========
function updateResultsList(items) {
    if (items.length === 0) {
        resultsList.innerHTML = `
      <div class="empty-state">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" opacity="0.3">
          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
          <line x1="3" y1="6" x2="21" y2="6"/>
          <path d="M16 10a4 4 0 0 1-8 0"/>
        </svg>
        <p>No items detected</p>
        <p class="sub">Hold grocery items in front of the camera</p>
      </div>
    `;
        return;
    }

    resultsList.innerHTML = items
        .map(
            (item, i) => `
    <div class="detection-item" style="animation-delay: ${i * 50}ms">
      <div class="item-icon" style="background: ${getBoxColor(i)}">${ITEM_EMOJIS[item.label.toLowerCase()] || '📦'}</div>
      <div class="item-info">
        <div class="item-name">${item.label}</div>
        <div class="item-confidence">
          <div class="confidence-bar">
            <div class="confidence-fill" style="width: ${item.score * 100}%"></div>
          </div>
          <span class="confidence-value">${Math.round(item.score * 100)}%</span>
        </div>
      </div>
    </div>
  `
        )
        .join('');
}

// ======== Add to history ========
function addToHistory(items) {
    const now = new Date();
    const time = now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });

    items.forEach((item) => {
        historyEntries.unshift({
            time,
            label: item.label,
            score: item.score,
        });
    });

    // Keep only last 50 entries
    historyEntries = historyEntries.slice(0, 50);
    renderHistory();
}

function renderHistory() {
    if (historyEntries.length === 0) {
        historyList.innerHTML = `
      <div class="empty-state small">
        <p>Detection events will appear here</p>
      </div>
    `;
        return;
    }

    historyList.innerHTML = historyEntries
        .slice(0, 20)
        .map(
            (entry) => `
    <div class="history-entry">
      <span class="history-time">${entry.time}</span>
      <span class="history-label">${ITEM_EMOJIS[entry.label.toLowerCase()] || '📦'} ${entry.label}</span>
      <span class="history-score">${Math.round(entry.score * 100)}%</span>
    </div>
  `
        )
        .join('');
}

function clearHistory() {
    historyEntries = [];
    renderHistory();
}

// ======== Window resize handler ========
window.addEventListener('resize', () => {
    if (isRunning) resizeCanvases();
});

// ======== Initial connection check ========
checkConnection();
setInterval(checkConnection, 10000);
