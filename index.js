const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const GrantAccessContainer = document.querySelector(
  ".grant-location-container"
);

const userContainer = document.querySelector(".weather-container");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");

let currentTab = userTab;
const APIKey = "d1845658f92b31c64bd94f06f7188c9c";
currentTab.classList.add("current-Tab");
getfromSessionStorage();

//switching tab method
function switchTab(clickedTab) {
  if (clickedTab != currentTab) {
    currentTab.classList.remove("current-Tab");
    currentTab = clickedTab;
    currentTab.classList.add("current-Tab");
    if (!searchForm.classList.contains("active")) {
      userInfoContainer.classList.remove("active");
      GrantAccessContainer.classList.remove("active");
      searchForm.classList.add("active");
    }
  } else {
    searchForm.classList.remove("active");
    userInfoContainer.classList.remove("active");
    getfromSessionStorage();
  }
}

//adding eventlistener on both tabs
userTab.addEventListener("click", () => {
  switchTab(userTab);
});

searchTab.addEventListener("click", () => {
  switchTab(searchTab);
});

//checking for local coordinates in session storage
function getfromSessionStorage() {
  const localCoordinates = sessionStorage.getItem("user-coordinates");
  if (!localCoordinates) {
    GrantAccessContainer.classList.add("active");
  } else {
    const coordinates = JSON.parse(localCoordinates);
    fetchuserWeatherInfo(coordinates);
  }
}

//fetching method
async function fetchuserWeatherInfo(coordinates) {
  const { lat, lon } = coordinates;
  //make grantcontainer invisible
  GrantAccessContainer.classList.remove("active");
  //make loaderIcon visible
  loadingScreen.classList.add("active");

  //api call
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${APIKey}`
    );
    const data = await response.json();

    loadingScreen.classList.remove("active");
    userInfoContainer.classList.add("active");
    renderWeatherInfo(data);
  } catch (err) {
    loadingScreen.classList.remove("active");
  }
}

//render informatin method
function renderWeatherInfo(weatherInfo) {
  //accesing each element
  const cityName = document.querySelector("[data-cityName]");
  const countryFlag = document.querySelector("[data-countryIcon]");
  const desc = document.querySelector("[data-weatherDesc]");
  const weatherIcon = document.querySelector("[data-weatherIcon]");
  const temp = document.querySelector("[data-temp]");

  const windSpeed = document.querySelector("[data-windSpeed]");
  const humidity = document.querySelector("[data-humidity]");
  const cloudiness = document.querySelector("[data-clouds]");

  //placing the inner data to above variables
  cityName.innerText = weatherInfo?.name;
  countryFlag.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
  desc.innerText = weatherInfo?.weather?.[0]?.description;
  weatherIcon.src = `https://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
  temp.innerText = `${weatherInfo?.main?.temp} F`;
  windSpeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
  humidity.innerText = `${weatherInfo?.main?.humidity} %`;
  cloudiness.innerText = `${weatherInfo?.clouds?.all} %`;
}
//making a method to get location
function getlocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    //make a alert for navigator support
  }
}

//making a function showposition
function showPosition(position) {
  const userCoordinates = {
    lat: position.coords.latitude,
    lon: position.coords.longitude,
  };
  sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
  fetchuserWeatherInfo(userCoordinates);
}

const grantAccessButton = document.querySelector("[data-GrantAccess]");
//adding eventlistener to grantaccessbuttion
grantAccessButton.addEventListener("click", getlocation);

//making search form function
const searchInput = document.querySelector("[data-searchInput]");
searchForm.addEventListener("click", (e) => {
  e.preventDefault();
  if (searchInput.value === "") return;
  fetchSearchWeatherInfo(searchInput.value);
});

//fetchSearchWeatherInfo method
async function fetchSearchWeatherInfo(city) {
  loadingScreen.classList.add("active");
  userInfoContainer.classList.remove("active");
  GrantAccessContainer.classList.remove("active");
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIKey}&units=metric`
    );
    let data = await response.json();
    loadingScreen.classList.remove("active");
    // if(data?.name!=undefined){
    userInfoContainer.classList.add("active");
    renderWeatherInfo(data);
    // }
    // else{
    //     window.alert("You entered a wrong city name");
    // }
  } catch (e) {
    window.alert("Error occured" + e);
  }
}
