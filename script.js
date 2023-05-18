var weatherHistory;
dayjs.extend(window.dayjs_plugin_utc);
dayjs.extend(window.dayjs_plugin_timezone);
apiKey = "e3f7cf22dd3edac262ac80be651ffa17";
var apiUrl = "https://api.openweathermap.org/data/2.5/forecast?lat=";
const apiGeo = 'https://api.openweathermap.org/geo/1.0/direct?q=';
var userFormEl = document.getElementById("userForm");
var outputDiv = document.getElementById("outputDiv");
var cityInputEl = document.getElementById("userText");
var historyEl = document.getElementById("history");

function showHistory()
{
	weatherHistory = JSON.parse(localStorage.getItem("weatherHistory")) || [];
	for( let i=0; i<weatherHistory.length; i++)
	{
		let city = weatherHistory[i].name;
		console.log(city);
		let button = document.createElement("button");
		button.textContent = city;
		button.addEventListener( 'click', showHistoryHandler(i, weatherHistory) );
		historyEl.append(button);
	}
	let badButton = document.createElement("button");
	badButton.textContent = "Delete History";
	badButton.style.color = "red";
	badButton.addEventListener( 'click', deleteHistory );
	historyEl.append(badButton);
}
function showHistoryHandler(i, weatherHistory)
{
	return function renderHistory()
	{
		console.log(weatherHistory[i]);
		for(let j=1; j<6; j++)
		{
			var dayDiv = document.getElementById(`day${j}`);
			dayDiv.innerHTML = "";
			dayDiv.classList.add("day");
			renderWeather( weatherHistory[i][`title${j}`], "h3", dayDiv);
			renderWeather( weatherHistory[i][`desc${j}`], "p", dayDiv );
			//! ICON STUFF
			let icon = document.createElement("img");
			icon.setAttribute('src', weatherHistory[i][`icon${j}`]);
			dayDiv.append(icon);
			//! ICON STUFF
			renderWeather( weatherHistory[i][`temp${j}`], "p", dayDiv );
			renderWeather( weatherHistory[i][`humid${j}`], "p", dayDiv );
			renderWeather( weatherHistory[i][`wind${j}`], "p", dayDiv );
		}
	}
}
function deleteHistory() { localStorage.removeItem("weatherHistory"); }

async function submitHandler()
{
	event.preventDefault();
	let city = cityInputEl.value.trim();
	//outputDiv.textContent = "Thanks.";
	var geoPromise = await fetch(`${apiGeo}${city}&appid=${apiKey}`);
	var geoData = await geoPromise.json();
	const { lon, lat } = geoData[0];
	var weatherPromise = await fetch(`${apiUrl + lat}&lon=${lon}&appid=${apiKey}&units=imperial`);
	var weatherData = await weatherPromise.json();
	console.log("weather data: ", weatherData);
	displayWeather(weatherData);
}

function displayWeather(data)
{
	var city = {};
	city.name = data.city.name;
	console.log(data.list[1].weather[0].description);
	displayCurrentWeather(data);

	for(let i=7; i<40; i=i+8) // we'll use j below to get 1 through 5
	{
		let j = Math.floor(i/8) + 1; // we want 1 through 5
		let dateObj = dayjs.unix( data.list[i].dt ).format('MMMM D, YYYY h:mm A');
		var dayDiv = document.getElementById(`day${j}`);
		dayDiv.innerHTML = "";
		dayDiv.classList.add("day");
		let title = `${data.city.name} ${dateObj}`;
		let desc = data.list[i].weather[0].description;
		let temp = `Temperature: ${data.list[i].main.temp}F`;
		let humid = `Humidity: ${data.list[i].main.humidity}%`;
		let wind = `Wind Speed: ${data.list[i].wind.speed} km/h`;
		//! ICON STUFF
		let iconURL = `https://openweathermap.org/img/w/${data.list[i].weather[0].icon}.png`;
		let icon = document.createElement("img");
		icon.setAttribute('src', iconURL);
		//! ICON STUFF
		renderWeather( title, "h3", dayDiv);
		renderWeather( desc, "p", dayDiv );
		dayDiv.append(icon);
		renderWeather( temp, "p", dayDiv );
		renderWeather( humid, "p", dayDiv );
		renderWeather( wind, "p", dayDiv );
		//console.log("7/8: ", Math.floor(7/8));
		city[`title${j}`] = title;
		city[`desc${j}`] = desc;
		city[`temp${j}`] = temp;
		city[`humid${j}`] = humid;
		city[`wind${j}`] = wind;
		city[`icon${j}`] = iconURL;
	}
	saveWeatherHistory(city);
	historyEl.innerHTML = "";
	showHistory();
}
function displayCurrentWeather(data)
{
	let current = document.getElementById("currentWeather");
	current.innerHTML = "";
	let heading = document.createElement("h2");
	heading.innerHTML = `${data.city.name} ${dayjs.unix( data.list[0].dt ).format('MMMM D, YYYY h:mm A')}`;
	let desc = document.createElement("p");
	desc.innerHTML = data.list[0].weather[0].description
	let temp = document.createElement("p");
	temp.innerHTML = `${data.list[0].main.temp}F`;
	let humid = document.createElement("p");
	humid.innerHTML = `${data.list[0].main.humidity}%`;
	let wind = document.createElement("p");
	wind.innerHTML = `${data.list[0].wind.speed} km/h`;
	//! ICON STUFF
	let iconURL = `https://openweathermap.org/img/w/${data.list[0].weather[0].icon}.png`;
	let icon = document.createElement("img");
	icon.setAttribute('src', iconURL);
	//! ICON STUFF
	current.append(heading, desc, icon, temp, humid, wind);
	current.classList.add("current");
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
	if(weatherHistory.length == 8)
		weatherHistory.shift();
	weatherHistory.push(city);
	localStorage.setItem("weatherHistory", JSON.stringify(weatherHistory));
	console.log(weatherHistory);
}

showHistory();
userFormEl.addEventListener('submit', submitHandler);

//localStorage.removeItem("weatherHistory");