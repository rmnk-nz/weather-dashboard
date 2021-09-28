var userInput = document.querySelector('#userCity');
var searchBtn = document.querySelector('#searchBtn');
var clearBtn = document.querySelector('#clearHistory');
var historyDiv = document.querySelector('#historyDiv');
var weatherTitle = document.querySelector('#weatherTitle');
var currentWeather = document.querySelector('#currentWeather');
var apiKey = '2a270cc981b828921936d857f8ccd07d';

//function to get users input
function inputHandler(event) {
    event.preventDefault();

    var userCity = userInput.value.trim();

    if (userCity) {
      getLocationInfo(userCity); 
    } else {
        alert('please enter city name');
    }
};

//function to select users pervious searches


//function to fetch required data from selected api
function getLocationInfo (userInput) {
    var apiUrl = 'https://api.openweathermap.org/data/2.5/weather?q=' + userInput.toLowerCase() + '&appid=' + apiKey + '&units=metric';

    fetch(apiUrl)
    .then(function (response) {
      if (response.ok) {
        response.json()
        .then(function (data) {
          console.log(data);
          displayWeather(data);
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

  // button style to be dynamicly applied for the user saved search history
  /* <button type="button" class="btn btn-secondary mb-3 me-3"></button> */
  var searchedEl = document.createElement('button');
  searchedEl.classList = 'btn btn-secondary mb-3 me-3';
  searchedEl.textContent = data.name;
  historyDiv.appendChild(searchedEl);
};

//function to get UV index
function getUvIndex(data) {
  var lat = data.coord.lat;
  var lon = data.coord.lon;
  var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=minutely,hourly&appid=" + apiKey + "&units=metric";

  fetch(apiUrl)
  .then(function(response){
    if (response.ok) {
        response.json()
      .then (function (data) {
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


//function to clear all saved searches from user
function clearSearches() { 
  //clear local data storage and refresh page
  localStorage.clear();
  window.location.replace('./index.html');
  
};


//when user clicks the search button, will start seach for the users input
searchBtn.addEventListener('click', inputHandler);

//clears all pervious searches from user
clearBtn.addEventListener('click', clearSearches);