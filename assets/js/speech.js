// Function to populate conversation div from JSON content
function populateConversation() {
    const conversationDiv = document.querySelector('.conversation');
    conversationDiv.innerHTML = ''; // Clear child elements
    conversationData.forEach(message => {
        const messageDiv = document.createElement('div');
        //console.log(message);
        messageDiv.classList.add('message');

        const senderSpan = document.createElement('span');
        senderSpan.classList.add('sender');
        senderSpan.textContent = `${message.speaker}:`;

        const japaneseSpan = document.createElement('span');
        japaneseSpan.classList.add('content');
        japaneseSpan.textContent = message.japanese;

        const romajiSpan = document.createElement('span');
        romajiSpan.classList.add('content');
        romajiSpan.textContent = message.romaji;

        const englishSpan = document.createElement('span');
        englishSpan.classList.add('content');
        englishSpan.textContent = message.english;

        messageDiv.appendChild(senderSpan);
        messageDiv.appendChild(japaneseSpan);
        messageDiv.appendChild(document.createElement('br'));
        messageDiv.appendChild(romajiSpan);
        messageDiv.appendChild(document.createElement('br'));
        messageDiv.appendChild(englishSpan);

        conversationDiv.appendChild(messageDiv);
    });
    const play_btn = document.querySelector('#play-btn');


    //play
    play_btn.addEventListener('click', () => speakConversation(1));
}
const pause_btn = document.querySelector('#pause-btn');
const resume_btn = document.querySelector('#resume-btn');

// Function to speak the conversation
function speakConversation(speed) {
    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance();
    utterance.lang = 'ja-JP'; // Set language to Japanese
    const conversation = conversationData.map(message => `${message.speaker} says ${message.japanese}`);
    utterance.text = conversation.join('. ');
    utterance.rate=speed;
    speechSynthesis.speak(utterance);

    console.log('Speaking conversation...');
}

//pause
pause_btn.addEventListener( 'click' , pause );

function pause(){
	speechSynthesis.pause();
};

//pause
resume_btn.addEventListener( 'click' , resume );

function resume(){
	speechSynthesis.resume();
};

document.getElementById('speedRange').addEventListener('input', (event) => {
    const speed = parseFloat(event.target.value);
    speakConversation(speed);

});