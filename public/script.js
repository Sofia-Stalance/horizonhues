const challenges = [
    // Set 1: AI vs Real Images
    {
        type: 'image',
        question: 'Is this a real or AI-generated cat?',
        images: [
            { src: 'https://placekitten.com/200/300', isReal: true },
            { src: 'https://placekitten.com/g/200/300', isReal: false }
        ],
        answer: null // to be set dynamically
    },
    // Set 2: Word Scramble
    {
        type: 'scramble',
        question: 'Unscramble the word:',
        scrambled: 'TCA',
        answer: 'CAT'
    },
    // Set 3: Trivia MCQ
    {
        type: 'trivia',
        question: 'What is a cat?',
        options: ['Animal', 'Plant', 'Food'],
        answer: 'Animal'
    }
];

let currentChallenge = 0;
let score = 0;
let userEmail = '';

document.getElementById('email-form').addEventListener('submit', function(e) {
    e.preventDefault();
    userEmail = document.getElementById('email').value;
    document.getElementById('email-form').style.display = 'none';
    document.getElementById('challenge-section').style.display = 'block';
    loadChallenge();
});

function loadChallenge() {
    if (currentChallenge >= challenges.length) {
        endChallenge();
        return;
    }

    const challenge = challenges[currentChallenge];
    const challengeSection = document.getElementById('challenge-section');
    challengeSection.innerHTML = `<h2>${challenge.question}</h2>`;

    if (challenge.type === 'image') {
        const imageChallenge = challenges[currentChallenge];
        const images = imageChallenge.images;
        const correctImage = images[Math.floor(Math.random() * images.length)];
        imageChallenge.answer = correctImage.isReal ? 'Real' : 'AI';

        challengeSection.innerHTML += `
            <div class="challenge-item">
                <img src="${correctImage.src}" alt="Cat Image">
                <div class="options">
                    <button onclick="checkAnswer('Real')">Real</button>
                    <button onclick="checkAnswer('AI')">AI Generated</button>
                </div>
            </div>
        `;
    } else if (challenge.type === 'scramble') {
        challengeSection.innerHTML += `
            <div class="challenge-item">
                <p>${challenge.scrambled}</p>
                <input type="text" id="scramble-input" placeholder="Your answer">
                <button onclick="checkScramble()">Submit</button>
            </div>
        `;
    } else if (challenge.type === 'trivia') {
        challengeSection.innerHTML += `
            <div class="challenge-item">
                <div class="options">
                    ${challenge.options.map(option => `<button onclick="checkAnswer('${option}')">${option}</button>`).join('')}
                </div>
            </div>
        `;
    }
}

function checkAnswer(userAnswer) {
    const challenge = challenges[currentChallenge];
    if (userAnswer === challenge.answer) {
        score += 10;
        alert('Correct!');
    } else {
        alert('Incorrect!');
    }
    currentChallenge++;
    loadChallenge();
}

function checkScramble() {
    const userAnswer = document.getElementById('scramble-input').value.toUpperCase();
    const challenge = challenges[currentChallenge];
    if (userAnswer === challenge.answer) {
        score += 10;
        alert('Correct!');
    } else {
        alert('Incorrect!');
    }
    currentChallenge++;
    loadChallenge();
}

function endChallenge() {
    document.getElementById('challenge-section').style.display = 'none';
    document.getElementById('result').style.display = 'block';
    document.getElementById('score').innerText = score;
    
    // Send email and score to backend
    sendScoreToBackend(userEmail, score);
}

function sendScoreToBackend(email, score) {
    fetch('/submit-score', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, score })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Backend response:', data);
    })
    .catch(error => {
        console.error('Error submitting score:', error);
    });
}