// select elements
let start = document.querySelector('.start');
let startClick = document.querySelector('.start > .click');
let quiz = document.querySelector('.quiz');
let header = document.querySelector('header');
let playerName = document.querySelector('.player-info h1');
let qNums = document.querySelector('.q-n');
let question = document.querySelector('.question');
let answersContainer = document.querySelector('.answers-area');
let submitBtn = document.querySelector('#submit-btn');
let score = document.querySelector('.score span');
let theTimer = document.querySelector('.countdown');
let timerLine = document.querySelector('.quiz .info hr');
let results = document.querySelector('.results')






// Settings variables
let currentIndex = 0;
let rightAnswers = 0;
let coundownInterval;
let widthOfLine = 0;

// start the quiz
startClick.onclick = () => {
  start.innerHTML = `<p>What is your Name ?</p>
  <input type="text" id="username" class="username" autocomplete="off">
  <button class="start-btn">Let's Go</button>`;
  let inputName = document.getElementById('username');
  inputName.focus();

  document.querySelector('.start-btn').onclick = () => {
    if (inputName.value != '') {
      playerName.textContent = inputName.value;
      start.classList.add('hide');
      quiz.classList.add('show-quiz');
      header.classList.add('show-header');
      getQuestions();
    }
  }
}


// Functions

function getQuestions() {
  let xhr = new XMLHttpRequest();
  
  xhr.onreadystatechange = function() {
    if (this.readyState === 4 && this.status === 200) {
      let qObj = JSON.parse(this.responseText);
      let qCount = qObj.length;

      addInfo(qCount, currentIndex);
      addQuestionData(qObj[currentIndex], qCount);
      timer(30, qCount);

      submitBtn.onclick = function() {
        let rAnswer = qObj[currentIndex].right_answer;

        currentIndex++;

        checkAnswer(rAnswer, qObj);

        question.innerHTML = '';
        answersContainer.innerHTML = '';
        quiz.style.transform = "translateX(200%)"
        setTimeout(function() {
          quiz.style.display = "none";
        }, 100);

        
        addQuestionData(qObj[currentIndex], qCount);
        widthOfLine = 0;
        clearInterval(coundownInterval);
        if (currentIndex == qCount) {
          showResult(qCount);
        } else {
          addInfo(qCount, currentIndex);
          nextQuiz();
          timer(30, qCount);
        }
      }
    }
  }
  xhr.open('GET', './html_questions.json', true);
  xhr.send();
}

function addInfo(count, index) {
  qNums.innerHTML = `quiz : <span>${index+1}</span> of <span>${count}</span>`;
  score.textContent = rightAnswers
}

function addQuestionData(obj, count) {
  if (currentIndex < count) {
    question.innerHTML = `<h2>${obj.title}</h2>`;
    for (let i = 1; i <=4; i++) {
      let mainDiv = document.createElement('div');
      mainDiv.className = 'answer';
      mainDiv.innerHTML =  
      `<input type="radio" name="answer" id="a-${i}" data-answer="${obj[`answer_${i}`]}">
      <label for="a-${i}">${obj[`answer_${i}`]}</label>`;
      answersContainer.appendChild(mainDiv);
    };
    selectAnswer();
  }
  
}

// handle select answer
function selectAnswer() {
  let answers = document.querySelectorAll('.answer');
  answers.forEach((ans) => {
    ans.addEventListener('click', (e) => {
      answers.forEach((a) => {
        a.classList.remove('checked');
      });
      ans.children[0].click();
      ans.classList.add('checked');
    })
  })
}

function checkAnswer(rightA, obj) {
  let theAnswers = document.querySelectorAll('input[name="answer"]');
  let selected;
  for (let i = 0; i < theAnswers.length; i++) {
    if (theAnswers[i].checked){
      selected = theAnswers[i].dataset.answer;
    }
  };
  if (selected === rightA) {
    rightAnswers++;
    score.textContent = rightAnswers;
  }
}

function nextQuiz() {
  setTimeout(function() {
    quiz.style.transform = "translateX(-200%)"
  }, 100);
  setTimeout(function() {
    quiz.style.display = "block";
  }, 300);
  setTimeout(function() {
    quiz.style.transform = "translateX(0)"
  }, 400);
}

function showResult(count) {
  let finalScore = (rightAnswers / count) * 100;
  results.innerHTML = `<div class="container">
  <img src="./imgs/badge.png" alt="">
  <h1>quiz completed</h1>
  <h2 class="end-score">you Scored ${finalScore}%</h2>
  <p>Thank you <span>${playerName}</span> for taking this quiz</p>
  <p>you had <span>${count} questions</span> and from that you got <span>${rightAnswers} answers</span> correct!. Well done</p>
</div>`
  results.classList.add('show');
}

function timer(dur, count) {
  if ((currentIndex < count)) {
    let mins, secs;
    let widthInSec = (1 / dur) * 100;
    coundownInterval = setInterval(function() {
      mins = parseInt(dur / 60);
      secs = parseInt(dur % 60);

      
      mins = mins < 10 ? `0${mins}`: mins;
      secs = secs < 10 ? `0${secs}`: secs;
      
      theTimer.innerHTML = `${mins}:${secs}`;
      widthOfLine = widthOfLine + widthInSec;
      timerLine.style.width = `${widthOfLine}%`

      if (--dur < 0) {
        clearInterval(coundownInterval);
        submitBtn.click();
      }
    }, 1000);
  }
}
