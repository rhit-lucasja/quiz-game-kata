async function test() {// jService - Trivia API API Example
    const response = await fetch('https://quiz-game-backend-5gpd.onrender.com/', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    console.log(`OpenTDB API response has code ${response.response_code}`);
    console.log(response);
}

test();