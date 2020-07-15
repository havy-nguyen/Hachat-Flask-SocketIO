// Prevent prompt input if already had a username.
const username = localStorage.getItem('username');

if (username){
  window.location = "/chat";

} else {
  
  const usernameInput = document.querySelector('#usernameInput');
  const submit = document.querySelector('#usernameSubmitBtn');

  // Make "Return" key submit.
  usernameInput.addEventListener("keydown", function(enter) {
    if (enter.keyCode === 13) {
      enter.preventDefault();
      console.log("ooo")
      document.querySelector('#usernameSubmitBtn').click();
    }
  });
  
  // Listen to username submission.
  submit.addEventListener('click', getUsername);

  function getUsername (event) {

    event.preventDefault();
    if (usernameInput.value.length < 1) {
      txt = "Please choose a username!";
      document.querySelector('#txt').innerHTML = txt;
      return;
    };

    // Save username to local storage
    localStorage.setItem('username', usernameInput.value);

    // Go to chat
    window.location = "/chat";
  }
}




