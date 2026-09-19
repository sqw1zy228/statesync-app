// Ініціалізація Telegram WebApp SDK
const tg = window.Telegram?.WebApp;
if (tg) {
  tg.ready();
  tg.expand();
}

// Стан додатку
let state = {
  isGuest: true,
  privacyAccepted: false,
  hapticEnabled: true,
  soundEnabled: true,
  userData: {
    tgUser: tg?.initDataUnsafe?.user?.username || tg?.initDataUnsafe?.user?.id || 'guest_user',
    tgAvatar: tg?.initDataUnsafe?.user?.photo_url || 'https://via.placeholder.com/150/262626/FFFFFF?text=TG',
    rbNick: 'Guest_Player',
    rbUser: '@guest_roblox',
    rbId: '00000000',
    rbAvatar: 'https://via.placeholder.com/150/121212/FFFFFF?text=RB'
  }
};

// Елементи DOM
const screenPrivacy = document.getElementById('screen-privacy');
const screenAuth = document.getElementById('screen-auth');
const screenSplash = document.getElementById('screen-splash');
const appMain = document.getElementById('app-main');
const privacyCheck = document.getElementById('privacy-check');
const btnAcceptPrivacy = document.getElementById('btn-accept-privacy');

// Вмикач тактильного відгуку (Haptic)
function triggerHaptic() {
  if (state.hapticEnabled && tg?.HapticFeedback) {
    tg.HapticFeedback.impactOccurred('light');
  }
}

// Ініціалізація додатка
document.addEventListener('DOMContentLoaded', () => {
  // Перевірка acceptance з localStorage
  if (localStorage.getItem('ss_privacy') === 'true') {
    screenPrivacy.classList.add('hidden');
    screenAuth.classList.remove('hidden');
  }

  // Обробка галочки політики
  privacyCheck.addEventListener('change', (e) => {
    btnAcceptPrivacy.disabled = !e.target.checked;
    btnAcceptPrivacy.classList.toggle('opacity-50', !e.target.checked);
    btnAcceptPrivacy.classList.toggle('cursor-not-allowed', !e.target.checked);
  });

  // Кнопка прийняття політики
  btnAcceptPrivacy.addEventListener('click', () => {
    triggerHaptic();
    localStorage.setItem('ss_privacy', 'true');
    screenPrivacy.classList.add('hidden');
    screenAuth.classList.remove('hidden');
  });

  // Вхід через Roblox (Авторизація)
  document.getElementById('btn-login-roblox').addEventListener('click', () => {
    triggerHaptic();
    // Симуляція переходу на авторизацію Roblox
    window.open('https://www.roblox.com/login', '_blank');
    
    // Встановлюємо тестовий Roblox профіль після повернення
    state.isGuest = false;
    state.userData.rbNick = 'Horizon_Agent';
    state.userData.rbUser = '@horizon_agent';
    state.userData.rbId = '482019382';
    state.userData.rbAvatar = 'https://tr.rbxcdn.com/30DAY-AvatarHeadshot-CBD1C3A0105C9B0964D3E6465451D45D-Png/150/150/AvatarHeadshot/Png/noFilter';
    
    startSplashAndLoad();
  });

  // Вхід у Гостьовому режимі
  document.getElementById('btn-guest-mode').addEventListener('click', () => {
    triggerHaptic();
    state.isGuest = true;
    startSplashAndLoad();
  });

  // Копіювання коду сервера
  document.getElementById('btn-copy-code').addEventListener('click', () => {
    triggerHaptic();
    const code = document.getElementById('server-code').innerText;
    navigator.clipboard.writeText(code);
    if (tg?.showAlert) tg.showAlert('Код сервера скопійовано: ' + code);
  });

  // Відкриття профілю при натисканні на аватарку зверху
  document.getElementById('btn-open-header-profile').addEventListener('click', () => {
    triggerHaptic();
    switchTab('profile');
  });

  // Пошук документів
  document.getElementById('doc-search').addEventListener('input', (e) => {
    const val = e.target.value.trim();
    const docs = document.querySelectorAll('#doc-list > div');
    docs.forEach(doc => {
      const id = doc.getAttribute('data-doc-id');
      if (!val || id.includes(val)) {
        doc.classList.remove('hidden');
      } else {
        doc.classList.add('hidden');
      }
    });
  });

  // Налаштування тем
  document.getElementById('toggle-theme').addEventListener('change', (e) => {
    document.documentElement.classList.toggle('dark', e.target.checked);
  });

  // Видалення акаунту
  document.getElementById('btn-delete-account').addEventListener('click', () => {
    triggerHaptic();
    if (confirm('Ви дійсно бажаєте видалити свій акаунт та очистити всі локальні дані?')) {
      localStorage.clear();
      location.reload();
    }
  });
});

// Екран завантаження (Splash)
function startSplashAndLoad() {
  screenAuth.classList.add('hidden');
  screenSplash.classList.remove('hidden');

  setTimeout(() => {
    screenSplash.classList.add('hidden');
    appMain.classList.remove('hidden');
    setupUserDataUI();
  }, 1200);
}

// Заповнення даних користувача в інтерфейсі
function setupUserDataUI() {
  const welcomeText = document.getElementById('welcome-text');
  const headerAvatar = document.getElementById('header-avatar');
  const headerUsername = document.getElementById('header-username');
  
  const profileAvatar = document.getElementById('profile-avatar');
  const profileDisplayName = document.getElementById('profile-display-name');
  const profileSubName = document.getElementById('profile-sub-name');

  if (state.isGuest) {
    welcomeText.innerText = `Вітаємо, ${state.userData.tgUser}!`;
    headerUsername.innerText = state.userData.tgUser;
    headerAvatar.src = state.userData.tgAvatar;

    profileAvatar.src = state.userData.tgAvatar;
    profileDisplayName.innerText = state.userData.tgUser;
    profileSubName.innerText = 'Гостьовий режим (Telegram)';
  } else {
    welcomeText.innerText = `Вітаємо, ${state.userData.rbNick}!`;
    headerUsername.innerText = state.userData.rbNick;
    headerAvatar.src = state.userData.rbAvatar;

    profileAvatar.src = state.userData.rbAvatar;
    profileDisplayName.innerText = state.userData.rbNick;
    profileSubName.innerText = state.userData.rbUser;
  }

  // Інформація в профілі
  document.getElementById('info-rb-nick').innerText = state.userData.rbNick;
  document.getElementById('info-rb-user').innerText = state.userData.rbUser;
  document.getElementById('info-rb-id').innerText = state.userData.rbId;
  document.getElementById('info-tg-user').innerText = `@${state.userData.tgUser}`;
}

// Перемикання вкладок
function switchTab(tabId) {
  triggerHaptic();
  
  document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.classList.remove('text-white', 'active');
    btn.classList.add('text-neutral-500');
  });

  const activeTab = document.getElementById(`tab-${tabId}`);
  if (activeTab) activeTab.classList.remove('hidden');

  const activeBtn = document.querySelector(`.nav-btn[data-tab="${tabId}"]`);
  if (activeBtn) {
    activeBtn.classList.remove('text-neutral-500');
    activeBtn.classList.add('text-white', 'active');
  }
}

// Подача заявки у фракцію
function submitApplication(factionName) {
  triggerHaptic();
  const myApps = document.getElementById('my-applications');
  const time = new Date().toLocaleDateString('uk-UA');
  
  const appItem = document.createElement('div');
  appItem.className = 'p-2 bg-brand-black border border-brand-border rounded-lg mb-1 flex justify-between items-center';
  appItem.innerHTML = `
    <span>Анкета в <b>${factionName}</b> (${time})</span>
    <span class="text-amber-400 font-semibold">На розгляді</span>
  `;

  if (myApps.innerText.includes('Заявок поки немає')) {
    myApps.innerHTML = '';
  }
  myApps.appendChild(appItem);

  if (tg?.showAlert) {
    tg.showAlert(`Заявку до фракції ${factionName} успішно надіслано!`);
  } else {
    alert(`Заявку до фракції ${factionName} успішно надіслано!`);
  }
}