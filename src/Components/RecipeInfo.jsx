import React, { forwardRef } from 'react';

const RecipeInfo = forwardRef(({ recipe }, ref) => {
  const renderAnalyzedInstructions = (instructions) => {
    return instructions.map((instruction, index) => (
      <div key={index}>
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
        className="icons"
      />
      <h2>{recipe.title}</h2>
      <p>Ready in {recipe.readyInMinutes} minutes</p>
      <p>Servings: {recipe.servings}</p>
      <div dangerouslySetInnerHTML={{ __html: recipe.summary }}></div>
      {recipe.analyzedInstructions && recipe.analyzedInstructions.length > 0 && (
        <div>
          <h2>Instructions:</h2>
          {renderAnalyzedInstructions(recipe.analyzedInstructions)}
        </div>
      )}
    </div>
  );
});
RecipeInfo.displayName = 'RecipeInfo';
export default RecipeInfo;