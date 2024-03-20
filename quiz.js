const startBtn = document.querySelector('.start-btn');
const popupInfo = document.querySelector('.popup-info');
const exitBtn = document.querySelector('.exit-btn');
const main = document.querySelector('.main');
const continueBtn = document.querySelector('.continue-btn');
const quizSection = document.querySelector('.quiz-section');
const quizBox = document.querySelector('.quiz-box');
const resultBox = document.querySelector('.result-box');
const tryAgainBtn = document.querySelector('.tryAgain-btn');
const goHomeBtn = document.querySelector('.goHome-btn');
const nextBtn = document.querySelector('.next-btn');
const optionList = document.querySelector('.option-list');
const minutesLabel = document.getElementById("minutes");
const secondsLabel = document.getElementById("seconds");
const colonElement = document.querySelector('.colon');
const timerElement = document.querySelector('.timer');
let questionCount = 0;
let questionNumb = 1;
let userScore = 0;
let totalSeconds = 300; 
let timerInterval;

startBtn.onclick = () => {
    popupInfo.classList.add('active');
    main.classList.add('active');
};

exitBtn.onclick = () => {
    popupInfo.classList.remove('active');
    main.classList.remove('active');
};

continueBtn.onclick = () => {
    quizSection.classList.add('active');
    popupInfo.classList.remove('active');
    main.classList.remove('active');
    quizBox.classList.add('active');

    showQuestions(0);
    questionCounter(1);
    headerScore();
    startTimer();
};

tryAgainBtn.onclick = () => {
    quizBox.classList.add('active');
    nextBtn.classList.remove('active');
    resultBox.classList.remove('active');

    questionCount = 0;
    questionNumb = 1;
    userScore = 0;
    showQuestions(questionCount);
    questionCounter(questionNumb);

    headerScore();
    resetQuiz();
};

goHomeBtn.onclick = () => {
    quizSection.classList.remove('active');
    nextBtn.classList.remove('active');
    resultBox.classList.remove('active');

    questionCount = 0;
    questionNumb = 1;
    userScore = 0;
    showQuestions(questionCount);
    questionCounter(questionNumb);
    headerScore();
    resetQuiz();
};

nextBtn.onclick = () => {
    if (questionCount < questions.length - 1) {
        questionCount++;
        showQuestions(questionCount);
        questionNumb++;
        questionCounter(questionNumb);
        nextBtn.classList.remove('active');
    } else {
        showResultBox();
    }
};

// getting questions and options from array
function showQuestions(index) {
    const questionText = document.querySelector('.question-text');
    questionText.textContent = `${questions[index].numb}. ${questions[index].question}`;

    let optionTag = `<div class="option"><span>${questions[index].options[0]}</span></div>
    <div class="option"><span>${questions[index].options[1]}</span></div>
    <div class="option"><span>${questions[index].options[2]}</span></div>
    <div class="option"><span>${questions[index].options[3]}</span></div>`;

    optionList.innerHTML = optionTag;

    const option = document.querySelectorAll('.option');
    for (let i = 0; i < option.length; i++) {
        option[i].setAttribute('onclick', 'optionSelected(this)');
    }
}

function optionSelected(answer) {
    let userAnswer = answer.textContent;
    let correctAnswer = questions[questionCount].answer;
    let allOptions = optionList.children.length;

    if (userAnswer == correctAnswer) {
        answer.classList.add('correct');
        userScore += 1;
        headerScore();
    } else {
        answer.classList.add('incorrect');

        // if answer incorrect, auto selected correct answer
        for (let i = 0; i < allOptions; i++) {
            if (optionList.children[i].textContent == correctAnswer) {
                optionList.children[i].setAttribute('class', 'option correct');
            }
        }
    }
    // if user has selected, disabled all option
    for (let i = 0; i < allOptions; i++) {
        optionList.children[i].classList.add('disabled');
    }
    nextBtn.classList.add('active');
}

function questionCounter(index) {
    const questionTotal = document.querySelector('.question-total');
    questionTotal.textContent = `${index} of ${questions.length} Questions`;
}

function headerScore() {
    const headerScoreText = document.querySelector('.header-score');
    headerScoreText.textContent = `Score: ${userScore} / ${questions.length}`;
}

function showResultBox() {
    quizBox.classList.remove('active');
    resultBox.classList.add('active');

    const scoreText = document.querySelector('.score-text');
    scoreText.textContent = `Your Score ${userScore} out of ${questions.length}`;

    const circularProgress = document.querySelector('.circular-progress');
    const progressValue = document.querySelector('.progress-value');
    let progressStartValue = -1;
    let progressEndValue = (userScore / questions.length) * 100;
    let speed = 20;

    let progress = setInterval(() => {
        progressStartValue++;
        progressValue.textContent = `${progressStartValue}%`;
        circularProgress.style.background = `conic-gradient(#f06 ${progressStartValue * 3.6}deg, rgba(255,255,255,.1)0deg)`;
        if (progressStartValue == progressEndValue) {
            clearInterval(progress);
        }
    }, speed);
}

// Timer logic
function startTimer() {
    clearInterval(timerInterval); // Clear any existing timer interval
    timerInterval = setInterval(setTime, 1000);
}

function setTime() {
    --totalSeconds;
    var minutes = Math.floor(totalSeconds / 60);
    var seconds = totalSeconds % 60;

    minutesLabel.innerHTML = pad(minutes);
    secondsLabel.innerHTML = pad(seconds);

    if (totalSeconds <= 30) {
        timerElement.classList.add('blink');
        colonElement.classList.add('blink');
    }

    if (totalSeconds <= 0) {
        clearInterval(timerInterval);
        timerElement.classList.remove('blink'); // Remove blink class when time's up
        colonElement.classList.remove('blink'); // Remove blink class when time's up
        showResultBox(); // Show the result when time's up
    }
}

function pad(val) {
    var valString = val + "";
    if (valString.length < 2) {
        return "0" + valString;
    } else {
        return valString;
    }
}

// Function to reset the quiz and timer
function resetQuiz() {
    // Remove active classes from resultBox and quizBox
    resultBox.classList.remove('active');
    quizBox.classList.remove('active');

    // Reset question count, number, and user score
    questionCount = 0;
    questionNumb = 1;
    userScore = 0;

    // Show the quiz box again and update question count
    quizBox.classList.add('active');
    questionCounter(questionNumb);

    // Reset timer
    resetTimer();

    // Show the questions again
    showQuestions(questionCount);

    // Reset header score
    headerScore();
}

// Function to reset the timer
function resetTimer() {
    // Reset totalSeconds to 60 for 1 minute
    totalSeconds = 300;
    clearInterval(timerInterval);
    startTimer();
}
