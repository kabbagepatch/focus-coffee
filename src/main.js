let isDesktop = false;
let isAndroid = false;
if (window.__TAURI__) {
  const { platform } = window.__TAURI__.os;
  const currentPlatform = platform();
  isDesktop = ['windows', 'macos', 'linux'].includes(currentPlatform);
  isAndroid = currentPlatform === 'android';
}

let curTheme = localStorage.getItem('theme') || 'Coffee';

const themes = {
  'Coffee': {
    'color-header': 'hsl(25, 29%, 18%)',
    'color-shadow': 'hsl(25, 29%, 25%)',
    'color-subheader': 'hsl(345, 7%, 89%)',
    'color-drink': 'hsl(6, 27%, 15%)',
    'color-background': 'hsla(32, 50%, 77%, 1.00)',
    'color-cup': 'hsl(23, 40%, 39%)',
    'color-text': 'hsl(345, 7%, 89%)',
    'color-text-shadow': 'hsl(26, 42%, 19%)',
  },
  'Latte': {
    'color-header': 'hsl(39, 59%, 78%)',
    'color-shadow': 'hsl(39, 59%, 58%)',
    'color-subheader': 'hsl(39, 59%, 78%)',
    'color-drink': 'hsl(31, 51%, 54%)',
    'color-background': 'hsla(26, 42%, 10%, 1.00)',
    'color-cup': 'hsl(26, 42%, 25%)',
    'color-text': 'hsl(0, 0%, 100%)',
    'color-text-shadow': 'hsl(26, 42%, 19%)',
  },
  'Elixir': {
    'color-header': 'hsl(336, 89%, 93%)',
    'color-shadow': 'hsl(336, 47%, 62%)',
    'color-subheader': 'hsl(307, 47%, 25%)',
    'color-drink': 'hsl(336, 100%, 87%)',
    'color-background': 'hsla(307, 47%, 18%, 1.00)',
    'color-cup': 'hsl(336, 100%, 70%)',
    'color-text': 'white',
    'color-text-shadow': 'hsl(276, 100%, 25%)'
  },
  'Matcha': {
    'color-header': 'hsl(60, 63%, 89%)',
    'color-shadow': 'hsl(60, 63%, 69%)',
    'color-subheader': 'hsl(60, 63%, 89%)',
    'color-drink': 'hsl(101, 41%, 74%)',
    'color-background': 'hsla(227, 8%, 22%, 1.00)',
    'color-cup': 'hsl(227, 8%, 38%)',
    'color-text': 'hsl(0, 0%, 100%)',
    'color-text-shadow': 'hsl(26, 62%, 18%)'
  },
  'Lemonade': {
    'color-header': 'hsl(48, 100%, 85%)',
    'color-shadow': 'hsl(48, 100%, 65%)',
    'color-subheader': 'hsl(204, 100%, 80%)',
    'color-drink': 'hsl(48, 100%, 85%)',
    'color-background': 'hsla(210, 100%, 16%, 1.00)',
    'color-cup': 'hsl(210, 100%, 28%)',
    'color-text': 'hsl(0, 0%, 100%)',
    'color-text-shadow': 'hsl(210, 100%, 21%)'
  },
  'Water': {
    'color-header': 'hsl(215, 87%, 12%)',
    'color-shadow': 'hsl(169, 44%, 83%)',
    'color-subheader': 'hsl(169, 58%, 91%)',
    'color-drink': 'hsl(169, 58%, 91%)',
    'color-background': 'hsla(203, 55%, 54%, 1.00)',
    'color-cup': 'hsl(203, 72%, 62%)',
    'color-text': 'hsl(215, 87%, 12%)',
    'color-text-shadow': 'hsl(185, 64%, 89%)'
  },
  'Cola': {
    'color-header': 'hsl(0, 0%, 100%)',
    'color-shadow': 'hsl(0, 0%, 14%)',
    'color-subheader': 'hsl(0, 0%, 100%)',
    'color-drink': 'hsl(0, 0%, 0%)',
    'color-background': 'hsla(0, 0%, 15%, 1.00)',
    'color-cup': 'hsl(358, 100%, 48%)',
    'color-text': 'hsl(0, 0%, 100%)',
    'color-text-shadow': 'hsl(0, 0%, 0%)'
  },
};
if (isDesktop) {
  for (let theme in themes) {
    themes[theme]['color-background'] = themes[theme]['color-background'].replace('1.00', '0.60');
  }
}
if (isAndroid) {
  document.getElementById('top-buttons-container').style.top = '40px';
  document.getElementById('top-buttons-container').style.left = '12px';
  document.querySelector(':root').style.paddingTop = '60px';
}

let animationVisible = false;
let animationType = 'steam';
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

  if (['Elixir', 'Lemonade', 'Water', 'Cola'].includes(theme)) {
    animationType = 'ice';
    document.querySelector('#coffee-container').classList.add('no-after');
    document.getElementById('cup').style.borderRadius = '30%';
    document.getElementById('cup').style.borderTopLeftRadius = '3%';
    document.getElementById('cup').style.borderTopRightRadius = '3%';
  } else {
    animationType = 'steam';
    document.querySelector('#coffee-container').classList.remove('no-after');
    document.getElementById('cup').style.borderRadius = '50%';
    document.getElementById('cup').style.borderTopLeftRadius = '3%';
    document.getElementById('cup').style.borderTopRightRadius = '3%';
  }
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
let totalSeconds = 0;

const saveSessionState = () => {
  localStorage.setItem('session-state', JSON.stringify({
    sessionStatus,
    sessionType,
    sessionCount,
    saveTime: Date.now(),
    timeRemaining: (M * 60 + S),
    totalSeconds,
  }));
};

const updateDisplay = (m = M, s = S) => {
  minutesDisplay.textContent = String(m).padStart(2, '0');
  secondsDisplay.textContent = String(s).padStart(2, '0');
};

const updateSessionCountDisplay = () => {
  sessionCountDisplay.textContent = `Session ${sessionCount}/${totalSessions}`;
};

const updateCupFillLevel = (remainingSeconds) => {
  let fraction = Math.max(0, (remainingSeconds / totalSeconds).toFixed(4));
  if (sessionType === 'break') fraction = 1 - fraction;
  cup.style.setProperty('--fill-level', fraction * 100 + '%');
  if (fraction > 0.7) {
    if (animationVisible) return;
    if (animationType === 'steam') {
      showSteam();
    } else {
      showIce();
    }
  } else {
    if (!animationVisible) return;
    if (animationType === 'steam') {
      hideSteam();
    } else {
      hideIce();
    }
  }
};

const showSteam = () => {
  setTimeout(() => {
    const steamElements = document.querySelectorAll('.steam');
    steamElements.forEach(el => {
      el.style.display = 'block';
    });
    animationVisible = true;
  }, 200);
}

const hideSteam = () => {
  const steamElements = document.querySelectorAll('.steam');
  steamElements.forEach(el => {
    el.style.display = 'none';
  });
  animationVisible = false;
}

function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const showIce = () => {
  const iceCubes = document.querySelectorAll('.ice-cube');
  iceCubes.forEach((cube, index) => {
    cube.style.display = 'block';
    cube.style.transition = 'none';
    cube.style.transform = 'none';
    cube.style.opacity = '1';
    cube.offsetHeight;

    cube.style.left = `${cube.clientWidth / 3 + index * cube.clientWidth * 1.3}px`;
    setTimeout(() => {
      cube.style.transition = `top 2s ease ${index * 0.25}s, transform 2s ease ${index * 0.25}s`;
      const randomNumber = getRandomNumber(80, 100);
      cube.style.top = `${randomNumber}px`;
      
      const randomNumber2 = getRandomNumber(270, 380);
      cube.style.transform = `rotate(${randomNumber2}deg)`;
    }, 10);

    setTimeout(() => {
      cube.style.transition = `top 2s ease`;
      const randomNumber = getRandomNumber(27, 35);
      cube.style.top = `${randomNumber}px`;
    }, (index * 200) + 1000);
  });
  animationVisible = true;
}

const hideIce = () => {
  const steamElements = document.querySelectorAll('.ice-cube');
  steamElements.forEach(el => {
    el.style.display = 'none';
  });
  animationVisible = false;
}

let totalSessionCount = parseInt(localStorage.getItem('total-session-count') || '0');
const startTimer = () => {
  if (sessionTimer) {
    clearInterval(sessionTimer);
  }
  const startTime = Date.now();
  console.log(`Timer started for ${M}m ${S}s at ${new Date(startTime).toLocaleTimeString()}`);
  const startM = M;
  const startS = S;
  const remainingDrainTime = (startM * 60 + startS); // in s
  updateDisplay();
  updateCupFillLevel(remainingDrainTime);
  sessionTimer = setInterval(() => {
    const elapsed = Date.now() - startTime;
    updateCupFillLevel(remainingDrainTime - (elapsed / 1000).toFixed(4))
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
      updateCupFillLevel(0);
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
  totalSeconds = state.totalSeconds;

  if (sessionStatus === 'stopped') return;

  let remainingMs;
  if (sessionStatus === 'paused') {
    remainingMs = state.timeRemaining * 1000;
  } else {
    const elapsedMs = Date.now() - state.saveTime;
    remainingMs = state.timeRemaining * 1000 - elapsedMs;
  }

  sessionCountDisplay.textContent = `Session ${sessionCount}/${totalSessions}`;
  startButton.textContent = sessionStatus === 'running' ? 'Pause' : 'Start';
  sessionDisplay.textContent = sessionType === 'focus' ? 'Focus Time!' : 'Refill your cup';
  if (sessionStatus === 'completed' || sessionStatus === 'running' && remainingMs <= 0) {
    sessionStatus = 'completed';
    startButton.textContent = 'Next';
    sessionDisplay.textContent = (sessionType === 'focus' ? 'Focus' : 'Break') + ' Session Completed!';
  }
  M = Math.max(0, Math.floor(remainingMs / (1000 * 60)));
  S = Math.max(0, Math.floor(remainingMs / 1000) % 60);
  updateDisplay();
  updateCupFillLevel(Math.max(0, remainingMs / 1000));

  if (remainingMs > 0 && sessionStatus === 'running') {
    startTimer();
  }
}
restoreSessionState()

const startFocusSession = () => {
  console.log('Focus Session Started');
  M = focusTime - 1;
  S = 59;
  totalSeconds = M * 60 + S;
  sessionType = 'focus';
  sessionStatus = 'running';
  sessionDisplay.textContent = 'Focus Time!';
  saveSessionState();
  startTimer();
}

const startBreakSession = () => {
  console.log('Break Session Started');
  M = breakTime - 1;
  S = 59;
  totalSeconds = M * 60 + S;
  sessionType = 'break';
  sessionStatus = 'running';
  sessionDisplay.textContent = 'Refill your cup';
  saveSessionState();
  startTimer();
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
  startTimer();
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
  updateCupFillLevel(0);
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

