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
        getUserData(userCity);
    } else {
        alert('please enter city name');
    }
};
//function to select users pervious searches

//function to clear all saved searches from user
function clearSearches() { 
  //clear local data storage and refresh page
  localStorage.clear();
  window.location.replace('./index.htm');
  
};

//function to fetch  required data from selected api
function getUserData (userInput) {
    var apiUrl = 'https://api.openweathermap.org/data/2.5/weather?q=' + userInput.toLowerCase() + '&appid=' + apiKey + '&units=metric';

    fetch(apiUrl)
    .then(function (response) {
      if (response.ok) {
        response.json()
        .then(function (data) {
          displayWeather(data);
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

  //append uv-index
  
  
  // button style to be dynamicly applied for the user saved search history
  /* <button type="button" class="btn btn-secondary mb-3 me-3"></button> */
  // var searchedEl = document.createElement('button');
  // searchedEl.classList = 'btn btn-secondary mb-3 me-3';
  // searchedEl.textContent = city;
  // historyDiv.appendChild(searchedEl);
};

//when user clicks the search button, will start seach for the users input
searchBtn.addEventListener('submit', inputHandler);

//clears all pervious searches from user
clearBtn.addEventListener('click', clearSearches);