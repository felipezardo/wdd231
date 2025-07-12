const directory = document.getElementById('directory');
const yearSpan = document.getElementById('year');
const lastModified = document.getElementById('lastModified');

yearSpan.textContent = new Date().getFullYear();
lastModified.textContent = `Last Modified: ${document.lastModified}`;

// View toggle
document.getElementById('grid').addEventListener('click', () => {
  directory.classList.add('grid-view');
  directory.classList.remove('list-view');
});

document.getElementById('list').addEventListener('click', () => {
  directory.classList.add('list-view');
  directory.classList.remove('grid-view');
});

// Hamburger menu toggle
const menuButton = document.getElementById('menu');
const nav = document.querySelector('.navigation');

menuButton.addEventListener('click', () => {
  nav.classList.toggle('open');
});

// Load member data
async function loadMembers() {
  const response = await fetch('data/members.json');
  const members = await response.json();
  displayMembers(members);
}

function displayMembers(members) {
  directory.innerHTML = '';
  members.forEach(member => {
    const card = document.createElement('div');
    let levelClass = '';
    switch (member.membership) {
      case 1: levelClass = 'member'; break;
      case 2: levelClass = 'silver'; break;
      case 3: levelClass = 'gold'; break;
    }
    card.className = `card ${levelClass}`;
    card.innerHTML = `
      <h3>${member.name}</h3>
      <p>${member.address}</p>
      <p>${member.phone}</p>
      <a href="${member.website}" target="_blank">${member.website}</a>
      <img src="images/${member.image}" alt="${member.name} logo" />
    `;
    directory.appendChild(card);
  });
}

loadMembers();
