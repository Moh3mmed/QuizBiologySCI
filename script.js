const questions = [
    { question: "What is the powerhouse of the cell?", options: ["Nucleus", "Mitochondria", "Ribosome", "Endoplasmic Reticulum"], correct: 1 },
    { question: "What is the process of photosynthesis?", options: ["Respiration", "Transpiration", "Fermentation", "Light energy to chemical energy"], correct: 3 },
    { question: "Which organ is responsible for pumping blood?", options: ["Brain", "Heart", "Lungs", "Liver"], correct: 1 },
    { question: "What is the chemical formula for water?", options: ["CO2", "O2", "H2O", "CH4"], correct: 2 },
    { question: "Who proposed the theory of evolution?", options: ["Newton", "Darwin", "Einstein", "Mendel"], correct: 1 },
    { question: "What is the genetic material in humans?", options: ["RNA", "DNA", "Proteins", "Carbohydrates"], correct: 1 },
    { question: "What is the main function of white blood cells?", options: ["Transport oxygen", "Fight infections", "Digest food", "Produce energy"], correct: 1 },
    { question: "Which system controls voluntary actions?", options: ["Nervous system", "Digestive system", "Circulatory system", "Respiratory system"], correct: 0 }
];

let currentQuestionIndex = 0;
let score = 0;
let studentName = '';
let leaderboard = [];
let totalTime = 0;
let questionTimer;
let questionTimeLeft = 10;

// Sound effects
const challengeSound = document.getElementById("challengeSound");
const timeoutSound = document.getElementById("timeoutSound");

function register() {
    studentName = document.getElementById("studentName").value;
    if (studentName) {
        document.getElementById("registration").style.display = "none";
        document.getElementById("quiz").style.display = "block";
        startQuiz();
    } else {
        alert("Please enter your name.");
    }
}

function startQuiz() {
    startOverallTimer();
    displayQuestion();
}

function startOverallTimer() {
    setInterval(() => {
        totalTime++;
        document.getElementById("totalTime").innerText = totalTime;
    }, 1000);
}

function displayQuestion() {
    if (currentQuestionIndex >= questions.length) {
        showResult();
        return;
    }

    const question = questions[currentQuestionIndex];
    document.getElementById("questionText").innerText = question.question;
    const optionsDiv = document.getElementById("options");
    optionsDiv.innerHTML = '';

    question.options.forEach((option, index) => {
        const button = document.createElement("button");
        button.innerText = option;
        button.onclick = () => checkAnswer(index);
        optionsDiv.appendChild(button);
    });

    // Reset and start question timer
    questionTimeLeft = 10;
    updateQuestionTimer();
    challengeSound.play();
    questionTimer = setInterval(updateQuestionTimer, 1000);
}

function updateQuestionTimer() {
    document.getElementById("timeLeft").innerText = questionTimeLeft;
    if (questionTimeLeft <= 0) {
        timeoutSound.play();
        clearInterval(questionTimer);
        nextQuestion();
    } else if (questionTimeLeft === 3) {
        challengeSound.play(); // Play sound at 3 seconds left
    }
    questionTimeLeft--;
}

function checkAnswer(selectedIndex) {
    clearInterval(questionTimer); // Stop the timer
    if (selectedIndex === questions[currentQuestionIndex].correct) {
        score++;
    }
    nextQuestion();
}

function nextQuestion() {
    currentQuestionIndex++;
    displayQuestion();
}

function showResult() {
    document.getElementById("quiz").style.display = "none";
    document.getElementById("result").style.display = "block";
    document.getElementById("score").innerText = `${studentName}, you scored ${score} out of ${questions.length} in ${totalTime} seconds.`;

    leaderboard.push({ name: studentName, score: score, time: totalTime });
    leaderboard.sort((a, b) => (b.score - a.score) || (a.time - b.time));

    const leaderboardList = document.getElementById("leaderboard-list");
    leaderboardList.innerHTML = leaderboard
        .map((entry, index) => {
            const isHighest = index === 0 && entry.score === leaderboard[0].score;
            const isFastest = entry.time === Math.min(...leaderboard.map(e => e.time)) && entry.score === leaderboard[0].score;

            return `<li class="${isHighest ? 'highest-score' : ''} ${isFastest ? 'fastest-time' : ''}">
                      ${entry.name}: ${entry.score} points (${entry.time} seconds)
                    </li>`;
        })
        .join('');
}
