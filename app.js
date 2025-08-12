// AI Nutritionist Application Logic

// Application Data
const applicationData = {
  formulas: {
    bmr_male: "BMR = 10 × weight(kg) + 6.25 × height(cm) - 5 × age + 5",
    bmr_female: "BMR = 10 × weight(kg) + 6.25 × height(cm) - 5 × age - 161"
  },
  activity_levels: {
    very_less: 1.2,
    medium: 1.55,
    very_hectic: 1.725
  },
  sample_meals: {
    weight_loss: {
      breakfast: [
        {name: "Vegetable Omelette", calories: 150, protein: "12g", carbs: "5g", fat: "10g"},
        {name: "Greek Yogurt with Berries", calories: 120, protein: "15g", carbs: "12g", fat: "2g"},
        {name: "Oatmeal with Almonds", calories: 180, protein: "8g", carbs: "25g", fat: "6g"}
      ],
      lunch: [
        {name: "Grilled Chicken Salad", calories: 300, protein: "35g", carbs: "10g", fat: "12g"},
        {name: "Quinoa Bowl with Vegetables", calories: 280, protein: "12g", carbs: "45g", fat: "8g"},
        {name: "Lentil Soup with Whole Grain Bread", calories: 320, protein: "18g", carbs: "40g", fat: "6g"}
      ],
      dinner: [
        {name: "Baked Salmon with Steamed Broccoli", calories: 350, protein: "40g", carbs: "8g", fat: "18g"},
        {name: "Turkey Meatballs with Zucchini Noodles", calories: 280, protein: "32g", carbs: "12g", fat: "12g"},
        {name: "Grilled Tofu Stir-fry", calories: 260, protein: "20g", carbs: "15g", fat: "14g"}
      ]
    },
    muscle_gain: {
      breakfast: [
        {name: "Protein Pancakes with Berries", calories: 400, protein: "30g", carbs: "35g", fat: "15g"},
        {name: "Scrambled Eggs with Whole Grain Toast", calories: 380, protein: "25g", carbs: "30g", fat: "18g"},
        {name: "Protein Smoothie Bowl", calories: 420, protein: "35g", carbs: "40g", fat: "16g"}
      ],
      lunch: [
        {name: "Chicken and Rice Bowl", calories: 550, protein: "45g", carbs: "55g", fat: "12g"},
        {name: "Tuna and Avocado Wrap", calories: 480, protein: "38g", carbs: "35g", fat: "20g"},
        {name: "Lean Beef Stir-fry with Quinoa", calories: 520, protein: "42g", carbs: "48g", fat: "16g"}
      ],
      dinner: [
        {name: "Grilled Chicken with Sweet Potato", calories: 600, protein: "50g", carbs: "45g", fat: "22g"},
        {name: "Salmon with Brown Rice and Vegetables", calories: 580, protein: "45g", carbs: "40g", fat: "25g"},
        {name: "Turkey Pasta with Vegetables", calories: 550, protein: "40g", carbs: "60g", fat: "18g"}
      ]
    }
  },
  nutrition_tips: [
    "Drink at least 8-10 glasses of water daily for optimal hydration",
    "Include lean protein in every meal to maintain muscle mass",
    "Eat colorful vegetables to ensure you get various nutrients",
    "Choose whole grains over refined grains for better fiber intake",
    "Practice portion control by using smaller plates",
    "Eat slowly and mindfully to better recognize hunger and fullness cues"
  ]
};

// Application State
let userProfile = {};
let conversationState = 'greeting';
let onboardingStep = 0;

// DOM Elements
const chatContainer = document.getElementById('chatContainer');
const chatInput = document.getElementById('chatInput');
const sendButton = document.getElementById('sendButton');
const typingIndicator = document.getElementById('typingIndicator');
const profileCard = document.getElementById('profileCard');
const statsSection = document.getElementById('statsSection');

// Initialize Application
document.addEventListener('DOMContentLoaded', function() {
  initializeApp();
  setupEventListeners();
  startConversation();
});

function initializeApp() {
  console.log('AI Nutritionist Application Started');
}

function setupEventListeners() {
  // Send button click
  sendButton.addEventListener('click', handleSendMessage);
  
  // Enter key press
  chatInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  });

  // Sidebar toggles
  const mobileSidebarToggle = document.getElementById('mobileSidebarToggle');
  const sidebar = document.getElementById('sidebar');
  
  if (mobileSidebarToggle) {
    mobileSidebarToggle.addEventListener('click', function() {
      sidebar.classList.toggle('active');
    });
  }
}

function startConversation() {
  setTimeout(() => {
    addBotMessage("Hello! I'm your AI Nutritionist assistant. 🥗 I'm here to help you create a personalized diet plan based on your unique needs and goals. To get started, could you please tell me your name?");
  }, 1000);
}

function handleSendMessage() {
  const message = chatInput.value.trim();
  if (!message) return;

  addUserMessage(message);
  chatInput.value = '';
  
  setTimeout(() => {
    processUserMessage(message);
  }, 500);
}

function addUserMessage(message) {
  const messageDiv = document.createElement('div');
  messageDiv.className = 'chat-message user';
  messageDiv.innerHTML = `
    <div class="user-avatar">👤</div>
    <div class="message-content">
      <p>${message}</p>
    </div>
  `;
  chatContainer.appendChild(messageDiv);
  scrollToBottom();
}

function addBotMessage(message) {
  showTypingIndicator();
  
  setTimeout(() => {
    hideTypingIndicator();
    const messageDiv = document.createElement('div');
    messageDiv.className = 'chat-message bot';
    messageDiv.innerHTML = `
      <div class="bot-avatar">🥗</div>
      <div class="message-content">
        <p>${message}</p>
      </div>
    `;
    chatContainer.appendChild(messageDiv);
    scrollToBottom();
  }, 1500);
}

function addDietPlan(plan) {
  const planDiv = document.createElement('div');
  planDiv.className = 'chat-message bot';
  
  let planHTML = `
    <div class="bot-avatar">🥗</div>
    <div class="message-content">
      <div class="diet-plan">
        <h4>Your Personalized Diet Plan</h4>
  `;

  // Add meals
  ['breakfast', 'lunch', 'dinner'].forEach(mealType => {
    const meals = plan[mealType];
    if (meals && meals.length > 0) {
      const meal = meals[Math.floor(Math.random() * meals.length)];
      planHTML += `
        <div class="meal-section">
          <div class="meal-title">
            ${getMealIcon(mealType)} ${mealType.charAt(0).toUpperCase() + mealType.slice(1)}
          </div>
          <div class="meal-item">
            <div class="meal-name">${meal.name}</div>
            <div class="meal-nutrition">
              ${meal.calories} cal | Protein: ${meal.protein} | Carbs: ${meal.carbs} | Fat: ${meal.fat}
            </div>
          </div>
        </div>
      `;
    }
  });

  // Add nutrition summary
  const totalCalories = calculateTotalCalories(plan);
  planHTML += `
        <div class="nutrition-summary">
          <strong>Daily Total: ~${totalCalories} calories</strong><br>
          <small>Perfectly balanced for your ${userProfile.goal} goal!</small>
        </div>
      </div>
    </div>
  `;

  planDiv.innerHTML = planHTML;
  chatContainer.appendChild(planDiv);
  scrollToBottom();
}

function getMealIcon(mealType) {
  const icons = {
    breakfast: '🌅',
    lunch: '☀️',
    dinner: '🌙'
  };
  return icons[mealType] || '🍽️';
}

function calculateTotalCalories(plan) {
  let total = 0;
  ['breakfast', 'lunch', 'dinner'].forEach(mealType => {
    const meals = plan[mealType];
    if (meals && meals.length > 0) {
      total += meals[0].calories;
    }
  });
  return total;
}

function processUserMessage(message) {
  const lowerMessage = message.toLowerCase();

  if (conversationState === 'greeting') {
    userProfile.name = message;
    conversationState = 'collecting_info';
    onboardingStep = 1;
    addBotMessage(`Nice to meet you, ${userProfile.name}! 😊 Now, I need some basic information to create your personalized diet plan. Could you please tell me your age?`);
  }
  else if (conversationState === 'collecting_info') {
    collectUserInfo(message, lowerMessage);
  }
  else {
    handleGeneralQuery(message, lowerMessage);
  }
}

function collectUserInfo(message, lowerMessage) {
  switch(onboardingStep) {
    case 1: // Age
      const age = parseInt(message);
      if (age && age > 0 && age < 150) {
        userProfile.age = age;
        onboardingStep++;
        addBotMessage("Great! Now, could you tell me your gender? (Male/Female)");
      } else {
        addBotMessage("Please provide a valid age (a number between 1 and 150).");
      }
      break;

    case 2: // Gender
      if (lowerMessage.includes('male') || lowerMessage.includes('m')) {
        userProfile.gender = lowerMessage.includes('female') ? 'female' : 'male';
        onboardingStep++;
        addBotMessage("Perfect! Now I need your height. Please provide it in centimeters (e.g., 175) or feet and inches (e.g., 5'9\").");
      } else {
        addBotMessage("Please specify your gender as Male or Female.");
      }
      break;

    case 3: // Height
      const height = parseHeight(message);
      if (height) {
        userProfile.height = height;
        onboardingStep++;
        addBotMessage("Excellent! Now, what's your weight in kilograms? (If you know it in pounds, just mention that too)");
      } else {
        addBotMessage("Please provide a valid height in centimeters (e.g., 175) or feet and inches (e.g., 5'9\").");
      }
      break;

    case 4: // Weight
      const weight = parseWeight(message);
      if (weight) {
        userProfile.weight = weight;
        onboardingStep++;
        addBotMessage("Thanks! Now, how would you describe your daily activity level?\n\n1️⃣ Very Less (Sedentary - desk job, minimal exercise)\n2️⃣ Medium (Moderate activity - light exercise 3-5 days/week)\n3️⃣ Very Hectic (Very active - intense exercise 6-7 days/week)\n\nJust type the number or description!");
      } else {
        addBotMessage("Please provide a valid weight in kilograms (e.g., 70) or pounds (e.g., 154 lbs).");
      }
      break;

    case 5: // Activity Level
      const activityLevel = parseActivityLevel(message);
      if (activityLevel) {
        userProfile.activityLevel = activityLevel;
        onboardingStep++;
        addBotMessage("Almost done! What's your primary goal?\n\n🎯 Weight Loss\n💪 Muscle Gain\n⚖️ Weight Maintenance\n\nPlease choose one of these options!");
      } else {
        addBotMessage("Please choose your activity level:\n1️⃣ Very Less\n2️⃣ Medium\n3️⃣ Very Hectic");
      }
      break;

    case 6: // Goal
      const goal = parseGoal(message);
      if (goal) {
        userProfile.goal = goal;
        conversationState = 'ready';
        calculateAndDisplayResults();
      } else {
        addBotMessage("Please specify your goal: Weight Loss, Muscle Gain, or Weight Maintenance.");
      }
      break;
  }
}

function parseHeight(input) {
  const cm = input.match(/(\d+)\s*cm/i);
  if (cm) return parseInt(cm[1]);
  
  const feet = input.match(/(\d+)'?\s*(\d+)/);
  if (feet) {
    const ft = parseInt(feet[1]);
    const inches = parseInt(feet[2]);
    return Math.round((ft * 12 + inches) * 2.54);
  }
  
  const number = parseInt(input);
  if (number > 50 && number < 300) return number;
  
  return null;
}

function parseWeight(input) {
  const lbs = input.match(/(\d+)\s*lbs?/i);
  if (lbs) return Math.round(parseInt(lbs[1]) * 0.453592);
  
  const kg = input.match(/(\d+)\s*kg/i);
  if (kg) return parseInt(kg[1]);
  
  const number = parseInt(input);
  if (number > 20 && number < 500) return number;
  
  return null;
}

function parseActivityLevel(input) {
  const lower = input.toLowerCase();
  if (lower.includes('1') || lower.includes('very less') || lower.includes('sedentary')) {
    return 'very_less';
  }
  if (lower.includes('2') || lower.includes('medium') || lower.includes('moderate')) {
    return 'medium';
  }
  if (lower.includes('3') || lower.includes('very hectic') || lower.includes('very active')) {
    return 'very_hectic';
  }
  return null;
}

function parseGoal(input) {
  const lower = input.toLowerCase();
  if (lower.includes('weight loss') || lower.includes('lose weight') || lower.includes('loss')) {
    return 'weight_loss';
  }
  if (lower.includes('muscle gain') || lower.includes('gain muscle') || lower.includes('muscle') || lower.includes('gain')) {
    return 'muscle_gain';
  }
  if (lower.includes('maintenance') || lower.includes('maintain')) {
    return 'maintenance';
  }
  return null;
}

function calculateAndDisplayResults() {
  // Calculate BMR using Mifflin-St Jeor equation
  let bmr;
  if (userProfile.gender === 'male') {
    bmr = 10 * userProfile.weight + 6.25 * userProfile.height - 5 * userProfile.age + 5;
  } else {
    bmr = 10 * userProfile.weight + 6.25 * userProfile.height - 5 * userProfile.age - 161;
  }

  // Calculate daily calories with activity multiplier
  const activityMultiplier = applicationData.activity_levels[userProfile.activityLevel];
  const dailyCalories = Math.round(bmr * activityMultiplier);

  // Adjust calories based on goal
  let targetCalories = dailyCalories;
  if (userProfile.goal === 'weight_loss') {
    targetCalories = dailyCalories - 500; // 500 calorie deficit
  } else if (userProfile.goal === 'muscle_gain') {
    targetCalories = dailyCalories + 300; // 300 calorie surplus
  }

  userProfile.bmr = Math.round(bmr);
  userProfile.dailyCalories = targetCalories;

  // Update profile display
  updateProfileDisplay();

  // Send results message
  addBotMessage(`Perfect! I've calculated your nutritional needs:

📊 **Your Results:**
• BMR (Basal Metabolic Rate): ${userProfile.bmr} calories
• Daily Calorie Target: ${targetCalories} calories
• Goal: ${formatGoal(userProfile.goal)}

🎯 Based on your profile, I've created a personalized diet plan just for you! Let me show you what your meals could look like...`);

  // Generate and display diet plan
  setTimeout(() => {
    const mealPlan = generateMealPlan();
    addDietPlan(mealPlan);
    
    setTimeout(() => {
      addBotMessage(`There you have it! This meal plan is tailored specifically for your ${formatGoal(userProfile.goal)} goal. 

You can ask me questions like:
• "Can you suggest alternatives for breakfast?"
• "How many grams of protein should I eat daily?"
• "Give me a nutrition tip"
• "Create a new meal plan"

What would you like to know? 😊`);
    }, 2000);
  }, 3000);
}

function formatGoal(goal) {
  const goalMap = {
    'weight_loss': 'Weight Loss',
    'muscle_gain': 'Muscle Gain',
    'maintenance': 'Weight Maintenance'
  };
  return goalMap[goal] || goal;
}

function generateMealPlan() {
  let planType = 'weight_loss'; // default
  
  if (userProfile.goal === 'muscle_gain') {
    planType = 'muscle_gain';
  } else if (userProfile.goal === 'weight_loss') {
    planType = 'weight_loss';
  }

  return applicationData.sample_meals[planType];
}

function updateProfileDisplay() {
  // Update profile card
  profileCard.innerHTML = `
    <div class="profile-info">
      <h4>${userProfile.name}</h4>
      <p>${userProfile.age} years old, ${userProfile.gender}</p>
      <p>${userProfile.height}cm, ${userProfile.weight}kg</p>
      <p>Activity: ${formatActivityLevel(userProfile.activityLevel)}</p>
    </div>
  `;

  // Update stats
  document.getElementById('dailyCalories').textContent = userProfile.dailyCalories + ' cal';
  document.getElementById('bmrValue').textContent = userProfile.bmr + ' cal';
  document.getElementById('userGoal').textContent = formatGoal(userProfile.goal);

  // Show stats section
  statsSection.style.display = 'block';
}

function formatActivityLevel(level) {
  const levelMap = {
    'very_less': 'Sedentary',
    'medium': 'Moderate',
    'very_hectic': 'Very Active'
  };
  return levelMap[level] || level;
}

function handleGeneralQuery(message, lowerMessage) {
  // Handle various user queries
  if (lowerMessage.includes('new plan') || lowerMessage.includes('new meal') || lowerMessage.includes('different plan')) {
    const mealPlan = generateMealPlan();
    addBotMessage("Here's a fresh meal plan for you!");
    setTimeout(() => {
      addDietPlan(mealPlan);
    }, 1000);
  }
  else if (lowerMessage.includes('tip') || lowerMessage.includes('advice')) {
    const randomTip = applicationData.nutrition_tips[Math.floor(Math.random() * applicationData.nutrition_tips.length)];
    addBotMessage(`💡 **Nutrition Tip:** ${randomTip}`);
  }
  else if (lowerMessage.includes('protein')) {
    const proteinAmount = Math.round(userProfile.weight * (userProfile.goal === 'muscle_gain' ? 2.2 : 1.6));
    addBotMessage(`Based on your goals, you should aim for approximately **${proteinAmount}g of protein daily**. This helps with muscle maintenance and recovery! 💪`);
  }
  else if (lowerMessage.includes('water') || lowerMessage.includes('hydration')) {
    const waterAmount = Math.round(userProfile.weight * 35);
    addBotMessage(`You should drink approximately **${waterAmount}ml (${Math.round(waterAmount/250)} glasses) of water daily** for optimal hydration! 💧`);
  }
  else if (lowerMessage.includes('breakfast') || lowerMessage.includes('lunch') || lowerMessage.includes('dinner')) {
    const mealType = lowerMessage.includes('breakfast') ? 'breakfast' : 
                     lowerMessage.includes('lunch') ? 'lunch' : 'dinner';
    provideMealAlternatives(mealType);
  }
  else if (lowerMessage.includes('calorie') || lowerMessage.includes('calories')) {
    addBotMessage(`Your daily calorie target is **${userProfile.dailyCalories} calories**. This is calculated based on your BMR (${userProfile.bmr} calories) and activity level, adjusted for your ${formatGoal(userProfile.goal)} goal! 📊`);
  }
  else if (lowerMessage.includes('thank') || lowerMessage.includes('thanks')) {
    addBotMessage("You're very welcome! I'm here to help you achieve your nutrition goals. Feel free to ask me anything about diet, nutrition, or healthy eating! 😊");
  }
  else {
    // General nutrition advice
    addBotMessage(`I'd be happy to help with that! As your AI nutritionist, I can assist you with:

🥗 **Meal planning** - "Create a new meal plan"
💡 **Nutrition tips** - "Give me a nutrition tip"  
🍳 **Meal alternatives** - "Suggest breakfast alternatives"
📊 **Calorie information** - "How many calories should I eat?"
💪 **Protein requirements** - "How much protein do I need?"

What specific aspect of nutrition would you like to discuss?`);
  }
}

function provideMealAlternatives(mealType) {
  const goalType = userProfile.goal === 'muscle_gain' ? 'muscle_gain' : 'weight_loss';
  const meals = applicationData.sample_meals[goalType][mealType];
  
  if (meals && meals.length > 0) {
    let alternatives = `Here are some great ${mealType} alternatives for you:\n\n`;
    meals.forEach((meal, index) => {
      alternatives += `${index + 1}. **${meal.name}**\n   ${meal.calories} cal | Protein: ${meal.protein} | Carbs: ${meal.carbs} | Fat: ${meal.fat}\n\n`;
    });
    alternatives += `All of these are perfect for your ${formatGoal(userProfile.goal)} goal! 🎯`;
    addBotMessage(alternatives);
  }
}

// Quick action functions
function requestNewPlan() {
  if (conversationState === 'ready') {
    const mealPlan = generateMealPlan();
    addBotMessage("Here's a fresh personalized meal plan for you!");
    setTimeout(() => {
      addDietPlan(mealPlan);
    }, 1000);
  } else {
    addBotMessage("Please complete your profile setup first so I can create a personalized meal plan for you!");
  }
}

function askNutritionTip() {
  const randomTip = applicationData.nutrition_tips[Math.floor(Math.random() * applicationData.nutrition_tips.length)];
  addBotMessage(`💡 **Nutrition Tip:** ${randomTip}`);
}

function resetProfile() {
  userProfile = {};
  conversationState = 'greeting';
  onboardingStep = 0;
  
  // Reset UI
  profileCard.innerHTML = `
    <div class="profile-placeholder">
      <div class="profile-icon">👤</div>
      <p>Complete your profile to get started!</p>
    </div>
  `;
  statsSection.style.display = 'none';
  
  // Clear chat and restart
  chatContainer.innerHTML = `
    <div class="welcome-message">
      <div class="bot-avatar">🥗</div>
      <div class="message-content">
        <h3>Welcome to Your AI Nutritionist! 👋</h3>
        <p>I'm here to help you create personalized diet plans and provide nutrition guidance. Let's start by getting to know you better!</p>
      </div>
    </div>
  `;
  
  setTimeout(() => {
    addBotMessage("Hello again! Let's start fresh. What's your name? 😊");
  }, 1000);
}

// Utility functions
function showTypingIndicator() {
  typingIndicator.style.display = 'flex';
  scrollToBottom();
}

function hideTypingIndicator() {
  typingIndicator.style.display = 'none';
}

function scrollToBottom() {
  chatContainer.scrollTop = chatContainer.scrollHeight;
}
