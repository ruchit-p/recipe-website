import React, { useEffect, useState } from "react";
import { useAuth } from "../AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import RecipeInfo from "../Components/RecipeInfo"; // Adjust the import based on your project structure
import { Link } from "react-router-dom";
import { Button } from "../Components/ui/button";
import Login from "../Components/Login";
import Signup from "../Components/Signup";

const API_KEY = import.meta.env.VITE_APP_API_KEY_BOOKMARK;
const API_BACKUP = import.meta.env.VITE_APP_API_KEY_BOOKMARK_BACKUP;
const API_BACKKUP2 = import.meta.env.VITE_APP_API_KEY_BOOKMARK_BACKUP2;

const Bookmarks = () => {
  const { currentUser, logout } = useAuth();
  const [bookmarkedRecipes, setBookmarkedRecipes] = useState([]);
  const [recipesDetails, setRecipesDetails] = useState([]);

  useEffect(() => {
    const fetchBookmarkedRecipes = async () => {
      if (currentUser) {
        const userDocRef = doc(db, "bookmarks", currentUser.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          setBookmarkedRecipes(userDoc.data().bookmarks || []);
        }
      }
    };

    fetchBookmarkedRecipes();
  }, [currentUser]);

  useEffect(() => {
    const fetchRecipeDetails = async () => {
      const fetchWithApiKey = async (recipeId, apiKey) => {
        const response = await fetch(
          `https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${apiKey}`
        );
        if (!response.ok) {
          throw new Error(`Failed with status: ${response.status}`);
        }
        return response.json();
      };

      const details = await Promise.all(
        bookmarkedRecipes.map(async (recipeId) => {
          try {
            return await fetchWithApiKey(recipeId, API_KEY);
          } catch (error) {
            try {
              return await fetchWithApiKey(recipeId, API_BACKUP);
            } catch (backupError) {
              return await fetchWithApiKey(recipeId, API_BACKUP2);
            }
          }
        })
      );

      setRecipesDetails(details);
    };

    if (bookmarkedRecipes.length > 0) {
      fetchRecipeDetails();
    }
  }, [bookmarkedRecipes]);

  return (
    <div>
      <div className="header flex flex-col justify-between items-center">
        <h1 className="font-bold text-lg mt-5">Meal Planner</h1>
        <h2 className="font-bold text-md my-2 underline">Bookmarked Recipes</h2>
        <div className="button-container">
          {currentUser ? (
            <>
              <Link to="/recipe-website/">
                <Button variant="outline">Back</Button>
              </Link>
              <Button variant="outline" onClick={logout}>
                Log Out
              </Button>
            </>
          ) : (
            <>
              <Login />
              <Signup />
            </>
          )}
        </div>
      </div>

      <div className="results">
        {recipesDetails.map((recipe) => (
          <RecipeInfo recipe={recipe} key={recipe.id} />
        ))}
      </div>
    </div>
  );
};

export default Bookmarks;
