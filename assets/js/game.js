

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
    // Shuffle arrays A and B while preserving relationships between corresponding elements
    const shuffledA = shuffleTwoDimensionalArray(A);
    const shuffledB = shuffleTwoDimensionalArray(B);
    console.log(shuffledA);
    console.log(shuffledB);
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
    console.log("Clicked words:", clickedWords);
    let patternIndex = -1;
    for (let i = 0; i < originalArray.length; i++) {
        console.log(originalArray[i])
        const indices = originalArray[i].map(word => clickedWords.indexOf(word));
      
        const sortedIndices = indices.slice().sort((a, b) => a - b); // Sort indices to find consecutive clicks
        console.log("Indices:", sortedIndices);
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
    //const cards = gameBoard.querySelectorAll('.card');

    for (let i = 0; i < gamewords.length; i++) {
        const row = rows[i];
        const words = gamewords[i];
        for (let j = 0; j < words.length ; j++) {
            const card = row.children[j];
            card.textContent = words[j];
            card.setAttribute('title', gamemeaning[i][j]);
            card.addEventListener('click', () => {
                const i = Array.from(row.parentNode.children).indexOf(row);
                const j = Array.from(row.children).indexOf(card);
                console.log(`Clicked on card at position (${i}, ${j})`);
                
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
                    fetchConversationFromLLM(patternFound, jn_words).then(conversationGeminiData => {
                        if (conversationGeminiData) {
                            conversationData = conversationGeminiData;
                            populateConversation();
                        }
                    });
                    
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
    return JSON.parse(data);
}
// Step 3
const fetchConnectionsFromStorage = async (key) => {
   
    const pattern = [];
    const solutions = [];
    const meanings = [];
    console.log("fetchConnectionsFromStorage: ",'gemma-' + key);
    var data = getFromLocalStorage('gemma-' + key);
    if (!data) {
        fetchFromLLM();
    }
    else {
        data = data.toLowerCase(); // Convert data to lowercase
        data = JSON.parse(cleanJson(data));
        
        if (data && data.patterns) {
            data = data.patterns;
        } 
        // Assuming the JSON has an array of objects with pattern, solutions, and meanings properties
        if (data && data.length > 0) {
            data.forEach(obj => {
                if (Array.isArray(obj.japanese)) {
                    pattern.push(obj.pattern.slice(0, 4));
                } else {
                    pattern.push(obj.pattern.split(", ").map(item => item.trim()).slice(0, 4));
                }
                if (Array.isArray(obj.japanese)) {
                    solutions.push(obj.japanese.slice(0, 4));
                } else {
                    solutions.push(obj.japanese.split(", ").map(item => item.trim()).slice(0, 4));
                }
                if (Array.isArray(obj.english)) {
                    meanings.push(obj.english.slice(0, 4));
                } else {
                    meanings.push(obj.english.split(", ").map(item => item.trim()).slice(0, 4));
                }
            });
        }
    }
    // console.log(pattern);
    // console.log(solutions);
    // console.log(meanings);
    return { pattern, solutions, meanings };
    
};

// Step 2
function backend(pageNumber){
    showGridLoading(true);
    
    fetchConnectionsFromStorage(pageNumber).then(result => {
        // Use the result here
        

        gl_pattern=result.pattern;
        gl_solutions=result.solutions;
        gl_meanings=result.meanings;
        [gamewords,gamemeaning] = shuffleTwoArrays(gl_solutions,gl_meanings);
        
        boardSetup();
       
      }).catch(error => {
        // Handle any errors here
        console.error('Error:', error);
      });
      showGridLoading(false);
}
// Step 1
function fetchConnectionsFromAI() {
    gamecount = Object.keys(localStorage).filter(key => key.startsWith('gemma-')).length;
    console.log("fetchConnectionsFromAI: ",gamecount);
    backend(1)
    // Call the function to populate conversation
    populateConversation(conversationData);
    return
}


// /// Function to shuffle two arrays of words and ensure the English meaning matches the shuffled Japanese word
// function shuffleAndMatchJapaneseEnglish(japaneseArray, englishArray) {
//     // Shuffle both arrays simultaneously using Fisher-Yates algorithm


//     // Shuffle both arrays simultaneously row-wise
//     for (let i = 0; i < japaneseArray.length; i++) {
//         for (let j = japaneseArray[i].length - 1; j > 0; j--) {
//             const k = Math.floor(Math.random() * (j + 1));
//             [japaneseArray[i][j], japaneseArray[i][k]] = [japaneseArray[i][k], japaneseArray[i][j]];
//             [englishArray[i][j], englishArray[i][k]] = [englishArray[i][k], englishArray[i][j]];
//         }
//     }
//         for (let i = japaneseArray.length - 1; i > 0; i--) {
//         const j = Math.floor(Math.random() * (i + 1));
//         [japaneseArray[i], japaneseArray[j]] = [japaneseArray[j], japaneseArray[i]];
//         [englishArray[i], englishArray[j]] = [englishArray[j], englishArray[i]];
//     }

//     return [japaneseArray, englishArray];
// }
// // Function to shuffle two arrays while preserving relationships between corresponding elements
// function shuffleTwoArrays(A, B) {
//     // Flatten both arrays and shuffle the flattened arrays
//     [shuffledA,shuffledB] = shuffleAndMatchJapaneseEnglish(A,B);
//     console.log(shuffledA);
//     console.log(shuffledB);
//     return [shuffledA, shuffledB];
// }
