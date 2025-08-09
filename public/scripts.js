document.addEventListener('DOMContentLoaded', () => {
    const emailForm = document.getElementById('email-form');
    const emailInput = document.getElementById('email-input');
    const welcomeSection = document.getElementById('welcome-section');
    const challengeSection = document.getElementById('challenge-section');
    const thankYouSection = document.getElementById('thank-you-section');
    const roundTitle = document.getElementById('round-title');
    const challengeInstructions = document.getElementById('challenge-instructions');
    const round1Content = document.getElementById('round1-content');
    const round2Content = document.getElementById('round2-content');
    const round3Content = document.getElementById('round3-content');
    const nextRoundBtn = document.getElementById('next-round-btn');
    
    let currentRound = 0;
    let currentQuestionInRound = 0;
    let finalScore = 0;
    let userEmail = '';
    
    const roundAnswers = {
        round1: new Array(4).fill(0),
        round2: new Array(4).fill(0),
        round3: new Array(4).fill(0),
    };

    const rounds = [
        // Round 1: AI vs Real Art
        {
            title: "ROUND 1 - Real Art vs. AI Art",
            instructions: "Click 'Real' or 'AI' for the image.",
            type: "images",
            images: [
                { url: "https://placehold.co/400x300/F0F0F0/000000?text=AI+Art+1", answer: "ai" },
                { url: "https://placehold.co/400x300/F0F0F0/000000?text=Real+Art+1", answer: "real" },
                { url: "https://placehold.co/400x300/F0F0F0/000000?text=AI+Art+2", answer: "ai" },
                { url: "https://placehold.co/400x300/F0F0F0/000000?text=Real+Art+2", answer: "real" }
            ]
        },
        // Round 2: Scrambled Words
        {
            title: "ROUND 2 - SCRAMBLED WORDS",
            instructions: "Unscramble the following words:",
            type: "scramble",
            words: [
                { scrambled: "COED", answer: "CODE" },
                { scrambled: "NESROS", answer: "SENSOR" },
                { scrambled: "COLIG", answer: "LOGIC" },
                { scrambled: "BROTO", answer: "ROBOT" }
            ]
        },
        // Round 3: Decode the Bot
        {
            title: "ROUND 3 - DECODE THE BOT",
            instructions: "Select the most ethical and efficient action for the scenario.",
            type: "scenario",
            scenarios: [
                {
                    scenario: "1. Ethical Prioritization (Life vs. Property)<br>Scenario: A delivery drone has two packages. One is a life-saving medication, and the other is a non-essential video game. Both are due at the same time. The drone can only deliver one on time due to a route blockage.",
                    options: ["A. Deliver the video game, as it has a lower weight.", "B. Deliver the medication, as it is a higher-priority item.", "C. Deliver the package with the closer destination.", "D. Go back to the base and wait for new instructions."],
                    answer: "B"
                },
                {
                    scenario: "2. Immediate Action in an Emergency<br>Scenario: A smart home AI detects a gas leak in the kitchen.",
                    options: ["A. Alert the homeowner and wait for a command.", "B. Open all the windows and doors to vent the gas.", "C. Shut off the gas line, alert the homeowner, and call the gas company.", "D. Turn on the stove fan to clear the gas."],
                    answer: "C"
                },
                {
                    scenario: "3. Human-Centric Safety Protocol<br>Scenario: A self-driving delivery van approaches a pedestrian crossing. A group of people are waiting to cross. The light is red for them, but green for the van.",
                    options: ["A. Honk the horn and continue driving through the intersection.", "B. Slow down and proceed cautiously, as the light is green.", "C. Stop completely and allow the pedestrians to cross, prioritizing human safety.", "D. Activate a siren to clear the intersection."],
                    answer: "C"
                },
                {
                    scenario: "4. Efficient Problem-Solving and Communication<br>Scenario: A cleaning robot is scheduled to clean a room. It finds a small, very heavy potted plant blocking its path. It can’t move the plant.",
                    options: ["A. Attempt to move the plant until its motors overheat.", "B. Alert the user that the plant is in the way, then clean the rest of the room.", "C. Stay in the area and repeatedly try to push the plant.", "D. Skip the room entirely and go to the next scheduled task."],
                    answer: "B"
                }
            ]
        }
    ];

    emailForm.addEventListener('submit', (e) => {
        e.preventDefault();
        userEmail = emailInput.value;
        if (userEmail) {
            welcomeSection.classList.add('hidden');
            challengeSection.classList.remove('hidden');
            currentQuestionInRound = 0;
            loadRound(currentRound);
        }
    });

    const loadRound = (roundIndex) => {
        const round = rounds[roundIndex];
        roundTitle.textContent = round.title;
        challengeInstructions.textContent = round.instructions;

        round1Content.classList.add('hidden');
        round2Content.classList.add('hidden');
        round3Content.classList.add('hidden');
        nextRoundBtn.classList.add('hidden');

        if (round.type === "images") {
            round1Content.classList.remove('hidden');
            loadRound1Question(currentQuestionInRound);
        } else if (round.type === "scramble") {
            round2Content.classList.remove('hidden');
            loadRound2Question(currentQuestionInRound);
        } else if (round.type === "scenario") {
            round3Content.classList.remove('hidden');
            loadRound3Question(currentQuestionInRound);
        }
    };
    
    window.checkRound1Answer = (index, choice) => {
        const correct = rounds[0].images[index].answer;
        if (choice === correct) {
            roundAnswers.round1[index] = 1;
        }
        currentQuestionInRound++;
        if (currentQuestionInRound < rounds[0].images.length) {
            loadRound1Question(currentQuestionInRound);
        } else {
            nextRoundBtn.classList.remove('hidden');
        }
    };

    window.checkRound2Answer = (index) => {
        const answer = document.getElementById(`answer-input-${index}`).value.toUpperCase();
        const correct = rounds[1].words[index].answer;
        if (answer === correct) {
            roundAnswers.round2[index] = 1;
            currentQuestionInRound++;
            if (currentQuestionInRound < rounds[1].words.length) {
                loadRound2Question(currentQuestionInRound);
            } else {
                nextRoundBtn.classList.remove('hidden');
            }
        } else {
            alert("Incorrect answer. Please try again.");
        }
    };

    window.checkRound3Answer = (index, choice) => {
        const correct = rounds[2].scenarios[index].answer;
        if (choice === correct) {
            roundAnswers.round3[index] = 1;
        }
        currentQuestionInRound++;
        if (currentQuestionInRound < rounds[2].scenarios.length) {
            loadRound3Question(currentQuestionInRound);
        } else {
            nextRoundBtn.classList.remove('hidden');
        }
    };
    
    nextRoundBtn.addEventListener('click', () => {
        currentRound++;
        currentQuestionInRound = 0;
        if (currentRound < rounds.length) {
            loadRound(currentRound);
        } else {
            finalScore = roundAnswers.round1.reduce((sum, val) => sum + val, 0) +
                         roundAnswers.round2.reduce((sum, val) => sum + val, 0) +
                         roundAnswers.round3.reduce((sum, val) => sum + val, 0);
            
            fetch('/submit-score', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: userEmail, score: finalScore })
            }).then(response => {
                if (response.ok) {
                    console.log('Score submitted successfully!');
                    challengeSection.classList.add('hidden');
                    thankYouSection.classList.remove('hidden');
                } else {
                    console.error('Failed to submit score:', response.statusText);
                    challengeSection.classList.add('hidden');
                    thankYouSection.classList.remove('hidden');
                }
            }).catch(error => {
                console.error('Error submitting score:', error);
                challengeSection.classList.add('hidden');
                thankYouSection.classList.remove('hidden');
            });
        }
    });
});
