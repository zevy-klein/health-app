import React, { useState, useEffect } from 'react';
import { Calendar, Moon, Utensils, CheckCircle, Circle, TrendingUp, Clock, Heart } from 'lucide-react';

const WellnessTracker = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [currentWeek, setCurrentWeek] = useState(1);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [dailyData, setDailyData] = useState({});
  const [loading, setLoading] = useState(true);
  const [onboardingComplete, setOnboardingComplete] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [userData, setUserData] = useState({
    name: '',
    startDate: '',
    targetCalories: 2700,
    currentBedtime: '1:00 AM'
  });
  const [selectedMealType, setSelectedMealType] = useState(null);
  const [mealSearchQuery, setMealSearchQuery] = useState('');
  const [customMeal, setCustomMeal] = useState({ name: '', calories: '', protein: '' });

  // Week-by-week bedtime goals
  const weeklyGoals = {
    1: { bedtime: '1:00 AM', wake: '7:00 AM', targetSleep: 6 },
    2: { bedtime: '12:30 AM', wake: '7:00 AM', targetSleep: 6.5 },
    3: { bedtime: '12:00 AM', wake: '7:00 AM', targetSleep: 7 },
    4: { bedtime: '11:30 PM', wake: '7:00 AM', targetSleep: 7.5 }
  };

  // Daily routine checklist
  const dailyRoutine = [
    { id: 'wake', time: '7:00 AM', task: 'Wake up', type: 'routine' },
    { id: 'shacharit', time: '7:15 AM', task: 'Shacharit', type: 'davening' },
    { id: 'chavrusa', time: '8:30 AM', task: 'Chavrusa learning', type: 'learning' },
    { id: 'breakfast', time: '9:30 AM', task: 'Breakfast', type: 'meal' },
    { id: 'work1', time: '10:30 AM', task: 'Work block 1', type: 'work' },
    { id: 'lunch', time: '1:00 PM', task: 'Lunch', type: 'meal' },
    { id: 'mincha', time: '1:30 PM', task: 'Mincha', type: 'davening' },
    { id: 'work2', time: '2:00 PM', task: 'Work block 2', type: 'work' },
    { id: 'snack', time: '4:00 PM', task: 'Afternoon snack', type: 'meal' },
    { id: 'dinner', time: '6:30 PM', task: 'Dinner', type: 'meal' },
    { id: 'learning', time: '8:00 PM', task: 'Evening learning/therapy work', type: 'learning' },
    { id: 'maariv', time: '10:00 PM', task: 'Maariv', type: 'davening' },
    { id: 'winddown', time: '10:30 PM', task: 'Wind down (no screens)', type: 'routine' },
    { id: 'sleep', time: weeklyGoals[currentWeek].bedtime, task: 'Bedtime', type: 'routine' }
  ];

  // Kosher meal suggestions - EXPANDED
  const mealSuggestions = {
    breakfast: [
      // Egg dishes
      { name: 'Scrambled eggs with toast', calories: 400, protein: 24 },
      { name: 'Scrambled eggs with whole wheat toast', calories: 420, protein: 26 },
      { name: 'Fried eggs (2) with toast', calories: 380, protein: 22 },
      { name: 'Hard boiled eggs (3) with toast', calories: 350, protein: 25 },
      { name: 'Shakshuka with pita', calories: 550, protein: 22 },
      { name: 'Shakshuka with challah', calories: 580, protein: 24 },
      { name: 'Egg and cheese sandwich', calories: 480, protein: 28 },
      { name: 'Veggie omelet with toast', calories: 450, protein: 26 },
      { name: 'Spanish omelet with potatoes', calories: 520, protein: 24 },
      { name: 'Eggs Benedict (pareve)', calories: 500, protein: 25 },
      
      // Fish dishes
      { name: 'Tuna salad on bagel', calories: 500, protein: 28 },
      { name: 'Tuna salad on whole wheat', calories: 450, protein: 30 },
      { name: 'Smoked salmon and cream cheese bagel', calories: 520, protein: 26 },
      { name: 'Lox and eggs', calories: 480, protein: 32 },
      { name: 'Tuna melt', calories: 550, protein: 34 },
      
      // Dairy
      { name: 'Greek yogurt with granola', calories: 350, protein: 20 },
      { name: 'Greek yogurt with honey and nuts', calories: 420, protein: 22 },
      { name: 'Cottage cheese with fruit', calories: 300, protein: 25 },
      { name: 'Cottage cheese with granola', calories: 380, protein: 28 },
      { name: 'Yogurt parfait with berries', calories: 340, protein: 18 },
      { name: 'Cheese toast (2 slices)', calories: 420, protein: 20 },
      { name: 'Cheese and veggie omelet', calories: 480, protein: 30 },
      { name: 'Blintzes with sour cream', calories: 450, protein: 16 },
      
      // Grains & cereals
      { name: 'Oatmeal with nuts and honey', calories: 450, protein: 12 },
      { name: 'Oatmeal with banana and peanut butter', calories: 480, protein: 14 },
      { name: 'Overnight oats with fruit', calories: 420, protein: 12 },
      { name: 'Granola with milk', calories: 400, protein: 14 },
      { name: 'Cheerios with milk and banana', calories: 320, protein: 10 },
      { name: 'Whole wheat pancakes with syrup', calories: 520, protein: 14 },
      { name: 'French toast (2 slices)', calories: 480, protein: 16 },
      { name: 'Whole wheat toast with avocado', calories: 380, protein: 10 },
      { name: 'Bagel with butter', calories: 400, protein: 12 },
      { name: 'Bagel with cream cheese', calories: 450, protein: 14 },
      { name: 'English muffin with eggs', calories: 420, protein: 24 },
      
      // Israeli/Middle Eastern
      { name: 'Pita with hummus and hard boiled egg', calories: 420, protein: 20 },
      { name: 'Israeli salad with feta and pita', calories: 380, protein: 16 },
      { name: 'Labneh with za\'atar and pita', calories: 360, protein: 18 },
      { name: 'Burekas (2) with yogurt', calories: 520, protein: 18 },
      
      // Other
      { name: 'Protein smoothie with banana', calories: 380, protein: 25 },
      { name: 'Breakfast burrito (eggs, cheese, veggies)', calories: 550, protein: 28 },
      { name: 'Avocado toast with eggs', calories: 480, protein: 22 },
      { name: 'Quinoa breakfast bowl', calories: 420, protein: 16 }
    ],
    lunch: [
      // Sandwiches & Wraps
      { name: 'Grilled chicken sandwich', calories: 650, protein: 42 },
      { name: 'Grilled chicken wrap', calories: 580, protein: 40 },
      { name: 'Turkey sandwich on whole wheat', calories: 550, protein: 36 },
      { name: 'Turkey and avocado sandwich', calories: 580, protein: 38 },
      { name: 'Turkey club sandwich', calories: 680, protein: 42 },
      { name: 'Tuna wrap with vegetables', calories: 550, protein: 35 },
      { name: 'Tuna sandwich on rye', calories: 520, protein: 32 },
      { name: 'Tuna melt with fries', calories: 780, protein: 38 },
      { name: 'Egg salad sandwich', calories: 480, protein: 22 },
      { name: 'Falafel in pita', calories: 520, protein: 18 },
      { name: 'Chicken schnitzel sandwich', calories: 720, protein: 38 },
      { name: 'Pastrami sandwich', calories: 650, protein: 40 },
      { name: 'Roast beef sandwich', calories: 620, protein: 42 },
      
      // Bowls & Salads
      { name: 'Hummus bowl with falafel', calories: 600, protein: 20 },
      { name: 'Chicken Caesar salad', calories: 580, protein: 44 },
      { name: 'Greek salad with feta and olives', calories: 420, protein: 16 },
      { name: 'Tuna salad bowl', calories: 480, protein: 38 },
      { name: 'Salmon salad with quinoa', calories: 520, protein: 40 },
      { name: 'Chicken and avocado salad', calories: 550, protein: 42 },
      { name: 'Mediterranean bowl (hummus, falafel, salad)', calories: 620, protein: 22 },
      { name: 'Burrito bowl (chicken, rice, beans)', calories: 680, protein: 40 },
      { name: 'Poke bowl (salmon, rice, veggies)', calories: 650, protein: 38 },
      { name: 'Cobb salad', calories: 620, protein: 38 },
      
      // Hot meals
      { name: 'Leftover chicken with rice', calories: 650, protein: 45 },
      { name: 'Grilled salmon with vegetables', calories: 580, protein: 42 },
      { name: 'Chicken stir-fry with rice', calories: 620, protein: 40 },
      { name: 'Beef stir-fry with noodles', calories: 680, protein: 38 },
      { name: 'Pasta with marinara and meatballs', calories: 750, protein: 36 },
      { name: 'Chicken quesadilla', calories: 620, protein: 36 },
      { name: 'Fish and chips', calories: 800, protein: 32 },
      { name: 'Grilled chicken with couscous', calories: 580, protein: 42 },
      { name: 'Turkey meatballs with pasta', calories: 680, protein: 38 },
      
      // Soups & Lighter
      { name: 'Chicken soup with matzo balls', calories: 420, protein: 24 },
      { name: 'Lentil soup with bread', calories: 380, protein: 18 },
      { name: 'Split pea soup', calories: 350, protein: 16 },
      { name: 'Vegetable soup with challah', calories: 320, protein: 12 },
      { name: 'Minestrone soup with bread', calories: 400, protein: 14 },
      
      // Israeli/Middle Eastern
      { name: 'Shawarma plate with rice', calories: 720, protein: 42 },
      { name: 'Schnitzel with fries and salad', calories: 820, protein: 40 },
      { name: 'Sabich (eggplant, egg, hummus)', calories: 580, protein: 20 },
      { name: 'Jerusalem mixed grill', calories: 680, protein: 48 }
    ],
    dinner: [
      // Chicken
      { name: 'Roasted chicken with vegetables', calories: 850, protein: 55 },
      { name: 'Roasted chicken with rice and salad', calories: 880, protein: 52 },
      { name: 'Grilled chicken breast with quinoa', calories: 780, protein: 54 },
      { name: 'Chicken schnitzel with salad', calories: 880, protein: 52 },
      { name: 'Chicken schnitzel with mashed potatoes', calories: 950, protein: 50 },
      { name: 'Chicken stir-fry with rice', calories: 820, protein: 48 },
      { name: 'Chicken curry with rice', calories: 850, protein: 46 },
      { name: 'BBQ chicken with sweet potato', calories: 820, protein: 50 },
      { name: 'Chicken fajitas', calories: 780, protein: 48 },
      { name: 'Chicken teriyaki with vegetables', calories: 800, protein: 46 },
      { name: 'Honey garlic chicken with rice', calories: 850, protein: 48 },
      { name: 'Lemon herb chicken with potatoes', calories: 820, protein: 50 },
      
      // Fish & Seafood
      { name: 'Grilled salmon with quinoa', calories: 800, protein: 50 },
      { name: 'Baked fish with sweet potato', calories: 750, protein: 45 },
      { name: 'Salmon teriyaki with rice', calories: 850, protein: 48 },
      { name: 'Fish tacos (3)', calories: 720, protein: 38 },
      { name: 'Grilled tilapia with vegetables', calories: 680, protein: 42 },
      { name: 'Tuna steak with salad', calories: 650, protein: 52 },
      { name: 'Gefilte fish with horseradish and sides', calories: 450, protein: 28 },
      { name: 'Baked cod with lemon and rice', calories: 720, protein: 44 },
      
      // Beef
      { name: 'Beef stir-fry with rice', calories: 900, protein: 48 },
      { name: 'Grilled steak with baked potato', calories: 950, protein: 54 },
      { name: 'Steak with roasted vegetables', calories: 880, protein: 52 },
      { name: 'Beef kebabs with rice', calories: 850, protein: 46 },
      { name: 'Meatballs with spaghetti', calories: 920, protein: 42 },
      { name: 'Beef tacos (3)', calories: 780, protein: 40 },
      { name: 'Pot roast with vegetables', calories: 820, protein: 48 },
      { name: 'Beef burgers (2) with salad', calories: 850, protein: 50 },
      { name: 'London broil with roasted potatoes', calories: 900, protein: 52 },
      
      // Lamb
      { name: 'Lamb chops with couscous', calories: 920, protein: 50 },
      { name: 'Grilled lamb with vegetables', calories: 880, protein: 48 },
      { name: 'Lamb kebabs with rice', calories: 850, protein: 46 },
      { name: 'Lamb shawarma plate', calories: 820, protein: 44 },
      
      // Vegetarian/Lighter
      { name: 'Vegetable stir-fry with tofu', calories: 520, protein: 24 },
      { name: 'Eggplant parmesan with salad', calories: 680, protein: 28 },
      { name: 'Falafel plate with hummus and salad', calories: 650, protein: 22 },
      { name: 'Veggie burger with sweet potato fries', calories: 720, protein: 26 },
      { name: 'Portobello mushroom with quinoa', calories: 580, protein: 20 },
      
      // Traditional/Comfort
      { name: 'Brisket with potatoes and carrots', calories: 920, protein: 52 },
      { name: 'Cholent (meat, potatoes, beans)', calories: 850, protein: 42 },
      { name: 'Stuffed cabbage rolls', calories: 680, protein: 36 },
      { name: 'Roasted turkey with sides', calories: 880, protein: 54 },
      
      // International
      { name: 'Sushi platter (12 pieces)', calories: 580, protein: 32 },
      { name: 'Pad Thai with chicken', calories: 820, protein: 38 },
      { name: 'Chicken tikka masala with naan', calories: 880, protein: 44 },
      { name: 'Lasagna (meat)', calories: 850, protein: 40 },
      { name: 'Pizza (3 slices, cheese)', calories: 750, protein: 36 }
    ],
    snack: [
      // Nuts & Seeds
      { name: 'Handful of almonds (1 oz)', calories: 180, protein: 6 },
      { name: 'Cashews (1 oz)', calories: 160, protein: 5 },
      { name: 'Mixed nuts (1 oz)', calories: 170, protein: 5 },
      { name: 'Pistachios (1 oz)', calories: 160, protein: 6 },
      { name: 'Sunflower seeds (1 oz)', calories: 165, protein: 6 },
      { name: 'Trail mix (1/2 cup)', calories: 280, protein: 8 },
      
      // Fruits
      { name: 'Apple with peanut butter', calories: 200, protein: 8 },
      { name: 'Banana with almond butter', calories: 220, protein: 6 },
      { name: 'Apple slices (1 apple)', calories: 95, protein: 0 },
      { name: 'Banana', calories: 105, protein: 1 },
      { name: 'Orange', calories: 65, protein: 1 },
      { name: 'Grapes (1 cup)', calories: 100, protein: 1 },
      { name: 'Berries (1 cup)', calories: 70, protein: 1 },
      
      // Dairy
      { name: 'String cheese and crackers', calories: 220, protein: 12 },
      { name: 'String cheese (2)', calories: 160, protein: 14 },
      { name: 'Yogurt cup', calories: 150, protein: 12 },
      { name: 'Greek yogurt (plain)', calories: 100, protein: 17 },
      { name: 'Cottage cheese (1/2 cup)', calories: 110, protein: 14 },
      { name: 'Cheese and crackers', calories: 200, protein: 10 },
      
      // Protein
      { name: 'Hard boiled eggs (2)', calories: 140, protein: 12 },
      { name: 'Hard boiled egg (1)', calories: 70, protein: 6 },
      { name: 'Protein bar', calories: 250, protein: 20 },
      { name: 'Protein shake', calories: 180, protein: 25 },
      { name: 'Beef jerky (1 oz)', calories: 116, protein: 9 },
      { name: 'Turkey slices (2 oz)', calories: 60, protein: 12 },
      
      // Veggies & Dips
      { name: 'Hummus with carrots', calories: 150, protein: 5 },
      { name: 'Hummus with pita', calories: 220, protein: 8 },
      { name: 'Guacamole with chips', calories: 240, protein: 3 },
      { name: 'Veggies with ranch dip', calories: 180, protein: 2 },
      { name: 'Celery with peanut butter', calories: 140, protein: 6 },
      
      // Baked goods
      { name: 'Granola bar', calories: 150, protein: 3 },
      { name: 'Muffin (small)', calories: 220, protein: 4 },
      { name: 'Banana bread slice', calories: 200, protein: 3 },
      { name: 'Rice cakes with peanut butter', calories: 180, protein: 7 },
      { name: 'Whole wheat crackers (10)', calories: 140, protein: 3 },
      { name: 'Pretzels (1 oz)', calories: 110, protein: 3 },
      { name: 'Popcorn (3 cups)', calories: 100, protein: 3 },
      
      // Other
      { name: 'Protein smoothie', calories: 220, protein: 15 },
      { name: 'Peanut butter sandwich (half)', calories: 190, protein: 8 },
      { name: 'Energy balls (2)', calories: 180, protein: 6 },
      { name: 'Dark chocolate (1 oz)', calories: 170, protein: 2 }
    ]
  };

  // Load data from storage
  useEffect(() => {
    const loadData = async () => {
      try {
        const result = await window.storage.get('wellness-data');
        if (result) {
          const data = JSON.parse(result.value);
          setDailyData(data.dailyData || {});
          setCurrentWeek(data.currentWeek || 1);
          setOnboardingComplete(data.onboardingComplete || false);
          setUserData(data.userData || {
            name: '',
            startDate: '',
            targetCalories: 2700,
            currentBedtime: '1:00 AM'
          });
        }
      } catch (error) {
        console.log('No previous data found, starting fresh');
      }
      setLoading(false);
    };
    loadData();
  }, []);

  // Save data to storage
  const saveData = async (newDailyData, newWeek, newUserData, newOnboardingComplete) => {
    try {
      await window.storage.set('wellness-data', JSON.stringify({
        dailyData: newDailyData,
        currentWeek: newWeek,
        userData: newUserData || userData,
        onboardingComplete: newOnboardingComplete !== undefined ? newOnboardingComplete : onboardingComplete
      }));
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  // Get or initialize today's data
  const getTodayData = () => {
    if (!dailyData[selectedDate]) {
      return {
        routineChecked: {},
        meals: {},
        sleepTime: null,
        wakeTime: null,
        notes: ''
      };
    }
    return dailyData[selectedDate];
  };

  const updateTodayData = (updates) => {
    const newDailyData = {
      ...dailyData,
      [selectedDate]: {
        ...getTodayData(),
        ...updates
      }
    };
    setDailyData(newDailyData);
    saveData(newDailyData, currentWeek);
  };

  const toggleRoutineItem = (itemId) => {
    const todayData = getTodayData();
    const newChecked = {
      ...todayData.routineChecked,
      [itemId]: !todayData.routineChecked[itemId]
    };
    updateTodayData({ routineChecked: newChecked });
  };

  const logMeal = (mealType, meal) => {
    const todayData = getTodayData();
    const newMeals = {
      ...todayData.meals,
      [mealType]: meal
    };
    updateTodayData({ meals: newMeals });
    setSelectedMealType(null);
    setMealSearchQuery('');
    setCustomMeal({ name: '', calories: '', protein: '' });
  };

  const logCustomMeal = (mealType) => {
    if (!customMeal.name || !customMeal.calories) {
      alert('Please enter meal name and calories');
      return;
    }
    logMeal(mealType, {
      name: customMeal.name,
      calories: parseInt(customMeal.calories),
      protein: parseInt(customMeal.protein) || 0
    });
  };

  const getFilteredMeals = (mealType) => {
    if (!mealSearchQuery) return mealSuggestions[mealType];
    return mealSuggestions[mealType].filter(meal =>
      meal.name.toLowerCase().includes(mealSearchQuery.toLowerCase())
    );
  };

  const completeOnboarding = () => {
    if (!userData.name || !userData.startDate) {
      alert('Please fill in all required fields');
      return;
    }
    setOnboardingComplete(true);
    saveData(dailyData, currentWeek, userData, true);
  };

  const getTotalCalories = () => {
    const todayData = getTodayData();
    return Object.values(todayData.meals || {}).reduce((sum, meal) => sum + (meal.calories || 0), 0);
  };

  const getCompletionRate = () => {
    const todayData = getTodayData();
    const checked = Object.values(todayData.routineChecked || {}).filter(Boolean).length;
    return Math.round((checked / dailyRoutine.length) * 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your wellness journey...</p>
        </div>
      </div>
    );
  }

  // Onboarding flow
  if (!onboardingComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl p-8">
          {onboardingStep === 0 && (
            <div className="text-center">
              <div className="mb-6">
                <Heart className="text-red-500 mx-auto mb-4" size={64} />
                <h1 className="text-4xl font-bold text-gray-800 mb-2">Welcome to Your Healing Journey</h1>
                <p className="text-lg text-gray-600">
                  A trauma-informed wellness tracker designed specifically for you
                </p>
              </div>
              
              <div className="space-y-4 text-left my-8 bg-indigo-50 p-6 rounded-xl">
                <div className="flex items-start gap-3">
                  <CheckCircle className="text-green-600 flex-shrink-0 mt-1" size={20} />
                  <p className="text-gray-700">Track your daily routine with gentle accountability</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="text-green-600 flex-shrink-0 mt-1" size={20} />
                  <p className="text-gray-700">Log kosher meals with hundreds of options or add your own</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="text-green-600 flex-shrink-0 mt-1" size={20} />
                  <p className="text-gray-700">Gradually improve sleep with 4-week bedtime progression</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="text-green-600 flex-shrink-0 mt-1" size={20} />
                  <p className="text-gray-700">Build eating patterns that work with your nervous system, not against it</p>
                </div>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg border-2 border-yellow-200 mb-6">
                <p className="text-sm text-yellow-800">
                  <strong>Important:</strong> This app is designed for trauma recovery. Your eating and sleep patterns 
                  are nervous system responses, not willpower issues. We'll work with your body, not against it.
                </p>
              </div>

              <button
                onClick={() => setOnboardingStep(1)}
                className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold text-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg"
              >
                Let's Get Started →
              </button>
            </div>
          )}

          {onboardingStep === 1 && (
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Tell Us About You</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    What should we call you? <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={userData.name}
                    onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                    placeholder="Your first name"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none text-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    When do you want to start this journey? <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={userData.startDate}
                    onChange={(e) => setUserData({ ...userData, startDate: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none text-lg"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    This will be Day 1 of Week 1. Choose today or a future date.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Daily calorie goal
                  </label>
                  <input
                    type="number"
                    value={userData.targetCalories}
                    onChange={(e) => setUserData({ ...userData, targetCalories: parseInt(e.target.value) })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none text-lg"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Recommended: 2,500-2,800 calories for a 24-year-old male
                  </p>
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <button
                  onClick={() => setOnboardingStep(0)}
                  className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-300 transition-all"
                >
                  ← Back
                </button>
                <button
                  onClick={() => setOnboardingStep(2)}
                  className="flex-1 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold hover:from-indigo-700 hover:to-purple-700 transition-all"
                >
                  Continue →
                </button>
              </div>
            </div>
          )}

          {onboardingStep === 2 && (
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Your Sleep Journey</h2>
              <p className="text-gray-600 mb-6">
                We'll help you gradually shift your bedtime over 4 weeks. This gives your nervous system time to adjust.
              </p>

              <div className="bg-indigo-50 p-6 rounded-xl mb-6">
                <h3 className="font-bold text-indigo-900 mb-4">The 4-Week Plan:</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 bg-white p-3 rounded-lg">
                    <span className="bg-indigo-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0">1</span>
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">Week 1: Bedtime 1:00 AM</p>
                      <p className="text-sm text-gray-600">Target: 6 hours sleep</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-white p-3 rounded-lg">
                    <span className="bg-indigo-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0">2</span>
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">Week 2: Bedtime 12:30 AM</p>
                      <p className="text-sm text-gray-600">Target: 6.5 hours sleep</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-white p-3 rounded-lg">
                    <span className="bg-indigo-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0">3</span>
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">Week 3: Bedtime 12:00 AM</p>
                      <p className="text-sm text-gray-600">Target: 7 hours sleep</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-white p-3 rounded-lg">
                    <span className="bg-indigo-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0">4</span>
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">Week 4: Bedtime 11:30 PM</p>
                      <p className="text-sm text-gray-600">Target: 7.5 hours sleep</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 p-4 rounded-lg border-2 border-green-200 mb-6">
                <p className="text-sm text-green-800">
                  <strong>Why gradual?</strong> Research shows that trauma survivors need gentle transitions. 
                  A 30-minute shift per week lets your body adapt without triggering stress responses.
                </p>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setOnboardingStep(1)}
                  className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-300 transition-all"
                >
                  ← Back
                </button>
                <button
                  onClick={() => setOnboardingStep(3)}
                  className="flex-1 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold hover:from-indigo-700 hover:to-purple-700 transition-all"
                >
                  Continue →
                </button>
              </div>
            </div>
          )}

          {onboardingStep === 3 && (
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Your Daily Routine</h2>
              <p className="text-gray-600 mb-6">
                Here's the routine we've designed based on your schedule:
              </p>

              <div className="bg-gray-50 p-6 rounded-xl mb-6 max-h-96 overflow-y-auto">
                {dailyRoutine.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 mb-3 pb-3 border-b border-gray-200 last:border-0">
                    <Clock size={16} className="text-gray-500 flex-shrink-0" />
                    <span className="font-medium text-gray-700 w-20 flex-shrink-0">{item.time}</span>
                    <span className="text-gray-800">{item.task}</span>
                  </div>
                ))}
              </div>

              <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-200 mb-6">
                <p className="text-sm text-blue-800">
                  <strong>Important:</strong> This routine includes your 8:30 AM chavrusa, davening times, 
                  structured meals, and 7 hours of work. You can adjust as needed once you start.
                </p>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setOnboardingStep(2)}
                  className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-300 transition-all"
                >
                  ← Back
                </button>
                <button
                  onClick={completeOnboarding}
                  className="flex-1 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg"
                >
                  Start My Journey! 🎯
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                <Heart className="text-red-500" />
                {userData.name ? `${userData.name}'s Wellness Journey` : 'Your Wellness Journey'}
              </h1>
              <p className="text-gray-600 mt-1">Healing through routine, one day at a time</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Week {currentWeek} of 4</p>
              <p className="text-lg font-semibold text-indigo-600">Goal: {weeklyGoals[currentWeek].bedtime} bedtime</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex gap-2 mb-6 bg-white rounded-xl p-2 shadow-lg">
          {['dashboard', 'routine', 'meals', 'progress'].map((view) => (
            <button
              key={view}
              onClick={() => setCurrentView(view)}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                currentView === view
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {view.charAt(0).toUpperCase() + view.slice(1)}
            </button>
          ))}
        </div>

        {/* Dashboard View */}
        {currentView === 'dashboard' && (
          <div className="grid md:grid-cols-2 gap-6">
            {/* Today's Stats */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <TrendingUp className="text-green-500" />
                Today's Progress
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
                  <span className="font-medium text-gray-700">Routine Completion</span>
                  <span className="text-2xl font-bold text-blue-600">{getCompletionRate()}%</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                  <span className="font-medium text-gray-700">Calories Today</span>
                  <span className="text-2xl font-bold text-green-600">{getTotalCalories()} / 2700</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-purple-50 rounded-lg">
                  <span className="font-medium text-gray-700">Target Sleep</span>
                  <span className="text-2xl font-bold text-purple-600">{weeklyGoals[currentWeek].targetSleep}h</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Log</h2>
              <div className="space-y-3">
                <button
                  onClick={() => setCurrentView('meals')}
                  className="w-full p-4 bg-gradient-to-r from-orange-400 to-orange-500 text-white rounded-lg hover:from-orange-500 hover:to-orange-600 transition-all shadow-md flex items-center justify-between"
                >
                  <span className="font-medium">Log a Meal</span>
                  <Utensils />
                </button>
                <button
                  onClick={() => setCurrentView('routine')}
                  className="w-full p-4 bg-gradient-to-r from-blue-400 to-blue-500 text-white rounded-lg hover:from-blue-500 hover:to-blue-600 transition-all shadow-md flex items-center justify-between"
                >
                  <span className="font-medium">Check Routine</span>
                  <CheckCircle />
                </button>
                <div className="p-4 bg-yellow-50 rounded-lg border-2 border-yellow-200">
                  <p className="text-sm font-medium text-yellow-800 mb-2">💡 Trauma-Informed Reminder</p>
                  <p className="text-sm text-yellow-700">Your body's hunger cues are healing. Eat at scheduled times even if not hungry.</p>
                </div>
              </div>
            </div>

            {/* 4-Week Progression */}
            <div className="bg-white rounded-2xl shadow-xl p-6 md:col-span-2">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Moon className="text-indigo-500" />
                Your 4-Week Sleep Journey
              </h2>
              <div className="grid grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((week) => (
                  <div
                    key={week}
                    onClick={() => setCurrentWeek(week)}
                    className={`p-4 rounded-lg cursor-pointer transition-all ${
                      week === currentWeek
                        ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg scale-105'
                        : week < currentWeek
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    <p className="font-bold text-lg">Week {week}</p>
                    <p className="text-sm mt-1">{weeklyGoals[week].bedtime}</p>
                    <p className="text-xs mt-1">{weeklyGoals[week].targetSleep}h sleep</p>
                    {week < currentWeek && <p className="text-xs mt-2">✓ Completed</p>}
                    {week === currentWeek && <p className="text-xs mt-2">← Current</p>}
                  </div>
                ))}
              </div>
              <div className="mt-4 p-4 bg-indigo-50 rounded-lg">
                <p className="text-sm text-indigo-800">
                  <strong>Gradual progress works.</strong> You're shifting your bedtime by 30 minutes every week. This gives your nervous system time to adjust.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Routine View */}
        {currentView === 'routine' && (
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Daily Routine</h2>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-4 py-2 border-2 border-gray-300 rounded-lg"
              />
            </div>
            <div className="space-y-2">
              {dailyRoutine.map((item) => {
                const isChecked = getTodayData().routineChecked?.[item.id] || false;
                return (
                  <div
                    key={item.id}
                    onClick={() => toggleRoutineItem(item.id)}
                    className={`p-4 rounded-lg cursor-pointer transition-all flex items-center gap-4 ${
                      isChecked
                        ? 'bg-green-50 border-2 border-green-300'
                        : 'bg-gray-50 border-2 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    {isChecked ? (
                      <CheckCircle className="text-green-600 flex-shrink-0" size={24} />
                    ) : (
                      <Circle className="text-gray-400 flex-shrink-0" size={24} />
                    )}
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Clock size={16} className="text-gray-500" />
                        <span className="font-medium text-gray-700">{item.time}</span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          item.type === 'davening' ? 'bg-blue-100 text-blue-700' :
                          item.type === 'meal' ? 'bg-orange-100 text-orange-700' :
                          item.type === 'learning' ? 'bg-purple-100 text-purple-700' :
                          item.type === 'work' ? 'bg-gray-100 text-gray-700' :
                          'bg-indigo-100 text-indigo-700'
                        }`}>
                          {item.type}
                        </span>
                      </div>
                      <p className="text-gray-800 font-medium mt-1">{item.task}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Meals View */}
        {currentView === 'meals' && (
          <div>
            {selectedMealType ? (
              // Meal selection modal
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-800 capitalize">
                    Log {selectedMealType}
                  </h3>
                  <button
                    onClick={() => {
                      setSelectedMealType(null);
                      setMealSearchQuery('');
                      setCustomMeal({ name: '', calories: '', protein: '' });
                    }}
                    className="text-gray-500 hover:text-gray-700 font-medium"
                  >
                    ✕ Close
                  </button>
                </div>

                {/* Search bar */}
                <input
                  type="text"
                  placeholder="Search meals..."
                  value={mealSearchQuery}
                  onChange={(e) => setMealSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg mb-4 focus:border-indigo-500 focus:outline-none"
                />

                {/* Custom meal option */}
                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-6 rounded-xl mb-6 border-2 border-purple-200">
                  <h4 className="font-bold text-gray-800 mb-3">Add Custom Meal</h4>
                  <div className="grid md:grid-cols-3 gap-3 mb-3">
                    <input
                      type="text"
                      placeholder="Meal name"
                      value={customMeal.name}
                      onChange={(e) => setCustomMeal({ ...customMeal, name: e.target.value })}
                      className="px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none"
                    />
                    <input
                      type="number"
                      placeholder="Calories"
                      value={customMeal.calories}
                      onChange={(e) => setCustomMeal({ ...customMeal, calories: e.target.value })}
                      className="px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none"
                    />
                    <input
                      type="number"
                      placeholder="Protein (g)"
                      value={customMeal.protein}
                      onChange={(e) => setCustomMeal({ ...customMeal, protein: e.target.value })}
                      className="px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none"
                    />
                  </div>
                  <button
                    onClick={() => logCustomMeal(selectedMealType)}
                    className="w-full py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-all"
                  >
                    Add Custom Meal
                  </button>
                </div>

                {/* Pre-made options */}
                <h4 className="font-bold text-gray-800 mb-3">
                  Or Choose from {getFilteredMeals(selectedMealType).length} Options:
                </h4>
                <div className="grid md:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
                  {getFilteredMeals(selectedMealType).map((meal, idx) => (
                    <button
                      key={idx}
                      onClick={() => logMeal(selectedMealType, meal)}
                      className="p-4 bg-gray-50 hover:bg-indigo-50 border-2 border-gray-200 hover:border-indigo-300 rounded-lg text-left transition-all"
                    >
                      <p className="font-medium text-gray-800">{meal.name}</p>
                      <div className="flex gap-4 mt-2 text-sm text-gray-600">
                        <span>{meal.calories} cal</span>
                        <span>{meal.protein}g protein</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              // Meal type selection
              <div className="space-y-6">
                {['breakfast', 'lunch', 'dinner', 'snack'].map((mealType) => (
                  <div key={mealType} className="bg-white rounded-2xl shadow-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-gray-800 capitalize flex items-center gap-2">
                        <Utensils size={24} className={
                          mealType === 'breakfast' ? 'text-orange-500' :
                          mealType === 'lunch' ? 'text-green-500' :
                          mealType === 'dinner' ? 'text-blue-500' :
                          'text-purple-500'
                        } />
                        {mealType}
                      </h3>
                      {getTodayData().meals?.[mealType] && (
                        <div className="text-right">
                          <p className="font-bold text-green-600">{getTodayData().meals[mealType].calories} cal</p>
                          <p className="text-sm text-gray-600">{getTodayData().meals[mealType].protein}g protein</p>
                        </div>
                      )}
                    </div>
                    
                    {getTodayData().meals?.[mealType] ? (
                      <div className="p-4 bg-green-50 rounded-lg border-2 border-green-200 flex justify-between items-center">
                        <div>
                          <p className="font-medium text-green-800">✓ {getTodayData().meals[mealType].name}</p>
                          <p className="text-sm text-green-700 mt-1">
                            {getTodayData().meals[mealType].calories} calories • {getTodayData().meals[mealType].protein}g protein
                          </p>
                        </div>
                        <button
                          onClick={() => {
                            const todayData = getTodayData();
                            const newMeals = { ...todayData.meals };
                            delete newMeals[mealType];
                            updateTodayData({ meals: newMeals });
                          }}
                          className="text-red-600 hover:text-red-800 font-medium px-4 py-2 hover:bg-red-50 rounded-lg transition-all"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setSelectedMealType(mealType)}
                        className="w-full p-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg font-medium hover:from-indigo-600 hover:to-purple-700 transition-all shadow-md flex items-center justify-between"
                      >
                        <span>Log {mealType}</span>
                        <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm">
                          {mealSuggestions[mealType].length}+ options
                        </span>
                      </button>
                    )}
                  </div>
                ))}

                <div className="bg-yellow-50 p-6 rounded-xl border-2 border-yellow-200">
                  <p className="text-sm font-medium text-yellow-800 mb-2">💡 Reminder about Eating</p>
                  <p className="text-sm text-yellow-700">
                    If you're not hungry at meal times, eat something small anyway. Your hunger cues are healing 
                    from years of trauma responses. Regular eating teaches your body that food is safe and available.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Progress View */}
        {currentView === 'progress' && (
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Journey So Far</h2>
            
            <div className="space-y-6">
              {/* Week Summary */}
              <div className="p-6 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl">
                <h3 className="text-lg font-bold text-gray-800 mb-4">This Week's Focus</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-white p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Target Bedtime</p>
                    <p className="text-2xl font-bold text-indigo-600">{weeklyGoals[currentWeek].bedtime}</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Target Sleep</p>
                    <p className="text-2xl font-bold text-indigo-600">{weeklyGoals[currentWeek].targetSleep}h</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Days This Week</p>
                    <p className="text-2xl font-bold text-indigo-600">
                      {Object.keys(dailyData).filter(date => {
                        const d = new Date(date);
                        const now = new Date();
                        const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
                        return d >= weekStart;
                      }).length}
                    </p>
                  </div>
                </div>
              </div>

              {/* Motivational Message */}
              <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border-2 border-green-200">
                <h3 className="font-bold text-green-800 mb-2">🌱 You're Healing</h3>
                <p className="text-green-700">
                  Every check mark, every meal logged, every bedtime honored - these aren't just data points. 
                  They're acts of care for your nervous system. Your body is learning that it's safe to have routine, 
                  safe to be nourished, safe to rest. Keep going.
                </p>
              </div>

              {/* Next Steps */}
              <div className="p-6 bg-blue-50 rounded-xl">
                <h3 className="font-bold text-blue-800 mb-3">What's Next?</h3>
                <ul className="space-y-2 text-blue-700">
                  <li className="flex items-start gap-2">
                    <span>→</span>
                    <span>Complete Week {currentWeek}, then advance to Week {currentWeek + 1 <= 4 ? currentWeek + 1 : 4}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>→</span>
                    <span>By Week 4, you'll be sleeping 7.5 hours consistently</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>→</span>
                    <span>Your eating patterns will feel more natural and less panic-driven</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>→</span>
                    <span>You'll have concrete data to share with your therapist</span>
                  </li>
                </ul>
              </div>

              {/* Week Advance Button */}
              {currentWeek < 4 && (
                <button
                  onClick={() => {
                    const newWeek = currentWeek + 1;
                    setCurrentWeek(newWeek);
                    saveData(dailyData, newWeek);
                  }}
                  className="w-full p-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-bold hover:from-indigo-600 hover:to-purple-700 transition-all shadow-lg"
                >
                  Ready for Week {currentWeek + 1}? Click to Advance →
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WellnessTracker;
