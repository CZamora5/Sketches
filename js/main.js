const $switch = document.querySelector(".switch"),
  $toggler = document.querySelector(".toggler");

$switch.addEventListener("click", () => {
  $toggler.classList.toggle("switch-active");
});