// 📅 Atualiza ano e data de modificação no rodapé
const yearSpan = document.getElementById('year');
const lastModified = document.getElementById('lastModified');

yearSpan.textContent = new Date().getFullYear();
lastModified.textContent = `Last Modified: ${document.lastModified}`;

// 🍔 Alterna o menu mobile
const menuButton = document.getElementById('menu');
const nav = document.querySelector('.navigation');

menuButton.addEventListener('click', () => {
  nav.classList.toggle('open');
});

// ✅ Intercepta envio do formulário (opcional)
const form = document.getElementById('join-form');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Application submitted successfully!');
    form.reset();
  });
}
