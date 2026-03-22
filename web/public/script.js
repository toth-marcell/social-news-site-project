function OnLoad() {
  const showPasswordButton = document.getElementById("showPasswordButton");
  const passwordInput = document.getElementById("passwordInput");
  showPasswordButton.addEventListener("click", () => {
    if (passwordInput.type == "password") {
      passwordInput.type = "text";
      showPasswordButton.innerText = "hide";
    } else {
      passwordInput.type = "password";
      showPasswordButton.innerText = "show";
    }
  });
  showPasswordButton.style.display = "block";
}
