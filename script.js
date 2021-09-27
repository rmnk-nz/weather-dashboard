// button style to be dynamicly applied for the user saved search history
/* <button type="button" class="btn btn-secondary mb-3 me-3">Auckland</button> */
var searchBtn = document.querySelector('#searchBtn');
var userCity = document.querySelector('#userCity');
var clearBtn = document.querySelector('clearHistory');
var apiKey = '2a270cc981b828921936d857f8ccd07d';

//function to get users input
function inputHandler (event) {
    event.preventDefault();

    var userInput = userCity.value.trim();

    if (userInput) {
        getUserCity(userInput);
    } else {
        alert('please enter city name')
    }
};
//function to select users pervious searches

//function to fetch  required data from selected api
function getUserCity (user) {
    var apiUrl = 'https://api.openweathermap.org/data/2.5/weather?q=' + user + '&appid='+ apiKey;

    fetch(apiUrl)
    .then(function (response) {
      if (response.ok) {
        response.json()
        .then(function (data) {
          displayWeather(data, user);
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
function displayWeather ()

//when user clicks the search button, will start seach for the users input
searchBtn.addEventListener('click', inputHandler);

//clears all pervious searches from user
clearBtn.addEventListener ("click", function() { 
    var userClear = confirm("Are you sure you want to clear history?");
    if (userClear === true) {
    //clear local data storage and refresh page
    localStorage.clear();
    window.location.replace("./index.html");
    }
    //alrets user they cancled clearing schedule
    else {
        alert("Cancled Clearing History");
        return;
    }
});