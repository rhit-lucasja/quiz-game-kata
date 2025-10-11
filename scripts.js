async function test() {// jService - Trivia API API Example
    const response = await fetch('https://quiz-game-backend-5gpd.onrender.com/', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    const data = await response.json();
    console.log(data);
}

test();