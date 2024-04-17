const fetchFromLLMPrompt = async () => {
    const fileName = 'prompts/jn.txt'
    const response = await fetch(fileName); 
    return await response.text();
}
const fetchFromLLMMasterPrompt = async () => {
    const fileName = 'prompts/master.txt'
    const response = await fetch(fileName); 
    return await response.text();
}
function fetchFromLLM(){
    fetchFromLLMMasterPrompt().then(master_prompt => {
        fetchFromLLMPrompt().then(examples_prompt => {
            console.log(master_prompt);
            console.log(examples_prompt);
            fetchConnectionsFromGemma(master_prompt, examples_prompt).then((gemmaresponse) => {
                gamecount++; //global variable to keep track of the number of games played, ref games.js
                saveToLocalStorage('gemma-' + gamecount,gemmaresponse);
                //saveToLocalStorage(keyPrefix + gamecount,gemmaresponse);
                console.log('Data fetched from Gemma!');
            }).catch(error => {
                console.error('Error:', error);
            });
        }).catch(error => {
            // Handle any errors here
            console.error('Error:', error);
        });
    }).catch(error => {
        // Handle any errors here
        console.error('Error:', error);
    });  
}

async function fetchConnectionsFromGemma(master_prompt, examples_prompt) {
    const response = await fetch('https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "contents": [
                {
                    "role": "model",
                    "parts": [
                        {
                            "text": master_prompt
                        }
                    ],
                    "role": "user",
                    "parts": [
                        {
                            "text": examples_prompt
                        }
                    ]
                }
            ]
        })
    });
   
    const data = await response.json();
    //console.log(data.candidates[0].content.parts[0].text);
    //saveToLocalStorage('gemma-' + gamecount, data.candidates[0].content.parts[0].text);
    return data.candidates[0].content.parts[0].text;

}