// Select DOM elements
const weatherForm = document.querySelector(".weatherForm");
const cityInput = document.querySelector(".cityInput");
const card = document.getElementById("weatherCard");
const weatherEffectContainer = document.getElementById("weatherEffect");
const apiKey = "08a9f8053851acd4207d65e31d43750a"; // Replace with your actual API key

// Initialize Weather Effects
function createWeatherEffect() {
    // Clear existing effects
    weatherEffectContainer.innerHTML = '';

    // For demonstration, we'll randomly choose weather effects
    // In a real app, you would set this based on actual weather data
    const weatherTypes = ['snow', 'rain', 'wind', 'clouds'];
    // For initial load, set a default effect
    addSnowflakes(50);
    addRaindrops(50);
    addWindGusts(10);
    addClouds(5);
}

// Functions to add different weather effects
function addSnowflakes(count) {
    for (let i = 0; i < count; i++) {
        const flake = document.createElement("div");
        flake.classList.add("snowflake");
        flake.style.left = `${Math.random() * 100}vw`;
        flake.style.top = `${Math.random() * 100}vh`;
        flake.style.animationDuration = `${Math.random() * 3 + 2}s`;
        weatherEffectContainer.appendChild(flake);
    }
}

function addRaindrops(count) {
    for (let i = 0; i < count; i++) {
        const drop = document.createElement("div");
        drop.classList.add("raindrop");
        drop.style.left = `${Math.random() * 100}vw`;
        drop.style.top = `${Math.random() * 100}vh`;
        drop.style.animationDuration = `${Math.random() * 2 + 1}s`;
        weatherEffectContainer.appendChild(drop);
    }
}

function addWindGusts(count) {
    for (let i = 0; i < count; i++) {
        const gust = document.createElement("div");
        gust.classList.add("windGust");
        gust.style.top = `${Math.random() * 100}vh`;
        gust.style.animationDuration = `${Math.random() * 4 + 2}s`;
        weatherEffectContainer.appendChild(gust);
    }
}

function addClouds(count) {
    for (let i = 0; i < count; i++) {
        const cloud = document.createElement("div");
        cloud.classList.add("cloud");
        cloud.style.left = `${Math.random() * 100}vw`;
        cloud.style.top = `${Math.random() * 50}vh`;
        cloud.style.animationDuration = `${Math.random() * 20 + 20}s`;
        weatherEffectContainer.appendChild(cloud);
    }
}

// Handle Form Submission
weatherForm.addEventListener("submit", async event => {
    event.preventDefault();

    const city = cityInput.value.trim();

    if (city) {
        try {
            const weatherData = await getWeatherData(city);
            displayWeatherInfo(weatherData);
            updateWeatherEffects(weatherData);
        }
        catch (error) {
            console.error(error);
            displayError(error.message);
        }
    }
    else {
        displayError("Please enter a city");
    }
});

async function getWeatherData(city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}`;

    const response = await fetch(apiUrl);

    if (!response.ok) {
        throw new Error("Could not fetch weather data. Please check the city name.");
    }

    const data = await response.json();

    // Get sunrise and sunset times (in Unix format)
    const sunriseTime = data.sys.sunrise;
    const sunsetTime = data.sys.sunset;

    // Get the current time in Unix format
    const currentTime = Math.floor(Date.now() / 1000); // Current time in Unix format

    // Check if it's day or night based on current time, sunrise, and sunset
    const isDay = currentTime >= sunriseTime && currentTime <= sunsetTime;

    // Return data with day/night info
    return { ...data, isDay };
}

// Display Weather Information
// Display Weather Information
function displayWeatherInfo(data) {
    const { name: city, main: { temp, humidity }, weather: [{ description, id }] } = data;

    const card = document.querySelector('.card');
    card.innerHTML = ''; // Clear previous content
    card.style.display = 'flex';

    // Create elements for the weather info
    const cityDisplay = document.createElement('h1');
    const tempDisplay = document.createElement('p');
    const humidityDisplay = document.createElement('p');
    const descDisplay = document.createElement('p');
    const weatherEmoji = document.createElement('div'); // Use a div for the fixed emoji

    // Set text content
    cityDisplay.textContent = city;
    tempDisplay.textContent = `${(temp - 273.15).toFixed(1)}°C`;
    humidityDisplay.textContent = `Humidity: ${humidity}%`;
    descDisplay.textContent = description;
    weatherEmoji.textContent = getWeatherEmoji(id);

    // Add classes for styling
    cityDisplay.classList.add('cityDisplay');
    tempDisplay.classList.add('tempDisplay');
    humidityDisplay.classList.add('humidityDisplay');
    descDisplay.classList.add('descDisplay');
    weatherEmoji.classList.add('fixedEmoji');

    // Append elements to the card
    card.appendChild(cityDisplay);
    card.appendChild(tempDisplay);
    card.appendChild(humidityDisplay);
    card.appendChild(descDisplay);
    card.appendChild(weatherEmoji);

    // Make the card visible by adding the 'show' class
    card.classList.add('show');
}



// Get Emoji Based on Weather ID
function getWeatherEmoji(code) {
    // Thunderstorm (Group 2xx)
    if (code >= 200 && code <= 232) {
        return "⛈️"; // Thunderstorm emoji
    }
    // Drizzle (Group 3xx)
    else if (code >= 300 && code <= 321) {
        return "🌧️"; // Drizzle emoji
    }
    // Rain (Group 5xx)
    else if (code >= 500 && code <= 531) {
        return "🌧️"; // Rain emoji
    }
    // Snow (Group 6xx)
    else if (code >= 600 && code <= 622) {
        return "❄️"; // Snow emoji
    }
    // Atmosphere (Group 7xx)
    else if (code >= 701 && code <= 781) {
        return "🌫️"; // Mist, haze, smoke, etc.
    }
    // Clear sky (Group 800)
    else if (code === 800) {
        return "☀️"; // Clear sky emoji
    }
    // Clouds (Group 80x)
    else if (code >= 801 && code <= 804) {
        return "☁️"; // Cloud emoji
    }
    // Default (If no match found)
    else {
        return "🌥️"; // Default cloudy emoji
    }
}


// Display Error Message
function displayError(message) {
    card.style.display = "flex";
    card.innerHTML = ''; // Clear previous content

    const errorDisplay = document.createElement("p");
    errorDisplay.textContent = message;
    errorDisplay.classList.add("errorDisplay");

    card.appendChild(errorDisplay);
}

// Update Weather Effects Based on Weather Data
// Update Weather Effects Based on Weather Data
function updateWeatherEffects(data) {
    const weatherId = data.weather[0].id;

    // Clear existing weather effects
    weatherEffectContainer.innerHTML = ''; // Clear all weather effects

    // Remove sun/moon if exists (before adding new effects)
    const existingBackground = document.querySelector(".sun, .moon");
    if (existingBackground) {
        existingBackground.remove();
    }

    // Animate background color change and transition sun/moon
    if (data.isDay) {
        transitionToDay();
        spawnSun();
    } else {
        transitionToNight();
        spawnMoon();
        spawnStars();
    }

    // Other weather effects based on weather ID (rain, snow, etc.)
    if (weatherId >= 200 && weatherId < 600) {
        // Thunderstorm, Drizzle, Rain
        addRaindrops(100);
    } else if (weatherId >= 600 && weatherId < 700) {
        // Snow
        addSnowflakes(100);
    } else if (weatherId >= 700 && weatherId < 800) {
        // Atmosphere (fog, mist, etc.)
        addClouds(10);
    } else if (weatherId === 800) {
        // Clear sky (already handled by day/night logic)
    } else if (weatherId > 800 && weatherId < 810) {
        // Clouds
        addClouds(20);
    }

    // Optionally, add wind effects based on weather
    if (weatherId >= 200 && weatherId < 700) {
        addWindGusts(5);
    }
}



// Initialize default weather effects on page load
createWeatherEffect();
function switchCityAnimation() {
    const card = document.querySelector('.card');
    card.style.opacity = '0';
    card.classList.add('show');
    setTimeout(() => {
        // After fade-out, change content here (update city data)
        card.style.opacity = '1'; // Fade-in new content
    }, 500);
}

function spawnClouds() {
    const body = document.querySelector('body');
    const cloudCount = 10;

    for (let i = 0; i < cloudCount; i++) {
        const cloud = document.createElement("div");
        cloud.classList.add("cloud");

        // Randomly position the clouds on the page (including the middle)
        cloud.style.left = `${Math.random() * 100}%`;
        cloud.style.top = `${Math.random() * 100}%`;
        cloud.style.animationDuration = `${Math.random() * 5 + 5}s`;

        // Append cloud to the body
        body.appendChild(cloud);
    }
}
// Reset and spawn the sun (only for clear weather)
function transitionToDay() {
    document.body.style.transition = "background 2s ease-in-out";
    document.body.style.background = "linear-gradient(to top, #50bce7, #87ceeb)";
    
}

// Transition Background to Night
function transitionToNight() {
    document.body.style.transition = "background 2s ease-in-out";
    document.body.style.background = "linear-gradient(180deg, hsl(210, 54%, 30%), hsl(200, 89%, 22%))"; // Dark blue (night sky)
    spawnStars()
}
// Spawn Sun in Background with Animation
function spawnSun() {
    const sun = document.createElement("div");
    sun.classList.add("sun");
    document.body.appendChild(sun);

    // Animate the sun (day)
    sun.style.animation = "sunrise 2s forwards";
}

// Spawn Moon in Background with Animation
function spawnMoon() {
    const moon = document.createElement("div");
    moon.classList.add("moon");
    document.body.appendChild(moon);

    // Animate the moon (night)
    moon.style.animation = "moonrise 2s forwards";
}

// Spawn Stars for Nighttime
function spawnStars() {
    const starsContainer = document.createElement("div");
    starsContainer.classList.add("stars");
    document.body.appendChild(starsContainer);

    // Generate stars dynamically
    for (let i = 0; i < 100; i++) {
        const star = document.createElement("div");
        star.classList.add("star");
        starsContainer.appendChild(star);
    }

    // Animate stars appearing
    starsContainer.style.animation = "stars 2s forwards";
}