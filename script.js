let menubar = document.querySelector('#menu-bars');
let mynav = document.querySelector('.navbar');


menubar.onclick = () =>{
    menubar.classList.toggle('fa-times')
    mynav.classList.toggle('active')
}

// Get weather data from OpenWeatherMap API
const apiKey = "9fd7a449d055dba26a982a3220f32aa2";
const locationSelect = document.getElementById("location");

function searchWeather() {
  const location = locationSelect.value;
  if (location.length === 0) {
    return alert("Please select a location");
  }

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      const city = document.getElementById("city");
      city.innerHTML = data.name;

      const temp = document.getElementById("temp");
      temp.innerHTML = `Min: ${(data.main.temp_min - 273.15).toFixed(1)}&deg;C / Max: ${(data.main.temp_max - 273.15).toFixed(1)}&deg;C`;

      const wind = document.getElementById("wind");
      wind.innerHTML = `${data.wind.speed} m/s`;

      const humidity = document.getElementById("humidity");
      humidity.innerHTML = `${data.main.humidity}%`;

      const weather = document.getElementById("weather");
      weather.innerHTML = data.weather[0].description;
      
    })
    .catch(error => alert(error.message));
}


// Get the meals div
const mealsDiv = document.querySelector('#meals');
const mealModal = document.querySelector('#mealModal');
const mealImage = document.querySelector('#mealImage');
const mealName = document.querySelector('#mealName');
const mealIngredients = document.querySelector('#mealIngredients');
const mealDescription = document.querySelector('#mealDescription');
const closeBtn = document.querySelector('.close');

fetch('https://www.themealdb.com/api/json/v1/1/filter.php?a=Polish')
  .then(response => response.json())
  .then(data => {
    const mealIds = data.meals.map(meal => meal.idMeal);
    const mealPromises = mealIds.map(id => fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`).then(response => response.json()));
    Promise.all(mealPromises).then(meals => {
      const mealElements = meals.map(meal => `
        <div class="meal">
          <img src="${meal.meals[0].strMealThumb}" alt="${meal.meals[0].strMeal}" data-mealid="${meal.meals[0].idMeal}">
        </div>
      `);
      const mealsElement = document.getElementById('meals');
      mealsElement.innerHTML = mealElements.join('');

      // Add click event listener to meal images
      const mealImages = document.querySelectorAll('.meal img');
      mealImages.forEach(img => {
        img.addEventListener('click', () => {
          // Set modal content with meal data
          mealImage.src = img.src;
          mealName.textContent = img.alt;
          mealIngredients.innerHTML = getMealIngredients(meals, img.dataset.mealid);
          mealDescription.textContent = getMealDescription(meals, img.dataset.mealid);
          mealModal.style.display = 'block';
        });
      });

      // Add click event listener to close button
      closeBtn.addEventListener('click', () => {
        mealModal.style.display = 'none';
      });

      // Add click event listener to modal background
      window.addEventListener('click', (event) => {
        if (event.target == mealModal) {
          mealModal.style.display = 'none';
        }
      });
    });
  });

function getMealIngredients(meals, mealId) {
  const meal = meals.find(m => m.meals[0].idMeal === mealId);
  const ingredients = [];

  for (let i = 1; i <= 20; i++) {
    if (meal.meals[0][`strIngredient${i}`]) {
      ingredients.push(`${meal.meals[0][`strIngredient${i}`]} - ${meal.meals[0][`strMeasure${i}`]}`);
    } else {
      break;
    }
  }

  return ingredients.join('<br>');
}

function getMealDescription(meals, mealId) {
  const meal = meals.find(m => m.meals[0].idMeal === mealId);
  return meal.meals[0].strInstructions;
}