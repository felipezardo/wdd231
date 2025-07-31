document.addEventListener("DOMContentLoaded", () => {
  // Update footer with current year and last modified date
  const yearSpan = document.getElementById('year');
  const lastModified = document.getElementById('lastModified');

  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  if (lastModified) {
    lastModified.textContent = `Last Modified: ${document.lastModified}`;
  }

  // Populate hidden timestamp input with page load time
  const timestampInput = document.getElementById("timestamp");
  if (timestampInput) {
    timestampInput.value = new Date().toISOString();
  }

  // Toggle mobile navigation menu
  const menuButton = document.getElementById('menu');
  const nav = document.querySelector('.navigation');

  if (menuButton && nav) {
    menuButton.addEventListener('click', () => {
      nav.classList.toggle('open');
    });
  }

  // Modal open logic
  const modalLinks = document.querySelectorAll('.open-modal');
  modalLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const modalId = link.getAttribute('data-modal');
      const modal = document.getElementById(modalId);
      if (modal) modal.style.display = 'block';
    });
  });

  // Modal close logic
  const closeButtons = document.querySelectorAll('.close');
  closeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const modalId = btn.getAttribute('data-close');
      const modal = document.getElementById(modalId);
      if (modal) modal.style.display = 'none';
    });
  });

  // Close modal when clicking outside the content
  window.addEventListener('click', (e) => {
    document.querySelectorAll('.modal').forEach(modal => {
      if (e.target === modal) {
        modal.style.display = 'none';
      }
    });
  });
});
