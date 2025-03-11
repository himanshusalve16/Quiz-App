// DOM Elements
const welcomeScreen = document.getElementById('welcome-screen');
const quizContainer = document.getElementById('quiz-container');
const resultsScreen = document.getElementById('results-screen');
const startBtn = document.getElementById('start-btn');
const restartBtn = document.getElementById('restart-btn');
const shareBtn = document.getElementById('share-btn');
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const questionNumber = document.getElementById('question-number');
const currentScoreElement = document.getElementById('current-score');
const finalScoreElement = document.getElementById('final-score');
const timeBonusElement = document.getElementById('time-bonus');
const totalScoreElement = document.getElementById('total-score');
const performanceMessage = document.getElementById('performance-message');
const timerBar = document.getElementById('timer-bar');
const timerText = document.getElementById('timer-text');
const progressIndicator = document.getElementById('progress-indicator');

// Quiz Variables
let currentQuestion = 0;
let score = 0;
let timeBonus = 0;
let timer;
let timeLeft;
let answeredQuestions = 0;
let correctAnswers = 0;
const maxTime = 10; // Maximum time in seconds for each question
const questions = [
    {
        question: "What does HTML stand for?",
        options: [
            "Hyper Text Markup Language",
            "High Tech Multi Language",
            "Hyper Transfer Markup Language",
            "Home Tool Markup Language"
        ],
        correctAnswer: 0
    },
    {
        question: "Which of the following is a CSS framework?",
        options: [
            "React",
            "jQuery",
            "Bootstrap",
            "Node.js"
        ],
        correctAnswer: 2
    },
    {
        question: "Which programming language is known as the 'language of the web'?",
        options: [
            "Java",
            "Python",
            "C++",
            "JavaScript"
        ],
        correctAnswer: 3
    },
    {
        question: "What symbol is used to select an ID in CSS?",
        options: [
            ".",
            "#",
            "&",
            "@"
        ],
        correctAnswer: 1
    },
    {
        question: "Which of these is NOT a JavaScript data type?",
        options: [
            "String",
            "Boolean",
            "Float",
            "Object"
        ],
        correctAnswer: 2
    },
    {
        question: "Which keyword is used to declare a variable in JavaScript?",
        options: [
            "var",
            "let",
            "const",
            "variable"
        ],
        correctAnswer: 3
    },
    {
        question: "What will `typeof null` return in JavaScript?",
        options: [
            "'null'",
            "'undefined'",
            "'object'",
            "'number'"
        ],
        correctAnswer: 2
    },
    {
        question: "Which method is used to add a new element to the end of an array?",
        options: [
            "push()",
            "pop()",
            "shift()",
            "unshift()"
        ],
        correctAnswer: 0
    },
    {
        question: "Which of the following is NOT a valid way to define a function in JavaScript?",
        options: [
            "Function declaration",
            "Function expression",
            "Arrow function",
            "Function component"
        ],
        correctAnswer: 3
    },
    {
        question: "Which symbol is used for single-line comments in JavaScript?",
        options: [
            "//",
            "/* */",
            "#",
            "--"
        ],
        correctAnswer: 0
    },
    {
        question: "Which built-in method converts a JSON string into a JavaScript object?",
        options: [
            "JSON.parse()",
            "JSON.stringify()",
            "parseJSON()",
            "stringifyJSON()"
        ],
        correctAnswer: 0
    }
];

// Sound Effects (optional - uncomment if you want to use sounds)
// const correctSound = new Audio('https://assets.mixkit.co/active_storage/sfx/2005/2005-preview.mp3');
// const incorrectSound = new Audio('https://assets.mixkit.co/active_storage/sfx/2006/2006-preview.mp3');
// const timerSound = new Audio('https://assets.mixkit.co/active_storage/sfx/2007/2007-preview.mp3');
// const completeSound = new Audio('https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3');

// Event Listeners
startBtn.addEventListener('click', startQuiz);
restartBtn.addEventListener('click', restartQuiz);
shareBtn.addEventListener('click', shareResult);

// Functions
function startQuiz() {
    // Add animation to welcome screen before hiding
    welcomeScreen.style.animation = 'fadeOut 0.5s forwards';
    
    setTimeout(() => {
        welcomeScreen.classList.add('hide');
        quizContainer.classList.remove('hide');
        quizContainer.style.animation = 'fadeIn 0.5s forwards';
        
        // Reset quiz variables
        currentQuestion = 0;
        score = 0;
        timeBonus = 0;
        answeredQuestions = 0;
        correctAnswers = 0;
        
        // Reset progress bar
        updateProgressBar();
        
        updateScore();
        loadQuestion();
    }, 500);
}

function restartQuiz() {
    // Add animation to results screen before hiding
    resultsScreen.style.animation = 'fadeOut 0.5s forwards';
    
    setTimeout(() => {
        resultsScreen.classList.add('hide');
        welcomeScreen.classList.remove('hide');
        welcomeScreen.style.animation = 'fadeIn 0.5s forwards';
    }, 500);
}

function loadQuestion() {
    if (currentQuestion < questions.length) {
        // Reset timer
        resetTimer();
        
        // Update question number display
        questionNumber.textContent = `Question ${currentQuestion + 1} of ${questions.length}`;
        
        // Update progress bar
        updateProgressBar();
        
        // Load question text with animation
        const question = questions[currentQuestion];
        questionText.style.opacity = '0';
        questionText.style.transform = 'translateY(-10px)';
        
        setTimeout(() => {
            questionText.textContent = question.question;
            questionText.style.opacity = '1';
            questionText.style.transform = 'translateY(0)';
            questionText.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        }, 200);
        
        // Clear previous options
        optionsContainer.innerHTML = '';
        
        // Create and append options with staggered animation
        question.options.forEach((option, index) => {
            const optionElement = document.createElement('div');
            optionElement.classList.add('option');
            optionElement.textContent = option;
            optionElement.dataset.index = index;
            optionElement.addEventListener('click', checkAnswer);
            
            // Set initial state for animation
            optionElement.style.opacity = '0';
            optionElement.style.transform = 'translateX(-10px)';
            
            optionsContainer.appendChild(optionElement);
            
            // Staggered animation for options
            setTimeout(() => {
                optionElement.style.opacity = '1';
                optionElement.style.transform = 'translateX(0)';
                optionElement.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            }, 300 + (index * 100));
        });
        
        // Start timer after a short delay to allow animations to complete
        setTimeout(() => {
            startTimer();
        }, 800);
    } else {
        // End of quiz
        endQuiz();
    }
}

function startTimer() {
    timeLeft = maxTime;
    timerText.textContent = timeLeft;
    timerBar.style.width = '100%';
    
    // Add pulse animation to timer when it's low
    timerBar.classList.remove('pulse-animation');
    
    timer = setInterval(() => {
        timeLeft--;
        timerText.textContent = timeLeft;
        
        // Update timer bar width
        const percentage = (timeLeft / maxTime) * 100;
        timerBar.style.width = `${percentage}%`;
        
        // Change color based on time left
        if (timeLeft <= 3) {
            timerBar.style.background = 'linear-gradient(90deg, #e74c3c, #ff7675)';
            
            // Add pulse animation when time is running out
            if (!timerBar.classList.contains('pulse-animation')) {
                timerBar.classList.add('pulse-animation');
                // Play timer sound when time is running out (optional)
                // timerSound.play();
            }
        } else if (timeLeft <= 6) {
            timerBar.style.background = 'linear-gradient(90deg, #f39c12, #fdcb6e)';
        }
        
        if (timeLeft <= 0) {
            clearInterval(timer);
            handleTimeUp();
        }
    }, 1000);
}

function resetTimer() {
    clearInterval(timer);
    timerBar.style.background = 'linear-gradient(90deg, var(--secondary-color), #55efc4)';
    timerBar.classList.remove('pulse-animation');
}

function handleTimeUp() {
    // Disable all options
    const options = document.querySelectorAll('.option');
    options.forEach(option => {
        option.classList.add('disabled');
        
        // Highlight correct answer
        if (parseInt(option.dataset.index) === questions[currentQuestion].correctAnswer) {
            option.classList.add('correct');
        }
    });
    
    // Show time's up message
    showNotification("Time's up!", 'warning');
    
    // Increment answered questions counter
    answeredQuestions++;
    
    // Move to next question after delay
    setTimeout(() => {
        currentQuestion++;
        loadQuestion();
    }, 1800);
}

function checkAnswer(event) {
    clearInterval(timer); // Stop the timer
    
    const selectedOption = event.target;
    const selectedAnswer = parseInt(selectedOption.dataset.index);
    const correctAnswer = questions[currentQuestion].correctAnswer;
    
    // Disable all options
    const options = document.querySelectorAll('.option');
    options.forEach(option => {
        option.classList.add('disabled');
        
        // Highlight correct answer
        if (parseInt(option.dataset.index) === correctAnswer) {
            option.classList.add('correct');
        }
    });
    
    // Increment answered questions counter
    answeredQuestions++;
    
    // Check if answer is correct
    if (selectedAnswer === correctAnswer) {
        selectedOption.classList.add('correct');
        
        // Increment correct answers counter
        correctAnswers++;
        
        // Play correct sound (optional)
        // correctSound.play();
        
        // Calculate base score and time bonus
        const basePoints = 10;
        const currentTimeBonus = calculateTimeBonus(timeLeft);
        
        // Update scores
        score += basePoints;
        timeBonus += currentTimeBonus;
        updateScore();
        
        // Show correct answer notification
        showNotification("Correct!", 'success');
        
        // Show time bonus notification if applicable
        if (currentTimeBonus > 0) {
            setTimeout(() => {
                showBonusNotification(currentTimeBonus);
            }, 700);
        }
    } else {
        selectedOption.classList.add('incorrect');
        
        // Play incorrect sound (optional)
        // incorrectSound.play();
        
        // Show incorrect answer notification
        showNotification("Incorrect!", 'error');
    }
    
    // Move to next question after delay
    setTimeout(() => {
        currentQuestion++;
        loadQuestion();
    }, 1800);
}

function calculateTimeBonus(timeRemaining) {
    // Calculate bonus points based on time remaining
    // More time left = more bonus points
    if (timeRemaining <= 0) return 0;
    
    // Maximum bonus is 10 points (when all time is left)
    // Minimum bonus is 1 point (when almost no time is left)
    return Math.ceil((timeRemaining / maxTime) * 10);
}

function showBonusNotification(bonusPoints) {
    const notification = document.createElement('div');
    notification.textContent = `+${bonusPoints} Time Bonus!`;
    notification.className = 'notification bonus';
    notification.style.position = 'absolute';
    notification.style.top = '50%';
    notification.style.left = '50%';
    notification.style.transform = 'translate(-50%, -50%)';
    notification.style.backgroundColor = 'rgba(0, 184, 148, 0.9)';
    notification.style.color = 'white';
    notification.style.padding = '10px 20px';
    notification.style.borderRadius = '50px';
    notification.style.fontWeight = 'bold';
    notification.style.zIndex = '100';
    notification.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.2)';
    notification.style.animation = 'fadeInUp 0.5s, fadeOut 0.5s 1.5s forwards';
    
    quizContainer.appendChild(notification);
    
    // Remove notification after animation completes
    setTimeout(() => {
        notification.remove();
    }, 2000);
}

function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.className = `notification ${type}`;
    notification.style.position = 'absolute';
    notification.style.top = '30%';
    notification.style.left = '50%';
    notification.style.transform = 'translate(-50%, -50%)';
    notification.style.padding = '10px 25px';
    notification.style.borderRadius = '50px';
    notification.style.fontWeight = 'bold';
    notification.style.zIndex = '100';
    notification.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.2)';
    notification.style.animation = 'fadeInUp 0.5s, fadeOut 0.5s 1.5s forwards';
    
    // Set colors based on notification type
    if (type === 'success') {
        notification.style.backgroundColor = 'rgba(0, 184, 148, 0.9)';
        notification.style.color = 'white';
    } else if (type === 'error') {
        notification.style.backgroundColor = 'rgba(231, 76, 60, 0.9)';
        notification.style.color = 'white';
    } else if (type === 'warning') {
        notification.style.backgroundColor = 'rgba(243, 156, 18, 0.9)';
        notification.style.color = 'white';
    }
    
    quizContainer.appendChild(notification);
    
    // Remove notification after animation completes
    setTimeout(() => {
        notification.remove();
    }, 2000);
}

function updateScore() {
    currentScoreElement.textContent = `Score: ${score}`;
    
    // Add animation to score when it updates
    currentScoreElement.classList.add('score-update');
    setTimeout(() => {
        currentScoreElement.classList.remove('score-update');
    }, 500);
}

function endQuiz() {
    // Play completion sound (optional)
    // completeSound.play();
    
    // Hide quiz container with animation
    quizContainer.style.animation = 'fadeOut 0.5s forwards';
    
    setTimeout(() => {
        quizContainer.classList.add('hide');
        resultsScreen.classList.remove('hide');
        resultsScreen.style.animation = 'fadeIn 0.5s forwards';
        
        // Update final score details with animation
        animateValue(finalScoreElement, 0, score, 1000);
        setTimeout(() => {
            animateValue(timeBonusElement, 0, timeBonus, 1000);
        }, 1000);
        
        const totalScore = score + timeBonus;
        setTimeout(() => {
            animateValue(totalScoreElement, 0, totalScore, 1000);
        }, 2000);
        
        // Calculate accuracy percentage
        const accuracy = (correctAnswers / answeredQuestions) * 100;
        
        // Set performance message based on total score and accuracy
        const maxPossibleScore = questions.length * 20; // 10 base points + max 10 time bonus per question
        const percentage = (totalScore / maxPossibleScore) * 100;
        
        setTimeout(() => {
            if (percentage >= 90) {
                performanceMessage.textContent = `Outstanding! You're a quiz master! (${accuracy.toFixed(1)}% accuracy)`;
                performanceMessage.style.color = '#00b894';
            } else if (percentage >= 70) {
                performanceMessage.textContent = `Great job! You know your stuff! (${accuracy.toFixed(1)}% accuracy)`;
                performanceMessage.style.color = '#00b894';
            } else if (percentage >= 50) {
                performanceMessage.textContent = `Good effort! Keep learning! (${accuracy.toFixed(1)}% accuracy)`;
                performanceMessage.style.color = '#fdcb6e';
            } else {
                performanceMessage.textContent = `Keep practicing! You'll improve! (${accuracy.toFixed(1)}% accuracy)`;
                performanceMessage.style.color = '#e17055';
            }
            
            performanceMessage.style.animation = 'fadeIn 1s forwards';
        }, 3000);
    }, 500);
}

// Helper function to animate counting up for score values
function animateValue(element, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const value = Math.floor(progress * (end - start) + start);
        element.textContent = value;
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// Add CSS animations dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }
    
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    @keyframes fadeInUp {
        from { 
            opacity: 0;
            transform: translate(-50%, -30%);
        }
        to { 
            opacity: 1;
            transform: translate(-50%, -50%);
        }
    }
    
    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }
    
    .score-update {
        animation: pulse 0.5s ease;
    }
    
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.1); }
        100% { transform: scale(1); }
    }
    
    .pulse-animation {
        animation: pulse 0.5s infinite;
    }
`;
document.head.appendChild(style);

// Initialize welcome screen
document.addEventListener('DOMContentLoaded', () => {
    welcomeScreen.classList.remove('hide');
    welcomeScreen.style.animation = 'fadeIn 1s forwards';
});

function updateProgressBar() {
    const progressPercentage = (currentQuestion / questions.length) * 100;
    progressIndicator.style.width = `${progressPercentage}%`;
}

function shareResult() {
    // Create share text
    const totalScore = parseInt(totalScoreElement.textContent);
    const shareText = `I scored ${totalScore} points in the Brain Teaser Quiz! Can you beat my score?`;
    
    // Check if Web Share API is supported
    if (navigator.share) {
        navigator.share({
            title: 'Brain Teaser Quiz Result',
            text: shareText,
            url: window.location.href
        })
        .then(() => showNotification('Shared successfully!', 'success'))
        .catch(error => console.log('Error sharing:', error));
    } else {
        // Fallback for browsers that don't support Web Share API
        // Copy to clipboard
        navigator.clipboard.writeText(shareText)
            .then(() => {
                showShareNotification('Result copied to clipboard!');
            })
            .catch(err => {
                console.log('Failed to copy text: ', err);
                alert(shareText);
            });
    }
}

function showShareNotification(message) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.className = 'notification';
    notification.style.position = 'fixed';
    notification.style.bottom = '20px';
    notification.style.left = '50%';
    notification.style.transform = 'translateX(-50%)';
    notification.style.backgroundColor = 'rgba(0, 184, 148, 0.9)';
    notification.style.color = 'white';
    notification.style.padding = '10px 20px';
    notification.style.borderRadius = '50px';
    notification.style.fontWeight = 'bold';
    notification.style.zIndex = '100';
    notification.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.2)';
    
    document.body.appendChild(notification);
    
    // Fade out and remove notification
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transition = 'opacity 0.5s';
        setTimeout(() => {
            notification.remove();
        }, 500);
    }, 2000);
} 