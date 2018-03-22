//Get JSON & using Ajax
function getDataFromApi(userInput, userInputForex, homeMoney, travelMoney) {
  const settings = {
    'async': true,
    'crossDomain': true,
    'url': `https://api.labstack.com/currency/convert?from=${homeMoney}&to=${travelMoney}&value=1`,
    'method': 'GET',
    'headers': {
      'Authorization': 'Bearer 5qCpoR1yN5ePigTWl2G1kG5T5tX8fAuV',
      'Cache-Control': 'no-cache',
    },
    'success': function(data){convertCurrency(data, userInput, userInputForex, homeMoney, travelMoney)}
  }
  $.ajax(settings);
}

//Function to create convert currency
function convertCurrency(result, userInput, userInputForex, homeMoney, travelMoney) {
//let exchangeTotalAmount= $('#js-homeland-currency').find('input[type=number]').val(); 
  let converted = `
  <form role='form' class='exchangeConversion'>
  <fieldset name='convertCurrency'>
    <legend>Currency Exchange</legend> 
    <label for='js-homeland-currency' class='home_currency'>${userInput}</label>
    <input placeholder='0.00' type='number' name='js-homeland-currency' id='js-homeland-currency' />
  </fieldset>
  </form> 
  <section role='region' class='foreignExchangeTotal'>
  <p class='afterExchange'> ${userInputForex}: ${result.value}</p>
  </section> 
  `;
  $('#travel-currency').html(converted);
}



//function to submit home country & current country traveling in to move to next page
function activateExchangeWindow() {
  $('.travelex').submit(event=> {
    event.preventDefault();
    //return currency symbol
    let userInput = $('#js-home-currency').find('option:selected').text();
    let userInputForex = $('#js-current-country').find('option:selected').text();
    let homeMoney = $('#js-home-currency').val();
    let travelMoney= $('#js-current-country').val();
    getDataFromApi(userInput, userInputForex, homeMoney, travelMoney);
    $('.travelex').hide();
});
}

//Global variables for Google Maps
let map;
let infowindow;
let places;

//Initiate Google Maps default map location
function initMap() {
  let defaultPosition = {lat: 43.766680, lng: 11.248663};
  map = new google.maps.Map(document.getElementById('map'), {
    center: defaultPosition,
    zoom: 15
  });
//Autocomplete generator
const autocomplete = new google.maps.places.Autocomplete(document.getElementById('js-current-location'));
const places = new google.maps.places.PlacesService(map)
autocomplete.addListener('place_changed', onPlaceChanged);

//Zoom to map location based on location search
function onPlaceChanged() {
  let place = autocomplete.getPlace();
  if (place.geometry) {
    map.panTo(place.geometry.location);
    map.setZoom(15);
    }
  else if (!place.geometry) {
    window.alert("No results available for '" + place.name + "'");
    return;
  }
    infowindow = new google.maps.InfoWindow();
    places.nearbySearch({
          location: place.geometry.location,
          bounds: map.getBounds(),
          type: ['bank']
        }, callback);
  }
}
//Callback to search for banks in nearby bounds area
function callback(results, status) {
  if (status === google.maps.places.PlacesServiceStatus.OK) {
    for (let i = 0; i < results.length; i++) {
      createMarker(results[i]);
    }
  }
}

//Create bank markers
function createMarker(place) {
  let placesList = document.getElementById('bank_places');
  let placeLoc = place.geometry.location;
  let marker = new google.maps.Marker({
    map: map,
    position: placeLoc
  });
 
//List banks on right-hand panel
  let li = document.createElement('li');
  li.textContent = `Bank: ${place.name} \n ${place.vicinity}`;
  placesList.appendChild(li);
  li.onclick= function() {
    google.maps.event.trigger(marker, 'click');
//Make markers bounce when clicking on right-hand panel 
    marker.setAnimation(google.maps.Animation.BOUNCE);
    setTimeout(function ()
        {
            marker.setAnimation(null);
            $(marker).dequeue();
        }, 1400);
  };
//Create pop-up window over pin items to describe location name & address 
  google.maps.event.addListener(marker, 'click', function() {
    infowindow.setContent(place.name + "<br />"+ place.vicinity);
    infowindow.open(map, this);
  });
}

function handleCreateApp() {
  activateExchangeWindow();
}

$(handleCreateApp);






