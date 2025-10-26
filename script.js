// ---------- CLASS 1: API HANDLER ----------
class WeatherAPI {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseUrl = 'https://api.openweathermap.org/data/2.5/weather';
  }

  async fetchWeather(city) {
    const url = `${this.baseUrl}?q=${encodeURIComponent(city)}&appid=${this.apiKey}&units=metric`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('City not found');
    }
    return response.json();
  }
}

// ---------- CLASS 2: UI MANAGER ----------
class UIManager {
  constructor() {
    this.location = document.getElementById('location');
    this.icon = document.getElementById('icon');
    this.temp = document.getElementById('temp');
    this.desc = document.getElementById('desc');
    this.details = document.getElementById('details');
    this.errorMsg = document.getElementById('errorMsg');
  }

  render(data) {
    this.location.textContent = `${data.name}, ${data.sys.country}`;
    this.temp.textContent = `${Math.round(data.main.temp)}°C`;
    this.desc.textContent = data.weather[0].description;
    this.details.textContent = `Humidity: ${data.main.humidity}% | Wind: ${data.wind.speed} m/s`;
    this.icon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    this.icon.alt = data.weather[0].description;
    this.errorMsg.textContent = '';
  }

  showError(msg) {
    this.errorMsg.textContent = msg;
    this.location.textContent = '--';
    this.icon.src = '';
    this.temp.textContent = '-- °C';
    this.desc.textContent = '--';
    this.details.textContent = '--';
  }
}

// ---------- CLASS 3: MAIN APP ----------
class WeatherApp {
  constructor(apiKey) {
    this.api = new WeatherAPI(apiKey);
    this.ui = new UIManager();

    this.searchBtn = document.getElementById('searchBtn');
    this.cityInput = document.getElementById('city');
    this.init();
  }

  init() {
    this.searchBtn.addEventListener('click', () => this.getWeather());
    this.cityInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.getWeather();
    });
  }

  async getWeather() {
  const city = this.cityInput.value.trim();
  if (!city) {
    this.ui.showError('Please enter a city name.');
    return;
  }
  try {
    console.log("Fetching weather for:", city);
    const data = await this.api.fetchWeather(city);
    console.log("API Response:", data);
    this.ui.render(data);
  } catch (err) {
    console.error("Error fetching weather:", err);
    this.ui.showError(err.message);
  }
}
}// ---------- APP INITIALIZATION ----------
const app = new WeatherApp('58f37eb463abeed8a08047e7fed8b9b9');
