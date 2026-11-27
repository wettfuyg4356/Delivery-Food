/* ============================================================================
   script.js — логика сайта.

   Блоки:
     1. Корзина (localStorage, счётчик, выдвижная панель)
     2. Страница меню (страна + вкладки категорий + карточки блюд)
     3. Мелкие детали (картинки, год, Escape)

   Данные лежат в data.js, стили — в style.css. Здесь только поведение.
   ============================================================================ */

/* Если картинка не загрузилась, показываем запасную иконку вместо пустого места.
   Все пути теперь относительные и латиницей, но запасной вариант не мешает. */
const FALLBACK_IMAGE = 'img/free-icon-food-and-restaurant-mega-pack-color-8210711.png';

function fixBrokenImage(image) {
  if (!(image instanceof HTMLImageElement)) return;
  if (image.dataset.fallbackUsed) return;
  image.dataset.fallbackUsed = '1';
  image.src = FALLBACK_IMAGE;
}

document.addEventListener('error', event => fixBrokenImage(event.target), true);

// На всякий случай проверяем уже загруженные картинки после сборки страницы.
function fixAlreadyBrokenImages() {
  document.querySelectorAll('img').forEach(img => {
    if (img.complete && img.naturalWidth === 0) fixBrokenImage(img);
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  'use strict';

  /* Сначала пробуем взять данные из базы (Laravel отдаёт /api/site-data).
     Если сервер выключен или база недоступна — остаётся data.js. */
  try {
    const response = await fetch('api/site-data', { cache: 'no-store' });
    if (response.ok) {
      const fromDatabase = await response.json();
      if (fromDatabase && fromDatabase.cuisines && fromDatabase.cities && fromDatabase.menus) {
        SITE_DATA = fromDatabase;
      }
    }
  } catch (error) {
    // Тихо используем резервный data.js
  }

  /* ==========================================================================
     1. КОРЗИНА

     Сохраняем массив товаров в localStorage под ключом df_cart_v1.
     Старый ключ df_cart из первой версии сайта не теряется — товары
     переносятся в новый формат при первой загрузке.
     ========================================================================== */

  const CART_KEY = 'df_cart_v1';
  const OLD_CART_KEY = 'df_cart';
  const ADDRESS_KEY = 'df_address';
  const NAME_KEY = 'df_name';
  const PHONE_KEY = 'df_phone';

  // Обёртки вокруг localStorage: в приватном режиме доступ к нему может быть
  // запрещён, поэтому ошибки просто игнорируются.
  function readStorage(key) {
    try { return localStorage.getItem(key); } catch (error) { return null; }
  }
  function writeStorage(key, value) {
    try { localStorage.setItem(key, value); } catch (error) { /* недоступно */ }
  }
  function removeStorage(key) {
    try { localStorage.removeItem(key); } catch (error) { /* недоступно */ }
  }

  // Приводим сохранённые товары к понятному и безопасному виду.
  function cleanCart(value) {
    if (!Array.isArray(value)) return [];
    return value
      .filter(item => item && item.id !== undefined && Number.isFinite(Number(item.price)))
      .map(item => ({
        id: item.id,
        name: String(item.name || 'Блюдо'),
        price: Number(item.price),
        count: Math.max(1, parseInt(item.count, 10) || 1),
        image: String(item.image || item.img || '')
      }));
  }

  // Загружаем корзину. Если есть данные старого формата — забираем их оттуда.
  function loadCart() {
    let raw = readStorage(CART_KEY);
    if (raw === null) {
      const old = readStorage(OLD_CART_KEY);
      if (old) {
        writeStorage(CART_KEY, old);
        raw = old;
      }
    }
    try {
      return cleanCart(JSON.parse(raw));
    } catch (error) {
      return [];
    }
  }

  let cart = loadCart();

  const drawer = document.getElementById('cartDrawer');
  const scrim = document.getElementById('scrim');
  const cartItems = document.getElementById('cartItems');
  const cartTotal = document.getElementById('cartTotal');
  const cartCounters = document.querySelectorAll('.cart-count');
  const checkoutButton = document.getElementById('checkout');
  const addressInput = document.getElementById('deliveryAddress');
  const toast = document.getElementById('toast');

  const money = value => `${Number(value).toLocaleString('ru-RU')} ₽`;

  // Уведомление внизу экрана
  let toastTimer;
  function showToast(text) {
    if (!toast) return;
    toast.textContent = text;
    toast.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 2800);
  }

  // Перерисовываем содержимое корзины и счётчик в шапке
  function renderCart() {
    const count = cart.reduce((sum, item) => sum + item.count, 0);
    const total = cart.reduce((sum, item) => sum + item.price * item.count, 0);

    cartCounters.forEach(el => {
      el.textContent = count;
      el.classList.toggle('has-items', count > 0);
    });
    if (cartTotal) cartTotal.textContent = money(total);
    if (checkoutButton) checkoutButton.disabled = cart.length === 0;
    if (!cartItems) return;

    if (cart.length === 0) {
      cartItems.innerHTML = '<p class="cart-empty">Корзина пуста. Выберите кухню и добавьте блюда.</p>';
      return;
    }

    cartItems.innerHTML = cart.map(item => `
      <div class="cart-item">
        <img src="${item.image}" alt="${item.name}" loading="lazy">
        <div class="cart-item__info">
          <strong>${item.name}</strong>
          <span>${money(item.price)}</span>
        </div>
        <div class="qty">
          <button type="button" data-cart-id="${item.id}" data-delta="-1" aria-label="Уменьшить количество">−</button>
          <span>${item.count}</span>
          <button type="button" data-cart-id="${item.id}" data-delta="1" aria-label="Увеличить количество">+</button>
        </div>
        <button class="cart-item__remove" type="button" data-remove="${item.id}" aria-label="Удалить ${item.name}">×</button>
      </div>
    `).join('');
  }

  // Сохраняем корзину и обновляем интерфейс
  function saveCart() {
    writeStorage(CART_KEY, JSON.stringify(cart));
    renderCart();
  }

  // --

  // Ищем блюдо во всех кухнях: id у блюд уникальный (it-01, ru-01 и т.д.)
  function findDish(id) {
    for (const menu of Object.values(SITE_DATA.menus)) {
      const dish = menu.dishes.find(item => item.id === id);
      if (dish) return dish;
    }
    return null;
  }

  function addToCart(id) {
    const dish = findDish(id);
    if (!dish) return;

    const found = cart.find(item => item.id === dish.id);
    if (found) {
      found.count += 1;
    } else {
      cart.push({
        id: dish.id,
        name: dish.name,
        price: dish.price,
        count: 1,
        image: dish.image
      });
    }

    saveCart();
    showToast(`«${dish.name}» — в корзине`);
  }

  function changeCount(id, delta) {
    const index = cart.findIndex(item => item.id === id);
    if (index === -1) return;

    cart[index].count += Number(delta);
    if (cart[index].count <= 0) cart.splice(index, 1);
    saveCart();
  }

  function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    saveCart();
  }

  function clearCart() {
    cart = [];
    removeStorage(CART_KEY);
    renderCart();
  }

  // Публичные функции — можно вызвать из консоли браузера: addToCart('ru-01')
  window.addToCart = addToCart;
  window.changeCount = changeCount;
  window.removeFromCart = removeFromCart;
  window.clearCart = clearCart;
  window.getCart = () => cart.map(item => Object.assign({}, item));

  // Открытие / закрытие корзины
  function openCart() {
    if (!drawer) return;
    drawer.classList.add('is-open');
    scrim?.classList.add('is-open');
    document.body.classList.add('no-scroll');
  }
  function closeCart() {
    drawer?.classList.remove('is-open');
    scrim?.classList.remove('is-open');
    document.body.classList.remove('no-scroll');
  }

  // Один обработчик на все кнопки с data-атрибутами
  document.addEventListener('click', event => {
    if (event.target.closest('[data-cart-open]')) { openCart(); return; }
    if (event.target.closest('[data-cart-close]')) { closeCart(); return; }

    const addButton = event.target.closest('[data-add-to-cart]');
    if (addButton) { addToCart(addButton.dataset.addToCart); return; }

    const countButton = event.target.closest('[data-delta]');
    if (countButton) { changeCount(countButton.dataset.cartId, countButton.dataset.delta); return; }

    const removeButton = event.target.closest('[data-remove]');
    if (removeButton) { removeFromCart(removeButton.dataset.remove); }
  });

  scrim?.addEventListener('click', closeCart);

  // Если в другой вкладке изменилась корзина — подтягиваем её сюда
  window.addEventListener('storage', event => {
    if (event.key !== CART_KEY && event.key !== OLD_CART_KEY) return;
    try {
      cart = cleanCart(JSON.parse(event.newValue || '[]'));
    } catch (error) {
      cart = [];
    }
    renderCart();
  });

  // Данные клиента сохраняем в браузере, чтобы не вводить их каждый раз
  const nameInput = document.getElementById('customerName');
  const phoneInput = document.getElementById('customerPhone');
  const commentInput = document.getElementById('orderComment');

  const savedAddress = readStorage(ADDRESS_KEY);
  if (addressInput && savedAddress) addressInput.value = savedAddress;
  const savedName = readStorage(NAME_KEY);
  if (nameInput && savedName) nameInput.value = savedName;
  const savedPhone = readStorage(PHONE_KEY);
  if (phoneInput && savedPhone) phoneInput.value = savedPhone;

  addressInput?.addEventListener('change', () => writeStorage(ADDRESS_KEY, addressInput.value.trim()));
  nameInput?.addEventListener('change', () => writeStorage(NAME_KEY, nameInput.value.trim()));
  phoneInput?.addEventListener('change', () => writeStorage(PHONE_KEY, phoneInput.value.trim()));

  let checkoutInProgress = false;

  // Оформление заказа: отправляем корзину в Laravel, он пишет заказ в MySQL.
  checkoutButton?.addEventListener('click', async () => {
    if (!cart.length || checkoutInProgress) return;

    const customerName = nameInput?.value.trim() || '';
    const phone = phoneInput?.value.trim() || '';
    const address = addressInput?.value.trim() || '';

    if (!customerName) {
      showToast('Укажите ваше имя');
      nameInput?.focus();
      return;
    }
    if (!phone) {
      showToast('Укажите телефон для курьера');
      phoneInput?.focus();
      return;
    }
    if (!address) {
      showToast('Укажите адрес доставки');
      addressInput?.focus();
      return;
    }

    // На GitHub Pages нет PHP и MySQL — заказ там сохранить нельзя.
    if (location.hostname.endsWith('github.io')) {
      showToast('Это статическая версия. Заказ работает на локальном сайте с MAMP');
      return;
    }

    checkoutInProgress = true;
    checkoutButton.disabled = true;
    const oldLabel = checkoutButton.textContent;
    checkoutButton.textContent = 'Отправляем заказ…';

    try {
      // Получаем CSRF-токен из Laravel — без него POST будет отклонён.
      const tokenResponse = await fetch('api/token', { cache: 'no-store' });
      const tokenData = await tokenResponse.json();

      const response = await fetch('api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-CSRF-TOKEN': tokenData.token || '',
        },
        body: JSON.stringify({
          customer_name: customerName,
          phone: phone,
          address: address,
          comment: commentInput?.value.trim() || '',
          // Отправляем только ключ и количество — цену сервер возьмёт из базы.
          items: cart.map(item => ({ id: item.id, count: item.count })),
        }),
      });

      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.message || 'Не удалось оформить заказ');

      writeStorage(NAME_KEY, customerName);
      writeStorage(PHONE_KEY, phone);
      writeStorage(ADDRESS_KEY, address);

      showToast(`Заказ №${result.order_id} принят! Сумма ${money(result.total)}`);
      if (commentInput) commentInput.value = '';
      clearCart();
      closeCart();
    } catch (error) {
      showToast(error.message || 'Ошибка соединения с сервером');
    } finally {
      checkoutInProgress = false;
      checkoutButton.textContent = oldLabel;
      renderCart();
    }
  });

  renderCart();

  /* ==========================================================================
     2. СТРАНИЦА МЕНЮ

     Адрес вида menu.html?cuisine=russian&city=moscow:
       cuisine — какая кухня открыта,
       city    — город, если пришли с карточки города.

     Вкладки категорий берутся из SITE_DATA.menus[cuisine].categories,
     поэтому у каждой страны свой набор: у русской — супы и пирожки,
     у японской — роллы и мисо, и так далее.
     ========================================================================== */

  const menuGrid = document.getElementById('menuGrid');

  if (menuGrid) {
    const params = new URLSearchParams(window.location.search);
    const cityKey = params.get('city');
    const city = SITE_DATA.cities.find(item => item.key === cityKey);

    // Если кухня не задана или не найдена — открываем первую из списка
    let cuisineKey = params.get('cuisine');
    if (!SITE_DATA.menus[cuisineKey]) cuisineKey = SITE_DATA.cuisines[0].key;

    const cuisine = SITE_DATA.cuisines.find(item => item.key === cuisineKey);
    const menu = SITE_DATA.menus[cuisineKey];

    // Ссылка на другую страну сохраняет выбранный город
    function menuUrl(key) {
      return `menu.html?cuisine=${key}${city ? `&city=${city.key}` : ''}`;
    }

    // Заголовок страницы
    document.getElementById('cuisineTitle').textContent = `${cuisine.name} кухня`;
    document.getElementById('cuisineNative').textContent = cuisine.native;
    document.title = `${cuisine.name} кухня — Delivery Food`;

    const cityBadge = document.getElementById('cityBadge');
    if (city && cityBadge) {
      cityBadge.querySelector('b').textContent = city.name;
      cityBadge.hidden = false;
    }

    // Вкладки стран — их можно переключать прямо в меню
    const countryTabs = document.getElementById('countryTabs');
    countryTabs.innerHTML = SITE_DATA.cuisines.map(item => `
      <a class="tab${item.key === cuisineKey ? ' is-active' : ''}" href="${menuUrl(item.key)}">${item.name}</a>
    `).join('');

    // Вкладки категорий — зависят от выбранной кухни
    const categoryTabs = document.getElementById('categoryTabs');
    categoryTabs.innerHTML = menu.categories.map((category, index) => `
      <button class="tab${index === 0 ? ' is-active' : ''}" type="button" data-category="${category}">${category}</button>
    `).join('');

    // Карточки блюд
    function renderDishes(category) {
      const dishes = category
        ? menu.dishes.filter(dish => dish.category === category)
        : menu.dishes;

      menuGrid.innerHTML = dishes.map(dish => `
        <article class="dish-card">
          <div class="dish-card__media">
            <img src="${dish.image}" alt="${dish.alt}" loading="lazy">
          </div>
          <div class="dish-card__body">
            <span class="dish-card__category">${dish.category}</span>
            <h3 class="dish-card__title">${dish.name}</h3>
            <div class="dish-card__foot">
              <span class="dish-card__price">${money(dish.price)}</span>
              <button class="button button--dark button--small" type="button" data-add-to-cart="${dish.id}">
                В корзину
              </button>
            </div>
          </div>
        </article>
      `).join('');
    }

    categoryTabs.addEventListener('click', event => {
      const tab = event.target.closest('[data-category]');
      if (!tab) return;
      categoryTabs.querySelectorAll('.tab').forEach(item => item.classList.remove('is-active'));
      tab.classList.add('is-active');
      renderDishes(tab.dataset.category);
    });

    renderDishes(menu.categories[0]);
  }

  /* ==========================================================================
     3. МЕЛКИЕ ДЕТАЛИ
     ========================================================================== */

  // Повторно проверяем картинки после того, как меню отрисовано.
  // Когда вы добавите файлы в папку img, всё отобразится автоматически.
  fixAlreadyBrokenImages();

  // Escape закрывает корзину
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeCart();
  });

  // Год в подвале
  document.querySelectorAll('[data-year]').forEach(el => {
    el.textContent = new Date().getFullYear();
  });
});
