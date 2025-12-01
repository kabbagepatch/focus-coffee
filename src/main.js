let curTheme = localStorage.getItem('theme') || 'Coffee';
const themes = {
  'Elixir': {
    'primary-color': 'hsl(336, 89%, 93%)',
    'primary-color-shadow': 'hsl(336, 47%, 62%)',
    'secondary-color': 'hsl(336, 100%, 70%)',
    'tertiary-color': 'hsl(336, 100%, 87%)',
    'background-color': 'hsla(307, 47%, 18%, 60%)',
    'background-color-light': 'hsl(307, 47%, 25%)',
    'text-color': 'white',
    'text-outline': 'hsl(276, 100%, 25%)'
  },
  'Coffee': {
    'primary-color': 'hsl(39, 59%, 78%)',
    'primary-color-shadow': 'hsl(39, 59%, 58%)',
    'secondary-color': 'hsl(18, 71%, 27%)',
    'tertiary-color': 'hsl(31, 51%, 54%)',
    'background-color': 'hsla(26, 42%, 14%, 60%)',
    'background-color-light': 'hsl(26, 42%, 25%)',
    'text-color': 'hsl(0, 0%, 100%)',
    'text-outline': 'hsl(26, 42%, 19%)',
  },
  'Matcha': {
    'primary-color': 'hsl(60, 63%, 89%)',
    'primary-color-shadow': 'hsl(60, 63%, 69%)',
    'secondary-color': 'hsl(77, 14%, 45%)',
    'tertiary-color': 'hsl(101, 41%, 74%)',
    'background-color': 'hsla(227, 8%, 22%, 60%)',
    'background-color-light': 'hsl(227, 8%, 38%)',
    'text-color': 'hsl(0, 0%, 100%)',
    'text-outline': 'hsl(26, 62%, 18%)'
  },
  'Lemonade': {
    'primary-color': 'hsl(48, 100%, 85%)',
    'primary-color-shadow': 'hsl(48, 100%, 65%)',
    'secondary-color': 'hsl(204, 100%, 50%)',
    'tertiary-color': 'hsl(48, 100%, 85%)',
    'background-color': 'hsla(210, 100%, 16%, 60%)',
    'background-color-light': 'hsl(210, 100%, 22%)',
    'text-color': 'hsl(0, 0%, 100%)',
    'text-outline': 'hsl(210, 100%, 21%)'
  }
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

  document.getElementById("theme-icon").src = `assets/${theme.toLowerCase()}-brush.png`;

  switch (theme) {
    case 'Elixir':
      document.getElementById('title').textContent = 'Focus Elixir';
      break;
    case 'Coffee':
      document.getElementById('title').textContent = 'Focus Coffee';
      break;
    case 'Matcha':
      document.getElementById('title').textContent = 'Focus Matcha';
      break;
    case 'Lemonade':
      document.getElementById('title').textContent = 'Focus Lemonade';
      break;
  }
}

setTheme(curTheme);
document.getElementById('theme-button').addEventListener('click', () => {
  if (curTheme === 'Elixir') {
    setTheme('Coffee');
  } else if (curTheme === 'Coffee') {
    setTheme('Matcha');
  } else if (curTheme === 'Matcha') {
    setTheme('Lemonade');
  } else {
    setTheme('Elixir');
  }
});

if (!window.__TAURI__) {
  document.getElementById('download-button').hidden = false;
}

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

const cup = document.getElementById('cup');
const startButton = document.getElementById('start-stop');
const sessionCountDisplay = document.getElementById('session-count');
const sessionDisplay = document.getElementById('session-type');
const minutesDisplay = document.getElementById('minutes');
const secondsDisplay = document.getElementById('seconds');

const updateDisplay = (m = M, s = S) => {
  minutesDisplay.textContent = String(m).padStart(2, '0');
  secondsDisplay.textContent = String(s).padStart(2, '0');
};

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
      startButton.textContent = (sessionType === 'focus' ? 'Start Break' : 'Next Session');
      sessionDisplay.textContent = (sessionType === 'focus' ? 'Focus' : 'Break') + ' Session Completed!';
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

const resetTimer = () => {
  sessionStatus = 'stopped';
  sessionType = 'focus';
  if (sessionTimer) {
    clearInterval(sessionTimer);
  }
  updateDisplay(0, 0);
};

const pauseTimer = () => {
  if (sessionTimer) {
    clearInterval(sessionTimer);
  }
  sessionStatus = 'paused';
};

const startFocusSession = () => {
  console.log('Focus Session Started');
  M = focusTime - 1;
  S = 59;
  startTimer();
  sessionType = 'focus';
  sessionStatus = 'running';
  sessionDisplay.textContent = 'Focus Time!';
}

const startBreakSession = () => {
  console.log('Break Session Started');
  M = breakTime - 1;
  S = 59;
  startTimer(true);
  sessionType = 'break';
  sessionStatus = 'running';
  sessionDisplay.textContent = 'Break Time! Refill your cup';
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

const reset = () => {
  resetTimer();
  sessionCount = 0;
  sessionStatus = 'stopped';
  sessionType = 'focus';
  sessionCountDisplay.textContent = `Session ${sessionCount}/${totalSessions}`;
  sessionDisplay.textContent = 'Focus Time!';
  startButton.textContent = 'Start';
  cup.style.setProperty('--fill-level', '0%');
};

startButton.addEventListener('click', () => {
  if (sessionStatus === 'running') {
    // Pause the session
    pauseTimer();
    startButton.textContent = 'Start';
  } else if (sessionStatus === 'paused') {
    // Resume the session
    sessionStatus = 'running';
    startButton.textContent = 'Pause';
    startTimer(sessionType === 'break');
  } else if (sessionStatus === 'stopped') {
    // Start a new session
    sessionCount = 1;
    sessionCountDisplay.textContent = `Session ${sessionCount}/${totalSessions}`;
    startFocusSession();
    sessionStatus = 'running';
    startButton.textContent = 'Pause';
  } else if (sessionStatus === 'completed') {
    sessionStatus = 'running';
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

const option25 = document.getElementById('25-5');
option25.addEventListener('click', () => {
  setPomo(25, 5);
  option25.className = "session-option session-option-selected";
  option50.className = "session-option";
  option75.className = "session-option";
});

const option50 = document.getElementById('50-10');
option50.addEventListener('click', () => {
  setPomo(50, 10);
  option25.className = "session-option";
  option50.className = "session-option session-option-selected";
  option75.className = "session-option";
});

const option75 = document.getElementById('75-15');
option75.addEventListener('click', () => {
  setPomo(75, 15);
  option25.className = "session-option";
  option50.className = "session-option";
  option75.className = "session-option session-option-selected";
});
