let correctAnswers = []

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
 * Given a list of quiz questions and details, adds the questions as interactive elements to the page
 * 
 * @param {list} questions list of questions, parsed from the API's json result
 */
function addQuizToPage(questions) {

    // Quiz HTML Element (div) to which all the questions are added
    quizContainer = document.getElementById("quiz");
    if (!quizContainer) {
        alert("There was a problem adding questions to the page. Redirecting to home...");
    }

    for (let i = 0; i < questions.length; i++) {
        
        // first get type of question (T/F vs MC)
        const type = questions[i].type;

        // get difficulty, which determines point value
        const diff = questions[i].difficulty;
        let pts = 0;
        if (diff === "easy") {
            pts = 1;
        } else if (diff === "medium") {
            pts = 2;
        } else {
            pts = 3;
        }

        // get question statement
        const q = questions[i].question;

        // get correct answer, and false answers
        const correct = questions[i].correct_answer;
        const incorrect = questions[i].incorrect_answers;

        // create a new question element and add relevant details to it
        const question = document.createElement("question");
        question.id = `q${i + 1}`;
        question.num = i + 1;
        question.type = type;
        question.pts = pts;
        correctAnswers.push(correct);

        // create and shuffle list of possible answers to question
        let answers = [correct, incorrect[0]];
        if (type === "multiple") {
            // MC have two more possible answers than T/F
            answers.push(incorrect[1], incorrect[2]);
        }
        // shuffle answers array to appear more random
        for (let j = answers.length - j; i > 0; j--) {
            const k = Math.floor(Math.random() * (j + 1)); // random index
            // swap elements at j and k
            const temp = answers[j];
            answers[j] = answers[k];
            answers[k] = temp;
        }

        // add possible answers to quiz as form of radio buttons
        const form = document.createElement("form");
        const qStatement = document.createElement("p");
        qStatement.textContent = q; // question being asked
        form.appendChild(qStatement);
        for (let j = 0; j < answers.length; j++) {
            // radio button input element
            const op = document.createElement("input");
            op.type = "radio";
            op.id = `q${i+1}.op${j}`;
            op.name = `q${i+1}.options`;
            op.value = answers[j];

            // label for the element
            const label = document.createElement("label");
            label.for = op.id;
            label.textContent = op.value;

            // add both to the form with breaks
            form.appendChild(op);
            form.appendChild(label);
            form.appendChild(document.createElement("br"));
        }

        // add form to question
        question.appendChild(form);

        // add question to quiz
        quizContainer.appendChild(question);

    }

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
            // success - add HTML elements to create the quiz taker using helper function
            addQuizToPage(data.results);
            break;
        case 1:
            // no results (not enough questions)
            alert("API responded with code 1: Not enough questions to satisfy request");
            window.location.href = `https://quiz-game-kata.vercel.app/quiz.html?catID=${catID}`;
            break;
        case 2:
            // invalid parameter to API call
            alert("API responded with code 2: Invalid parameter given to API call");
            window.location.href = `https://quiz-game-kata.vercel.app/quiz.html?catID=${catID}`;
            break;
        case 3:
            // token not found
            alert("API responded with code 3: Token not found");
            window.location.href = `https://quiz-game-kata.vercel.app/quiz.html?catID=${catID}`;
            break;
        case 4:
            // token empty (questions used up; need to reset token)
            alert("API responded with code 4: Token needs to be reset");
            window.location.href = `https://quiz-game-kata.vercel.app/quiz.html?catID=${catID}`;
            break;
        case 5:
            // rate limit (API can only be accessed once per 5 seconds)
            alert("API responded with code 5: Must have at least 5 seconds between API requests");
            window.location.href = `https://quiz-game-kata.vercel.app/quiz.html?catID=${catID}`;
            break;
        default:
            // unknown error
            alert("API responded with unknown error. Reloading to home page...");
            window.location.href = `https://quiz-game-kata.vercel.app/`;
            break;
    }

}


// entry point to set up num questions list once DOM loads
setupNumQuestions();
generateQuiz();