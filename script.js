
async function getCountry(x) {
  
    const response = await fetch(`https://rapidapi.p.rapidapi.com/v1/geo/countries?namePrefix=${x}`, {
      "method": "GET",
      "headers": {
        "x-rapidapi-host": "wft-geo-db.p.rapidapi.com",
        "x-rapidapi-key": "f4a11bf4cbmsh5b92adb0e60713cp1d13b1jsn9bba4dd46055"
      }
    })
    countryData = await response.json();
    
    console.log(response) 

}

async function getCity(x) {
  
    const response = await fetch(`https://rapidapi.p.rapidapi.com/v1/geo/cities?limit=10&types=city&countryIds=${countryData.data[0].code}&namePrefix=${x}`, {
      "method": "GET",
      "headers": {
        "x-rapidapi-host": "wft-geo-db.p.rapidapi.com",
        "x-rapidapi-key": "f4a11bf4cbmsh5b92adb0e60713cp1d13b1jsn9bba4dd46055"
      }
    })
    cityData = await response.json();
    
  

}


async function getWeather(lat, lon) {
  const apiKeyWeather = "3e16e32ceee02973c525698b26376c5b";
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=current,minutely,alerts&units=metric&appid=${apiKeyWeather}`
  );
  let data = await response.json();
  forecastWeather = data
  console.log(data)

}



const weekdayArray = ["Sun","Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
const burgerIconButton = document.querySelector('.burger-icon')
const backIconButton = document.querySelector('.back-icon')
const citySelectButton = document.querySelector('.city-select')
const submitCityButton = document.querySelector('.search-submit-off')
const appTitle = document.querySelector('.app-title')
const cityTitle = document.querySelector('.city-name')
const mainPage = document.querySelector('.page.main-page-off')
const detailPage = document.querySelector('.page.detail-page-off')
const searchBar = document.querySelector('.search-bar-on')
const setToday = document.querySelector('.date')
const mainTemp = document.querySelector('.current-temp')
const mainMinMaxTemp = document.querySelector('.minmax-temp')
const matchList = document.querySelector('.match-list-off')
const matchListShow = document.querySelector('.match-ul')
const conditionMain = document.querySelector('.time')
const forwardHoursArray = [...document.querySelectorAll('.show-hour')]
const forwardDaysArray = [...document.querySelectorAll('.day')]
const maxtempArray = [...document.querySelectorAll('.maxtemp')]
const mintempArray = [...document.querySelectorAll('.mintemp')]
const forwardTempsArray = [...document.querySelectorAll('.graph-temp')]
const boxesValue = [...document.querySelectorAll('.value')]
const firstGraph = [...document.querySelectorAll('.line')]
const forwardPopArray = [...document.querySelectorAll('.rain')]
const iconsDay = [...document.querySelectorAll('.icon-day')]
const forwardInfo = document.querySelector('.forward-info')
const currnetInfo = document.querySelector('.current-info')
const hoursOrder = []
const dayOrder = []
let minmaxBackArray = []
let forecastWeather = []
let countryData = []
let searchedCountry
let cityData = []
let searchedCity
let citiesToShow = []
let selectedCity;
let displayedMatchList = []
let latitude = 0
let longitude = 0

// INTERACTION -------------------------------------------------
burgerIconButton.addEventListener('click', () => {
  searchBar.classList.value = "search-bar-off"
  submitCityButton.classList.value = "search-submit-off"
  citySelectButton.children[0].classList.value = "fas fa-globe-europe"
  searchBar.children[0].value = ""
  mainPage.classList.value = "page main-page-off"
setTimeout(()=>{
  detailPage.classList.value = "page detail-page-on"
},500)
})

backIconButton.addEventListener('click', () => {
  detailPage.classList.value = "page detail-page-off"
  setTimeout(()=>{
    mainPage.classList.value = "page main-page-on"
  },500)
})

citySelectButton.addEventListener('click',() => {
  if(searchBar.classList.value == "search-bar-off"){
   searchBar.classList.value = "search-bar-on"
   citySelectButton.children[0].classList.value = "fas fa-times"
   currnetInfo.classList.value = "current-info-off"
   forwardInfo.classList.value = "forward-info-off"
   searchBar.children[0].focus()
  } else {
    searchBar.classList.value = "search-bar-off"
   citySelectButton.children[0].classList.value = "fas fa-globe-europe"
   submitCityButton.classList.value = "search-submit-off"
   searchBar.children[0].value = ""
   currnetInfo.classList.value = "current-info"
   forwardInfo.classList.value = "forward-info"
   searchBar.children[0].placeholder = "country"
   matchList.classList.value = "match-list-off"
   matchListShow.innerHTML = ""
   clearAll()
   }
  }
)

searchBar.children[0].addEventListener('input', () => {
  if(searchBar.children[0].value != ""){
    submitCityButton.classList.value = "search-submit-on"
  }
  else
  {
    submitCityButton.classList.value = "search-submit-off"
  }
})

submitCityButton.addEventListener('click', () => {
     if(countryData.length == 0){
  searchedCountry = searchBar.children[0].value.toUpperCase()
      console.log(searchedCountry)
      findCountry ()
     }
     else
     { 
      searchedCity = searchBar.children[0].value.toUpperCase()
      console.log(searchedCity)
       findCity()
       setTimeout(setMatchCities,1000)
        matchList.classList.value = "match-list"    
     }   
})

console.log(`raz`)



// INTERACTION -------------------------------------------------
setHoursOrder()
setDaysOrder ()
setToday.textContent = setDate()

forwardDaysArray.forEach((item, index)=> {
  item.textContent = dayOrder[index]
})


forwardHoursArray.forEach((item, index) => {  
  if(index < 6){
  hoursOrder[0] = "NOW"
  
  item.textContent = hoursOrder[index] 
  }
  else
  {
    item.textContent = hoursOrder[index-6]
  }
})

function setTemp(){
  mainTemp.children[1].firstChild.textContent = Math.round(forecastWeather.hourly[0].temp)
  mainMinMaxTemp.children[1].firstChild.textContent = Math.round(forecastWeather.daily[0].temp.min)
  mainMinMaxTemp.children[0].firstChild.textContent = Math.round(forecastWeather.daily[0].temp.max)
}

function setDate(){
  let date = new Date()
  let day = date.getDate()
  let month = date.toLocaleString('en-us',{ month: 'short'})
  let year = date.getFullYear()
  return `${day}, ${month} ${year}`
}

function setHoursOrder() {
     let date = new Date()
     let hour = date.getHours() 
     for(i=0;i<6;i++) {
       if(hour>23) hour = 0
       if(hour>=0 && hour<=12){
       hoursOrder.push(`${hour}am`)
       hour++
       }
       else
       { 
        hoursOrder.push(`${hour - 12}pm`)
        hour++
       }}}

function setDaysOrder (){
  let dayIndex = new Date().getDay()
  for(i=0;i<7;i++){
    dayOrder.push(weekdayArray[dayIndex])
    dayIndex++
    if(dayIndex>=7){
      dayIndex = 0
    }
  }
}

function findCountry (){
  if(searchedCountry == "USA") searchedCountry = "United States of America"
  if(searchedCountry == "UAE") searchedCountry = "United Arab Emirates"
  getCountry(searchedCountry)
  
  setTimeout(()=>{
    if(countryData.data.length>0){
      searchBar.children[0].value = ""
      searchBar.children[0].placeholder = "city"
      searchBar.children[0].focus()
      submitCityButton.classList.value = "search-submit-off"
    }
    else
    {
      searchBar.children[0].classList.value = "search-value-wrong"
      setTimeout(()=> searchBar.children[0].classList.value = "search-value",300)
      searchBar.children[0].value = ""
      searchedCountry = ""
      countryData = []
      searchBar.children[0].focus()
    }
  },1000)
}

function findCity (){
  getCity(searchedCity)
  setTimeout(()=>{
    if(cityData.data.length>0){
      console.log(cityData)
      
      submitCityButton.classList.value = "search-submit-off"
    }
    else
    {
      searchBar.children[0].classList.value = "search-value-wrong"
      setTimeout(()=> searchBar.children[0].classList.value = "search-value",300)
      searchBar.children[0].value = ""
      searchedCity = ""
      cityData =[]
      searchBar.children[0].focus()
    }
  },1000)
}

function setMatchCities () {
  let temparray = cityData.data
  citiesToShow = temparray.map((item,index)=>{
       return `<li>${item.city}<span>, ${item.regionCode}</span></li>`
  })
  matchListShow.innerHTML = citiesToShow.join('')
  setFinalCity()
}

function clearAll(){
  searchedCountry = ""
  searchedCity = ''
  countryData = []
  cityData = []
  citiesToShow = []
}

function setFinalCity(){
  displayedMatchList = [...document.querySelectorAll('.match-ul li')]
  displayedMatchList.forEach((item,index)=>{
       item.addEventListener('click', ()=> {
            selectedCity = item.firstChild.textContent
            let q = selectedCity.split(",")
            if(q[0].length <13) {
              cityTitle.textContent = q[0]
            } else{
            let w = q[0].split(" ")
            cityTitle.textContent = w[0]
            }
            getCity(selectedCity)
            appTitle.classList.value = "app-title-off"
            mainPage.classList.value = "page main-page-on"
            citySelectButton.children[0].classList.value = "fas fa-globe-europe"
            searchBar.children[0].value = ""
            matchList.classList.value = "match-list-off"
            selectedCity = ""
            matchListShow.innerHTML = ""
            searchedCountry = ""
            searchedCity = ''
            citiesToShow = []
            currnetInfo.classList.value = "current-info"
   forwardInfo.classList.value = "forward-info"
            
            searchBar.classList.value = "search-bar-off"
            setTimeout(() =>{
              latitude = cityData.data[0].latitude 
              longitude = cityData.data[0].longitude
              getWeather(latitude, longitude)
             setTimeout(() => {
               setWeather()
               setTemp()
               setBoxesValue()
               setPop()
               setCondition()
               
             },1000)
              
            },1000)                        
      })
  })
}


function setWeather(){
  cityData = []
  countryData = []
  searchBar.children[0].placeholder = "country"
  forwardTempsArray.forEach((item,index)=> {
    item.firstChild.textContent = Math.round(forecastWeather.hourly[index].temp)
  })
  firstGraph.forEach((item, index) => {
    if(Math.round(forecastWeather.hourly[index].temp)>=0){
    item.style.height = Math.round(forecastWeather.hourly[index].temp) * 3
    } else {item.style.height = 0 }
  })
  minmaxBackArray= dayOrder.map((item, index) => {
     item =  {item, minTemp: Math.round(forecastWeather.daily[index].temp.min), maxTemp: Math.round(forecastWeather.daily[index].temp.max) }
    return item                  
  })
  mintempArray.forEach((item,index)=>{
    item.firstChild.textContent = minmaxBackArray[index].minTemp
  })
  maxtempArray.forEach((item,index)=>{
    item.firstChild.textContent = minmaxBackArray[index].maxTemp
  })  
  
}


function setBoxesValue(){
  
  boxesValue[0].firstChild.textContent = Math.round(forecastWeather.hourly[0].feels_like) 
  boxesValue[1].textContent = Math.round(forecastWeather.hourly[0].wind_speed) + "m/s"
  boxesValue[2].textContent = Math.round(forecastWeather.hourly[0].humidity) + "%"
  boxesValue[3].textContent = Math.round(forecastWeather.hourly[0].pressure) + "hPa"
  boxesValue[4].textContent = Math.round(forecastWeather.hourly[0].visibility) + "m"
  boxesValue[5].firstChild.textContent = Math.round(forecastWeather.hourly[0].dew_point)
  if(Math.round(forecastWeather.hourly[0].visibility) == 10000) {
    boxesValue[4].textContent = "MAX"
  }

}

function setPop(){
  forwardPopArray.forEach((item, index) => {
    let x  = forecastWeather.hourly[index].pop * 100
    item.children[0].textContent = x.toFixed(0)  + "%"
    item.style.height = Math.round(forecastWeather.hourly[index].pop * 80) 
  })
}

function setCondition (){
  
  conditionMain.innerHTML = `<img src="http://openweathermap.org/img/wn/${forecastWeather.hourly[0].weather[0].icon}.png" alt="">${forecastWeather.hourly[0].weather[0].main}`
  if(forecastWeather.hourly[0].weather[0].main=="thunderstorm")
  { conditionMain.innerHTML = `<img src="http://openweathermap.org/img/wn/${forecastWeather.hourly[0].weather[0].icon}.png" alt="">STORM` }

  iconsDay.forEach((item, index)=> {
    item.innerHTML = `<img src="http://openweathermap.org/img/wn/${forecastWeather.daily[index].weather[0].icon}.png" alt="">`
  })
}




