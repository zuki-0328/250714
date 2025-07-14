let currentQuestion = 0;
let quizData = [];

fetch('quiz.json')
  .then(response => response.json())
  .then(data => {
    quizData = data;
    showQuestion();
  });

function showQuestion() {
  const questionEl = document.getElementById('question');
  const choicesEl = document.getElementById('choices');
  const resultEl = document.getElementById('result');
  resultEl.textContent = '';
  choicesEl.innerHTML = '';

  const q = quizData[currentQuestion];
  questionEl.textContent = q.question;

  q.choices.forEach(choice => {
    const li = document.createElement('li');
    li.textContent = choice;
    li.onclick = () => checkAnswer(choice);
    choicesEl.appendChild(li);
  });
}

function checkAnswer(selected) {
  const resultEl = document.getElementById('result');
  const correct = quizData[currentQuestion].answer;
  if (selected === correct) {
    resultEl.textContent = '正解！';
    resultEl.style.color = 'green';
  } else {
    resultEl.textContent = `不正解。正解は「${correct}」です。`;
    resultEl.style.color = 'red';
  }
}

document.getElementById('next-btn').onclick = () => {
  currentQuestion = (currentQuestion + 1) % quizData.length;
  showQuestion();
};
