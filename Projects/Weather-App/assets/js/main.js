
var weather = {
    // thực tế API_ID sẽ viết ở phần backend và lưu ở sever để tránh bị lộ chứ không viết ở đây
    WEATHER_API_ID: '07189092906ad670e64e8a8c17cec5cf',

    fetchWeather: function(city) {
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${this.WEATHER_API_ID}&units=metric&lang=vi`)
        // &units=metric : để hiển thị độ C
        // &lang=vi : để hiển thị tiếng việt

        .then( response => {
            // Json.parse: JSON -> javascript type
            return response.json() 
        })
        // return ở trên sẽ được truyền xuống dưới
        .then(data => {
            if(data.cod === 200) {
                this.searchWeather(data)
            }
            else {
                alert(data.message)
            }
        })
    },

    searchWeather: function(data) {
        const VALUE_DEFAULT = '--'
    
        const cityName = document.querySelector('.city-name')
        const timeUpdate = document.querySelector('.time-update')
        const weatherState = document.querySelector('.weather-state')
        const weatherIcon = document.querySelector('.weather-icon')
        const temperature = document.querySelector('.temperature')
        const temperatureMax = document.querySelector('.temperature-max')
        const temperatureMin = document.querySelector('.temperature-min')
        const temperatureFeel = document.querySelector('.temperature-feel')
        const sunriseTime = document.querySelector('.sunrise-time')
        const sunsetTime = document.querySelector('.sunset-time')
        const cloudPercent = document.querySelector('.cloud-percent')
        const humidity = document.querySelector('.humidity')
        const windSpeed = document.querySelector('.wind-speed')
    
        document.body.style.backgroundImage = "url('https://source.unsplash.com/1600x900/?" + data.name + "')"
    
        cityName.innerText = data.name || VALUE_DEFAULT
    
        weatherIcon.setAttribute('src',`http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`)
        temperature.innerText = Math.round(data.main.temp) || VALUE_DEFAULT
    
        temperatureMax.innerText = Math.round(data.main.temp_max) || VALUE_DEFAULT
        temperatureMin.innerText = Math.round(data.main.temp_min) || VALUE_DEFAULT
        temperatureFeel.innerText = Math.round(data.main.feels_like) || VALUE_DEFAULT
    
        weatherState.innerText = data.weather[0].description || VALUE_DEFAULT
    
        // thời gian đang ở dạng  Unix Timestamp, cần convert về định dạng time bằng thư viện moment
        sunriseTime.innerText = moment.unix(data.sys.sunrise).format('h:mm') || VALUE_DEFAULT
        sunsetTime.innerText = moment.unix(data.sys.sunset).format('h:mm') || VALUE_DEFAULT
        
        cloudPercent.innerText = data.clouds.all || VALUE_DEFAULT
        humidity.innerText = data.main.humidity || VALUE_DEFAULT
    
        // tốc độ trong API đơn vị m/s, để đổi sang km/h ta nhân với 3.6
        windSpeed.innerText = (data.wind.speed * 3.6).toFixed(2) || VALUE_DEFAULT

        timeUpdate.innerText = moment.unix(data.dt).format('Do MMMM, h:mm') || VALUE_DEFAULT
    }
}

// khơi tại dữ liệu khi load trang
window.addEventListener('load', function(e) {
    weather.fetchWeather('Hà Nội');
})

// khi search thành phố
const searchInput = document.getElementById('search-city')

searchInput.addEventListener('change', function(e) {
    weather.fetchWeather(e.target.value);
})
