
function fetchFromLLM(fileName){
    fetchConnectionsFromGemma(fileName).then((gemmaresponse) => {
        saveToLocalStorage('gemma-' + gamecount,gemmaresponse);
        console.log('Data fetched from Gemma!',gamecount);
    }).catch(error => {
        console.error('Error:', error);
    }); 
}

async function fetchConnectionsFromGemma(fileName) {
    const gemmaResponse = await fetch(fileName);
    const data = await gemmaResponse.text();
    //console.log(data);
    return data;

}