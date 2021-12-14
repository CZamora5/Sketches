const $switch = document.querySelector('.switch'),
  $toggler = document.querySelector('.toggler'),
  $cards = document.querySelectorAll('.card');

$switch.addEventListener('click', () => {
  $toggler.classList.toggle('switch-active');
});

$cards.forEach($card => {
  $card.addEventListener('click', () => {
    const $cardContent = $card.querySelector('.card-content');
    if ($cardContent === undefined) return;

    $cardContent.classList.toggle('none');
  });
});
