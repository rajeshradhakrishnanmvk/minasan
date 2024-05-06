async function fetchConnectionsFromGemma(fileName) {
    const gemmaResponse = await fetch(fileName);
    const data = await gemmaResponse.text();
    //console.log(data);
    return data;

}