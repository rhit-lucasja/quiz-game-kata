

/**
 * Given a multiple of 10 maxNum and a reference to a <select> element, adds options
 * 20, 30, ... maxNum to the selection menu
 * @param {int} maxNum 
 * @param {Element} selection 
 */
function setupNumList(maxNum, selection) {
    // for each multiple of 10 in [20, min(maxNum, 50)], add an option to <select> reference given
    for (i = 2; i <= maxNum / 10; i++) {
        op = document.createElement("option");
        op.value = i * 10;
        op.textContent = `${i * 10} Questions`;
        selection.appendChild(op);
    }
}


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
    }
}


/**
 * Sets up the selection menu for the number of questions to put on the new quiz, given a catID in the URL search
 * 
 */
async function setupNumQuestions() {

    // get the URL search parameter for category ID as string
    const params = new URLSearchParams(window.location.search);
    const strID = params.get("catID");
    const catID = parseInt(strID);

    // get the <select> element in order to add num questions options to it
    const selection = document.getElementById("selectNumQuestions");

    let max = 0;
    if (Number.isNaN(catID)) {
        // NaN catID was provided - so default to choosing questions from anywhere
        max = await getMaxNumQuestionsAnyCategory();
    } else {
        // parse argument strID as an integer catID
        max = await getMaxNumQuestions(catID);
    }
    if (max > 50) max = 50; // cap quiz length at 50 questions
    setupNumList(max, selection);

}


/**
 * Reloads the web page, adding a parameter to the URL corresponding to the number of questions chosen in the
 * selection menu.
 * 
 */
function reloadWithQuizParam() {

    // get the <select> element in order to add num questions options to it
    const selection = document.getElementById("selectNumQuestions");
    let numQuestions = parseInt(selection.value);
    if (Number.isNaN(numQuestions)) {
        // NaN selection for number of quiz questions - for now default to 10
        numQuestions = 10;
    }

    // get category ID being used as well to form a collective URL query
    const params = new URLSearchParams(window.location.search);
    const catID = params.get("catID");

    // redirect to page with catID and number of questions
    window.location.href = `https://quiz-game-kata.vercel.app/quiz.html?catID=${catID}&num=${numQuestions}`;

}


/**
 * Generates the quiz upon page setup, as long as the URL contains a parameter for number of questions
 * 
 */
async function generateQuiz() {

    // get parameters from URL for the category (or "any") and for the number of questions, and use them to load a quiz
    //   due to this design, reloading the page will generate a new quiz every time
    const params = new URLSearchParams(window.location.search);
    const catID = params.get("catID");
    const numQuestionsStr = params.get("num");
    if (!numQuestionsStr) {
        // no numQuestions parameter is provided - so skip the quiz generation and wait for a selection to be made
        return;
    }

    const numQuestions = parseInt(numQuestionsStr);
    if (Number.isNaN(numQuestions) || numQuestions < 1 || numQuestions > 50) {
        // error converting the parameter into a valid number within API's bounds
        console.error("Error: number of questions provided is not a number within API bounds (number of questions to retrieve must be between 1 and 50).");
        return;
    }

    // else call API to get numQuestions questions of the category given by catID (or from any category if "any")
    let data;
    if (catID === "any") {
        // pull questions from any category
        const response = await fetch(`https://quiz-game-backend-5gpd.onrender.com/getQuestions/${numQuestions}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        data = await response.json();
    } else {
        // pull questions from category given by catID
        const response = await fetch(`https://quiz-game-backend-5gpd.onrender.com/getQuestions/${catID}/${numQuestions}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        data = await response.json();
    }

    // handle response code properly in case of errors, then append questions to the quiz page
    switch (data.response_code) {
        case 0:
            // success
            alert("response code 0 but redirecting URL anyway");
            window.location.href = "https://quiz-game-kata.vercel.app/"
            break;
        case 1:
            // no results (not enough questions)

            break;
        case 2:
            // invalid parameter to API call

            break;
        case 3:
            // token not found
            
            break;
        case 4:
            // token empty (questions used up; need to reset token)

            break;
        case 5:
            // rate limit (API can only be accessed once per 5 seconds)
            
            break;
        default:
            // unknown error

            break;
    }

}


// entry point to set up num questions list once DOM loads
setupNumQuestions();
generateQuiz();