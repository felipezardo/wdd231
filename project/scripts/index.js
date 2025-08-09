document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("menu-toggle");
  const navLinks = document.getElementById("nav-links");

  toggle.addEventListener("click", () => {
    navLinks.classList.toggle("open");
  });
});

// Function to show a toast message
document.querySelector('form').addEventListener('submit', function(e) {
  e.preventDefault();

  // Simula envio (você pode colocar lógica real aqui)
  showToast("✅ Tip sent successfully!");

  // Limpa o formulário
  this.reset();
});

function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.remove('hidden');
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
    toast.classList.add('hidden');
  }, 3000); // 3 segundos
}
