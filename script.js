const API_KEY = '7cf75a65d73420c4a42168b64e60defc';
const API_URL = 'https://api.openweathermap.org/data/2.5/weather';

const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const weatherResult = document.getElementById('weatherResult');
const errorMessage = document.getElementById('errorMessage');

const cityName = document.getElementById('cityName');
const temperature = document.getElementById('temperature');
const description = document.getElementById('description');
const feelsLike = document.getElementById('feelsLike');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('windSpeed');

searchBtn.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city) {
        getWeather(city);
    }
});

cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const city = cityInput.value.trim();
        if (city) {
            getWeather(city);
        }
    }
});

async function getWeather(city) {
    try {
        hideMessages();
        
        const response = await fetch(`${API_URL}?q=${city}&appid=${API_KEY}&units=metric`);
        const data = await response.json();
        
        if (!response.ok) {
            if (data.cod === 401) {
                // API key not activated yet, use demo data
                showError('API key not activated yet. Showing demo data for ' + city);
                setTimeout(() => {
                    const demoData = {
                        name: city.charAt(0).toUpperCase() + city.slice(1),
                        sys: { country: 'DEMO' },
                        main: {
                            temp: 25,
                            feels_like: 23,
                            humidity: 65
                        },
                        weather: [{ description: 'partly cloudy' }],
                        wind: { speed: 3.5 }
                    };
                    displayWeather(demoData);
                }, 1500);
                return;
            } else if (data.cod === 404) {
                throw new Error('City not found. Please try again.');
            } else {
                throw new Error(data.message || 'An error occurred');
            }
        }
        
        displayWeather(data);
        
    } catch (error) {
        showError(error.message);
        console.error('Weather API Error:', error);
    }
}

function displayWeather(data) {
    cityName.textContent = `${data.name}, ${data.sys.country}`;
    temperature.textContent = `${Math.round(data.main.temp)}°C`;
    description.textContent = data.weather[0].description;
    feelsLike.textContent = `${Math.round(data.main.feels_like)}°C`;
    humidity.textContent = `${data.main.humidity}%`;
    windSpeed.textContent = `${data.wind.speed} m/s`;
    
    weatherResult.classList.remove('hidden');
}

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.remove('hidden');
}

function hideMessages() {
    weatherResult.classList.add('hidden');
    errorMessage.classList.add('hidden');
}
