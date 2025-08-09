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
                { url: "https://lucid.content-delivery-one.com/cdn-cgi/image/w=600,format=auto,metadata=none/66e2e5fbe0cca.png", answer: "ai" },
                { url: "https://www.sheknows.com/wp-content/uploads/2018/08/poise-articleimage-real_1_dp4wis.jpeg", answer: "real" },
                { url: "https://petapixel.com/assets/uploads/2022/08/fdfs19-800x533.jpg", answer: "ai" },
                { url: "https://www.usnews.com/object/image/00000162-f3a3-d0d5-a57f-fbf3af9b0000/20-mount-rainier-national-park.jpg?update-time=1745872131347&size=responsive640", answer: "real" }
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
    
    const loadRound1Question = (index) => {
        round1Content.innerHTML = '';
        const image = rounds[0].images[index];
        const questionDiv = document.createElement('div');
        questionDiv.className = "flex flex-col md:flex-row items-center md:items-start md:space-x-4";
        questionDiv.innerHTML = `
            <img src="${image.url}" class="rounded-lg shadow-md w-full md:w-1/2 h-auto mb-4 md:mb-0" alt="Challenge Image ${index + 1}">
            <div class="flex flex-col space-y-4 w-full md:w-1/2">
                <button id="real-btn" class="bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-lg transition duration-300 transform hover:scale-105 shadow-md">Real</button>
                <button id="ai-btn" class="bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-6 rounded-lg transition duration-300 transform hover:scale-105 shadow-md">AI</button>
            </div>
        `;
        round1Content.appendChild(questionDiv);

        document.getElementById('real-btn').addEventListener('click', () => checkRound1Answer(index, 'real'));
        document.getElementById('ai-btn').addEventListener('click', () => checkRound1Answer(index, 'ai'));
    };

    const loadRound2Question = (index) => {
        round2Content.innerHTML = '';
        const word = rounds[1].words[index];
        const questionDiv = document.createElement('div');
        questionDiv.className = "flex flex-col items-center space-y-4";
        questionDiv.innerHTML = `
            <p class="text-2xl font-semibold text-center">${word.scrambled}</p>
            <input type="text" id="answer-input-${index}" placeholder="Enter answer" class="w-full px-4 py-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-600">
            <button id="submit-btn" class="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 transform hover:scale-105 shadow-md">Submit Answer</button>
        `;
        round2Content.appendChild(questionDiv);

        document.getElementById('submit-btn').addEventListener('click', () => checkRound2Answer(index));
    };
    
    const loadRound3Question = (index) => {
        round3Content.innerHTML = '';
        const scenario = rounds[2].scenarios[index];
        const scenarioDiv = document.createElement('div');
        scenarioDiv.className = "p-4 bg-gray-700 rounded-lg shadow-inner";
        
        const scenarioText = document.createElement('p');
        scenarioText.className = "text-xl font-semibold mb-4";
        scenarioText.innerHTML = scenario.scenario;
        scenarioDiv.appendChild(scenarioText);

        const optionsList = document.createElement('div');
        optionsList.className = "space-y-2";
        scenario.options.forEach((option, optionIndex) => {
            const button = document.createElement('button');
            button.className = "w-full text-left bg-gray-600 hover:bg-blue-500 text-white font-medium py-3 px-4 rounded-lg transition";
            button.innerHTML = option;
            button.addEventListener('click', () => checkRound3Answer(index, option.charAt(0)));
            optionsList.appendChild(button);
        });
        scenarioDiv.appendChild(optionsList);
        round3Content.appendChild(scenarioDiv);
    };
    
    const checkRound1Answer = (index, choice) => {
        const correct = rounds[0].images[index].answer;
        if (choice === correct) {
            roundAnswers.round1[index] = 1;
        }
        currentQuestionInRound++;
        // FIX: Check if we have more questions *after* incrementing
        if (currentQuestionInRound < rounds[0].images.length) {
            loadRound1Question(currentQuestionInRound);
        } else {
            nextRoundBtn.classList.remove('hidden');
        }
    };

    const checkRound2Answer = (index) => {
        const answer = document.getElementById(`answer-input-${index}`).value.toUpperCase();
        const correct = rounds[1].words[index].answer;
        if (answer === correct) {
            roundAnswers.round2[index] = 1;
        }
        currentQuestionInRound++;
        if (currentQuestionInRound < rounds[1].words.length) {
            loadRound2Question(currentQuestionInRound);
        } else {
            nextRoundBtn.classList.remove('hidden');
        }
    };

    const checkRound3Answer = (index, choice) => {
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
