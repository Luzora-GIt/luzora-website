const article = document.querySelector('.hs-article');
const sentences = document.querySelectorAll('.sentence');
const playBtn = document.getElementById('playBtn');
const synth = window.speechSynthesis;

let currentIndex = 0;
let state = 'stopped'; // 'stopped' | 'playing' | 'paused'

function highlightSentence(index) {
    sentences.forEach(s => s.classList.remove('active'));
    if (sentences[index]) {
        sentences[index].classList.add('active');
        sentences[index].scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        });
    }
}

function speakSentence(index) {
    if (index >= sentences.length) {
        stopReading();
        return;
    }

    // Chrome requires cancel before new utterance
    synth.cancel();

    const text = sentences[index].textContent.trim();
    const utterance = new SpeechSynthesisUtterance(text);

    utterance.rate = 0.92;
    utterance.pitch = 1;
    utterance.volume = 1;

    highlightSentence(index);

    utterance.onend = () => {
        // Only continue if still in playing state
        if (state === 'playing') {
            currentIndex++;
            speakSentence(currentIndex);
        }
    };

    utterance.onerror = (e) => {
        // Ignore interrupted errors (caused by cancel on pause)
        if (e.error === 'interrupted') return;
        console.error('Speech error:', e.error);
    };

    setTimeout(() => {
        // Double check state before speaking
        // (user might have paused during the timeout)
        if (state === 'playing') {
            synth.speak(utterance);
        }
    }, 150);
}

function startReading() {
    state = 'playing';
    currentIndex = 0;
    article.classList.add('reading');
    playBtn.classList.add('playing');
    speakSentence(currentIndex);
}

function pauseReading() {
    state = 'paused';
    synth.cancel(); // stop speaking, currentIndex stays where it is
    playBtn.classList.remove('playing');
    // Keep sentence highlighted so user sees where they paused
}

function resumeReading() {
    state = 'playing';
    playBtn.classList.add('playing');
    speakSentence(currentIndex); // resume from saved index
}

function stopReading() {
    state = 'stopped';
    currentIndex = 0;
    synth.cancel();
    article.classList.remove('reading');
    playBtn.classList.remove('playing');
    sentences.forEach(s => s.classList.remove('active'));
}

// Single button handles all three states
playBtn.addEventListener('click', () => {
    console.log('Button clicked, state:', state); // debug line

    if (state === 'stopped') {
        startReading();
    } else if (state === 'playing') {
        pauseReading();
    } else if (state === 'paused') {
        resumeReading();
    }
});

// Clean up when leaving page
window.addEventListener('beforeunload', () => {
    synth.cancel();
});