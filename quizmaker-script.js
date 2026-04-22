// =====================================
// QUIZ MAKER APPLICATION - JavaScript
// =====================================

// Sample Quizzes Data
const sampleQuizzes = [
    {
        id: 1,
        title: 'World Geography Quiz',
        description: 'Test your knowledge of world capitals, countries, and geographical features.',
        category: 'Geography',
        questions: [
            { question: 'What is the capital of France?', options: ['London', 'Paris', 'Berlin', 'Madrid'], correct: 1 },
            { question: 'Which is the largest ocean in the world?', options: ['Atlantic', 'Indian', 'Pacific', 'Arctic'], correct: 2 },
            { question: 'Mount Everest is located in which mountain range?', options: ['Alps', 'Andes', 'Rockies', 'Himalayas'], correct: 3 },
            { question: 'Which country has the largest population?', options: ['USA', 'India', 'China', 'Russia'], correct: 2 },
            { question: 'What is the longest river in the world?', options: ['Amazon', 'Nile', 'Mississippi', 'Yangtze'], correct: 1 }
        ],
        plays: 1250,
        createdBy: 'Admin',
        featured: true
    },
    {
        id: 2,
        title: 'Science Fundamentals',
        description: 'Basic science questions covering physics, chemistry, and biology.',
        category: 'Science',
        questions: [
            { question: 'What is the chemical symbol for water?', options: ['H2O', 'CO2', 'NaCl', 'O2'], correct: 0 },
            { question: 'What planet is known as the Red Planet?', options: ['Venus', 'Mars', 'Jupiter', 'Saturn'], correct: 1 },
            { question: 'What is the powerhouse of the cell?', options: ['Nucleus', 'Ribosome', 'Mitochondria', 'Golgi Body'], correct: 2 },
            { question: 'What is the speed of light in vacuum (approx)?', options: ['300 km/s', '3,000 km/s', '300,000 km/s', '3 million km/s'], correct: 2 },
            { question: 'Which element has the atomic number 1?', options: ['Helium', 'Hydrogen', 'Oxygen', 'Carbon'], correct: 1 }
        ],
        plays: 980,
        createdBy: 'Admin',
        featured: true
    },
    {
        id: 3,
        title: 'Tech & Programming',
        description: 'Questions about technology, programming languages, and computer science.',
        category: 'Technology',
        questions: [
            { question: 'Who is the founder of Microsoft?', options: ['Steve Jobs', 'Bill Gates', 'Mark Zuckerberg', 'Jeff Bezos'], correct: 1 },
            { question: 'What does HTML stand for?', options: ['Hyper Text Markup Language', 'High Tech Machine Learning', 'Home Tool Markup Language', 'Hyperlink Text Making Language'], correct: 0 },
            { question: 'Which programming language is known as "the mother of all languages"?', options: ['Java', 'Python', 'C', 'Assembly'], correct: 2 },
            { question: 'What year was the first iPhone released?', options: ['2005', '2006', '2007', '2008'], correct: 2 },
            { question: 'What does CPU stand for?', options: ['Central Process Unit', 'Central Processing Unit', 'Computer Personal Unit', 'Central Program Utility'], correct: 1 }
        ],
        plays: 750,
        createdBy: 'Admin',
        featured: true
    },
    {
        id: 4,
        title: 'World History',
        description: 'Journey through time with questions about major historical events.',
        category: 'History',
        questions: [
            { question: 'In which year did World War II end?', options: ['1943', '1944', '1945', '1946'], correct: 2 },
            { question: 'Who was the first President of the United States?', options: ['Abraham Lincoln', 'Thomas Jefferson', 'George Washington', 'John Adams'], correct: 2 },
            { question: 'The Great Wall of China was primarily built to protect against invasions from?', options: ['Japanese', 'Mongols', 'Russians', 'Indians'], correct: 1 },
            { question: 'Which ancient civilization built the pyramids?', options: ['Romans', 'Greeks', 'Egyptians', 'Mayans'], correct: 2 },
            { question: 'The Industrial Revolution began in which country?', options: ['France', 'Germany', 'USA', 'Britain'], correct: 3 }
        ],
        plays: 620,
        createdBy: 'Admin',
        featured: false
    },
    {
        id: 5,
        title: 'Movie Trivia',
        description: 'Test your knowledge of classic and modern movies.',
        category: 'Entertainment',
        questions: [
            { question: 'Who directed "Titanic"?', options: ['Steven Spielberg', 'James Cameron', 'Christopher Nolan', 'Ridley Scott'], correct: 1 },
            { question: 'Which movie won the first Academy Award for Best Picture?', options: ['Wings', 'The Jazz Singer', 'Sunrise', 'Metropolis'], correct: 0 },
            { question: 'What is the highest-grossing film of all time (not adjusted for inflation)?', options: ['Titanic', 'Avengers: Endgame', 'Avatar', 'Star Wars'], correct: 2 },
            { question: 'Who played the Joker in "The Dark Knight"?', options: ['Jack Nicholson', 'Joaquin Phoenix', 'Heath Ledger', 'Jared Leto'], correct: 2 },
            { question: 'In "The Matrix", what color pill does Neo take?', options: ['Blue', 'Red', 'Green', 'Yellow'], correct: 1 }
        ],
        plays: 890,
        createdBy: 'Admin',
        featured: true
    }
];

// Application State
let currentUser = null;
let quizzes = [...sampleQuizzes];
let filteredQuizzes = [...quizzes];
let currentQuiz = null;
let currentQuestionIndex = 0;
let userAnswers = [];
let myQuizzes = [];
let quizResults = [];

// Question counter for creating quizzes
let questionCount = 0;

// =====================================
// PAGE NAVIGATION
// =====================================

function showPage(pageName, pushState = true) {
    if (pageName === 'create' || pageName === 'dashboard') {
        if (!currentUser) {
            showModal('login');
            showToast('Please login to access this page', 'error');
            return;
        }
    }

    if (pushState) {
        history.pushState({ pageName }, '', `#${pageName}`);
    }

    document.querySelectorAll('.page').forEach(page => {
        page.style.display = 'none';
    });

    const page = document.getElementById(pageName + 'Page');
    if (page) {
        page.style.display = 'block';
        window.scrollTo(0, 0);
    }

    switch (pageName) {
        case 'home':
            loadPopularQuizzes();
            break;
        case 'quizList':
            loadQuizList();
            break;
        case 'create':
            initCreateQuiz();
            break;
        case 'dashboard':
            loadDashboard();
            break;
    }
}

// =====================================
// QUIZ DISPLAY
// =====================================

function loadPopularQuizzes() {
    const grid = document.getElementById('popularQuizzesGrid');
    if (!grid) return;

    const popular = quizzes.filter(q => q.featured).slice(0, 4);
    grid.innerHTML = popular.map(quiz => createQuizCard(quiz)).join('');
}

function loadQuizList() {
    const grid = document.getElementById('quizListGrid');
    if (!grid) return;

    if (filteredQuizzes.length === 0) {
        grid.innerHTML = `
            <div class="empty-state" style="grid-column: 1/-1;">
                <i class="fas fa-search"></i>
                <h3>No quizzes found</h3>
                <p>Try a different search or category</p>
            </div>
        `;
    } else {
        grid.innerHTML = filteredQuizzes.map(quiz => createQuizCard(quiz)).join('');
    }
}

function createQuizCard(quiz) {
    return `
        <div class="quiz-card" onclick="selectQuiz(${quiz.id})">
            <div class="quiz-card-header">
                <span class="quiz-category">${quiz.category}</span>
            </div>
            <h3>${quiz.title}</h3>
            <p>${quiz.description}</p>
            <div class="quiz-card-footer">
                <div class="quiz-meta">
                    <span><i class="fas fa-list"></i> ${quiz.questions.length} Questions</span>
                    <span><i class="fas fa-play"></i> ${quiz.plays} plays</span>
                </div>
            </div>
        </div>
    `;
}

// =====================================
// SEARCH & FILTER
// =====================================

function searchQuizzes() {
    const searchTerm = document.getElementById('quizSearch').value.toLowerCase();
    filteredQuizzes = quizzes.filter(quiz => 
        quiz.title.toLowerCase().includes(searchTerm) ||
        quiz.description.toLowerCase().includes(searchTerm) ||
        quiz.category.toLowerCase().includes(searchTerm)
    );
    loadQuizList();
}

function filterByCategory(category) {
    // Update active button
    document.querySelectorAll('.category-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    if (category === 'all') {
        filteredQuizzes = [...quizzes];
    } else {
        filteredQuizzes = quizzes.filter(quiz => quiz.category === category);
    }
    loadQuizList();
}

// =====================================
// TAKE QUIZ
// =====================================

function selectQuiz(quizId) {
    currentQuiz = quizzes.find(q => q.id === quizId);
    if (!currentQuiz) return;

    // Reset state
    currentQuestionIndex = 0;
    userAnswers = new Array(currentQuiz.questions.length).fill(null);

    // Update start screen
    document.getElementById('startQuizTitle').textContent = currentQuiz.title;
    document.getElementById('startQuizDescription').textContent = currentQuiz.description;
    document.getElementById('startQuestionCount').textContent = currentQuiz.questions.length;
    document.getElementById('startQuizCategory').textContent = currentQuiz.category;

    // Show start screen
    showPage('takeQuiz');
    showQuizScreen('quizStartScreen');
}

function showQuizScreen(screenId) {
    document.querySelectorAll('.quiz-screen').forEach(screen => {
        screen.style.display = 'none';
    });
    document.getElementById(screenId).style.display = 'flex';
}

function startQuiz() {
    showQuizScreen('quizQuestionsScreen');
    displayQuestion();
}

function displayQuestion() {
    const question = currentQuiz.questions[currentQuestionIndex];
    const total = currentQuiz.questions.length;

    // Update progress
    const progress = ((currentQuestionIndex + 1) / total) * 100;
    document.getElementById('progressFill').style.width = `${progress}%`;
    document.getElementById('questionProgress').textContent = `${currentQuestionIndex + 1} / ${total}`;

    // Display question
    document.getElementById('currentQuestion').textContent = question.question;

    // Display options
    const optionsContainer = document.getElementById('optionsContainer');
    const letters = ['A', 'B', 'C', 'D'];
    optionsContainer.innerHTML = question.options.map((option, index) => `
        <button class="option-btn ${userAnswers[currentQuestionIndex] === index ? 'selected' : ''}" onclick="selectAnswer(${index})">
            <span class="option-letter">${letters[index]}</span>
            ${option}
        </button>
    `).join('');

    // Update navigation buttons
    document.getElementById('prevBtn').disabled = currentQuestionIndex === 0;
    
    if (currentQuestionIndex === total - 1) {
        document.getElementById('nextBtn').style.display = 'none';
        document.getElementById('submitBtn').style.display = 'inline-flex';
    } else {
        document.getElementById('nextBtn').style.display = 'inline-flex';
        document.getElementById('submitBtn').style.display = 'none';
    }
}

function selectAnswer(index) {
    userAnswers[currentQuestionIndex] = index;
    
    // Update UI
    document.querySelectorAll('.option-btn').forEach((btn, i) => {
        btn.classList.toggle('selected', i === index);
    });
}

function nextQuestion() {
    if (currentQuestionIndex < currentQuiz.questions.length - 1) {
        currentQuestionIndex++;
        displayQuestion();
    }
}

function prevQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        displayQuestion();
    }
}

function submitQuiz() {
    // Calculate score
    let correct = 0;
    currentQuiz.questions.forEach((q, i) => {
        if (userAnswers[i] === q.correct) correct++;
    });

    const total = currentQuiz.questions.length;
    const percentage = Math.round((correct / total) * 100);

    // Update results screen
    document.getElementById('scoreNumber').textContent = correct;
    document.getElementById('correctCount').textContent = correct;
    document.getElementById('wrongCount').textContent = total - correct;
    document.getElementById('percentScore').textContent = `${percentage}%`;
    document.getElementById('scoreText').textContent = `You got ${correct} out of ${total} questions correct!`;

    // Update result title and icon based on score
    const resultsIcon = document.getElementById('resultsIcon');
    const resultsTitle = document.getElementById('resultsTitle');
    
    if (percentage >= 80) {
        resultsIcon.className = 'results-icon good';
        resultsIcon.innerHTML = '<i class="fas fa-trophy"></i>';
        resultsTitle.textContent = 'Excellent!';
    } else if (percentage >= 50) {
        resultsIcon.className = 'results-icon';
        resultsIcon.innerHTML = '<i class="fas fa-thumbs-up"></i>';
        resultsTitle.textContent = 'Good Job!';
    } else {
        resultsIcon.className = 'results-icon bad';
        resultsIcon.innerHTML = '<i class="fas fa-redo"></i>';
        resultsTitle.textContent = 'Keep Practicing!';
    }

    // Save result
    if (currentUser) {
        quizResults.push({
            quizId: currentQuiz.id,
            quizTitle: currentQuiz.title,
            score: correct,
            total: total,
            percentage: percentage,
            date: new Date().toLocaleDateString()
        });
    }

    // Increment play count
    currentQuiz.plays++;

    showQuizScreen('quizResultsScreen');
}

function showResults() {
    showQuizScreen('quizResultsScreen');
}

function reviewAnswers() {
    const reviewContent = document.getElementById('reviewContent');
    const letters = ['A', 'B', 'C', 'D'];

    reviewContent.innerHTML = currentQuiz.questions.map((q, i) => {
        const isCorrect = userAnswers[i] === q.correct;
        const userAnswer = userAnswers[i] !== null ? letters[userAnswers[i]] + '. ' + q.options[userAnswers[i]] : 'Not answered';
        const correctAnswer = letters[q.correct] + '. ' + q.options[q.correct];

        return `
            <div class="review-item ${isCorrect ? 'correct' : 'incorrect'}">
                <div class="review-question">
                    <i class="fas ${isCorrect ? 'fa-check-circle' : 'fa-times-circle'}"></i>
                    <span>Q${i + 1}: ${q.question}</span>
                </div>
                <div class="review-answer ${isCorrect ? 'correct-answer' : 'user-answer'}">
                    Your answer: ${userAnswer}
                </div>
                ${!isCorrect ? `<div class="review-answer correct-answer">Correct answer: ${correctAnswer}</div>` : ''}
            </div>
        `;
    }).join('');

    showQuizScreen('reviewScreen');
}

function retakeQuiz() {
    currentQuestionIndex = 0;
    userAnswers = new Array(currentQuiz.questions.length).fill(null);
    startQuiz();
}

// =====================================
// CREATE QUIZ
// =====================================

function initCreateQuiz() {
    questionCount = 0;
    document.getElementById('quizForm').reset();
    document.getElementById('questionsContainer').innerHTML = '';
    addQuestion(); // Add first question
}

function addQuestion() {
    questionCount++;
    const container = document.getElementById('questionsContainer');
    
    const questionHTML = `
        <div class="question-card-edit" id="question${questionCount}">
            <div class="question-card-header">
                <span class="question-number">Question ${questionCount}</span>
                <button type="button" class="delete-question" onclick="deleteQuestion(${questionCount})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
            <div class="form-group">
                <label>Question</label>
                <input type="text" name="q${questionCount}_text" placeholder="Enter your question" required>
            </div>
            <div class="options-edit">
                <div class="option-row">
                    <input type="text" name="q${questionCount}_opt0" placeholder="Option A" required>
                    <label class="correct-option">
                        <input type="radio" name="q${questionCount}_correct" value="0" required> Correct
                    </label>
                </div>
                <div class="option-row">
                    <input type="text" name="q${questionCount}_opt1" placeholder="Option B" required>
                    <label class="correct-option">
                        <input type="radio" name="q${questionCount}_correct" value="1"> Correct
                    </label>
                </div>
                <div class="option-row">
                    <input type="text" name="q${questionCount}_opt2" placeholder="Option C" required>
                    <label class="correct-option">
                        <input type="radio" name="q${questionCount}_correct" value="2"> Correct
                    </label>
                </div>
                <div class="option-row">
                    <input type="text" name="q${questionCount}_opt3" placeholder="Option D" required>
                    <label class="correct-option">
                        <input type="radio" name="q${questionCount}_correct" value="3"> Correct
                    </label>
                </div>
            </div>
        </div>
    `;
    
    container.insertAdjacentHTML('beforeend', questionHTML);
}

function deleteQuestion(num) {
    if (document.querySelectorAll('.question-card-edit').length <= 1) {
        showToast('Quiz must have at least one question', 'error');
        return;
    }
    
    document.getElementById(`question${num}`).remove();
    updateQuestionNumbers();
}

function updateQuestionNumbers() {
    document.querySelectorAll('.question-card-edit').forEach((card, index) => {
        card.querySelector('.question-number').textContent = `Question ${index + 1}`;
    });
}

function saveQuiz(event) {
    event.preventDefault();

    const title = document.getElementById('quizTitle').value;
    const category = document.getElementById('quizCategory').value;
    const description = document.getElementById('quizDescription').value;

    // Gather questions
    const questions = [];
    const questionCards = document.querySelectorAll('.question-card-edit');
    
    questionCards.forEach((card, index) => {
        const qNum = card.id.replace('question', '');
        const questionText = card.querySelector(`input[name="q${qNum}_text"]`).value;
        const options = [
            card.querySelector(`input[name="q${qNum}_opt0"]`).value,
            card.querySelector(`input[name="q${qNum}_opt1"]`).value,
            card.querySelector(`input[name="q${qNum}_opt2"]`).value,
            card.querySelector(`input[name="q${qNum}_opt3"]`).value
        ];
        const correctRadio = card.querySelector(`input[name="q${qNum}_correct"]:checked`);
        
        if (!correctRadio) {
            showToast(`Please select correct answer for question ${index + 1}`, 'error');
            return;
        }
        
        questions.push({
            question: questionText,
            options: options,
            correct: parseInt(correctRadio.value)
        });
    });

    if (questions.length === 0) {
        showToast('Please add at least one question', 'error');
        return;
    }

    // Create new quiz
    const newQuiz = {
        id: Date.now(),
        title: title,
        description: description || 'No description provided',
        category: category,
        questions: questions,
        plays: 0,
        createdBy: currentUser.name,
        featured: false
    };

    quizzes.unshift(newQuiz);
    filteredQuizzes = [...quizzes];
    myQuizzes.push(newQuiz);

    showToast('Quiz created successfully!', 'success');
    showPage('quizList');
}

// =====================================
// DASHBOARD
// =====================================

function loadDashboard() {
    if (!currentUser) return;

    // Update stats
    document.getElementById('createdQuizzesCount').textContent = myQuizzes.length;
    document.getElementById('takenQuizzesCount').textContent = quizResults.length;
    
    // Calculate average score
    let avgScore = 0;
    if (quizResults.length > 0) {
        avgScore = Math.round(quizResults.reduce((sum, r) => sum + r.percentage, 0) / quizResults.length);
    }
    document.getElementById('avgScore').textContent = avgScore + '%';

    // Load my quizzes
    const myQuizzesList = document.getElementById('myQuizzesList');
    if (myQuizzes.length === 0) {
        myQuizzesList.innerHTML = `
            <div class="empty-state" style="grid-column: 1/-1;">
                <i class="fas fa-edit"></i>
                <h3>No quizzes created yet</h3>
                <p>Create your first quiz to see it here</p>
            </div>
        `;
    } else {
        myQuizzesList.innerHTML = myQuizzes.map(quiz => createQuizCard(quiz)).join('');
    }

    // Load recent results
    const recentResultsList = document.getElementById('recentResults');
    if (quizResults.length === 0) {
        recentResultsList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-chart-bar"></i>
                <h3>No results yet</h3>
                <p>Take a quiz to see your results here</p>
            </div>
        `;
    } else {
        recentResultsList.innerHTML = quizResults.slice(-5).reverse().map(result => `
            <div class="result-item">
                <div class="result-info">
                    <h4>${result.quizTitle}</h4>
                    <span>${result.date}</span>
                </div>
                <span class="result-score">${result.percentage}%</span>
            </div>
        `).join('');
    }
}

// =====================================
// AUTHENTICATION
// =====================================

function login(event) {
    event.preventDefault();
    const email = document.getElementById('loginEmail').value;

    currentUser = {
        id: Date.now(),
        name: email.split('@')[0],
        email: email
    };

    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    updateAuthUI();
    closeModal('login');
    showToast('Welcome back!', 'success');
}

function register(event) {
    event.preventDefault();
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;

    currentUser = {
        id: Date.now(),
        name: name,
        email: email
    };

    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    updateAuthUI();
    closeModal('register');
    showToast('Account created!', 'success');
}

function logout() {
    currentUser = null;
    myQuizzes = [];
    quizResults = [];
    localStorage.removeItem('currentUser');
    updateAuthUI();
    closeDropdown();
    showToast('Logged out');
    showPage('home');
}

function updateAuthUI() {
    const navAuth = document.getElementById('navAuth');
    const navUser = document.getElementById('navUser');
    const userName = document.getElementById('userName');

    if (currentUser) {
        navAuth.style.display = 'none';
        navUser.style.display = 'block';
        userName.textContent = currentUser.name;
    } else {
        navAuth.style.display = 'flex';
        navUser.style.display = 'none';
    }
}

// =====================================
// MODALS & UI HELPERS
// =====================================

function showModal(modalName) {
    document.getElementById(modalName + 'Modal').classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeModal(modalName) {
    document.getElementById(modalName + 'Modal').classList.remove('show');
    document.body.style.overflow = '';
}

function switchModal(from, to) {
    closeModal(from);
    setTimeout(() => showModal(to), 200);
}

function toggleDropdown() {
    document.getElementById('dropdownMenu').classList.toggle('show');
}

function closeDropdown() {
    document.getElementById('dropdownMenu').classList.remove('show');
}

function toggleMobileMenu() {
    // Simple mobile menu implementation
    const navLinks = document.querySelector('.nav-links');
    navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
}

function showToast(message, type = '') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = 'toast show ' + type;
    setTimeout(() => toast.classList.remove('show'), 3000);
}

// Close dropdown on outside click
document.addEventListener('click', (e) => {
    if (!e.target.closest('.user-dropdown')) closeDropdown();
    if (e.target.classList.contains('modal')) {
        const modalId = e.target.id.replace('Modal', '');
        closeModal(modalId);
    }
});

// =====================================
// INITIALIZATION
// =====================================

document.addEventListener('DOMContentLoaded', () => {
    // Load user
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        updateAuthUI();
    }

    // Load initial content
    loadPopularQuizzes();

    const hash = window.location.hash.slice(1);
    const initialPage = hash || 'home';
    history.replaceState({ pageName: initialPage }, '', `#${initialPage}`);
    showPage(initialPage, false);
});

window.addEventListener('popstate', (e) => {
    const pageName = e.state ? e.state.pageName : 'home';
    showPage(pageName, false);
});
