import React, { forwardRef, useEffect, useState, useMemo } from "react";
import "./RecipeInfo.css";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { Button } from "./ui/button";
import { useAuth } from "../AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { Link } from "react-router-dom";
import DOMPurify from "dompurify";

const RecipeInfo = forwardRef(({ recipe }, ref) => {
  const { currentUser, addBookmark, removeBookmark } = useAuth();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const sanitizedSummary = useMemo(() => DOMPurify.sanitize(recipe.summary || ""), [recipe.summary]);

  useEffect(() => {
    const checkBookmark = async () => {
      if (currentUser) {
        const userDocRef = doc(db, "bookmarks", currentUser.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists() && userDoc.data().bookmarks.includes(recipe.id)) {
          setIsBookmarked(true);
        } else {
          setIsBookmarked(false);
        }
      }
    };
    checkBookmark();
  }, [currentUser, recipe.id]);

  const handleBookmark = async () => {
    if (isBookmarked) {
      await removeBookmark(recipe.id);
      setIsBookmarked(false);
    } else {
      await addBookmark(recipe.id);
      setIsBookmarked(true);
    }
  };

  const renderAnalyzedInstructions = (instructions) => {
    return instructions.map((instruction, index) => (
      <div key={index} className="instruction-section">
        <h3>{instruction.name}</h3>
        <ol>
          {instruction.steps.map((step, stepIndex) => (
            <li key={stepIndex}>{step.step}</li>
          ))}
        </ol>
      </div>
    ));
  };

  return (
    <div ref={ref} className="recipe">
      <img
        src={`https://spoonacular.com/recipeImages/${recipe.id}-480x360.${recipe.imageType}`}
        alt={`Small icon for ${recipe.title} recipe`}
        className="recipe-image"
      />
      <h2 className="font-bold text-center	">{recipe.title}</h2>
      <p>
        Ready in {recipe.readyInMinutes} minutes{" "}
        <Button
          className="bookmark-button"
          onClick={handleBookmark}
          disabled={!currentUser}
        >
          {isBookmarked ? <BookmarkCheck /> : <Bookmark />}
        </Button>
      </p>
      <p>Servings: {recipe.servings}</p>
      <Button>
        <Link to={`/recipe-website/details/${recipe.id}`}>
        View Details
        </Link>
      </Button>
      <div className="recipe-summary" dangerouslySetInnerHTML={{ __html: sanitizedSummary }}></div>
      {recipe.analyzedInstructions &&
        recipe.analyzedInstructions.length > 0 && (
          <div className="instructions">
            <h2>Instructions:</h2>
            {renderAnalyzedInstructions(recipe.analyzedInstructions)}
          </div>
        )}
    </div>
  );
});
RecipeInfo.displayName = "RecipeInfo";
export default RecipeInfo;
