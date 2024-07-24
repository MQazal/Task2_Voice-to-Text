window.onload = function() {
    startContinuousRecording();
};

function startContinuousRecording() {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.continuous = true; // Enable continuous listening

    recognition.start();

    recognition.onresult = (event) => {
        const transcript = event.results[event.resultIndex][0].transcript.trim();
        document.getElementById('text-output').value += transcript + ' ';
    };

    recognition.onerror = (event) => {
        console.error(event.error);
        recognition.stop();
        setTimeout(() => recognition.start(), 1000); // Restart after a short delay
    };

    recognition.onend = () => {
        setTimeout(() => recognition.start(), 1000); // Restart after a short delay
    };
}

function saveText() {
    const text = document.getElementById('text-output').value;

    if (text.trim() === '') {
        alert('Please enter some text before saving.');
        return;
    }

    fetch('save_voice.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text: text })
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            alert('Text saved successfully.');
            document.getElementById('text-output').value = '';
        } else {
            alert('Failed to save text.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}
