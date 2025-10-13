/**
 * A simple function for testing that I can properly get data from API
 * 
 * This function routes through Node backend and gets 10 random questions from any category.
 * It prints the raw JSON data to the console log.
 * 
 */
async function printRandom10() {
    try {
        const response = await fetch('https://quiz-game-backend-5gpd.onrender.com', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json(); // extract JSON data
        console.log(data);
    } catch (error) {
        console.error("Error fetching 10 random questions");
    }
}


/**
 * Retrieves the names and corresponding IDs of all categories in OpenTDB.
 * 
 * Prints the category info to the console log.
 * 
 */
async function printAllCategories() {
    try {
        const response = await fetch('https://quiz-game-backend-5gpd.onrender.com/allCategories', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        // take data and iterate through to print each category and its ID
        for (const entry of data.trivia_categories) {
            console.log(`Category: ${entry.name} \tID: ${entry.id}`);
        }
    } catch (error) {
        console.error("Error fetching category list");
    }
}


/**
 * Given a category ID, prints to the console log the number of questions in that category.
 * 
 * @param {int} id The ID of the category whose size is being requested
 */
async function printNumInCategory(id) {

    if (Number.isNaN(parseInt(id))) {
        console.error("Must provide a numerical category ID.");
        return;
    }

    try {
        const response = await fetch(`https://quiz-game-backend-5gpd.onrender.com/categorySize/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        if (data.error === undefined) {
            // means that category size was properly returned
            const counts = data.category_question_count;
            const numEasy = counts.total_easy_question_count;
            const numMedium = counts.total_medium_question_count;
            const numHard = counts.total_hard_question_count;
            const total = counts.total_question_count;
            console.log(`Easy: ${numEasy}\nMedium: ${numMedium}\nHard: ${numHard}\nTotal: ${total}`);
        } else {
            throw new Error("Failed to fetch category by ID.");
        }
    } catch (error) {
        console.error(`Error fetching size of category with ID ${id}`);
    }
}


/**
 * Fetches the names and IDs of all the categories in OpenTDB. Then constructs a menu on the index page
 *   so that you can select a topic to take a quiz on.
 */
async function setupCategoryList() {
    try {
        const response = await fetch('https://quiz-game-backend-5gpd.onrender.com/allCategories', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();

        // if data received has an "error" field, then the server had a problem
        if (data.error) {
            throw new Error("Server had an error with message: " + data.error);
        }

        // get the select menu element from HTML
        //   add an option for each category, with the value as its ID
        selection = document.getElementById("selectCategory");
        for (const entry of data.trivia_categories) {
            op = document.createElement("option");
            op.value = entry.id;
            op.textContent = entry.name;
            selection.appendChild(op);
        }
        console.log("Category selection menu set up successfully");

    } catch (error) {
        console.error(error);
    }
}


// entry point - set up the list of categories to choose a quiz on
setupCategoryList();