let curTheme = localStorage.getItem('theme') || 'Coffee';
const themes = {
  'Elixir': {
    'primary-color': 'hsl(336, 89%, 93%)',
    'primary-color-shadow': 'hsl(336, 47%, 62%)',
    'secondary-color': 'hsl(336, 100%, 70%)',
    'tertiary-color': 'hsl(336, 100%, 87%)',
    'background-color': 'hsla(307, 47%, 18%, 1.00)',
    'background-color-light': 'hsl(307, 47%, 25%)',
    'text-color': 'white',
    'text-outline': 'hsl(276, 100%, 25%)'
  },
  'Coffee': {
    'primary-color': 'hsl(39, 59%, 78%)',
    'primary-color-shadow': 'hsl(39, 59%, 58%)',
    'secondary-color': 'hsl(18, 71%, 27%)',
    'tertiary-color': 'hsl(31, 51%, 54%)',
    'background-color': 'hsla(26, 42%, 10%, 1.00)',
    'background-color-light': 'hsl(26, 42%, 25%)',
    'text-color': 'hsl(0, 0%, 100%)',
    'text-outline': 'hsl(26, 42%, 19%)',
  },
  'Matcha': {
    'primary-color': 'hsl(60, 63%, 89%)',
    'primary-color-shadow': 'hsl(60, 63%, 69%)',
    'secondary-color': 'hsl(77, 14%, 45%)',
    'tertiary-color': 'hsl(101, 41%, 74%)',
    'background-color': 'hsla(227, 8%, 22%, 1.00)',
    'background-color-light': 'hsl(227, 8%, 38%)',
    'text-color': 'hsl(0, 0%, 100%)',
    'text-outline': 'hsl(26, 62%, 18%)'
  },
  'Lemonade': {
    'primary-color': 'hsl(48, 100%, 85%)',
    'primary-color-shadow': 'hsl(48, 100%, 65%)',
    'secondary-color': 'hsl(204, 100%, 50%)',
    'tertiary-color': 'hsl(48, 100%, 85%)',
    'background-color': 'hsla(210, 100%, 16%, 1.00)',
    'background-color-light': 'hsl(210, 100%, 22%)',
    'text-color': 'hsl(0, 0%, 100%)',
    'text-outline': 'hsl(210, 100%, 21%)'
  },
  'Water': {
    'primary-color': 'hsl(215, 87%, 12%)',
    'primary-color-shadow': 'hsl(169, 44%, 83%)',
    'secondary-color': 'hsl(169, 58%, 91%)',
    'tertiary-color': 'hsl(169, 58%, 91%)',
    'background-color': 'hsla(203, 55%, 54%, 1.00)',
    'background-color-light': 'hsl(203, 72%, 62%)',
    'text-color': 'hsl(215, 87%, 12%)',
    'text-outline': 'hsl(185, 64%, 89%)'
  },
  'Cola': {
    'primary-color': 'hsl(0, 0%, 100%)',
    'primary-color-shadow': 'hsl(0, 0%, 14%)',
    'secondary-color': 'hsl(358, 100%, 48%)',
    'tertiary-color': 'hsl(0, 0%, 0%)',
    'background-color': 'hsla(0, 0%, 0%, 1.00)',
    'background-color-light': 'hsl(358, 100%, 48%)',
    'text-color': 'hsl(0, 0%, 100%)',
    'text-outline': 'hsl(0, 0%, 0%)'
  },
};

const setTheme = (theme) => {
  if (!Object.keys(themes).includes(theme)) return;
  localStorage.setItem('theme', theme);
  curTheme = theme;
  const vars = themes[theme];
  const root = document.documentElement;

  Object.entries(vars).forEach(([key, value]) => {
    root.style.setProperty(`--${key}`, value);
  });

  const title = document.getElementById('title')
  if (title) {
    title.textContent = `Focus ${theme}`;
  }
  const drink = document.getElementById('drink-name')
  if (drink) {
    drink.textContent = theme;
  }
  document.getElementById("settings-icon").src = `./assets/settings-${theme.toLowerCase()}.png`;
}

setTheme(curTheme);

let tabbedAway = false;
document.addEventListener('visibilitychange', function() {
  if (document.visibilityState === 'visible') {
    tabbedAway = false;
    document.title = 'Focus Coffee';
  } else {
    tabbedAway = true;
  }
});

const cup = document.getElementById('cup');
const startButton = document.getElementById('start-stop');
const sessionCountDisplay = document.getElementById('session-count');
const sessionDisplay = document.getElementById('session-type');
const minutesDisplay = document.getElementById('minutes');
const secondsDisplay = document.getElementById('seconds');

const DEFAULT_SESSION_COUNT = 4;
const DEFAULT_FOCUS_TIME = 50; // minutes
const DEFAULT_BREAK_TIME = 10; // minutes

let sessionTimer;
let sessionStatus = 'stopped';
let sessionType = 'focus';
let sessionCount = 0;
let focusTime = DEFAULT_FOCUS_TIME;
let breakTime = DEFAULT_BREAK_TIME;
let totalSessions = DEFAULT_SESSION_COUNT;

let M = 0;
let S = 0;

const saveSessionState = () => {
  localStorage.setItem('session-state', JSON.stringify({
    sessionStatus,
    sessionType,
    sessionCount,
    saveTime: Date.now(),
    timeRemaining: (M * 60 + S),
  }));
};

const updateDisplay = (m = M, s = S) => {
  minutesDisplay.textContent = String(m).padStart(2, '0');
  secondsDisplay.textContent = String(s).padStart(2, '0');
};

let totalSessionCount = parseInt(localStorage.getItem('total-session-count') || '0');
const startTimer = (reverse=false) => {
  if (sessionTimer) {
    clearInterval(sessionTimer);
  }
  const startTime = Date.now();
  console.log(`Timer started for ${M}m ${S}s at ${new Date(startTime).toLocaleTimeString()}`);
  const startM = M;
  const startS = S;
  const totalDrainTime = (startM * 60 + startS) * 1000; // in ms
  updateDisplay();
  cup.style.setProperty('--fill-level', reverse ? '0%' : '100%');
  let percent = 100;
  sessionTimer = setInterval(() => {
    const elapsed = Date.now() - startTime;
    percent = Math.max(0, 1 - (elapsed / totalDrainTime).toFixed(4));
    if (reverse) {
      percent = 1 - percent;
    }
    percent = cup.style.setProperty('--fill-level', percent * 100 + '%');

    const secondsElapsedTotal = Math.floor(elapsed / 1000);
    const minutesElapsed = Math.floor(secondsElapsedTotal / 60);
    const secondsElapsed = secondsElapsedTotal % 60;
    M = startM - minutesElapsed;
    S = startS - secondsElapsed;
    if (S < 0) {
      S += 60;
      M -= 1;
    }
    if (M < 0) {
      const audio = new Audio('./assets/chime.mp3');
      audio.play();
      sessionStatus = 'completed';
      clearInterval(sessionTimer);
      updateDisplay(0, 0);
      cup.style.setProperty('--fill-level', reverse ? '100%' : '0%');
      startButton.textContent = 'Next';
      sessionDisplay.textContent = (sessionType === 'focus' ? 'Focus' : 'Break') + ' Session Completed!';
      if (sessionType === 'focus') {
        totalSessionCount += 1;
        localStorage.setItem('total-session-count', totalSessionCount);
      }
      saveSessionState();
      if (tabbedAway && !window.__TAURI__) {
        document.title = 'Session Complete!';
        alert('Session Complete!');
      }
      if (sessionCount >= totalSessions && sessionType === 'break') {
        sessionDisplay.textContent = 'All Sessions Completed!';
        startButton.textContent = 'Start Over';
        return;
      }
      return;
    }

    updateDisplay();
  }, 500);
};

const restoreSessionState = () => {
  const state = JSON.parse(localStorage.getItem('session-state'));
  if (!state) return;
  sessionStatus = state.sessionStatus;
  sessionType = state.sessionType;
  sessionCount = state.sessionCount;
  if (sessionStatus === 'stopped') return;
  sessionCountDisplay.textContent = `Session ${sessionCount}/${totalSessions}`;

  let remainingMs;
  if (sessionStatus === 'paused') {
    remainingMs = state.timeRemaining * 1000;
    M = Math.max(0, Math.floor(remainingMs / (1000 * 60)));
    S = Math.max(0, Math.floor(remainingMs / 1000) % 60);
    updateDisplay();
  } else {
    const elapsedMs = Date.now() - state.saveTime;
    remainingMs = state.timeRemaining * 1000 - elapsedMs;
    M = Math.max(0, Math.floor(remainingMs / (1000 * 60)));
    S = Math.max(0, Math.floor(remainingMs / 1000) % 60);
  }

  startButton.textContent = sessionStatus === 'running' ? 'Pause' : 'Start';
  sessionDisplay.textContent = sessionType === 'focus' ? 'Focus Time!' : 'Refill your cup';
  if (sessionStatus === 'completed') {
    startButton.textContent = 'Next';
    sessionDisplay.textContent = (sessionType === 'focus' ? 'Focus' : 'Break') + ' Session Completed!';
  }

  if (remainingMs > 0 && sessionStatus === 'running') {
    startTimer(sessionType === 'break');
  }
}
restoreSessionState()

const startFocusSession = () => {
  console.log('Focus Session Started');
  M = focusTime - 1;
  S = 59;
  startTimer();
  sessionType = 'focus';
  sessionStatus = 'running';
  sessionDisplay.textContent = 'Focus Time!';
  saveSessionState();
}

const startBreakSession = () => {
  console.log('Break Session Started');
  M = breakTime - 1;
  S = 59;
  startTimer(true);
  sessionType = 'break';
  sessionStatus = 'running';
  sessionDisplay.textContent = 'Refill your cup';
  saveSessionState();
};

const skip = () => {
  sessionStatus = 'running';
  startButton.textContent = 'Pause';
  if (sessionCount === 0) {
    sessionCount += 1;
    sessionCountDisplay.textContent = `Session ${sessionCount}/${totalSessions}`;
  }
  if (sessionTimer) {
    clearInterval(sessionTimer);
  }
  if (sessionType === 'focus') {
    startBreakSession();
  } else {
    sessionCount += 1;
    sessionCountDisplay.textContent = `Session ${sessionCount}/${totalSessions}`;
    if (sessionCount > totalSessions) {
      reset();
      sessionDisplay.textContent = 'All Sessions Completed!';
      return;
    }
    startFocusSession();
  }
};

const pause = () => {
  if (sessionTimer) {
    clearInterval(sessionTimer);
  }
  sessionStatus = 'paused';
  startButton.textContent = 'Start';
  saveSessionState();
};

const resume = () => {
  sessionStatus = 'running';
  startButton.textContent = 'Pause';
  saveSessionState();
  startTimer(sessionType === 'break');
}


const reset = () => {
  if (sessionTimer) {
    clearInterval(sessionTimer);
  }
  updateDisplay(0, 0);
  sessionCount = 0;
  sessionStatus = 'stopped';
  sessionType = 'focus';
  sessionCountDisplay.textContent = `Session ${sessionCount}/${totalSessions}`;
  sessionDisplay.textContent = 'Focus Time!';
  startButton.textContent = 'Start';
  cup.style.setProperty('--fill-level', '0%');
  saveSessionState();
};

startButton.addEventListener('click', () => {
  switch (sessionStatus) {
    case 'running': pause(); break;
    case 'paused': resume(); break;
    case 'stopped':
      sessionCount = 1;
      sessionCountDisplay.textContent = `Session ${sessionCount}/${totalSessions}`;
      startFocusSession();
      startButton.textContent = 'Pause';
      break;
    case 'completed':
      startButton.textContent = 'Pause';
      // Move to the next session
      if (sessionType === 'focus') {
        startBreakSession();
      } else {
        sessionCount += 1;
        if (sessionCount > totalSessions) {
          reset();
          return;
        }
        startFocusSession();
        sessionCountDisplay.textContent = `Session ${sessionCount}/${totalSessions}`;
      }
      break;
  }
});

document.getElementById('skip').addEventListener('click', () => {
  skip();
});

document.getElementById('reset').addEventListener('click', () => {
  reset();
});

const setPomo = (f, b) => {
  focusTime = f;
  breakTime = b;
};

/* --- SESSION OPTIONS --- */

const option25 = document.getElementById('25-5');
const option50 = document.getElementById('50-10');
const option75 = document.getElementById('75-15');

const selectOption = (id) => {
  option25.className = "session-option";
  option50.className = "session-option";
  option75.className = "session-option";
  document.getElementById(id).className = "session-option session-option-selected";
  localStorage.setItem('session-option', id);
  if (id === '25-5') setPomo(25, 5);
  else if (id === '50-10') setPomo(50, 10);
  else if (id === '75-15') setPomo(75, 15);
};

option25.addEventListener('click', () => selectOption('25-5'));
option50.addEventListener('click', () => selectOption('50-10'));
option75.addEventListener('click', () => selectOption('75-15'));

selectOption(localStorage.getItem('session-option') || '50-10');

/* --- TASKS LIST --- */

const taskContainer = document.getElementById('tasks-container');
let tasksDisplayed = localStorage.getItem('displayTasks') || 'false';
if (tasksDisplayed === 'true') {
  taskContainer.style.display = 'flex';
}

let totalTaskCount = parseInt(localStorage.getItem('total-task-count') || '0');
const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
let completedTasks = tasks.filter(t => t.complete).length;
const taskTitle = document.getElementById('task-title');
const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');
const clearButton = document.getElementById('clear-tasks');
if (tasks.length > 0) clearButton.style.display = 'inline';

const saveTasks = () => localStorage.setItem('tasks', JSON.stringify(tasks));

const renderTask = (taskData, index) => {
  const li = document.createElement("li");
  li.textContent = taskData.text;
  if (taskData.complete) li.className = "task-complete";
  li.onclick = () => {
    if (taskData.complete) {
      taskData.complete = false;
      completedTasks -= 1;
      li.className = "";
    } else {
      taskData.complete = true;
      completedTasks += 1;
      totalTaskCount += 1;
      localStorage.setItem('total-task-count', totalTaskCount);
      li.className = "task-complete";
    }
    saveTasks();
    taskTitle.textContent = `Tasks ${completedTasks}/${tasks.length}`;
  };
  taskList.appendChild(li);
};

tasks.forEach((task, i) => renderTask(task, i));
taskTitle.textContent = `Tasks ${completedTasks}/${tasks.length}`;

document.getElementById('task-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const taskData = { text: taskInput.value, complete: false };
  tasks.push(taskData);
  clearButton.style.display = 'inline'
  saveTasks();
  renderTask(taskData, tasks.length - 1);
  taskInput.value = '';
  taskTitle.textContent = `Tasks ${completedTasks}/${tasks.length}`;
});

clearButton.addEventListener('click', () => {
  tasks.length = 0;
  completedTasks = 0;
  saveTasks();
  taskList.innerHTML = '';
  taskTitle.textContent = `Tasks 0/0`;
  clearButton.style.display = 'none'
});

