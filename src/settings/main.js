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
    setTheme('Latte');
  } else if (curTheme === 'Latte') {
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
