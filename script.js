// IndexedDB wrapper for iframe-safe storage
const DB_NAME = 'SportStatsDB';
const DB_VERSION = 1;
const STORE_NAME = 'appData';
let db;

// Initialize IndexedDB
function initDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onerror = () => reject(request.error);
        request.onsuccess = () => {
            db = request.result;
            resolve(db);
        };

        request.onupgradeneeded = (event) => {
            const database = event.target.result;
            if (!database.objectStoreNames.contains(STORE_NAME)) {
                database.createObjectStore(STORE_NAME);
            }
        };
    });
}

// Save data to IndexedDB
function saveData(key, value) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.put(value, key);

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
}

// Load data from IndexedDB
function loadData(key) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.get(key);

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

// Data storage in memory
let activityData = [45, 60, 55, 70, 80, 90, 75];
let chart;
let appData = {
    streak: 14,
    steps: 10000,
    percentile: 86,
    calories: 2450,
    distance: 8.5,
    activeMinutes: 127,
    activity: [45, 60, 55, 70, 80, 90, 75]
};
let profileData = {
    name: "Nume Prenume",
    age: 25,
    education: "Studiez la Instituția ta"
};

// Initialize
document.addEventListener('DOMContentLoaded', async function() {
    await initDB();
    updateDots(appData.streak);
    initChart();
    await loadFromStorage();
});

// Load data from IndexedDB
async function loadFromStorage() {
    try {
        const storedAppData = await loadData('appData');
        const storedProfileData = await loadData('profileData');

        if (storedAppData) {
            appData = storedAppData;
            document.getElementById('streakNumber').textContent = appData.streak;
            document.getElementById('stepsNumber').textContent = formatSteps(appData.steps);
            document.getElementById('percentile').textContent = appData.percentile + '%';
            document.getElementById('caloriesNumber').textContent = appData.calories.toLocaleString();
            document.getElementById('distanceNumber').textContent = appData.distance;
            document.getElementById('activeMinutesNumber').textContent = appData.activeMinutes;
            activityData = appData.activity;
            updateDots(appData.streak);
            updateChart();
        }

        if (storedProfileData) {
            profileData = storedProfileData;
            updateProfileUI();
        }
    } catch (error) {
        console.error('Error loading data:', error);
    }
}

// Save data to IndexedDB
async function saveToStorage() {
    try {
        appData = {
            streak: parseInt(document.getElementById('streakNumber').textContent),
            steps: parseSteps(document.getElementById('stepsNumber').textContent),
            percentile: parseInt(document.getElementById('percentile').textContent),
            calories: parseInt(document.getElementById('caloriesNumber').textContent.replace(/,/g, '')),
            distance: parseFloat(document.getElementById('distanceNumber').textContent),
            activeMinutes: parseInt(document.getElementById('activeMinutesNumber').textContent),
            activity: activityData
        };

        profileData = {
            name: document.getElementById('profileName').textContent,
            age: parseInt(document.getElementById('profileAge').textContent),
            education: document.getElementById('profileEducation').textContent
        };

        await saveData('appData', appData);
        await saveData('profileData', profileData);
    } catch (error) {
        console.error('Error saving data:', error);
    }
}

// Update profile UI elements
function updateProfileUI() {
    document.getElementById('profileName').textContent = profileData.name;
    document.getElementById('profileAge').textContent = profileData.age + ' ani';
    document.getElementById('profileEducation').textContent = profileData.education;

    const initial = profileData.name.charAt(0).toUpperCase();
    document.getElementById('avatarInitial').textContent = initial;
    document.getElementById('profileAvatar').textContent = initial;
}

// Format steps (10000 -> 10k)
function formatSteps(steps) {
    if (steps >= 1000) {
        return (steps / 1000).toFixed(steps % 1000 === 0 ? 0 : 1) + 'k';
    }
    return steps.toString();
}

// Parse steps (10k -> 10000)
function parseSteps(stepsStr) {
    if (stepsStr.includes('k')) {
        return parseInt(parseFloat(stepsStr) * 1000);
    }
    return parseInt(stepsStr);
}

// Update dots display
function updateDots(count) {
    const container = document.getElementById('dotsContainer');
    container.innerHTML = '';

    for (let row = 0; row < 2; row++) {
        for (let i = 0; i < 15; i++) {
            const dot = document.createElement('div');
            dot.className = 'dot';
            const dotIndex = row * 15 + i;
            if (dotIndex < count) {
                dot.classList.add('filled');
            }
            container.appendChild(dot);
        }
    }
}

// Initialize Chart
function initChart() {
    const ctx = document.getElementById('activityChart').getContext('2d');
    chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Lun', 'Mar', 'Mie', 'Joi', 'Vin', 'Sâm', 'Dum'],
            datasets: [{
                label: 'Minute active',
                data: activityData,
                backgroundColor: activityData.map((_, i) => i === 6 ? '#FF6B35' : '#ffffff'),
                borderRadius: 10,
                borderSkipped: false,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: '#1a1a1a',
                    titleColor: '#fff',
                    bodyColor: '#fff',
                    borderColor: '#FF6B35',
                    borderWidth: 2,
                    padding: 12,
                    displayColors: false,
                    callbacks: {
                        label: function(context) {
                            return context.parsed.y + ' min';
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: '#2a2a2a',
                        drawBorder: false
                    },
                    ticks: {
                        color: '#888',
                        font: {
                            size: 11
                        },
                        callback: function(value) {
                            return value + 'min';
                        }
                    }
                },
                x: {
                    grid: {
                        display: false,
                        drawBorder: false
                    },
                    ticks: {
                        color: '#888',
                        font: {
                            size: 12
                        }
                    }
                }
            }
        }
    });
}

// Update Chart
function updateChart() {
    chart.data.datasets[0].data = activityData;
    chart.data.datasets[0].backgroundColor = activityData.map((_, i) =>
        i === 6 ? '#FF6B35' : '#ffffff'
    );
    chart.update();
}

// Modal functions
function editStreak() {
    document.getElementById('streakInput').value = document.getElementById('streakNumber').textContent;
    document.getElementById('streakModal').classList.remove('hidden');
}

function editSteps() {
    const steps = parseSteps(document.getElementById('stepsNumber').textContent);
    document.getElementById('stepsInput').value = steps;
    document.getElementById('percentileInput').value = document.getElementById('percentile').textContent;
    document.getElementById('stepsModal').classList.remove('hidden');
}

function editActivity() {
    document.getElementById('actMon').value = activityData[0];
    document.getElementById('actTue').value = activityData[1];
    document.getElementById('actWed').value = activityData[2];
    document.getElementById('actThu').value = activityData[3];
    document.getElementById('actFri').value = activityData[4];
    document.getElementById('actSat').value = activityData[5];
    document.getElementById('actSun').value = activityData[6];
    document.getElementById('activityModal').classList.remove('hidden');
}

function addCustomStat() {
    document.getElementById('customStatModal').classList.remove('hidden');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.add('hidden');
}

// Save functions
async function saveStreak() {
    const value = parseInt(document.getElementById('streakInput').value);
    if (value >= 0 && value <= 30) {
        document.getElementById('streakNumber').textContent = value;
        updateDots(value);
        await saveToStorage();
        closeModal('streakModal');
    }
}

async function saveSteps() {
    const steps = parseInt(document.getElementById('stepsInput').value);
    const percentile = parseInt(document.getElementById('percentileInput').value);

    if (steps >= 0 && percentile >= 0 && percentile <= 100) {
        document.getElementById('stepsNumber').textContent = formatSteps(steps);
        document.getElementById('percentile').textContent = percentile + '%';
        await saveToStorage();
        closeModal('stepsModal');
    }
}

async function saveActivity() {
    activityData = [
        parseInt(document.getElementById('actMon').value),
        parseInt(document.getElementById('actTue').value),
        parseInt(document.getElementById('actWed').value),
        parseInt(document.getElementById('actThu').value),
        parseInt(document.getElementById('actFri').value),
        parseInt(document.getElementById('actSat').value),
        parseInt(document.getElementById('actSun').value)
    ];
    updateChart();
    await saveToStorage();
    closeModal('activityModal');
}

function saveCustomStat() {
    const name = document.getElementById('customStatName').value;
    const value = document.getElementById('customStatValue').value;
    const unit = document.getElementById('customStatUnit').value;
    const icon = document.getElementById('customStatIcon').value;

    if (name && value) {
        const iconMap = {
            clock: '⏰',
            heart: '❤️',
            fire: '🔥',
            water: '💧',
            muscle: '💪',
            trophy: '🏆'
        };

        const statsContainer = document.getElementById('additionalStats');
        const newStat = document.createElement('div');
        newStat.className = 'stat-card p-6';
        newStat.innerHTML = `
            <div class="flex items-center gap-2 mb-3">
                <span class="text-2xl">${iconMap[icon]}</span>
                <span class="text-gray-400 text-sm">${name}</span>
            </div>
            <div class="text-4xl font-bold text-white mb-2">${value}</div>
            <div class="text-gray-500 text-sm">${unit}</div>
        `;
        statsContainer.appendChild(newStat);

        document.getElementById('customStatName').value = '';
        document.getElementById('customStatValue').value = '';
        document.getElementById('customStatUnit').value = '';

        closeModal('customStatModal');
    }
}

// Close modals on outside click
document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', function(e) {
        if (e.target === this) {
            this.classList.add('hidden');
        }
    });
});

// Toggle mobile menu
function toggleMobileMenu() {
    const menu = document.getElementById('mobileMenu');
    menu.classList.toggle('open');
}

// Show profile modal
function showProfile() {
    updateProfileUI();
    document.getElementById('profileModal').classList.remove('hidden');
}

// Edit profile
function editProfile() {
    document.getElementById('editProfileName').value = profileData.name;
    document.getElementById('editProfileAge').value = profileData.age;
    document.getElementById('editProfileEducation').value = profileData.education;
    closeModal('profileModal');
    document.getElementById('editProfileModal').classList.remove('hidden');
}

// Save profile
async function saveProfile() {
    const name = document.getElementById('editProfileName').value;
    const age = parseInt(document.getElementById('editProfileAge').value);
    const education = document.getElementById('editProfileEducation').value;

    if (name && age && education) {
        profileData.name = name;
        profileData.age = age;
        profileData.education = education;

        updateProfileUI();

        await saveToStorage();

        closeModal('editProfileModal');
    }
}
