async function OnLoad() {
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

  if (await cookieStore.get("token")) {
    for (postVoteButton of document.getElementsByClassName("postVoteButton")) {
      const button = postVoteButton;
      button.addEventListener("click", async () => {
        const result = await fetch(`/postVote/${button.dataset.id}`, {
          method: "post",
        });
        if (result.ok) {
          const votesSpan = button.querySelector("span");
          if (button.classList.contains("outline")) {
            votesSpan.innerText = parseInt(votesSpan.innerText) - 1;
            button.classList.remove("outline");
          } else {
            votesSpan.innerText = parseInt(votesSpan.innerText) + 1;
            button.classList.add("outline");
          }
        }
      });
      button.type = "button";
    }
  }
}
