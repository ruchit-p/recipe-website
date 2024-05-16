import React, { useState, useEffect, useRef } from "react";
import "./App.css";
const API_KEY = import.meta.env.VITE_APP_API_KEY;
const API_BACKUP = import.meta.env.VITE_APP_API_KEY_BACKUP;
import RecipeInfo from "./Components/RecipeInfo";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/Components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";
import { Input } from "./Components/ui/input";
import { Button } from "./Components/ui/button";
import { Separator } from "./Components/ui/separator";

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
      let apiKeyToUse = API_KEY;

      try {
        // Attempt to fetch with the primary API key
        let response = await fetch(
          `https://api.spoonacular.com/recipes/random?apiKey=${apiKeyToUse}&number=15`
        );

        // If the primary API key fails, use the backup API key
        if (!response.ok) {
          if (response.status === 402) {
            // Status 402 indicates quota exceeded for Spoonacular API
            apiKeyToUse = API_BACKUP;
            response = await fetch(
              `https://api.spoonacular.com/recipes/random?apiKey=${apiKeyToUse}&number=15`
            );
          }

          if (!response.ok) {
            throw new Error(`API call failed with status: ${response.status}`);
          }
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
      <div className="header">
        <h1 className="font-bold text-lg my-5">Meal Planner</h1>
      </div>

      <div className="cardContainer">
        {isLoading ? (
          <div>Loading...</div>
        ) : error ? (
          <div>Error: {error}</div>
        ) : (
          <>
            <Card className="Card side">
              <CardHeader>
                <CardTitle>Shortest Prep Time</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  {shortestPreparationTimeRecipe
                    ? shortestPreparationTimeRecipe.title
                    : "N/A"}
                </CardDescription>
              </CardContent>
              <CardFooter>
                <Button
                  onClick={() => scrollToRecipe(shortestPreparationTimeIndex)}
                >
                  View Recipe
                </Button>
              </CardFooter>
            </Card>

            <Card className="Card total">
              <CardHeader>
                <CardTitle>Total Displayed Recipes</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  <h2 className="text-lg">{displayRecipes.length}</h2>
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="Card side">
              <CardHeader>
                <CardTitle>Healthiest Recipe</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  {highestHealthScoreRecipe
                    ? highestHealthScoreRecipe.title
                    : "N/A"}
                </CardDescription>
              </CardContent>
              <CardFooter>
                <Button onClick={() => scrollToRecipe(highestHealthScoreIndex)}>
                  View Recipe
                </Button>
              </CardFooter>
            </Card>
          </>
        )}
      </div>

      <form onSubmit={(e) => e.preventDefault()} className="rounded-lg border bg-card text-card-foreground shadow-sm m-2 p-2 search">
        <Input
          type="text"
          placeholder="Search for recipes"
          className="card-search"
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="card-filter">
          <Select onValueChange={setType}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="food">Food</SelectItem>
              <SelectItem value="drink">Drink</SelectItem>
            </SelectContent>
          </Select>
          <Input
            type="number"
            placeholder="Min Calories"
            className="card-input"
            onChange={(e) => setMinCalories(e.target.value)}
          />
          <Input
            type="number"
            placeholder="Max Calories"
            className="card-input"
            onChange={(e) => setMaxCalories(e.target.value)}
          />
        </div>

        <Button onClick={searchItems}>Search</Button>
      </form>

      <Separator />
      <div className="main">
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
    </>
  );
}

export default App;
