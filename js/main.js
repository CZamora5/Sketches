const $switch = document.querySelector('.switch'),
  $toggler = document.querySelector('.toggler'),
  $cards = document.querySelectorAll('.card');

document.addEventListener('DOMContentLoaded', () => {
  if (localStorage.getItem('theme') === null) {
    localStorage.setItem('theme', 'dark');
  }

  setTheme();
});

function setTheme(change = false) {
  let theme = localStorage.getItem('theme');
  if (change) {
    theme = theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', theme);
  }
  if (theme === 'light') {
    document.documentElement.style.setProperty('--clr-contrast', '41 41 41');
    document.documentElement.style.setProperty('--clr-high-contrast', '38 38 38');
    document.documentElement.style.setProperty('--clr-primary', '255 255 255');
    document.documentElement.style.setProperty('--clr-secondary', '221 221 221');
  } else {
    document.documentElement.style.setProperty('--clr-contrast', '221 221 221');
    document.documentElement.style.setProperty('--clr-high-contrast', '255 255 255');
    document.documentElement.style.setProperty('--clr-primary', '38 38 38');
    document.documentElement.style.setProperty('--clr-secondary', '41 41 41');
  }
}

$switch.addEventListener('click', () => {
  $toggler.classList.toggle('switch-active');
  setTheme(true);
});

$cards.forEach($card => {
  $card.addEventListener('click', () => {
    const $cardContent = $card.querySelector('.card-content');
    if ($cardContent === undefined) return;

    $cardContent.classList.toggle('none');
  });
});
