document.addEventListener("DOMContentLoaded", function () {
  const buttons = document.querySelectorAll(".toggle-button");

  buttons.forEach(button => {
    button.addEventListener("click", () => {
      const subimages = button.previousElementSibling;

      if (subimages.classList.contains("hidden")) {
        subimages.classList.remove("hidden");
        button.textContent = "Show Less";
      } else {
        subimages.classList.add("hidden");
        button.textContent = "Show More";
      }
    });
  });
});
