const fetchConversationFromLLMPrompt = async () => {
    const fileName = 'prompts/jn-conversation.txt'
    const response = await fetch(fileName); 
    return await response.text();
}
const fetchConversationFromLLMMasterPrompt = async () => {
    const fileName = 'prompts/master.txt'
    const response = await fetch(fileName); 
    return await response.text();
}
function fetchConversationFromLLM(context, words){

return fetchConversationFromLLMMasterPrompt().then(master_prompt => {
    return fetchConversationFromLLMPrompt().then(examples_prompt => {
        examples_prompt = examples_prompt.replace(/\$\(context\)/g, context);
        examples_prompt= examples_prompt.replace(/\$\(words\)/g, words);
        //console.log('Master Prompt:', master_prompt);
        //console.log('Examples Prompt:', examples_prompt);
        return fetchConnectionsFromGemma(master_prompt, examples_prompt).then((gemmaresponse) => {
            console.log('Conversation fetched from Gemma!');
            //console.log('Gemma Response:', gemmaresponse);
            return gemmaresponse;
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
                    // "role": "model",
                    // "parts": [
                    //     {
                    //         "text": master_prompt
                    //     }
                    // ],
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