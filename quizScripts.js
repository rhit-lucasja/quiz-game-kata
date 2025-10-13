

/**
 * Returns the int number of questions in any category in OpenTDB
 * 
 * @returns integer number of questions from any category
 */
async function getMaxNumQuestionsAnyCategory() {
    try {
        const response = await fetch('https://quiz-game-backend-5gpd.onrender.com/categorySizeAll', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();

        // if data received has an "error" field, then server had a problem
        if (data.error) {
            throw new Error("Server had an error: " + data.error);
        }

        // return the maximum number of questions to choose (the largest multiple of 10 <= numQuestions)
        const numQuestions = data.total_num_of_verified_questions;
        return numQuestions - (numQuestions % 10);

    } catch (error) {
        // upon error, alert the user and return to category selection (index) page
        console.error(`Error fetching size of chosen category. Redirecting to home page...`);
        console.error(error);
        //window.location.href = 'https://quiz-game-kata.vercel.app/index.html';
    }
}


/**
 * Given an int catID, returns the int number of questions in the corresponding category
 * 
 * @param {int} catID
 * @returns number of questions in the category corresponding to catID
 */
async function getMaxNumQuestions(catID) {
    try {
        const response = await fetch(`https://quiz-game-backend-5gpd.onrender.com/categorySize/${catID}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();

        // if data received has an "error" field, then server had a problem
        if (data.error) {
            throw new Error("Server had an error: " + data.error);
        }

        // return the maximum number of questions to choose (the largest multiple of 10 <= numQuestions)
        const numQuestions = data.category_question_count.total_question_count;
        return numQuestions - (numQuestions % 10);

    } catch (error) {
        // upon error, alert the user and return to category selection (index) page
        console.error(`Error fetching size of chosen category. Redirecting to home page...`);
        console.error(error);
        //window.location.href = 'https://quiz-game-kata.vercel.app/index.html';
    }
}


async function setupNumQuestions() {

    // get the URL search parameter for category ID as string
    const params = new URLSearchParams(window.location.search);
    const strID = params.get("catID");
    const catID = parseInt(strID);

    // get the <select> element in order to add num questions options to it
    const selection = document.getElementById("selectNumQuestions");

    if (Number.isNaN(catID)) {
        // NaN catID was provided - so default to choosing questions from anywhere
        const maxNum = await getMaxNumQuestionsAnyCategory();
        // for each multiple of 10 in [20, min(maxNum, 50)], add an option to <select> reference given
        for (i = 2; i <= maxNum / 10 && i <= 5; i++) {
            op = document.createElement("option");
            op.value = i * 10;
            op.textContent = `${i * 10} Questions`;
            selection.appendChild(op);
        }
        console.log("Added to select menu");
    } else {
        // parse argument strID as an integer catID
        const maxNum = await getMaxNumQuestions(catID);
        // for each multiple of 10 in [20, min(maxNum, 50)], add an option to <select> reference given
        for (i = 2; i <= maxNum / 10 && i <= 5; i++) {
            op = document.createElement("option");
            op.value = i * 10;
            op.textContent = `${i * 10} Questions`;
            selection.appendChild(op);
        }
        console.log("Added to select menu");
    }

}


// entry point to set up num questions list once DOM loads
setupNumQuestions();