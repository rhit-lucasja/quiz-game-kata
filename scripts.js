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
    
}