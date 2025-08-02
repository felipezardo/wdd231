// Mensagem personalizada com localStorage
const visitContainer = document.querySelector('.visit-message');
const today = Date.now();
const lastVisit = localStorage.getItem('lastVisit');

if (!lastVisit) {
  visitContainer.textContent = 'Welcome! Let us know if you have any questions.';
} else {
  const daysPassed = Math.floor((today - lastVisit) / (1000 * 60 * 60 * 24));
  if (daysPassed < 1) {
    visitContainer.textContent = 'Back so soon! Awesome!';
  } else {
    visitContainer.textContent = `You last visited ${daysPassed} day(s) ago.`;
  }
}

localStorage.setItem('lastVisit', today);

// Gerar os cards dinamicamente
const cardContainer = document.getElementById('attraction-cards');

async function loadAttractions() {
  try {
    const response = await fetch('data/attractions.json');
    const data = await response.json();

    data.forEach(item => {
      const card = document.createElement('div');
      card.className = 'card';

      card.innerHTML = `
        <h2>${item.name}</h2>
        <figure>
          <img src="${item.image}" alt="${item.name}" width="300" height="200" loading="lazy" />
        </figure>
        <address>${item.address}</address>
        <p>${item.description}</p>
        <button>Learn More</button>
      `;

      cardContainer.appendChild(card);
    });
  } catch (error) {
    console.error('Error loading cards:', error);
    cardContainer.innerHTML = '<p>Unable to load locations at this time.</p>';
  }
}

loadAttractions();

//  Mobile menu toggle 
const menuButton = document.getElementById('menu');
const nav = document.querySelector('.navigation');

menuButton?.addEventListener('click', () => {
  nav.classList.toggle('open');
});
