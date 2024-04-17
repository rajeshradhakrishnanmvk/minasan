


// Function to populate conversation div from JSON content
function populateConversation() {
    const conversationDiv = document.querySelector('.conversation');
    conversationDiv.innerHTML = ''; // Clear child elements
    if (typeof conversationData === 'string') {
        conversationData = JSON.parse(conversationData);
    }

    conversationData.conversation.forEach(message => {
        const messageDiv = document.createElement('div');
        //console.log(message);
        messageDiv.classList.add('message');

        const senderSpan = document.createElement('span');
        senderSpan.classList.add('sender');
        senderSpan.textContent = `${message.speaker}:`;

        const contentSpan = document.createElement('span');
        contentSpan.classList.add('content');
        contentSpan.textContent = message.text;

        messageDiv.appendChild(senderSpan);
        messageDiv.appendChild(contentSpan);

        conversationDiv.appendChild(messageDiv);
    });
    const play_btn = document.querySelector('#play-btn');


    //play
    play_btn.addEventListener('click', () => speakConversation(1.3));
}
const pause_btn = document.querySelector('#pause-btn');
const resume_btn = document.querySelector('#resume-btn');

// Function to speak the conversation
function speakConversation(speed) {
    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance();
    utterance.lang = 'ja-JP'; // Set language to Japanese
    const conversation = conversationData.conversation.map(message => `${message.speaker} says ${message.text}`);
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