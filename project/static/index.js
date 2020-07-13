const username = localStorage.getItem('username');
if (username){
  window.location = "/chat";

} else {
  
  const usernameInput = document.querySelector('#usernameInput');
  const submit = document.querySelector('#usernameSubmitBtn');

  submit.addEventListener('click', getUsername, false)

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




