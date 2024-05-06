

// used in Step 2 shuffleTwoArrays calls shuffleTwoDimensionalArray
// Step 8 B
function shuffleTwoDimensionalArray(arr) {
    const flatArr = arr.flat(); // Flatten the array
    flatArr.sort(() => Math.random() - 0.5); // Shuffle the flattened array
    const shuffledArr = [];
    let index = 0;
    // Reconstruct the shuffled two-dimensional array
    for (let i = 0; i < arr.length; i++) {
        const row = [];
        for (let j = 0; j < arr[i].length; j++) {
            row.push(flatArr[index++]);
        }
        shuffledArr.push(row);
    }
    return shuffledArr;
}

// Function to shuffle a two-dimensional array
// Step 8 A
// used in Step 2 backend calls shuffleTwoArrays
function shuffleTwoArrays(A, B) {
    const mergedArray = [];
    for (let i = 0; i < A.length; i++) {
        const mergedRow = [];
        for (let j = 0; j < A[i].length; j++) {
            mergedRow.push(`${A[i][j]}-${B[i][j]}`);
        }
        mergedArray.push(mergedRow);
    }
    // Shuffle arrays A and B while preserving relationships between corresponding elements
    const shuffledAB = shuffleTwoDimensionalArray(mergedArray);
    const shuffledA = [];
    const shuffledB = [];
    for (let i = 0; i < shuffledAB.length; i++) {
        const rowA = [];
        const rowB = [];
        for (let j = 0; j < shuffledAB[i].length; j++) {
            const [a, b] = shuffledAB[i][j].split("-");
            rowA.push(a);
            rowB.push(b);
        }
        shuffledA.push(rowA);
        shuffledB.push(rowB);
    }
    return [shuffledA, shuffledB];
}

// Function to remove unnecessary text from JSON data
// Step 7
// Step 3 used in fetchConnectionsFromStorage
function cleanJson(jsonString) {
    // Define regular expression to remove triple backticks and 'json' keyword
    const regex = /```|json/g;
    // Replace unnecessary text with an empty string
    const cleanedJson = jsonString.replace(regex, '');
    return cleanedJson;
}


// Step 6
// Array to store clicked positions
let clickedPositions = [];

// Function to find the pattern for four consecutive clicks
function findPattern(clickedPositions, shuffledArray, pattern, originalArray) {
    if (clickedPositions.length < 4) {
        return "Keep clicking to select four consecutive positions.";
    }
    const clickedWords = clickedPositions.map(pos => shuffledArray[pos.row][pos.column]);
    //console.log("Clicked words:", clickedWords);
    let patternIndex = -1;
    for (let i = 0; i < originalArray.length; i++) {
        //console.log(originalArray[i])
        const indices = originalArray[i].map(word => clickedWords.indexOf(word));
      
        const sortedIndices = indices.slice().sort((a, b) => a - b); // Sort indices to find consecutive clicks
        //console.log("Indices:", sortedIndices);
        if (sortedIndices.every((index, idx) => idx === 0 || (index === sortedIndices[idx - 1] + 1))) {
            patternIndex = i;
            break;
        }

    }
    clickedPositions = [];
    return patternIndex !== -1 ? pattern[patternIndex] : "Invalid pattern";
}
// Step 5
function boardSetup() {
    clickedPositions = [];
    const gameBoard = document.querySelector('.game-board');
    const rows = gameBoard.querySelectorAll('.row');
    rows.forEach(row => {
        while (row.firstChild) {
            row.removeChild(row.firstChild);
        }
    });
    //const cards = gameBoard.querySelectorAll('.card');

    for (let i = 0; i < gamewords.length; i++) {
        const row = rows[i];
        const words = gamewords[i];
        for (let j = 0; j < words.length ; j++) {
            const card = document.createElement('button');
            card.classList.add('card');
            card.textContent = 'Word ' + i + j;
            row.appendChild(card);
            //card = row.children[j];
            card.textContent = words[j];
            card.setAttribute('title', gamemeaning[i][j]);
            card.addEventListener('click', () => {
                const i = Array.from(row.parentNode.children).indexOf(row);
                const j = Array.from(row.children).indexOf(card);
                //console.log(`Clicked on card at position (${i}, ${j})`);
                //console.log(clickedPositions);
                // Store the clicked position
                clickedPositions.push({ row: i, column: j });
                // Add a class to change the background color of the clicked button
                card.classList.add('clicked');
                // Check if four consecutive clicks have been made
                if (clickedPositions.length === 4) {
                    const patternFound = findPattern(clickedPositions, gamewords, gl_pattern, gl_solutions);
                    var gameHeader = document.getElementById("game_header");
                    gameHeader.innerText = patternFound;
                    console.log("Pattern found:", patternFound);
                    // Reset clickedPositions after finding the pattern
                    const jn_words = clickedPositions.map(pos => gamewords[i][j]);
                    clickedPositions = [];
                    // Remove the 'clicked' class from all cards
                    const allCards = document.querySelectorAll('.card');
                    allCards.forEach(card => card.classList.remove('clicked'));
                    clickedPositions = [];
                }   
            });
        }
    }
    console.log('Board setup!');
} 
// Function to save data to local storage
function saveToLocalStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
    console.log(`Data saved to local storage with key: ${key}`);
}
// Step 4
function getFromLocalStorage(key) {
    const data = localStorage.getItem(key);
    if (data) {
        return JSON.parse(data.toLowerCase());
    }
    return null;
}
// Step 3
const fetchConnectionsFromStorage = async (data) => {
    const pattern = [];
    const solutions = [];
    const meanings = [];
    if (data && data.patterns) {
        data = data.patterns;
    } 
    // Assuming the JSON has an array of objects with pattern, solutions, and meanings properties
    if (data && data.length > 0) {
       // console.log("Data:", data);
        data.forEach(obj => {
            if (Array.isArray(obj.japanese)) {
                pattern.push(obj.pattern.slice(0, 4));
            } else {
                pattern.push(obj.pattern.split(",").map(item => item.trim()).slice(0, 4));
            }
            if (Array.isArray(obj.japanese)) {
                solutions.push(obj.japanese.slice(0, 4));
            } else {
                solutions.push(obj.japanese.split(",").map(item => item.trim()).slice(0, 4));
            }
            if (Array.isArray(obj.english)) {
                meanings.push(obj.english.slice(0, 4));
            } else {
                meanings.push(obj.english.split(",").map(item => item.trim()).slice(0, 4));
            }
        });
    }
    // console.log(pattern);
    // console.log(solutions);
    // console.log(meanings);
    return { pattern, solutions, meanings };
    
};
function gameRefresh(pageNumber){
    console.log("Retry fetchConnectionsFromStorage: ",'gemma-' + pageNumber);
    data =JSON.parse(getFromLocalStorage('gemma-' + pageNumber));
    //console.log("Data:", data);
    if(data && data.connections && data.connections.length > 0)
    {
        fetchConnectionsFromStorage(data.connections).then(result => {
            // Use the result here
            gl_pattern=result.pattern;
            gl_solutions=result.solutions;
            gl_meanings=result.meanings;
            [gamewords,gamemeaning] = shuffleTwoArrays(gl_solutions,gl_meanings);
            
            boardSetup();
            if (data.conversation && data.conversation.length > 0){
                conversationData = data.conversation;
                populateConversation()
            }
            showGridLoading(false);
        
        }).catch(error => {
            // Handle any errors here
            console.error('Error:', error);
        });
    }
}
// Step 2
function backend(pageNumber){
    showGridLoading(true);

    console.log("fetchConnectionsFromStorage: ",'gemma-' + pageNumber);
    var data = getFromLocalStorage('gemma-' + pageNumber);
    if (!data) {
        gamecount++; //global variable to keep track of the number of games played, ref games.js
        const fileName = 'json/gemma-'+ gamecount +'.txt';
        fetchConnectionsFromGemma(fileName).then((gemmaresponse) => {
            saveToLocalStorage('gemma-' + gamecount,gemmaresponse);
            console.log('Data fetched from Gemma!',gamecount);
            gameRefresh(pageNumber);
        }).catch(error => {
            console.error('Error:', error);
        }); 
    }
    else{
        gameRefresh(pageNumber);
    }
    

}
// Step 1
function fetchConnectionsFromAI() {
    gamecount = Object.keys(localStorage).filter(key => key.startsWith('gemma-')).length;
    console.log("fetchConnectionsFromAI: ",gamecount);
    backend(1)
    return
}



