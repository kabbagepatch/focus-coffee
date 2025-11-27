let curTheme = localStorage.getItem('theme') || 'Coffee';
const themes = {
  'Elixir': {
    'primary-color': 'hsl(336, 89%, 93%)',
    'primary-color-shadow': 'hsl(336, 47%, 62%)',
    'secondary-color': 'hsl(336, 100%, 70%)',
    'tertiary-color': 'hsla(336, 100%, 87%, 1.00)',
    'background-color': 'hsla(307, 47%, 18%, 0.50)',
    'background-color-dark': 'hsl(307, 47%, 15%)',
    'text-color': 'white',
    'text-outline': 'hsl(276, 100%, 25%)'
  },
  'Coffee': {
    'primary-color': 'hsl(39, 59%, 78%)',
    'primary-color-shadow': 'hsl(39, 59%, 58%)',
    'secondary-color': 'hsl(18, 71%, 27%)',
    'tertiary-color': 'hsl(31, 51%, 34%)',
    'background-color': 'hsl(26, 42%, 19%)',
    'background-color-dark': 'hsl(26, 42%, 15%)',
    'text-color': 'hsl(0, 0%, 100%)',
    'text-outline': 'hsl(26, 42%, 19%)',
  },
  'Matcha': {
    'primary-color': 'hsl(60, 63%, 89%)',
    'primary-color-shadow': 'hsl(60, 63%, 69%)',
    'secondary-color': 'hsl(77, 14%, 45%)',
    'tertiary-color': 'hsla(101, 41%, 74%, 1.00)',
    'background-color': 'hsla(227, 8%, 22%, 50%)',
    'background-color-dark': 'hsl(227, 8%, 18%)',
    'text-color': 'hsl(0, 0%, 100%)',
    'text-outline': 'hsl(26, 62%, 18%)'
  },
  'Lemonade': {
    'primary-color': 'hsl(48, 100%, 85%)',
    'primary-color-shadow': 'hsl(48, 100%, 65%)',
    'secondary-color': 'hsl(204, 100%, 50%)',
    'tertiary-color': 'hsl(48, 100%, 85%)',
    'background-color': 'hsl(210, 100%, 16%)',
    'background-color-dark': 'hsl(210, 100%, 12%)',
    'text-color': 'hsla(0, 0%, 100%, 1.00)',
    'text-outline': 'hsla(210, 100%, 21%, 1.00)'
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

const DEFAULT_SESSION_COUNT = 4;
const DEFAULT_FOCUS_TIME = 45; // minutes
const DEFAULT_BREAK_TIME = 1; // minutes

let sessionTimer;
let sessionStatus = 'stopped';
let sessionType = 'focus';
let sessionCount = 0;
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
      sessionStatus = 'completed';
      clearInterval(sessionTimer);
      updateDisplay(0, 0);
      cup.style.setProperty('--fill-level', reverse ? '100%' : '0%');
      startButton.textContent = 'Next Session';
      sessionDisplay.textContent = (sessionType === 'focus' ? 'Focus' : 'Break') + ' Session Completed!';
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
  M = DEFAULT_FOCUS_TIME - 1;
  S = 59;
  startTimer();
  sessionType = 'focus';
  sessionStatus = 'running';
  sessionDisplay.textContent = 'Focus Time!';
}

const startBreakSession = () => {
  console.log('Break Session Started');
  M = DEFAULT_BREAK_TIME - 1;
  S = 59;
  startTimer(true);
  sessionType = 'break';
  sessionStatus = 'running';
  sessionDisplay.textContent = 'Break Time! Go refill your cup.';
};

const skip = () => {
  if (sessionTimer) {
    clearInterval(sessionTimer);
  }
  if (sessionType === 'focus') {
    startBreakSession();
  } else {
    sessionCount += 1;
    if (sessionCount >= totalSessions) {
      alert('All focus sessions completed! Take a longer break.');
      reset();
      return;
    }
    startFocusSession();
    sessionCountDisplay.textContent = `Session ${sessionCount}/${totalSessions}`;
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
    startTimer();
  } else if (sessionStatus === 'stopped') {
    // Start a new session
    sessionCount = 1;
    sessionCountDisplay.textContent = `Session ${sessionCount}/${totalSessions}`;
    startFocusSession();
    sessionStatus = 'running';
    startButton.textContent = 'Pause';
  } else if (sessionStatus === 'completed') {
    // Move to the next session
    if (sessionType === 'focus') {
      startBreakSession();
    } else {
      sessionCount += 1;
      if (sessionCount >= totalSessions) {
        alert('All focus sessions completed! Take a longer break.');
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
