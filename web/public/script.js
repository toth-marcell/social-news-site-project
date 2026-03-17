function OnLoad() {
  const showPasswordButton = document.getElementById("showPasswordButton");
  const passwordInput = document.getElementById("passwordInput");
  showPasswordButton.addEventListener("click", () => {
    if (passwordInput.type == "password") {
      passwordInput.type = "text";
      showPasswordButton.innerText = "hide";
      passwordInput.focus();
    } else {
      passwordInput.type = "password";
      showPasswordButton.innerText = "show";
      passwordInput.focus();
    }
  });
  showPasswordButton.style.display = "block";
}
