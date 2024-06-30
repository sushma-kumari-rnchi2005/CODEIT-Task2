// console.log("hello gi kaise ho aap");
// const API_KEY ="830138d34242e1237bf9de46a35a7715";
// async function fetchWeatherDetails(){
//     try{
//         let city='goa';

//     const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);

//     const data = await response.json();
//     console.log("weather data :->",data);

//     let newPara = document.createElement('p');
//     newPara.textContent = `${data?.main?.temp.toFixed(2)} .c`;

//     document.body.appendChild(newPara);
//     renderWeatherInfo(data);
//     }
//     catch(err){
//         // handle the error
//     }
    

    
// }
// fetchWeatherDetails();

// // async function getCustomWeatherDetails(){
// //    try{
// //     let latitude = 17.6333;
// //     let longitude = 18.3333;
// //     let result = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`);
// //     data = await result.json();
// //     console.log(data);
// //    }
// //    catch(err){
// //     console.log('error found',err);
// //    }
// // }
// // getCustomWeatherDetails();

// function getLocation(){
//     if(navigator.geolocation){
//         navigator.geolocation.getCurrentPosition(showPosition);
//     }
//     else{
//         console.log("No geoLocation Support");
//     }
// }
// function showPosition(position){
//     let lat = position.coords.latitude;
//     let longi = position.coords.longitude;
//     console.log(lat);
//     console.log(longi);
// }
// getLocation();

const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");

const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");

// intially kin kin variable ki need pur sakta hai
let currentTab = userTab;
const API_KEY ="830138d34242e1237bf9de46a35a7715";
currentTab.classList.add("current-tab");
getfromSessionStorage();

 

function switchTab(clickedTab){
    if(clickedTab != currentTab){
        currentTab.classList.remove("current-tab");
        currentTab = clickedTab;
        
        currentTab.classList.add("current-tab");

        if(!searchForm.classList.contains("active")){
            // kya search form wala container is invisible, if yes then make it visible
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");
        }
        else{
            // main pehle search wala tab me tha , ab your weather tab visible karna h
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            // ab main your weather tab me aagya hu, toh weather bhi display karina padega, so lets check local storage first 
            // for coordinate, if we haved then there.
            getfromSessionStorage();
        }
    }
     
}

userTab.addEventListener("click",()=>{
    switchTab(userTab);

});

searchTab.addEventListener("click",()=>{
    switchTab(searchTab);
    
});

// check if coordinate are already present in session storage
function getfromSessionStorage(){
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if(!localCoordinates){
        grantAccessContainer.classList.add("active");
    }
    else{
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}
    async function fetchUserWeatherInfo(coordinates){
    const {lat,lon}= coordinates;
    // make grantcontainer invisible
    grantAccessContainer.classList.remove("active");
    // make loader visible
    loadingScreen.classList.add("active");

    // API CALL
    try{
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
        );
        const data =await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
        }
    catch(err){
        loadingScreen.classList.remove("active");
        // HW
    }
 }

function renderWeatherInfo(weatherInfo){
    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windspeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloudiness]");

    // fetch values from weatherINFO object and put it UI elements 
    cityName.innerHTML = weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `https://openweathermap.org/img/w/${weatherInfo?.weather?.[0].icon}.png`;
    temp.innerText =`${weatherInfo?.main?.temp}°C`;
    windspeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText =`${weatherInfo?.main?.humidity} %`;
    cloudiness.innerText =`${weatherInfo?.clouds?.all} %`;
}

function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        // Show an alert for no geolocation support available;
    }
}
    function showPosition(position){
        const userCoordinates = {
            lat: position.coords.latitude,
            lon: position.coords.longitude,
        }
       
        sessionStorage.setItem("user-coordinates",JSON.stringify(userCoordinates));
        fetchUserWeatherInfo(userCoordinates);
        console.log("hello");
    }


const grantAccessButton = document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click",getLocation);

const searchInput = document.querySelector("[data-searchInput]");
searchForm.addEventListener("submit",(e)=>{
    e.preventDefault();
    let cityName = searchInput.value;
    if(cityName ==="")
        return;
    else

    fetchSearchWeatherInfo(cityName);
});
 
async function fetchSearchWeatherInfo(city){
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");

    try{
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
        );
        const data = await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
        searchInput.value= "";
    }
    catch(err){
        // hw
    }
}





