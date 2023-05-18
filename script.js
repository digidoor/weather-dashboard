dayjs.extend(window.dayjs_plugin_utc);
dayjs.extend(window.dayjs_plugin_timezone);
apiKey = "e3f7cf22dd3edac262ac80be651ffa17";
var apiUrl = "https://api.openweathermap.org/data/2.5/forecast?lat=";
const apiGeo = 'https://api.openweathermap.org/geo/1.0/direct?q=';
var userFormEl = document.getElementById("userForm");
var outputDiv = document.getElementById("outputDiv");

async function submitHandler()
{
	event.preventDefault();
	let city = "Sacramento";
	outputDiv.textContent = "Form submmitted. Check the console.";
	var geoPromise = await fetch(`${apiGeo}${city}&appid=${apiKey}`);
	var geoData = await geoPromise.json();
	const { lon, lat } = geoData[0];
	var weatherPromise = await fetch(`${apiUrl + lat}&lon=${lon}&appid=${apiKey}&units=imperial`);
	var weatherData = await weatherPromise.json();
	console.log(weatherData);
	displayWeather(weatherData, city);
}

function displayWeather(data, city)
{
	
	console.log(data.list[1].weather[0].description);
	let i = 0;
	for(let i=7; i<40; i=i+8)
	{
		let dateObj = dayjs.unix( data.list[i].dt ).format('MMMM D, YYYY h:mm A');
		renderWeather( dateObj, "h3", outputDiv );
		renderWeather( data.list[i].weather[0].description, "p", outputDiv);
		renderWeather( data.list[i].main.feels_like + "F", "p", outputDiv );
	}
}

function renderWeather( data, elementType, parentEl )
{
	let newEl = document.createElement(elementType);
	newEl.textContent = data;
	parentEl.append(newEl);
}


userFormEl.addEventListener('submit', submitHandler);