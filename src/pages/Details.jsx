import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { useAuth } from "../AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "../Components/ui/card";
import { Button } from "../Components/ui/button";
import { Link } from "react-router-dom";
import Login from "../Components/Login";
import Signup from "../Components/Signup";

const API_KEY = import.meta.env.VITE_APP_API_KEY_BOOKMARK_DETAILS;
const API_BACKUP = import.meta.env.VITE_APP_API_KEY_BOOKMARK_BACKUP;

const Details = () => {
  const { id } = useParams();
  const [recipeDetails, setRecipeDetails] = useState(null);
  const { currentUser, addBookmark, removeBookmark, logout } = useAuth();
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    const fetchRecipeDetails = async () => {
      let response = await fetch(
        `https://api.spoonacular.com/recipes/${id}/information?apiKey=${API_KEY}&includeNutrition=true`
      );
      
      if (!response.ok) {
        response = await fetch(
          `https://api.spoonacular.com/recipes/${id}/information?apiKey=${API_BACKUP}&includeNutrition=true`
        );
      }

      const data = await response.json();
      setRecipeDetails(data);
    };

    fetchRecipeDetails();
  }, [id]);

  useEffect(() => {
    const checkBookmark = async () => {
      if (currentUser) {
        const userDocRef = doc(db, "bookmarks", currentUser.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists() && userDoc.data().bookmarks.includes(id)) {
          setIsBookmarked(true);
        } else {
          setIsBookmarked(false);
        }
      }
    };
    checkBookmark();
  }, [currentUser, id]);

  const handleBookmark = async () => {
    if (isBookmarked) {
      await removeBookmark(id);
      setIsBookmarked(false);
    } else {
      await addBookmark(id);
      setIsBookmarked(true);
    }
  };

  if (!recipeDetails) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <div className="header flex flex-col justify-between items-center">
        <h1 className="font-bold text-lg mt-5">Meal Planner</h1>
        <h2 className="font-bold text-md my-2 underline">Details</h2>
        <div className="button-container">
          {currentUser ? (
            <>
              <Link to="/recipe-website/bookmarks">
                <Button variant="outline">Bookmarks</Button>
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
      <Card>
        <CardHeader>
          <img
            src={recipeDetails.image}
            alt={recipeDetails.title}
            className="w-full h-auto"
          />
        </CardHeader>
        <CardContent>
          <h2 className="font-bold text-center underline">
            {recipeDetails.title}
          </h2>
          <p className="text-center">
            Ready in {recipeDetails.readyInMinutes} minutes
          </p>
          <p className="text-center">Servings: {recipeDetails.servings}</p>
          <div className="w-full justify-center">
            <Button
              className="bookmark-button align-center text-center"
              onClick={handleBookmark}
              disabled={!currentUser}
            >
              {isBookmarked ? <BookmarkCheck /> : <Bookmark />}
            </Button>
          </div>

          <div
            dangerouslySetInnerHTML={{ __html: recipeDetails.summary }}
          ></div>
          <h2 className="mt-4 mb-2 font-bold text-lg">Ingredients</h2>
          <ul className="list-disc pl-5">
            {recipeDetails.extendedIngredients.map((ingredient) => (
              <li key={ingredient.id}>{ingredient.original}</li>
            ))}
          </ul>
          {recipeDetails.analyzedInstructions &&
            recipeDetails.analyzedInstructions.length > 0 && (
              <div>
                <h2 className="mt-4 mb-2 font-bold text-lg">Instructions</h2>
                {recipeDetails.analyzedInstructions.map(
                  (instruction, index) => (
                    <div key={index} className="mb-4">
                      <h3>{instruction.name}</h3>
                      <ol className="list-decimal pl-5">
                        {instruction.steps.map((step, stepIndex) => (
                          <li key={stepIndex} className="mb-1">
                            {step.step}
                          </li>
                        ))}
                      </ol>
                    </div>
                  )
                )}
              </div>
            )}
          {recipeDetails.nutrition && (
            <div className="mt-4">
              <h2 className="mb-2 font-bold text-lg">Nutrition</h2>
              <p>
                Calories:{" "}
                {
                  recipeDetails.nutrition.nutrients.find(
                    (n) => n.name === "Calories"
                  )?.amount
                }{" "}
                kcal
              </p>
              <p>
                Protein:{" "}
                {
                  recipeDetails.nutrition.nutrients.find(
                    (n) => n.name === "Protein"
                  )?.amount
                }{" "}
                g
              </p>
              <p>
                Fat:{" "}
                {
                  recipeDetails.nutrition.nutrients.find(
                    (n) => n.name === "Fat"
                  )?.amount
                }{" "}
                g
              </p>
              <p>
                Carbohydrates:{" "}
                {
                  recipeDetails.nutrition.nutrients.find(
                    (n) => n.name === "Carbohydrates"
                  )?.amount
                }{" "}
                g
              </p>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Link to="/recipe-website/bookmarks">
            <Button variant="outline">Back to Bookmarks</Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Details;
