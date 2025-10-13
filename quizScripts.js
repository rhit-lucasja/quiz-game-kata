


function getCategoryID() {

    // get the URL search parameter for category ID as string
    const params = new URLSearchParams(window.location.search);
    const strID = params.get("catID");
    const catID = parseInt(strID);
    if (Number.isNaN(catID)) {
        // argument was not provided - so default to any category works
        console.log("You decided to start a quiz on any category.");
    } else {
        // parse argument strID as an integer catID
        console.log(`You started a quiz on category with catID ${catID}.`);
    }

}

getCategoryID();