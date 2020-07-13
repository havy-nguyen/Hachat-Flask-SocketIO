const username = localStorage.getItem('username');
  if (username == null){
    window.location = "/";
  }

// When user click Create Channel, ask for channel name.
const newChannel = document.querySelector('#newChannel');
newChannel.addEventListener('click', createChannel, false)

function createChannel(event) {
  // Remove button.
  let list = document.querySelector('#channelDiv');
  list.removeChild(list.childNodes[1]);

  // Unhide form.
  document.querySelector('#channelForm').removeAttribute("style"); 
}


