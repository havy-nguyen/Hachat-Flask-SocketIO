// Get username. Redirect to index if not found. 
const username = localStorage.getItem('username');
if (username == null){
  window.location = "/";
}

//------------------CREATE CHANNEL-------------------------

// When user clicks Create Channel button, ask for channel name.
let newChannel = document.querySelector('#newChannel');
newChannel.addEventListener('click', createChannel, false)

function createChannel(event) {
  // Remove button.
  let list = document.querySelector('#channelDiv');
  list.removeChild(list.childNodes[1]);
  // Show form.
  document.querySelector('#channelForm').removeAttribute("style"); 
}

//------------------SOCKETIO - MESSAGE----------------------

document.addEventListener('DOMContentLoaded', () => {
  // Connect to websocket
  var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

  // Get data
  socket.on("connect", () => {
    let button = document.getElementById("sendMessage");
    button.onclick = () => {
        let message = document.getElementById("userMessage").value;
        socket.emit("message", {"message": message, "username": username});
    }
  });

  // Emit data
  socket.on("show message", data => {
    
    if (data.message.length < 1) { 
      return;
      } else {
          document.querySelector(".message-box-top").insertAdjacentHTML("beforeend",
            `<div id="bubble" class="container text-wrap">
              <div class="row ml-1">
                <div class="text-wrap message-bubble ml-auto">
                  <h6 class="bubble-author">${data.username}</h6>
                  <span class="bubble-content">${data.message}</span>
                  &nbsp;<span class="bubble-timestamp float-right pt-1">${data.timestamp}</span>
                </div>
              </div>
            </div>`);

          // Reset textarea value.
          document.querySelector("#userMessage").value = "";

          // Scroll to newest.
          let container = document.querySelector(".message-box-top");
          container.scrollTop = container.scrollHeight;
        }
    });
  });



