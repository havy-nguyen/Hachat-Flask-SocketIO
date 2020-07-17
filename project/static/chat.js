const username = localStorage.getItem('username');
const channelNameInput = document.querySelector('#channelForm');
const newChannelValue = document.querySelector('#newChannelName');
const typedInMsg = document.getElementById("userMessage");
const paperPlaneButton = document.getElementById("sendMessage");
const createChannelButton = document.querySelector('#newChannel');
const logOffButton = document.getElementById("logOffButton");
const goToChannelButton = document.querySelector('.newChannelButton');

// Redirect to index if username is not found. 
if (username == null){
  window.location = "/";
}

//------------------CREATE CHANNEL-------------------------

// When user clicks Create Channel button, ask for channel name.
createChannelButton.addEventListener('click', createChannel, false)

function createChannel() {
  // Remove button.
  let list = document.querySelector('#channelDiv');
  list.removeChild(list.childNodes[1]);
  // Show form.
  channelNameInput.removeAttribute("style"); 
}

// Store new channels
const userChannel = [];

// Add newly created channel to Channels
JSON.parse(localStorage.getItem("userChannel")).forEach(addItem);

function addItem (item) {
document.querySelector("#channelList").insertAdjacentHTML("afterbegin",
        `<ul id="channelList" style="list-style-type:none;" class="list-group p-2">
          <li class="channel">
            <i class="fa fa-2x fa-connectdevelop fa-spin" aria-hidden="true"></i>
            ${item}
          </li>
        </ul>`); }

//------------Set "RETURN" key to send message-------------

typedInMsg.addEventListener("keyup", function(event) {
  event.preventDefault();
  if (event.keyCode === 13) {
    paperPlaneButton.click();
  }
});

//------------------SIGN OUT--------------------------------

logOffButton.onclick = () => {
  localStorage.removeItem('username');
  // Go to index
  window.location = "/chat";
}

//---------------------------SOCKETIO----------------------

document.addEventListener('DOMContentLoaded', () => {
  // Connect to websocket
  var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

  // On CONNECT
  socket.on("connect", () => {
    paperPlaneButton.onclick = () => {
      let message = typedInMsg.value;
      socket.emit("message", {"message": message, "username": username});
    }
  });

  // CHANNEL
  goToChannelButton.onclick = () => {
    let newChannelName = newChannelValue.value;
    userChannel.unshift(newChannelName)
    localStorage.setItem('userChannel', JSON.stringify(userChannel));
    socket.emit("channel", {"newChannelName": newChannelName});
  }

  //---------------------------EMIT DATA----------------------
  
  socket.on("show message", data => {

    if (data.message.length < 1) { 
      return;
      } else {
          if (username == data.username) {
            document.querySelector(".message-box-top").insertAdjacentHTML("beforeend",
              `<div id="bubble" class="container text-wrap">
                <div class="row ml-1">
                  <div class="text-wrap message-bubble ml-auto">
                    <h6 class="bubble-author">${data.username}</h6>
                    <span class="bubble-content">${data.message}</span>
                    &nbsp;<span class="bubble-timestamp float-right navbar-fixed-bottom pt-1">${data.timestamp}</span>
                  </div>
                </div>
              </div>`);
            } else {
              document.querySelector(".message-box-top").insertAdjacentHTML("beforeend",
              `<div id="bubble" class="container text-wrap">
                <div class="row">
                  <div class="text-wrap message-bubble" style="background-color: #f5e6e7; border: 1px solid #018a2a;">
                    <h6 class="bubble-author" style="color: #018a2a">${data.username}</h6>
                    <span class="bubble-content">${data.message}</span>
                    &nbsp;<span class="bubble-timestamp float-right navbar-fixed-bottom pt-1">${data.timestamp}</span>
                  </div>
                </div>
              </div>`);
            }

          // Reset textarea value.
          typedInMsg.value = "";

          // Scroll to newest.
          scrollDownChatWindow();
      }
    });

  socket.on("create channel", data => {
   
    if (data.newChannelName.length < 1) { 
      channelNameInput.removeAttribute("style");
      } else {
        document.querySelector("#channelList").insertAdjacentHTML("afterbegin",
        `<ul id="channelList" style="list-style-type:none;" class="list-group p-2">
        <li class="channel">
          <i class="fa fa-2x fa-connectdevelop fa-spin" aria-hidden="true"></i>
            ${data.newChannelName}
        </li>
        </ul>`
        );

        // Reset textarea value.
        newChannelValue.value = "";
        }
      });
    });
