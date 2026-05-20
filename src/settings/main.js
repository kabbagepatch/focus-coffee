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

  document.getElementById("theme-icon").src = `../assets/${theme.toLowerCase()}-brush.png`;
  const title = document.getElementById('title')
  if (title) {
    title.textContent = `Focus ${theme}`;
  }
  const drink = document.getElementById('drink-name')
  if (drink) {
    drink.textContent = theme;
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
  } else if (curTheme === 'Lemonade') {
    setTheme('Water');
  } else if (curTheme === 'Water') {
    setTheme('Cola');
  } else {
    setTheme('Elixir');
  }
});

if (!window.__TAURI__) {
  document.getElementById('download-button').hidden = false;
}

let tabbedAway = false;
document.addEventListener('visibilitychange', function() {
  if (document.visibilityState === 'visible') {
    tabbedAway = false;
    document.title = 'Focus Coffee';
  } else {
    tabbedAway = true;
  }
});

const taskContainer = document.getElementById('tasks-container');
let tasksDisplayed = localStorage.getItem('displayTasks') || 'false';
if (tasksDisplayed === 'true') {
  document.getElementById('task-list-display-value').textContent = 'On';
}
document.getElementById('tasks-button').addEventListener('click', () => {
  tasksDisplayed = tasksDisplayed === 'true' ? 'false' : 'true';
  document.getElementById('task-list-display-value').textContent = tasksDisplayed === 'true' ? 'On' : 'Off';
  localStorage.setItem('displayTasks', tasksDisplayed);
});

let totalSessionCount = localStorage.getItem('total-session-count') || '0';
document.getElementById('total-session-count').textContent = totalSessionCount;
let totalTaskCount = localStorage.getItem('total-task-count') || '0';
document.getElementById('total-task-count').textContent = totalTaskCount;
