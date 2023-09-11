const search = document.getElementById("search");
const submit = document.getElementById("submit");
const random = document.getElementById("random");
const mealEl = document.getElementById("meals");
const resultHeading = document.querySelector(".result-heading");
const favoriteMealsList = document.getElementById("favorite-meals");
const singleMealEl = document.getElementById("single-meal");
const favoriteMeals = [];

// Search meal
function searchMeal(e) {
  e.preventDefault();

  singleMealEl.innerHTML = ""; // Clear single meal details
  const term = search.value.trim();

  if (term !== "") {
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`)
      .then((res) => res.json())
      .then((data) => {
        resultHeading.innerHTML = `<h2>Search Result for '${term}'</h2>`;

        if (data.meals === null) {
          mealEl.innerHTML = "<p>No results found.</p>";
        } else {
          mealEl.innerHTML = data.meals
            .map(
              (meal) => `
                <div class="meal">
                  <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                  <div class="meal-info" data-mealID="${meal.idMeal}">
                    <h3>${meal.strMeal}</h3>
                    <button class="btn-favorite">Add to Favorites</button>
                  </div>
                </div>
              `
            )
            .join("");
        }
      });
  } else {
    alert("Please insert a value in the search.");
  }
}

// Fetch meal by ID
function getMealById(mealID) {
  fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
    .then((res) => res.json())
    .then((data) => {
      const meal = data.meals[0];
      displayMealDetails(meal);
    });
}

// Display meal details
function displayMealDetails(meal) {
  const ingredients = [];

  for (let i = 1; i <= 20; i++) {
    if (meal[`strIngredient${i}`]) {
      ingredients.push(
        `${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`
      );
    } else {
      break;
    }
  }

  singleMealEl.innerHTML = `
    <div class="single-meal-detail">
      <h1>${meal.strMeal}</h1>
      <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
      <div class="single-meal-info">
        <h2>Ingredients</h2>
        <ul>
          ${ingredients.map((ingredient) => `<li>${ingredient}</li>`).join("")}
        </ul>
        <h2>Instructions</h2>
        <p>${meal.strInstructions}</p>
      </div>
    </div>
  `;
}

// Random meal
function randomMeal() {
  mealEl.innerHTML = "";
  resultHeading.innerHTML = "";

  fetch(`https://www.themealdb.com/api/json/v1/1/random.php`)
    .then((res) => res.json())
    .then((data) => {
      const meal = data.meals[0];
      displayMealDetails(meal);
    });
}

// Add to favorites
mealEl.addEventListener("click", (e) => {
  if (e.target.classList.contains("btn-favorite")) {
    const mealInfo = e.target.parentElement;
    const mealID = mealInfo.getAttribute("data-mealID");
    const mealName = mealInfo.querySelector("h3").textContent;
    if (!favoriteMeals.some((meal) => meal.id === mealID)) {
      favoriteMeals.push({ id: mealID, name: mealName });
      addToFavorites(mealID, mealName);
      console.log(favoriteMeals);
    } else {
      console.log("Meal already in favorites.");
    }
  }
});

// Remove from favorites
favoriteMealsList.addEventListener("click", (e) => {
  if (e.target.classList.contains("btn-remove")) {
    const favoriteMeal = e.target.parentElement;
    const mealID = favoriteMeal.getAttribute("data-mealID");
    removeFromFavorites(mealID);
  }
});

// Function to add a meal to the favorites list
function addToFavorites(mealID, mealName) {
  const favoriteMeal = document.createElement("li");
  favoriteMeal.innerHTML = `<span>${mealName}</span> <button class="btn-remove">Remove</button>`;
  favoriteMeal.setAttribute("data-mealID", mealID);
  favoriteMealsList.appendChild(favoriteMeal);
}

// Function to remove a meal from the favorites list
function removeFromFavorites(mealID) {
  const favoriteMeal = document.querySelector(`#favorite-meals li[data-mealID="${mealID}"]`);
  if (favoriteMeal) {
    favoriteMeal.remove();
    favoriteMeals = favoriteMeals.filter((meal) => meal.id !== mealID);
    console.log(favoriteMeals);
  }
}


mealEl.addEventListener("click", (e) => {
  if (e.target.classList.contains("btn-favorite")) {
    const mealInfo = e.target.parentElement;
    const mealID = mealInfo.getAttribute("data-mealID");
    const mealName = mealInfo.querySelector("h3").textContent;
    if (!favoriteMeals.some((meal) => meal.id === mealID)) {
      favoriteMeals.push({ id: mealID, name: mealName });
      addToFavorites(mealID, mealName);
      console.log(favoriteMeals);
    } else {
      console.log("Meal already in favorites.");
    }
  }
});


// Event listeners
submit.addEventListener("submit", searchMeal);
random.addEventListener("click", randomMeal);

mealEl.addEventListener("click", (e) => {
  const mealInfo = e.path.find(
    (item) =>
      item.classList &&
      item.classList.contains("meal-info")
  );

  if (mealInfo) {
    const mealID = mealInfo.getAttribute("data-mealID");
    getMealById(mealID);
  }
});