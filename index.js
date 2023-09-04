
const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");

const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-serachForm]");
const loadingScreen = document.querySelector(".loading-conatiner");
const userInfoContainer = document.querySelector(".user-info-container");

const errorImage = document.querySelector(".error");

const grantAccessButton = document.querySelector("[data-grantAccess]");

// initial variables needed
let currentTab = searchTab;
searchForm.classList.add("active");
const API_KEY = "a14747dc2892aeedc20af737a7d91187";
currentTab.classList.add("current-tab");
errorImage.classList.remove("active");



function switchTab(clickedTab) {
    if (clickedTab != currentTab) {
        currentTab.classList.remove("current-tab");
        loadingScreen.classList.remove("active")
        currentTab = clickedTab;
        currentTab.classList.add("current-tab");

        if (!searchForm.classList.contains("active")) {
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");
        } else {
            // main pehle search weather wale tab pr tha aur ab main your weather wale tab pe aa gaya hu 
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            // since we are in your weather section so we have to check local storage in order to display weather
            // if we have saved coordinates or not
            loadingScreen.classList.add("active");
            getFromSessionStorage();
        }
    }
}

userTab.addEventListener("click", () => {
    // pass clicked tab as an input parameter
    switchTab(userTab);
})
searchTab.addEventListener("click", () => {
    // pass clicked tab as an input parameter
    switchTab(searchTab);
})

// check if we have already coordinates present in our local storage or not
function getFromSessionStorage() {
    const localCoordinates = sessionStorage.getItem("userCoordinates");
    if (!localCoordinates) {
        // agar local coorinates nhi mile iska matlab locationn ka acces nhi  diya gaya hai
        loadingScreen.classList.remove("active");
        //grantAccessContainer.classList.add("active");
        //grantAccessButton.addEventListener("click", getLocation());
         getLocation();
    }
    else {
        const coordinates = JSON.parse(localCoordinates);
        loadingScreen.classList.remove("active");
        fetchUserWeatherInfo(coordinates);
    }
}

async function fetchUserWeatherInfo(coordinates) {
    // loadingScreen.classList.add("active");
    const { lat, lon } = coordinates;
    // make grant invisible
    grantAccessContainer.classList.remove("active");
    // make loader visible
    loadingScreen.classList.add("active");

    // API CALL
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
    
        const data = await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
    
        renderWeatherInfo(data);
    }
    catch (e) {
        userInfoContainer.classList.remove("active");
        loadingScreen.classList.remove("active");
        errorImage.classList.add("active");
    }
}

function renderWeatherInfo(weatherInfo) {
    // first fetch the data from ui
    const cityName = document.querySelector('[data-cityName]');
    const countryFlag = document.querySelector('[data-countryIcon]');
    const description = document.querySelector('[data-weatherDesc]');
    const weatherIcon = document.querySelector('[data-weatherIcon]');
    const temp = document.querySelector('[data-temp]');
    const windspeed = document.querySelector('[data-windspeed]');
    const humidity = document.querySelector('[data-humidity]');
    const clouds = document.querySelector('[data-cloudiness]');

    //put the data on ui
    cityName.innerText = weatherInfo?.name;
    countryFlag.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    description.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = `${weatherInfo?.main?.temp.toFixed(2)} °C`;
    windspeed.innerText = `${weatherInfo?.wind?.speed.toFixed(2)} m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity.toFixed(2)} %`;
    clouds.innerText = `${weatherInfo?.clouds?.all.toFixed(2)} %`;
}
//

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        alert("No geolocation is supported");
    }
}

function showPosition(position) {
    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }
   
    sessionStorage.setItem("userCoordinates", JSON.stringify(userCoordinates));
    // console.log(userCoordinates);
    fetchUserWeatherInfo(userCoordinates);
}




const searchInput = document.querySelector("[data-serachInput]");

searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let cityName = searchInput.value;

    if (cityName === "") {
        return;
    } else {
        fetchSearchWeatherInfo(cityName);
    }
})

async function fetchSearchWeatherInfo(city) {
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");

    try {
        // const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        const data = await response.json();

        // console.log(data);

        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    } catch (e) {
        userInfoContainer.classList.remove("active");
        loadingScreen.classList.remove("active");
        console.log("error");
        errorImage.classList.add("active");
    }
}
