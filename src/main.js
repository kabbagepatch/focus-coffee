const themes = {
  'Fairy': {
    'primary-color': 'hsl(336, 89%, 93%)',
    'primary-color-shadow': 'hsl(336, 47%, 62%)',
    'secondary-color': 'hsl(336, 100%, 70%)',
    'tertiary-color': 'hsl(58, 55%, 86%)',
    'background-color': 'hsla(307, 47%, 18%, 1.00)',
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
  'Forest': {
    'primary-color': 'hsl(60, 63%, 89%)',
    'primary-color-shadow': 'hsl(60, 63%, 69%)',
    'secondary-color': 'hsl(77, 14%, 45%)',
    'tertiary-color': 'hsl(31, 43%, 53%)',
    'background-color': 'hsl(227, 8%, 22%)',
    'background-color-dark': 'hsl(227, 8%, 18%)',
    'text-color': 'hsl(0, 0%, 100%)',
    'text-outline': 'hsl(26, 62%, 18%)'
  }
};

export const setTheme = (theme) => {
  if (!Object.keys(themes).includes(theme)) return;
  const vars = themes[theme];
  const root = document.documentElement;

  Object.entries(vars).forEach(([key, value]) => {
    root.style.setProperty(`--${key}`, value);
  });
}

const DEFAULT_SESSION_COUNT = 4;
const DEFAULT_FOCUS_TIME = 45; // minutes
const DEFAULT_BREAK_TIME = 15; // minutes

const updateDisplay = (m = M, s = S) => {
  document.getElementById('minutes').textContent = String(m).padStart(2, '0');
  document.getElementById('seconds').textContent = String(s).padStart(2, '0');
};

let sessionTimer;
let sessionStatus = 'stopped';
let sessionType = 'focus';
let sessionCount = 0;
let totalSessions = DEFAULT_SESSION_COUNT;

let M = 0;
let S = 0;

const cup = document.getElementById('cup');

const startTimer = () => {
  if (sessionTimer) {
    clearInterval(sessionTimer);
  }
  const startTime = Date.now();
  console.log(`Timer started for ${M}m ${S}s at ${new Date(startTime).toLocaleTimeString()}`);
  const startM = M;
  const startS = S;
  const totalDrainTime = (startM * 60 + startS) * 1000; // in ms
  updateDisplay();
  cup.style.setProperty('--fill-level', '100%');
  let percent = 100;
  sessionTimer = setInterval(() => {
    const elapsed = Date.now() - startTime;
    percent = Math.max(0, 1 - (elapsed / totalDrainTime).toFixed(4));
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
      cup.style.setProperty('--fill-level', '0%');
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

const reset = () => {
  resetTimer();
  sessionCount = 0;
  sessionStatus = 'stopped';
  sessionType = 'focus';
  document.getElementById('session-count').textContent = `Session ${sessionCount}/${totalSessions}`;
  document.getElementById('session-type').textContent = 'Focus Time!';
  document.getElementById('start-stop').textContent = 'Start';
  cup.style.setProperty('--fill-level', '0%');
}

const startFocusSession = () => {
  console.log('Focus Session Started');
  M = DEFAULT_FOCUS_TIME - 1;
  S = 59;
  startTimer();
  sessionType = 'focus';
  sessionStatus = 'running';
  document.getElementById('session-type').textContent = 'Focus Time!';
}

const startBreakSession = () => {
  console.log('Break Session Started');
  M = DEFAULT_BREAK_TIME - 1;
  S = 59;
  startTimer();
  sessionType = 'break';
  sessionStatus = 'running';
  document.getElementById('session-type').textContent = 'Break Time! Go refill your cup.';
};

document.getElementById('start-stop').addEventListener('click', () => {
  if (sessionStatus === 'running') {
    // Pause the session
    pauseTimer();
    document.getElementById('start-stop').textContent = 'Start';
  } else if (sessionStatus === 'paused') {
    // Resume the session
    sessionStatus = 'running';
    document.getElementById('start-stop').textContent = 'Pause';
    startTimer();
  } else if (sessionStatus === 'stopped') {
    // Start a new session
    sessionCount = 1;
    document.getElementById('session-count').textContent = `Session ${sessionCount}/${totalSessions}`;
    startFocusSession();
    sessionStatus = 'running';
    document.getElementById('start-stop').textContent = 'Pause';
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
      document.getElementById('session-count').textContent = `Session ${sessionCount}/${totalSessions}`;
    }
  }
});

document.getElementById('reset').addEventListener('click', () => {
  reset();
});
