document.addEventListener('DOMContentLoaded', () => {
  const tg = window.Telegram?.WebApp;
  if (tg) tg.expand();

  // Фракції
  const factionsData = [
    { name: "НПУ (Національна Поліція)", icon: "🛡️", color: "#2563eb", desc: "Забезпечення правопорядку, затримання злочинців та патрулювання міст." },
    { name: "СБУ (Служба Безпеки)", icon: "🕵️‍♂️", color: "#1e3a8a", desc: "Контррозвідка, боротьба з тероризмом та захист державної таємниці." },
    { name: "ДБР (Державне Бюро Розслідувань)", icon: "⚖️", color: "#475569", desc: "Розслідування злочинів високопосадовців та правоохоронців." },
    { name: "ДСНС (Надзвичайні Ситуації)", icon: "🚒", color: "#dc2626", desc: "Пожежна охорона, рятувальні операції та допомога громадянам." },
    { name: "МВС (Мін. Внутрішніх Справ)", icon: "🏛️", color: "#0284c7", desc: "Координація органів виконавчої влади та внутрішніх справ." },
    { name: "Прокуратура", icon: "📜", color: "#7c3aed", desc: "Підтримання публічного обвинувачення в суді та нагляд за дотриманням законів." },
    { name: "Суд", icon: "👨‍⚖️", color: "#d97706", desc: "Здійснення правосуддя та розгляд кримінальних/цивільних справ." },
    { name: "Адміністрація", icon: "👑", color: "#eab308", desc: "Контроль за дотриманням правил сервера та допомога гравцям." },
    { name: "Founder", icon: "⚡", color: "#ef4444", desc: "Засновники та керівництво проекту UKRAINE HORIZON RP." }
  ];

  const rolesList = ["Громадянин", "НПУ", "СБУ", "ДБР", "ДСНС", "МВС", "Прокуратура", "Суд", "Адміністрація", "Founder", "Розробник сайту 👨‍💻"];

  // Елементи DOM
  const authScreen = document.getElementById('auth-screen');
  const appScreen = document.getElementById('app-screen');
  const loginBtn = document.getElementById('login-btn');
  const usernameInput = document.getElementById('roblox-username-input');
  
  const userAvatar = document.getElementById('user-avatar');
  const userDisplayName = document.getElementById('user-display-name');
  const userRoleBadge = document.getElementById('user-role-badge');
  
  const themeToggle = document.getElementById('theme-toggle');
  const factionsList = document.getElementById('factions-list');

  // Отримати аватрку Roblox
  async function loadRobloxAvatar(username) {
    try {
      const res = await fetch(`https://users.roblox.com/v1/usernames/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usernames: [username], excludeBannedUsers: false })
      });
      const data = await res.json();
      if (data.data && data.data.length > 0) {
        const userId = data.data[0].id;
        userAvatar.src = `https://tr.rbxcdn.com/30df80a74f42813133604f323e031a08/150/150/AvatarHeadshot/Png`;
        return;
      }
    } catch (e) {
      console.log('Помилка завантаження аватара');
    }
    userAvatar.src = 'https://tr.rbxcdn.com/30df80a74f42813133604f323e031a08/150/150/AvatarHeadshot/Png';
  }

  // Авторизація
  loginBtn.addEventListener('click', () => {
    const username = usernameInput.value.trim();
    if (!username) return alert('Введіть свій Roblox Username!');

    localStorage.setItem('horizon_roblox_user', username);
    loginUser(username);
  });

  function loginUser(username) {
    userDisplayName.textContent = username;
    
    // Спеціальна перевірка для розробника
    if (username.toLowerCase() === 'sqw1zy228' || username.toLowerCase() === 'admin') {
      userRoleBadge.textContent = 'Розробник сайту 👨‍💻';
    } else {
      userRoleBadge.textContent = localStorage.getItem(`role_${username}`) || 'Громадянин';
    }

    loadRobloxAvatar(username);

    authScreen.classList.remove('active');
    appScreen.classList.add('active');
  }

  // Перевірка збереженого входу
  const savedUser = localStorage.getItem('horizon_roblox_user');
  if (savedUser) loginUser(savedUser);

  // Рендер фракцій
  factionsData.forEach(fac => {
    const item = document.createElement('div');
    item.className = 'accordion-item';
    item.innerHTML = `
      <div class="accordion-header" style="border-left: 4px solid ${fac.color}">
        <span>${fac.icon} ${fac.name}</span>
        <span>▼</span>
      </div>
      <div class="accordion-body">
        <p>${fac.desc}</p>
      </div>
    `;
    item.querySelector('.accordion-header').addEventListener('click', () => {
      item.classList.toggle('active');
    });
    factionsList.appendChild(item);
  });

  // Таби
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      
      btn.classList.add('active');
      document.getElementById(`tab-${btn.dataset.tab}`).classList.add('active');
    });
  });

  // Перемикач теми
  themeToggle.addEventListener('change', (e) => {
    if (e.target.checked) {
      document.body.classList.remove('light-theme');
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
      document.body.classList.add('light-theme');
    }
  });

  // Модалка анкети
  const applyModal = document.getElementById('apply-modal');
  document.getElementById('open-apply-btn').onclick = () => applyModal.style.display = 'flex';
  document.querySelector('.close-modal').onclick = () => applyModal.style.display = 'none';

  document.getElementById('admin-form').onsubmit = (e) => {
    e.preventDefault();
    alert('Вашу анкету успішно відправлено на розгляд Адміністрації!');
    applyModal.style.display = 'none';
  };

  // Адмін Панель
  const adminModal = document.getElementById('admin-modal');
  const secretBtn = document.getElementById('secret-admin-btn');
  const adminLoginBtn = document.getElementById('admin-login-btn');
  const adminPassInput = document.getElementById('admin-pass-input');
  const adminContent = document.getElementById('admin-panel-content');
  const adminAuthBlock = document.getElementById('admin-auth-block');

  secretBtn.onclick = () => adminModal.style.display = 'flex';
  document.querySelector('.close-admin-modal').onclick = () => adminModal.style.display = 'none';

  adminLoginBtn.onclick = () => {
    if (adminPassInput.value === '1234') {
      adminAuthBlock.style.display = 'none';
      adminContent.style.display = 'block';
      setupAdminRoles();
    } else {
      alert('Невірний пароль!');
    }
  };

  function setupAdminRoles() {
    const select = document.getElementById('adm-role-select');
    select.innerHTML = '';
    rolesList.forEach(r => {
      const opt = document.createElement('option');
      opt.value = r;
      opt.textContent = r;
      select.appendChild(opt);
    });
  }

  document.getElementById('admin-search-btn').onclick = () => {
    const query = document.getElementById('admin-search-input').value.trim();
    if (!query) return;

    document.getElementById('admin-user-result').style.display = 'block';
    document.getElementById('adm-user-name').textContent = `Користувач: ${query}`;
  };

  document.getElementById('adm-save-role').onclick = () => {
    const role = document.getElementById('adm-role-select').value;
    alert(`Роль успішно змінено на ${role}`);
  };

  document.getElementById('adm-ban-btn').onclick = () => {
    alert('Користувача заблоковано!');
  };

  // Вихід
  document.getElementById('logout-btn').onclick = () => {
    localStorage.removeItem('horizon_roblox_user');
    location.reload();
  };
});