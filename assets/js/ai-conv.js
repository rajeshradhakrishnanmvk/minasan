const fetchConversationFromLLMPrompt = async () => {
    const fileName = 'https://rajeshradhakrishnanmvk.github.io/minasan/assets/prompts/jn-conversation.txt'
    const response = await fetch(fileName); 
    return await response.text();
}
const fetchConversationFromLLMMasterPrompt = async () => {
    const fileName = 'https://rajeshradhakrishnanmvk.github.io/minasan/assets/prompts/master.txt'
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
    const gemmaResponse = await fetch('https://rajeshradhakrishnanmvk.github.io/minasan/assets/json/conv-1.txt');
    return data.candidates[0].content.parts[0].text;

}