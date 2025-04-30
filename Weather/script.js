const TILE_BASE_URL = 'https://a.tile.openstreetmap.org';
const RAIN_URL = 'https://api.rainviewer.com/public/weather-maps.json';

const convertLonToTileX = (longitude, zoomLevel) => {
  return Math.floor(((longitude + 180) / 360) * Math.pow(2, zoomLevel)) - 1;
};

const convertLatToTileY = (latitude, zoomLevel) => {
  const radLat = latitude * (Math.PI / 180);
  const factor = 1 / Math.cos(radLat);
  const y = (1 - Math.log(Math.tan(radLat) + factor) / Math.PI) / 2;
  return Math.floor(y * Math.pow(2, zoomLevel)) - 1;
};

function checkZoom(inputZoom) {
  const issues = [];
  const z = parseInt(inputZoom);
  if (isNaN(z)) {
    issues.push('Zoom має бути цілим числом');
  } else {
    if (z < 0) issues.push('Min value is — 0');
    if (z > 19) issues.push('Max value is — 19');
  }
  return issues;
}

function checkLatitude(inputLat) {
  const problems = [];
  const lat = parseFloat(inputLat);
  if (isNaN(lat)) {
    problems.push('Invalid data');
  }
  return problems;
}

function checkLongitude(inputLon) {
  const issues = [];
  const lon = parseFloat(inputLon);
  if (isNaN(lon) || lon < -180 || lon > 180) {
    issues.push('Invalid data');
  }
  return issues;
}

function displayErrors(groupElem, messages) {
  const list = document.createElement('ul');
  list.className = 'input-errors';
  for (let msg of messages) {
    const li = document.createElement('li');
    li.textContent = msg;
    list.appendChild(li);
  }
  groupElem.querySelector('label').after(list);
}

function clearPreviousErrors(formElement) {
  formElement.querySelectorAll('.input-errors').forEach(el => el.remove());
}

async function getRadarTiles(zoom, x, y, w, h, color = 0) {
  const result = [];
  const response = await fetch(RAIN_URL);
  const json = await response.json();

  const base = json.host;
  const pastFrames = json.radar.past;

  for (let row = y; row < y + h; row++) {
    for (let col = x; col < x + w; col++) {
      const img = document.createElement('img');
      img.src = `${base}${pastFrames[0].path}/256/${zoom}/${col}/${row}/${color}/1_0.png`;
      img.className = 'map-tile';
      result.push(img);
    }
  }

  return result;
}

document.getElementById('mapViewer').addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.target;

  clearPreviousErrors(form);

  const zVal = form.zoom.value;
  const latVal = form.lat.value;
  const lonVal = form.lon.value;

  const zProblems = checkZoom(zVal);
  const latProblems = checkLatitude(latVal);
  const lonProblems = checkLongitude(lonVal);

  if (zProblems.length) displayErrors(form.zoom.parentElement, zProblems);
  if (latProblems.length) displayErrors(form.lat.parentElement, latProblems);
  if (lonProblems.length) displayErrors(form.lon.parentElement, lonProblems);

  if (zProblems.length || latProblems.length || lonProblems.length) return;

  const zoom = Number(zVal) + 1;
  const yStart = convertLatToTileY(Number(latVal), zoom);
  const xStart = convertLonToTileX(Number(lonVal), zoom);

  const baseTiles = [];
  for (let row = yStart; row < yStart + 2; row++) {
    for (let col = xStart; col < xStart + 2; col++) {
      const tileImg = document.createElement('img');
      tileImg.src = `${TILE_BASE_URL}/${zoom}/${col}/${row}.png`;
      tileImg.className = 'map-tile';
      baseTiles.push(tileImg);
    }
  }

  const mapContainer = document.querySelector('#mapViewer .map');
  mapContainer.innerHTML = '';
  baseTiles.forEach(tile => mapContainer.appendChild(tile));

  const radarOverlay = document.createElement('div');
  radarOverlay.className = 'map-radar-layer';

  const radarTiles = await getRadarTiles(zoom, xStart, yStart, 2, 2);
  radarTiles.forEach(t => radarOverlay.appendChild(t));

  mapContainer.appendChild(radarOverlay);
});