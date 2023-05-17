apiKey = "e3f7cf22dd3edac262ac80be651ffa17";
var apiUrl = "https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}"
const apiGeo = 'https://api.openweathermap.org/geo/1.0/direct?q='
const apiGeo2 = "&appid="
var userFormEl = document.getElementById("userForm");
var outputDiv = document.getElementById("outputDiv");

async function submitHandler()
{
	event.preventDefault();
	outputDiv.textContent = "Form submmitted. Check the console.";
	var geoPromise = await fetch(apiGeo + 'Sacramento' + apiGeo2 + apiKey);
	console.log(geoPromise);
	var geoData = await geoPromise.json();
	console.log(geoData);

}

userFormEl.addEventListener('submit', submitHandler);