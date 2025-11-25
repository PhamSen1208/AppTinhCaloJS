class CalorieTracker
{
    constructor()
    {
        this._calorieLimit = Storage.getCalorieLimit();
        this._totalCalories = Storage.getTotalCalories();
        this._meal = Storage.getMeals();
        this._workout = Storage.getWorkouts();

        this._displayCaloriesLimit();
        this._displayCaloriesTotal();
        this._displayCaloriesConsumed();
        this._displayCaloriesBurned();
        this._displayCaloriesRemaining();
        this._displayCaloriesProgress();

        document.getElementById('limit').value = this._calorieLimit;
    }

// public method

    addMeal(meal)
    {
        this._meal.push(meal);
        this._totalCalories += meal.calories;
        Storage.updateTotalCalories(this._totalCalories);
        Storage.saveMeal(meal);
        this._displayNewMeal(meal);
        this._render();
    }

    removeMeal(id)
    {
        const index = this._meal.findIndex((meal) => meal.id === id);
        if(index !== -1)
        {
            const meal = this._meal[index];
            this._totalCalories -= meal.calories;
            Storage.updateTotalCalories(this._totalCalories);
            this._meal.splice(index,1);
            Storage.removeMeal(id);
            this._render();  
        }
    }
 
    addWorkout(workout)
    {
        this._workout.push(workout);
        this._totalCalories -= workout.calories;
        Storage.updateTotalCalories(this._totalCalories);
        Storage.saveWorkout(workout);
        this._displayNewWorkout(workout);
        this._render();
    }

    removeWorkout(id)
    {
        const index = this._workout.findIndex((workout) => workout.id === id);
        if(index !== -1)
        {
            const workout = this._workout[index];
            this._totalCalories += workout.calories;
            Storage.updateTotalCalories(this._totalCalories);
            this._workout.splice(index, 1);
            Storage.removeWorkout(id);
            this._render();
        }
    }

    setLimit(calorieLimit)
    {
        this._calorieLimit = parseInt(calorieLimit);
        this._displayCaloriesLimit();
        Storage.setCalorieLimit(parseInt(calorieLimit));
        this._render();
    }

    loadItem()
    {
        this._meal.forEach(meal => this._displayNewMeal(meal));
        this._workout.forEach(workout => this._displayNewWorkout(workout));
    }

    reset()
    {
        this._totalCalories = 0;
        Storage.updateTotalCalories(0);
        this._meal = [];
        this._workout = [];
        this._render();
    }

//private method

    _displayCaloriesTotal()
    {
        const displayCaloriesTotal = document.getElementById('calories-total');
        displayCaloriesTotal.innerHTML = this._totalCalories;
    }

    _displayCaloriesLimit()
    {
        const displayCaloriesLimit = document.getElementById('calories-limit');
        displayCaloriesLimit.innerHTML = this._calorieLimit;
    }

    _displayCaloriesConsumed()
    {
        const displayCaloriesConsumed = document.getElementById('calories-consumed');
        const consumed = this._meal.reduce((total, meal) => total + meal.calories, 0);
        displayCaloriesConsumed.innerHTML = consumed;
    }

    _displayCaloriesBurned()
    {
        const displayCaloriesBurned = document.getElementById('calories-burned');
        const burned = this._workout.reduce((total, workout) => total + workout.calories, 0);
        displayCaloriesBurned.innerHTML = burned;
    }

    _displayCaloriesRemaining()
    {
        const displayCaloriesRemaining = document.getElementById('calories-remaining');
        const displayCaloriesProgress = document.getElementById('calorie-progress');
        const remaining = this._calorieLimit - this._totalCalories;
        displayCaloriesRemaining.innerHTML = remaining;

        if(remaining <= 0)
        {
            displayCaloriesRemaining.parentElement.parentElement.classList.remove('bg-light');
            displayCaloriesRemaining.parentElement.parentElement.classList.add('bg-danger');
            displayCaloriesProgress.classList.remove('bg-success');
            displayCaloriesProgress.classList.add('bg-danger');

        }

        else
        {
            displayCaloriesRemaining.parentElement.parentElement.classList.add('bg-light');
            displayCaloriesRemaining.parentElement.parentElement.classList.remove('bg-danger');
            displayCaloriesProgress.classList.add('bg-success');
            displayCaloriesProgress.classList.remove('bg-danger');
        }
    }


    _displayCaloriesProgress()
    {
        const displayCaloriesProgress = document.getElementById('calorie-progress');
        const percentage = (this._totalCalories / this._calorieLimit) * 100;
        const width = Math.max(0, Math.min(percentage, 100));
        displayCaloriesProgress.style.width = `${width}%`;
    }

    _displayNewMeal(meal)
    {
        const mealsEl = document.getElementById('meal-items');
        const mealEl = document.createElement('div');
        mealEl.classList.add('card','my-2');
        mealEl.setAttribute('data-id', meal.id);
        mealEl.innerHTML = `
            <div class="card-body">
                <div class="d-flex align-items-center justify-content-between">
                    <h4 class="mx-1">${meal.name}</h4>
                    <div
                        class="fs-1 bg-primary text-white text-center rounded-2 px-2 px-sm-5"
                    >
                        ${meal.calories}
                    </div>
                    <button class="delete btn btn-danger btn-sm mx-2">
                        <i class="fa-solid fa-xmark"></i>
                    </button>
                </div>
            </div>
        `;
    mealsEl.appendChild(mealEl);
}

    _displayNewWorkout(workout)
    {
        const workoutsEl = document.getElementById('workout-items');
        const workoutEl = document.createElement('div');
        workoutEl.classList.add('card', 'my-2');
        workoutEl.setAttribute('data-id', workout.id);
        workoutEl.innerHTML = `
            <div class="card-body">
                <div class="d-flex align-items-center justify-content-between">
                    <h4 class="mx-1">${workout.name}</h4>
                    <div
                        class="fs-1 bg-primary text-white text-center rounded-2 px-2 px-sm-5"
                    >
                        ${workout.calories}
                    </div>
                    <button class="delete btn btn-danger btn-sm mx-2">
                        <i class="fa-solid fa-xmark"></i>
                    </button>
                </div>
            </div>
        `;
        workoutsEl.appendChild(workoutEl);
    }

    _render()
    {
        this._displayCaloriesTotal();
        this._displayCaloriesConsumed();
        this._displayCaloriesBurned();
        this._displayCaloriesRemaining();
        this._displayCaloriesProgress();
    }
}

class Meal{
    constructor(name, calories)
    {
        this.id = Math.random().toString(16).slice(2);
        this.name = name;
        this.calories = calories;
    }
}

class Workout{
    constructor(name, calories)
    {
        this.id = Math.random().toString(16).slice(2);
        this.name = name;
        this.calories = calories;
    }
}

class Storage
{
    static getCalorieLimit(defaultLimit = 2000)
    {
        let calorieLimit ;
        if(localStorage.getItem('calorieLimit') === null)
        {
            calorieLimit = defaultLimit;
        }
        else
        {
            calorieLimit = parseInt(localStorage.getItem('calorieLimit'));
        }
        return calorieLimit;
    }

    static setCalorieLimit(calorieLimit)
    {
        localStorage.setItem('calorieLimit', calorieLimit);
    }

    static getTotalCalories(defaultCalorie = 0)
    {
        let totalCalories ;
        if(localStorage.getItem('totalCalories') === null)
        {
            totalCalories = defaultCalorie;
        }
        else
        {
            totalCalories = parseInt(localStorage.getItem('totalCalories'));
        }
        return totalCalories;
    }

    static updateTotalCalories(calories)
    {
        localStorage.setItem('totalCalories', calories);
    }

    static getMeals()
    {
        let meals;
        if(localStorage.getItem('meals') === null)
        {
            meals = [];
        }
        else
        {
            meals = JSON.parse(localStorage.getItem('meals'));
        }
        return meals;
    }

    static saveMeal(meal)
    {
        const meals = Storage.getMeals();
        meals.push(meal);
        localStorage.setItem('meals', JSON.stringify(meals));
    }

    static getWorkouts()
    {
        let workouts;
        if(localStorage.getItem('workouts') === null)
        {
            workouts = [];
        }
        else
        {
            workouts = JSON.parse(localStorage.getItem('workouts'));
        }
        return workouts;
    }

    static saveWorkout(workout)
    {
        const workouts = Storage.getWorkouts();
        workouts.push(workout);
        localStorage.setItem('workouts', JSON.stringify(workouts));
    }

    static removeMeal(id) {
        const meals = Storage.getMeals().filter(meal => meal.id !== id);
        localStorage.setItem('meals', JSON.stringify(meals));
    }

    static removeWorkout(id) {
        const workouts = Storage.getWorkouts().filter(workout => workout.id !== id);
        localStorage.setItem('workouts', JSON.stringify(workouts));
    }

    static clearAll() {
    localStorage.removeItem('totalCalories');
    localStorage.removeItem('meals');
    localStorage.removeItem('workouts');

  }

}

class App
{
    constructor()
    {
        this._tracker = new CalorieTracker();
        this._loadEventListener();
        this._tracker.loadItem();
    }

    _loadEventListener()
    {
        document.getElementById('meal-form').addEventListener('submit', this._newItem.bind(this, 'meal'));
        document.getElementById('workout-form').addEventListener('submit', this._newItem.bind(this, 'workout'));
        document.getElementById('meal-items').addEventListener('click', this._removeItem.bind(this,'meal')); 
        document.getElementById('workout-items').addEventListener('click', this._removeItem.bind(this,'workout')); 
        document.getElementById('filter-meals').addEventListener('keyup', this._filterItem.bind(this,'meal'));
        document.getElementById('filter-workouts').addEventListener('keyup', this._filterItem.bind(this, 'workout'));
        document.getElementById('reset').addEventListener('click',this._resetItem.bind(this));
        document.getElementById('limit-form').addEventListener('submit', this._setLimit.bind(this));

    }

    _newItem(type, e)
    {
        e.preventDefault();
        const name = document.getElementById(`${type}-name`);
        const calorie = document.getElementById(`${type}-calories`);

        if(name.value === '' || calorie.value === '')
        {
            alert('Please fill all the fields');
            return;
        }
        if(type === 'meal')
        {
            const meal = new Meal(name.value, +calorie.value);
            this._tracker.addMeal(meal);
        }
        else
        {
            const workout = new Workout(name.value, +calorie.value);
            this._tracker.addWorkout(workout);
        }

        name.value = '';
        calorie.value = '';    
        
        const collapseItem = document.getElementById(`collapse-${type}`);
        const bsCollapse = new bootstrap.Collapse(collapseItem, {
            toggle: true,
        });
    }

    _removeItem(type, e)
    {
        e.preventDefault();
        if(e.target.classList.contains('delete') || e.target.classList.contains('fa-xmark'))
        {
            if(confirm('Are you sure to delete this item ?'))
            {
                const id = e.target.closest('.card').getAttribute('data-id');
                if(type === 'meal')
                {
                    this._tracker.removeMeal(id);
                }
                else
                {
                    this._tracker.removeWorkout(id);
                }

                e.target.closest('.card').remove();
            }
        }    
    }

    _filterItem(type, e)
    {
        e.preventDefault();
        const text = e.target.value.toLowerCase().trim();
        document.querySelectorAll(`#${type}-items .card`).forEach(item => {
            const name = item.firstElementChild.firstElementChild.textContent;

            if(name.toLowerCase().includes(text))
            {
                item.style.display = 'block';
            }
            else
            {
                item.style.display = 'none';
            }
        });
    }

    _resetItem()
    {

        if(confirm('Are you sure to reset all items'))
        {
            this._tracker.reset();
            document.getElementById('meal-items').innerHTML = '';
            document.getElementById('workout-items').innerHTML = '';
            document.getElementById('filter-meals').value = '';
            document.getElementById('filter-workouts').value = '';
        }
    }

    _setLimit(e)
    {
        e.preventDefault();
        const limit = document.getElementById('limit');
        if(limit.value === '')
        {
            alert('Please fill all the fields !');
            return;
        }
        else
        {
            this._tracker.setLimit(limit.value);
            limit.value = '';

            const modalEl = document.getElementById('limit-modal');
            const modal = bootstrap.Modal.getInstance(modalEl);
            modal.hide();
        }
    }
}

const app = new App();



