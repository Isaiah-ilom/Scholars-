document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  const signupForm = document.getElementById('signupForm');
  const recoveryForm = document.getElementById('recoveryForm');
  const welcomeMessage = document.getElementById('welcomeMessage');
  const startButton = document.getElementById('startButton');
  const englishTest = document.getElementById('englishTest');
  const englishTestForm = document.getElementById('englishTestForm');
  const scoreSheet = document.getElementById('scoreSheet');
  const progressBar = document.getElementById('progress');
  const timerDisplay = document.getElementById('time');
  const leaderboard = document.getElementById('leaderboard');
  const leaderboardList = document.getElementById('leaderboardList');
  const darkModeToggle = document.getElementById('darkModeToggle');

  let timerInterval;
  let userEmail;
  let questions = [];

  function toggleForms() {
    loginForm.classList.toggle('active');
    signupForm.style.display = signupForm.style.display === 'none' ? 'block' : 'none';
    recoveryForm.style.display = recoveryForm.style.display === 'none' ? 'block' : 'none';
  }

  function login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    if (email && password) {
      userEmail = email;
      loginForm.style.display = 'none';
      welcomeMessage.style.display = 'block';
      startButton.style.display = 'block';
    } else {
      alert('Please enter valid credentials');
    }
  }
  document.getElementById('signupForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    let fullName = document.getElementById('fullName').value;
    let email = document.getElementById('signupEmail').value;
    let password = document.getElementById('signupPassword').value;
    let phoneNumber = document.getElementById('phoneNumber').value;
    let address = document.getElementById('address').value;

    if (fullName && email && password && phoneNumber && address) {
      // Hide the signup form and show the welcome message
      signupForm.style.display = 'none';
      displayWelcomeMessage();
    } else {
      alert('Please fill in all fields.');
    }
  });

  function displayWelcomeMessage() {
    welcomeMessage.style.display = 'block';
    startButton.style.display = 'block';
  }

  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  }

  function validatePhone(phone) {
    const re = /^\d{11}$/;
    return re.test(String(phone));
  }

  function startQuiz() {
    welcomeMessage.style.display = 'none';
    englishTest.style.display = 'block';
    fetchQuestions();
    startTimer(300, timerDisplay);
  }

  function fetchQuestions() {
    fetch('https://opentdb.com/api.php?amount=20&category=17&type=multiple')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
      })
      .then(data => {
        questions = data.results;
        questions.forEach((question, index) => {
          const questionElement = document.createElement('div');
          questionElement.innerHTML = `
            <p>${index + 1}. ${question.question}</p>
            <label><input type="radio" name="question${index}" value="${question.correct_answer}"> ${question.correct_answer}</label><br>
            ${question.incorrect_answers.map(answer => `<label><input type="radio" name="question${index}" value="${answer}"> ${answer}</label><br>`).join('')}
          `;
          englishTestForm.insertBefore(questionElement, englishTestForm.lastElementChild);
        });
      })
      .catch(error => console.error('Error fetching questions:', error));
  }

  function submitAnswers() {
    const answers = [];
    for (let i = 0; i < questions.length; i++) {
      const selectedOption = document.querySelector(`input[name="question${i}"]:checked`);
      if (selectedOption) {
        answers.push(selectedOption.value);
      } else {
        answers.push(null);
      }
    }
    displayResults(answers);
  }

  function displayResults(answers) {
    clearInterval(timerInterval);
    englishTest.style.display = 'none';
    scoreSheet.style.display = 'block';
    leaderboard.style.display = 'block';
    const table = scoreSheet.querySelector('table');
    table.innerHTML = `
      <tr>
        <th>Question</th>
        <th>Your Answer</th>
        <th>Correct Answer</th>
        <th>Result</th>
      </tr>
    `;
    let score = 0;
    answers.forEach((answer, index) => {
      const row = table.insertRow();
      const cell1 = row.insertCell(0);
      const cell2 = row.insertCell(1);
      const cell3 = row.insertCell(2);
      const cell4 = row.insertCell(3);
      cell1.innerHTML = questions[index].question;
      cell2.innerHTML = answer ? answer : 'No answer';
      cell3.innerHTML = questions[index].correct_answer;
      cell4.innerHTML = answer === questions[index].correct_answer ? 'Correct' : 'Incorrect';
      if (answer === questions[index].correct_answer) {
        score++;
      }
    });
    updateLeaderboard([{ name: userEmail, points: score }]);
  }

  function startTimer(duration, display) {
    let timer = duration, minutes, seconds;
    timerInterval = setInterval(() => {
      minutes = parseInt(timer / 60, 10);
      seconds = parseInt(timer % 60, 10);

      minutes = minutes < 10 ? "0" + minutes : minutes;
      seconds = seconds < 10 ? "0" + seconds : seconds;

      display.textContent = minutes + ":" + seconds;

      if (--timer < 0) {
        clearInterval(timerInterval);
        submitAnswers();
      }
    }, 1000);
  }

  function updateLeaderboard(scores) {
    leaderboardList.innerHTML = '';
    scores.forEach(score => {
      const listItem = document.createElement('li');
      listItem.textContent = `${score.name}: ${score.points}`;
      leaderboardList.appendChild(listItem);
    });
  }

  document.getElementById('logButton').addEventListener('click', login);
  document.getElementById('startButton').addEventListener('click', startQuiz);
  document.querySelector('button[onclick="submitAnswers()"]').addEventListener('click', submitAnswers);
});
