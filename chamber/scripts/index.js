// 📅 Footer date updates
const yearSpan = document.getElementById('year');
const lastModified = document.getElementById('lastModified');

yearSpan.textContent = new Date().getFullYear();
lastModified.textContent = `Last Modified: ${document.lastModified}`;

// 🍔 Mobile menu toggle
const menuButton = document.getElementById('menu');
const nav = document.querySelector('.navigation');

menuButton.addEventListener('click', () => {
  nav.classList.toggle('open');
});

// 🌦️ OpenWeatherMap API setup
const apiKey = '73de0c71f889d7d25d5448af30e428b2';
const cityId = '3451190';

const weatherURL = `https://api.openweathermap.org/data/2.5/weather?id=${cityId}&units=metric&lang=en&appid=${apiKey}`;
const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?id=${cityId}&units=metric&lang=en&appid=${apiKey}`;

async function getWeather() {
  try {
    const [currentRes, forecastRes] = await Promise.all([
      fetch(weatherURL),
      fetch(forecastURL),
    ]);

    if (!currentRes.ok || !forecastRes.ok) {
      throw new Error('Weather API request failed');
    }

    const currentData = await currentRes.json();
    const forecastData = await forecastRes.json();

    document.getElementById('temperature').textContent = Math.round(currentData.main.temp);
    document.getElementById('description').textContent = currentData.weather[0].description;

    const forecastElement = document.getElementById('forecast');
    forecastElement.innerHTML = '';

    const today = new Date().getDate();
    const forecastDays = [];

    for (let entry of forecastData.list) {
      const date = new Date(entry.dt_txt);
      const day = date.getDate();

      if (day !== today && !forecastDays.includes(day)) {
        forecastDays.push(day);

        const weekday = date.toLocaleDateString('en-US', { weekday: 'long' });
        const temp = Math.round(entry.main.temp);

        forecastElement.innerHTML += `<li><strong>${weekday}:</strong> ${temp}°C</li>`;
      }

      if (forecastDays.length === 3) break;
    }
  } catch (error) {
    console.error('Failed to fetch weather data:', error);
    document.getElementById('forecast').innerHTML = '<li>Unable to load forecast.</li>';
  }
}

// 💼 Spotlight members (Gold/Silver only)
async function getMembers() {
  try {
    const res = await fetch('data/members.json');
    if (!res.ok) throw new Error('Failed to load member data');

    const data = await res.json();
    const goldSilver = data.filter(member => member.membership >= 2);
    const shuffled = goldSilver.sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, Math.floor(Math.random() * 2) + 2); // 2 or 3

    const container = document.querySelector('.spotlight-container');
    container.innerHTML = '';

    selected.forEach(member => {
      const card = document.createElement('div');
      card.className = 'card spotlight';
      card.innerHTML = `
        <h3>${member.name}</h3>
        <img src="images/${member.image}" alt="${member.name} logo" width="100" height="50" />
        <p><strong>Membership:</strong> ${member.membership === 3 ? 'Gold' : 'Silver'}</p>
        <p><strong>Phone:</strong> ${member.phone}</p>
        <p><strong>Address:</strong> ${member.address}</p>
        <a href="${member.website}" target="_blank">${member.website}</a>
      `;
      container.appendChild(card);
    });
  } catch (error) {
    console.error('Failed to load spotlight members:', error);
  }
}

// 🚀 Initialize
getWeather();
getMembers();
