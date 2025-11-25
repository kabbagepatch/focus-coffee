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
const DEFAULT_FOCUS_TIME = 10; // minutes
const DEFAULT_BREAK_TIME = 1; // minutes

const updateDisplay = (h, m, s) => {
  document.getElementById('hours').textContent = String(h).padStart(2, '0');
  document.getElementById('minutes').textContent = String(m).padStart(2, '0');
  document.getElementById('seconds').textContent = String(s).padStart(2, '0');
};

let sessionTimer;
let sessionStatus = 'stopped';
let sessionType = 'focus';
let sessionCount = 0;
let totalSessions = 4;

let h = 0;
let m = 0;
let s = 0;

const startTimer = () => {
  if (sessionTimer) {
    clearInterval(sessionTimer);
  }
  const startTime = Date.now();
  console.log(`Timer started for ${h}h ${m}m ${s}s at ${new Date(startTime).toLocaleTimeString()}`);
  const startH = h;
  const startM = m;
  const startS = s;
  updateDisplay(h, m, s);
  sessionTimer = setInterval(() => {
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    const hoursElapsed = Math.floor(elapsed / 3600);
    const minutesElapsed = Math.floor((elapsed % 3600) / 60);
    const secondsElapsed = elapsed % 60;
    h = startH - hoursElapsed;
    m = startM - minutesElapsed;
    s = startS - secondsElapsed;
    if (s < 0) {
      s += 60;
      m -= 1;
    }
    if (m < 0) {
      m += 60;
      h -= 1;
    }
    if (h < 0) {
      sessionStatus = 'completed';
      clearInterval(sessionTimer);
      updateDisplay(0, 0, 0);
      return;
    }

    updateDisplay(h, m, s);
  }, 1000);
};

const resetTimer = () => {
  sessionStatus = 'stopped';
  sessionType = 'focus';
  if (sessionTimer) {
    clearInterval(sessionTimer);
  }
  updateDisplay(0, 0, 0);
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
  document.getElementById('sessionCount').textContent = `Session ${sessionCount}/${totalSessions}`;
  document.getElementById('sessionType').textContent = 'Focus Time!';
  document.getElementById('start-stop').textContent = 'Start';
}

const startFocusSession = () => {
  console.log('Focus Session Started');
  h = 0;
  m = DEFAULT_FOCUS_TIME - 1;
  s = 59;
  startTimer();
  sessionType = 'focus';
  sessionStatus = 'running';
  document.getElementById('sessionType').textContent = 'Focus Time!';
}

const startBreakSession = () => {
  console.log('Break Session Started');
  h = 0;
  m = DEFAULT_BREAK_TIME - 1;
  s = 59;
  startTimer();
  sessionType = 'break';
  sessionStatus = 'running';
  document.getElementById('sessionType').textContent = 'Break Time!';
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
    document.getElementById('sessionCount').textContent = `Session ${sessionCount}/${totalSessions}`;
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
      document.getElementById('sessionCount').textContent = `Session ${sessionCount}/${totalSessions}`;
    }
  }
});

document.getElementById('reset').addEventListener('click', () => {
  reset();
});
