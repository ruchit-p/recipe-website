import React, { useState, useEffect, useRef } from "react";
import "./App.css";
const API_KEY = import.meta.env.VITE_APP_API_KEY;
import RecipeInfo from "./Components/RecipeInfo";

function App() {
  const [recipes, setRecipes] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [search, setSearch] = useState("");
  const [minCalories, setMinCalories] = useState(0);
  const [maxCalories, setMaxCalories] = useState(1000);
  const [isFiltered, setIsFiltered] = useState(false);
  const [type, setType] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const recipeRefs = useRef([]);

  useEffect(() => {
    const fetchAllRecipeData = async () => {
      setIsLoading(true);
      setError(null);
      setIsFiltered(false);
      try {
        const response = await fetch(
          `https://api.spoonacular.com/recipes/random?apiKey=${API_KEY}&number=15`
        );
        if (!response.ok) {
          throw new Error(`API call failed with status: ${response.status}`);
        }
        const json = await response.json();
        setRecipes(json.recipes || []);
        recipeRefs.current = (json.recipes || []).map(() => React.createRef());
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAllRecipeData();
  }, []);

  const searchItems = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `https://api.spoonacular.com/recipes/complexSearch?apiKey=${API_KEY}&query=${search}&instructionsRequired=true&addRecipeInformation=true&number=15&type=${type}&minCalories=${
          parseInt(minCalories) || 0
        }&maxCalories=${parseInt(maxCalories) || 1000}`
      );
      if (!response.ok) {
        throw new Error(`API call failed with status: ${response.status}`);
      }
      const data = await response.json();
      setFilteredResults(data.results || []);
      setIsFiltered(true);
      recipeRefs.current = (data.results || []).map(() => React.createRef());
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const displayRecipes = isFiltered ? filteredResults : recipes;

  const highestHealthScoreRecipe =
    displayRecipes.length > 0
      ? displayRecipes.reduce(
          (prev, current) =>
            prev.healthScore > current.healthScore ? prev : current,
          displayRecipes[0]
        )
      : null;

  const shortestPreparationTimeRecipe =
    displayRecipes.length > 0
      ? displayRecipes.reduce(
          (prev, current) =>
            prev.readyInMinutes < current.readyInMinutes ? prev : current,
          displayRecipes[0]
        )
      : null;

  const highestHealthScoreIndex = highestHealthScoreRecipe
    ? displayRecipes.findIndex((recipe) => recipe === highestHealthScoreRecipe)
    : -1;

  const shortestPreparationTimeIndex = shortestPreparationTimeRecipe
    ? displayRecipes.findIndex(
        (recipe) => recipe === shortestPreparationTimeRecipe
      )
    : -1;

  const scrollToRecipe = (index) => {
    if (
      index >= 0 &&
      recipeRefs.current[index] &&
      recipeRefs.current[index].current
    ) {
      recipeRefs.current[index].current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <>
      <div className="whole-page">
        <div className="header">
          <h1>Meal Planner</h1>
        </div>

        <div className="cardContainer">
          {isLoading ? (
            <div>Loading...</div>
          ) : error ? (
            <div>Error: {error}</div>
          ) : (
            <>
              <div className="card">
                <h2>Total Recipes: {displayRecipes.length}</h2>
              </div>
              {highestHealthScoreRecipe && (
                <div
                  className="card"
                  onClick={() => scrollToRecipe(highestHealthScoreIndex)}
                >
                  <h2>Recipe with the highest health score:</h2>
                  <a>{highestHealthScoreRecipe.title || "N/A"}</a>
                </div>
              )}
              {shortestPreparationTimeRecipe && (
                <div
                  className="card"
                  onClick={() => scrollToRecipe(shortestPreparationTimeIndex)}
                >
                  <h2>Recipe with the shortest preparation time:</h2>
                  <a>{shortestPreparationTimeRecipe.title || "N/A"}</a>
                </div>
              )}
            </>
          )}
        </div>

        <div className="main">
          <form onSubmit={(e) => e.preventDefault()}>
            <input
              type="text"
              placeholder="Search for recipes"
              className="search-bar"
              onChange={(e) => setSearch(e.target.value)}
            />
            <select
              className="search-bar"
              onChange={(e) => setType(e.target.value)}
            >
              <option value="all">All</option>
              <option value="food">Food</option>
              <option value="drink">Drink</option>
            </select>
            <input
              type="number"
              placeholder="Min Calories"
              className="search-bar"
              onChange={(e) => setMinCalories(e.target.value)}
            />
            <input
              type="number"
              placeholder="Max Calories"
              className="search-bar"
              onChange={(e) => setMaxCalories(e.target.value)}
            />
            <button onClick={searchItems}>Search</button>
          </form>

          <div className="results">
            {displayRecipes.map((recipe, index) => (
              <RecipeInfo
                ref={recipeRefs.current[index]}
                recipe={recipe}
                key={recipe.id}
              />
            ))}
          </div>
        </div>
        <button
          className="toTop"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          ^
        </button>
      </div>
    </>
  );
}

export default App;
