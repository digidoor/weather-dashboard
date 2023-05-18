var weatherHistory;
dayjs.extend(window.dayjs_plugin_utc);
dayjs.extend(window.dayjs_plugin_timezone);
apiKey = "e3f7cf22dd3edac262ac80be651ffa17";
var apiUrl = "https://api.openweathermap.org/data/2.5/forecast?lat=";
const apiGeo = 'https://api.openweathermap.org/geo/1.0/direct?q=';
var userFormEl = document.getElementById("userForm");
var outputDiv = document.getElementById("outputDiv");
var cityInputEl = document.getElementById("userText");

async function submitHandler()
{
	event.preventDefault();
	let city = cityInputEl.value.trim();
	outputDiv.textContent = "Thanks.";
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
	var city = {};
	city.name = data.city.name;
	console.log(data.list[1].weather[0].description);
	for(let i=7; i<40; i=i+8)
	{
		let dateObj = dayjs.unix( data.list[i].dt ).format('MMMM D, YYYY h:mm A');
		renderWeather( `${data.city.name} ${dateObj}`, "h3", outputDiv );
		renderWeather( data.list[i].weather[0].description, "p", outputDiv);
		renderWeather( `Temperature: ${data.list[i].main.temp}F`, "p", outputDiv );
		renderWeather( `Humidity: ${data.list[i].main.humidity}%`, "p", outputDiv );
		renderWeather( `Wind Speed: ${data.list[i].wind.speed} km/h`, "p", outputDiv );
		let title = `${data.city.name} ${dateObj}`;
		let desc = data.list[i].weather[0].description;
		let temp = `Temperature: ${data.list[i].main.temp}F`;
		let humid = `Humidity: ${data.list[i].main.humidity}%`;
		let wind = `Wind Speed: ${data.list[i].wind.speed} km/h`;
		console.log("7/8: ", Math.floor(7/8));
		city[`title${Math.floor(i/8)+1}`] = title;
		city[`desc${Math.floor(i/8)+1}`] = desc;
		city[`temp${Math.floor(i/8)+1}`] = temp;
		city[`humid${Math.floor(i/8)+1}`] = humid;
		city[`wind${Math.floor(i/8)+1}`] = wind;
	}
	saveWeatherHistory(city);
}
function renderWeather( data, elementType, parentEl )
{
	let newEl = document.createElement(elementType);
	newEl.innerHTML = data;
	parentEl.append(newEl);
}
function saveWeatherHistory(city)
{
	weatherHistory = JSON.parse(localStorage.getItem("weatherHistory")) || [];
	if(weatherHistory.length == 5)
		weatherHistory.shift();
	weatherHistory.push(city);
	localStorage.setItem("weatherHistory", JSON.stringify(weatherHistory));
	console.log(weatherHistory);
}

userFormEl.addEventListener('submit', submitHandler);

//localStorage.removeItem("weatherHistory");