const fetchFromLLMPrompt = async () => {
    const fileName = 'https://rajeshradhakrishnanmvk.github.io/minasan/assets/prompts/jn.txt'
    const response = await fetch(fileName); 
    return await response.text();
}
const fetchFromLLMMasterPrompt = async () => {
    const fileName = 'https://rajeshradhakrishnanmvk.github.io/minasan/assets/prompts/master.txt'
    const response = await fetch(fileName); 
    return await response.text();
}
function fetchFromLLM(key){
    fetchFromLLMMasterPrompt().then(master_prompt => {
        fetchFromLLMPrompt().then(examples_prompt => {
            //console.log(master_prompt);
            //console.log(examples_prompt);
            console.log("Page number", key)
            fetchConnectionsFromGemma(master_prompt, examples_prompt,key).then((gemmaresponse) => {
                gamecount++; //global variable to keep track of the number of games played, ref games.js
                saveToLocalStorage('gemma-' + gamecount,gemmaresponse);
                //saveToLocalStorage(keyPrefix + gamecount,gemmaresponse);
                console.log('Data fetched from Gemma!',key,gamecount);
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

async function fetchConnectionsFromGemma(master_prompt, examples_prompt,key) {
    const fileName = 'https://rajeshradhakrishnanmvk.github.io/minasan/assets/json/gemma-'+ key +'.txt';
    console.log("fetchConnectionsFromGemma: ",'gemma-' + key);
    const gemmaResponse = await fetch(fileName);
    const data = await gemmaResponse.text();
    console.log(data);
    return data;

}