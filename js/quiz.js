// Quiz State Management
const quizState = {
    currentQuestion: 1,
    totalQuestions: 4,
    answers: {},
    selectedProduct: sessionStorage.getItem('selectedProduct')
};

// DOM Elements
const progressBar = document.querySelector('.progress-bar');
const prevButton = document.querySelector('.prev-btn');
const nextButton = document.querySelector('.next-btn');
const questionSlides = document.querySelectorAll('.question-slide');

// Initialize Quiz
document.addEventListener('DOMContentLoaded', () => {
    updateProgress();
    setupOptionCards();
    
    // Navigation Button Event Listeners
    prevButton.addEventListener('click', showPreviousQuestion);
    nextButton.addEventListener('click', handleNextButton);
});

// Setup Option Cards
function setupOptionCards() {
    const optionCards = document.querySelectorAll('.option-card');
    
    optionCards.forEach(card => {
        card.addEventListener('click', () => {
            // Remove selection from siblings
            const siblings = card.parentElement.querySelectorAll('.option-card');
            siblings.forEach(sibling => sibling.classList.remove('selected'));
            
            // Select current card
            card.classList.add('selected');
            
            // Store answer
            const questionNumber = card.closest('.question-slide').dataset.question;
            quizState.answers[questionNumber] = card.dataset.value;
            
            // Enable next button if an option is selected
            nextButton.disabled = false;
        });
    });
}

// Navigation Functions
function showPreviousQuestion() {
    if (quizState.currentQuestion > 1) {
        showQuestion(quizState.currentQuestion - 1);
    }
}

function handleNextButton() {
    if (quizState.currentQuestion < quizState.totalQuestions) {
        showQuestion(quizState.currentQuestion + 1);
    } else {
        submitQuiz();
    }
}

function showQuestion(questionNumber) {
    // Hide all questions
    questionSlides.forEach(slide => {
        slide.classList.remove('active');
    });
    
    // Show current question
    const currentSlide = document.querySelector(`[data-question="${questionNumber}"]`);
    currentSlide.classList.add('active');
    
    // Update quiz state
    quizState.currentQuestion = questionNumber;
    
    // Update navigation buttons
    updateNavigationButtons();
    
    // Update progress bar
    updateProgress();
}

// Update UI Elements
function updateNavigationButtons() {
    prevButton.disabled = quizState.currentQuestion === 1;
    nextButton.textContent = quizState.currentQuestion === quizState.totalQuestions ? 'See Results' : 'Next';
}

function updateProgress() {
    const progress = (quizState.currentQuestion - 1) / quizState.totalQuestions * 100;
    progressBar.style.width = `${progress}%`;
}

// Quiz Submission
function submitQuiz() {
    // Validate all questions are answered
    if (Object.keys(quizState.answers).length < quizState.totalQuestions) {
        alert('Please answer all questions before proceeding.');
        return;
    }
    
    // Store quiz results
    localStorage.setItem('quizResults', JSON.stringify({
        answers: quizState.answers,
        selectedProduct: quizState.selectedProduct,
        timestamp: new Date().toISOString()
    }));
    
    // Redirect to results/recommendations page
    window.location.href = 'products.html';
}

// Prevent form submission on enter key
document.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        return false;
    }
});