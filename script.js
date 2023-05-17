apiKey = "e3f7cf22dd3edac262ac80be651ffa17";
var apiUrl = "https://api.openweathermap.org/data/2.5/forecast?lat=";
const apiGeo = 'https://api.openweathermap.org/geo/1.0/direct?q=';
var userFormEl = document.getElementById("userForm");
var outputDiv = document.getElementById("outputDiv");

async function submitHandler()
{
	event.preventDefault();
	outputDiv.textContent = "Form submmitted. Check the console.";
	var geoPromise = await fetch(apiGeo + 'Sacramento' + "&appid=" + apiKey);
	console.log(geoPromise);
	var geoData = await geoPromise.json();
	console.log(geoData);
	const { lon, lat } = geoData[0];
	console.log( lon, lat);
	var weatherPromise = await fetch(apiUrl + lat + "&lon=" + lon + "&appid=" + apiKey);
	var weatherData = await weatherPromise.json();
	console.log(weatherData);
}


userFormEl.addEventListener('submit', submitHandler);