const menuButton = document.querySelector('.menu-button');
const menu = document.querySelector('#mobile-menu');
menuButton.addEventListener('click', () => {
  const expanded = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!expanded));
  menuButton.setAttribute('aria-label', expanded ? 'Відкрити меню' : 'Закрити меню');
  menu.hidden = expanded;
});
menu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  menu.hidden = true;
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Відкрити меню');
}));

const basePrices = {13:600, 14:650, 15:700, 16:800, 17:900, 18:1000, 19:1200, 20:1400};
let selectedSize = 16;
const serviceSelect = document.querySelector('#price-service');
const vehicleSelect = document.querySelector('#vehicle-type');
const priceAmount = document.querySelector('#price-amount');
const priceUnit = document.querySelector('#price-unit');
const priceIncludes = document.querySelector('#price-includes');
const bookingService = document.querySelector('#booking-service');
const bookingSize = document.querySelector('#booking-size');

function updatePrice() {
  const type = serviceSelect.value;
  let amount = basePrices[selectedSize] + (vehicleSelect.value === 'suv' ? 200 : 0);
  if (type === 'balance') amount = Math.round(amount * 0.5 / 50) * 50;
  if (type === 'repair') amount = 200 + (vehicleSelect.value === 'suv' ? 50 : 0);
  priceAmount.textContent = (type === 'repair' ? 'від ' : '') + new Intl.NumberFormat('uk-UA').format(amount);
  priceUnit.textContent = type === 'repair' ? 'за 1 колесо · після огляду' : `за 4 колеса · R${selectedSize}${selectedSize === 20 ? '+' : ''}`;
  const includes = type === 'seasonal' ? ['Зняття та встановлення коліс', 'Демонтаж і монтаж шин', 'Балансування'] : type === 'balance' ? ['Зняття та встановлення коліс', 'Балансування коліс', 'Перевірка тиску'] : ['Огляд пошкодження', 'Ремонт за можливості', 'Перевірка герметичності'];
  priceIncludes.replaceChildren();
  const title = document.createElement('p');
  title.textContent = type === 'repair' ? 'Приклад робіт після огляду:' : 'У прикладі комплексу:';
  priceIncludes.append(title);
  includes.forEach(text => {
    const row = document.createElement('div');
    const label = document.createElement('span');
    const check = document.createElement('span');
    label.textContent = text; check.textContent = '✓'; check.setAttribute('aria-hidden','true');
    row.append(label, check); priceIncludes.append(row);
  });
}
document.querySelectorAll('[data-size]').forEach(button => button.addEventListener('click', () => {
  selectedSize = Number(button.dataset.size);
  document.querySelectorAll('[data-size]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
  updatePrice();
}));
serviceSelect.addEventListener('change', updatePrice);
vehicleSelect.addEventListener('change', updatePrice);
document.querySelectorAll('.service-price-link').forEach(link => link.addEventListener('click', () => {
  serviceSelect.value = link.dataset.service;
  updatePrice();
}));
document.querySelector('#price-book').addEventListener('click', () => {
  bookingSize.value = String(selectedSize);
  bookingService.value = serviceSelect.value;
});

const form = document.querySelector('#booking-form');
const phone = document.querySelector('#customer-phone');
const phoneError = document.querySelector('#phone-error');
const success = document.querySelector('#form-success');
phone.addEventListener('input', () => { phone.removeAttribute('aria-invalid'); phoneError.hidden = true; phone.setCustomValidity(''); });
form.addEventListener('submit', event => {
  event.preventDefault();
  const digits = phone.value.replace(/\D/g, '');
  const validPhone = /^0\d{9}$/.test(digits) || /^380\d{9}$/.test(digits);
  if (!validPhone) {
    phone.setAttribute('aria-invalid', 'true');
    phoneError.hidden = false;
    phone.focus();
    return;
  }
  const name = document.querySelector('#customer-name');
  if (!name.value.trim()) { name.setCustomValidity('Вкажіть ваше ім’я.'); name.reportValidity(); return; }
  const service = bookingService.selectedOptions[0].textContent;
  const size = bookingSize.selectedOptions[0].textContent;
  document.querySelector('#success-summary').textContent = `${name.value.trim()} · ${phone.value.trim()}\n${service} · ${size}`;
  form.hidden = true;
  success.hidden = false;
  success.focus({preventScroll:true});
});
document.querySelector('#customer-name').addEventListener('input', event => event.target.setCustomValidity(''));
document.querySelector('#reset-form').addEventListener('click', () => {
  success.hidden = true;
  form.hidden = false;
  document.querySelector('#customer-name').focus({preventScroll:true});
});
updatePrice();
