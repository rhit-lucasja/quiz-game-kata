
/**
 * A simple function for testing that I can properly get data from API
 * 
 * This function routes through Node backend and gets 10 random questions from any category.
 * It prints the raw JSON data to the console log.
 * 
 */
async function test() {// jService - Trivia API API Example
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

test();