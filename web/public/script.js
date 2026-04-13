function OnLoad() {
  for (passwordInputGroup of document.getElementsByClassName(
    "passwordInputGroup"
  )) {
    const input = passwordInputGroup.querySelector("input");
    const button = passwordInputGroup.querySelector("button");
    button.addEventListener("click", () => {
      if (input.type == "password") {
        input.type = "text";
        button.innerText = "hide";
      } else {
        input.type = "password";
        button.innerText = "show";
      }
    });
    button.style.display = "block";
  }
}
