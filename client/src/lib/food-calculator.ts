// Common food database for rapid prototyping
// All macros are per 100g by default unless specified

export const FOOD_DATABASE: Record<string, { kcal: number, p: number, c: number, f: number, unit?: string, unitWeight?: number }> = {
  // Proteins
  "chicken breast": { kcal: 165, p: 31, c: 0, f: 3.6 },
  "chicken thigh": { kcal: 209, p: 26, c: 0, f: 10.9 },
  "lean beef 95/5": { kcal: 137, p: 21.4, c: 0, f: 5 },
  "lean ground beef": { kcal: 137, p: 21.4, c: 0, f: 5 },
  "steak": { kcal: 252, p: 27, c: 0, f: 15 },
  "salmon": { kcal: 208, p: 20, c: 0, f: 13 },
  "white fish": { kcal: 90, p: 19, c: 0, f: 1 },
  "tuna": { kcal: 132, p: 28, c: 0, f: 1 },
  "egg": { kcal: 72, p: 6, c: 0.4, f: 4.8, unit: "large egg", unitWeight: 50 },
  "egg white": { kcal: 17, p: 3.6, c: 0.2, f: 0.1, unit: "large egg white", unitWeight: 33 },
  "turkey breast": { kcal: 114, p: 24, c: 0, f: 1.5 },
  "whey protein": { kcal: 120, p: 25, c: 3, f: 1.5, unit: "scoop", unitWeight: 30 },
  
  // Carbs
  "white rice": { kcal: 130, p: 2.7, c: 28, f: 0.3 },
  "brown rice": { kcal: 111, p: 2.6, c: 23, f: 0.9 },
  "sweet potato": { kcal: 86, p: 1.6, c: 20, f: 0.1 },
  "potato": { kcal: 87, p: 1.9, c: 20, f: 0.1 },
  "oats": { kcal: 389, p: 16.9, c: 66.3, f: 6.9 },
  "pasta": { kcal: 131, p: 5, c: 25, f: 1 },
  "cream of rice": { kcal: 360, p: 7, c: 80, f: 1 },
  "bread": { kcal: 265, p: 9, c: 49, f: 3.2 },
  
  // Fats
  "olive oil": { kcal: 884, p: 0, c: 0, f: 100, unit: "tbsp", unitWeight: 14 },
  "avocado": { kcal: 160, p: 2, c: 8.5, f: 14.7 },
  "almonds": { kcal: 579, p: 21, c: 21.6, f: 49.9 },
  "peanut butter": { kcal: 588, p: 25, c: 20, f: 50, unit: "tbsp", unitWeight: 16 },
  "butter": { kcal: 717, p: 0.8, c: 0.1, f: 81, unit: "tbsp", unitWeight: 14 },
  
  // Other common items
  "broccoli": { kcal: 34, p: 2.8, c: 6.6, f: 0.4 },
  "asparagus": { kcal: 20, p: 2.2, c: 3.9, f: 0.1 },
  "spinach": { kcal: 23, p: 2.9, c: 3.6, f: 0.4 },
  "banana": { kcal: 89, p: 1.1, c: 22.8, f: 0.3, unit: "medium banana", unitWeight: 118 },
  "apple": { kcal: 52, p: 0.3, c: 13.8, f: 0.2, unit: "medium apple", unitWeight: 182 },
  "greek yogurt": { kcal: 59, p: 10, c: 3.6, f: 0.4 }
};

export function parseAndCalculateFood(input: string): { name: string, kcal: number, p: number, c: number, f: number } | null {
  const lowerInput = input.toLowerCase().trim();
  
  // Find matching food in database
  let matchedFoodKey = null;
  for (const food of Object.keys(FOOD_DATABASE)) {
    if (lowerInput.includes(food)) {
      matchedFoodKey = food;
      break;
    }
  }

  if (!matchedFoodKey) return null;

  const foodData = FOOD_DATABASE[matchedFoodKey];
  let multiplier = 1; // Default multiplier representing 100g or 1 unit

  // Check for quantity/weight patterns
  // Pattern 1: e.g., "6oz chicken" or "6 oz chicken"
  const ozMatch = lowerInput.match(/(\d+(?:\.\d+)?)\s*oz/);
  // Pattern 2: e.g., "200g chicken" or "200 g chicken"
  const gMatch = lowerInput.match(/(\d+(?:\.\d+)?)\s*g(?!al)/); // (?!al) prevents matching 'gal'
  // Pattern 3: e.g., "3 eggs", "2 scoops whey"
  const unitMatch = lowerInput.match(/^(\d+(?:\.\d+)?)\s+/);

  if (ozMatch) {
    // Convert oz to grams, then divide by 100 for multiplier
    const oz = parseFloat(ozMatch[1]);
    const grams = oz * 28.3495;
    multiplier = grams / 100;
  } else if (gMatch) {
    // Grams divided by 100 for multiplier
    const grams = parseFloat(gMatch[1]);
    multiplier = grams / 100;
  } else if (unitMatch && foodData.unit) {
    // Based on unit count (e.g., 3 eggs)
    const count = parseFloat(unitMatch[1]);
    multiplier = (count * foodData.unitWeight!) / 100;
  } else if (unitMatch) {
     // If user inputs a number without unit and food doesn't have a standard unit, 
     // assume they mean number of 100g servings or it's just part of the name
     // Defaulting to 1 (100g) if no clear metric provided
     multiplier = 1;
  } else if (foodData.unit) {
      // If food expects a unit but none provided, default to 1 unit
      multiplier = foodData.unitWeight! / 100;
  }

  // Format the name nicely
  let formattedName = input;
  // If user just typed "chicken breast", auto-format to "100g Chicken breast"
  if (!ozMatch && !gMatch && !unitMatch) {
      formattedName = foodData.unit ? `1 ${foodData.unit} ${matchedFoodKey}` : `100g ${matchedFoodKey}`;
  }

  return {
    name: formattedName.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
    kcal: Math.round(foodData.kcal * multiplier),
    p: Math.round(foodData.p * multiplier),
    c: Math.round(foodData.c * multiplier),
    f: Math.round(foodData.f * multiplier)
  };
}