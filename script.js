var userInput = document.querySelector('#userCity');
var searchBtn = document.querySelector('#searchBtn');
var clearBtn = document.querySelector('#clearHistory');
var historyDiv = document.querySelector('#historyDiv');
var weatherDisplay = document.querySelector('.weatherDisplay')
var weatherTitle = document.querySelector('.weatherTitle');
var currentWeather = document.querySelector('.currentWeather');
var forecastDiv = document.querySelector('#fiveDay');
var apiKey = '2a270cc981b828921936d857f8ccd07d';

//function to get users input
function inputHandler(event) {
    event.preventDefault();

    var userCity = userInput.value.trim();

    if (userCity) {
      getLocationInfo(userCity);
      userCity.textContent = '';
    
    } else {
        alert('please enter city name');
    }
};


//function to fetch required data from selected api
function getLocationInfo (userInput) {
    var apiUrl = 'https://api.openweathermap.org/data/2.5/weather?q=' + userInput.toLowerCase() + '&appid=' + apiKey + '&units=metric';

    fetch(apiUrl)
    .then(function (response) {
      if (response.ok) {
        response.json()
        .then(function (data) {
          displayWeather(data);
          saveSearch(data); 
          getUvIndex(data);
        })
        .catch(function(error){
        console.log('error: invalid json')
      });
      } else {
        alert('Error: ' + response.statusText);
      }
    })
    .catch(function (error) {
      alert('unable to connect to server');
    });
};

//function to render through the fetched data and append to page
function displayWeather(data) {
    console.log(data);
    

  weatherTitle.textContent = "";
  currentWeather.textContent = "";

  weatherDisplay.setAttribute('id', 'userInfo');

  //append city name
  var city = document.createElement('h2');
  city.textContent = data.name;
  weatherTitle.appendChild(city);

  //append current date
  var currentDate = moment(data.dt.value).format('DD-MM-YYYY');
  var day = document.createElement('p');
  day.textContent = 'Date: ' + currentDate;
  weatherTitle.appendChild(day);

  //append weather Image
  var weatherImage = document.createElement('img');
  weatherImage.src = 'http://openweathermap.org/img/wn/' + data.weather[0].icon + '@4x.png';
  weatherTitle.appendChild(weatherImage);

  //append temperature
  var temp = document.createElement('h4');
  temp.textContent = 'Tempurature: ' + data.main.temp + '\u00B0C';
  currentWeather.appendChild(temp);

  //append humidity
  var humid = document.createElement('h4');
  humid.textContent = 'Humidity: ' + data.main.humidity + "%";
  currentWeather.appendChild(humid);

  //append wind speed
  var wind = document.createElement('h4');
  wind.textContent = 'Wind Speed: ' + data.wind.speed + "m/sec";
  currentWeather.appendChild(wind);

};

//function to get UV index
function getUvIndex(data) { 
  //applie lat and lon to openweather onecall api to get UV index
  var lat = data.coord.lat;
  var lon = data.coord.lon;
  var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=minutely,hourly&appid=" + apiKey + "&units=metric";

  fetch(apiUrl)
  .then(function(response){
    if (response.ok) {
        response.json()
      .then (function (data) {
        displayForecast(data);
        //create element to display UV index 
        var uvIndexEl = document.createElement('h4');
        uvIndexEl.textContent = 'UV Index: ' + data.current.uvi;
        //if else condition to apply attribute depending on current UV index
          if (data.current.uvi <= 2) {
            uvIndexEl.setAttribute('class', 'low');
        } else if (data.current.uvi > 2 || data.current.uvi < 6) {
            uvIndexEl.setAttribute('class', 'medium');
        } else {
            uvIndexEl.setAttribute('class', 'high');
        }
        currentWeather.appendChild(uvIndexEl);
      })
    } else {
        alert('Error: ' + response.statusText);
      }
  });
};

//function to display 5 day
function displayForecast (weather) {
  forecastDiv.textContent = '';

  var forecastTitle = document.createElement('h3');
  forecastTitle.textContent = '5 day Forecast';
  forecastDiv.appendChild(forecastTitle);
 
  for (i = 1; i < 6; i++) {
    //attribute to applied to forecast elements <div class="col forecast"></div>
    var forecastEl = document.createElement('div');
    forecastEl.classList = "col forecast";

    var forecastWeather = weather.daily[i];
    var date = moment.unix(forecastWeather.dt).format('DD/MM/YYYY');

    var displayDate = document.createElement('h5');
    displayDate.textContent = date;
    forecastEl.appendChild(displayDate);

    var displayImg = document.createElement('img');
    displayImg.src = 'http://openweathermap.org/img/wn/' + forecastWeather.weather[0].icon + '@2x.png';
    forecastEl.appendChild(displayImg);
    
    var displayTemp = document.createElement('h5');
    displayTemp.textContent = 'Temp: ' + forecastWeather.temp.max + '\u00B0C';
    forecastEl.appendChild(displayTemp);
    
    var displayWind = document.createElement('h5');
    displayWind.textContent = 'Wind: ' + forecastWeather.wind_speed + 'm/sec';
    forecastEl.appendChild(displayWind);

    var displayHumid = document.createElement('h5');
    displayHumid.textContent = 'Humidity: ' + forecastWeather.humidity + '%';
    forecastEl.appendChild(displayHumid);

    forecastDiv.appendChild(forecastEl);
  }
};

//function to save users pervious searches
function saveSearch(data) {
  var savedCity = data.name;

  var userHistory = localStorage.getItem('cityName');
    if (userHistory === null) {
      userHistory=[];
      //will ensure that user search dosen't already exist
    } else if (userHistory.indexOf(savedCity) != -1) {
        return;
    } else {
      userHistory = JSON.parse(userHistory);
      console.log(userHistory);
    }

  userHistory.push(savedCity);
  var addCity = JSON.stringify(userHistory);
  localStorage.setItem('cityName', addCity);
  //creates button element for user search and append to history div
  var searchedEl = document.createElement('button');
  searchedEl.classList = 'btn btn-secondary mb-3 me-3';
  searchedEl.setAttribute('cityInfo', savedCity);
  searchedEl.textContent = savedCity;
  console.log(searchedEl);
  historyDiv.appendChild(searchedEl);
  
  //add event listener so when user clicks button it will initiate sreach
  searchedEl.addEventListener('click', function(event) {
    var btnValue = event.target.getAttribute('cityInfo');
    getLocationInfo(btnValue);
    userCity.textContent = '';
  });
};

//function to get past searches from local data and append to page
function renderHistory () {
  var pastSearches = JSON.parse(localStorage.getItem('cityName'));
  if (pastSearches != null) {
    for (var i=0; i < pastSearches.length; i++) {
      var searchedEl = document.createElement('button');
      searchedEl.classList = 'btn btn-secondary mb-3 me-3';
      searchedEl.setAttribute('cityInfo', pastSearches[i]);
      searchedEl.textContent = pastSearches[i];
      historyDiv.appendChild(searchedEl);

      //add event listener so when user clicks button it will initiate sreach
      searchedEl.addEventListener('click', function(event) {
        var btnValue = event.target.getAttribute('cityInfo');
        getLocationInfo(btnValue);
        userCity.textContent = '';
        });
    }
  }   
};

renderHistory();

//when user clicks the search button, will start seach for the users input
searchBtn.addEventListener('click', inputHandler);

//clears all pervious searches from user
clearBtn.addEventListener('click', function () {
  localStorage.clear();
  window.location.replace('./index.html'); 
});