const username = localStorage.getItem('username');
const channelNameInput = document.querySelector('#channelForm');
const newChannelValue = document.querySelector('#newChannelName');
const typedInMsg = document.getElementById("userMessage");
const paperPlaneButton = document.getElementById("sendMessage");
const createChannelButton = document.querySelector('#newChannel');
const logOffButton = document.getElementById("logOffButton");
const goToChannelButton = document.querySelector('.newChannelButton');
const channelNameAlert = document.querySelector(".channelNamePrompt");
const channelCreatedNotif = document.querySelector(".textNotif");
const defaultChannels = ["hobbies", "travel", "cooking", "sports", "news", "education"];


// Redirect to index if username is not found. 
if (username == null){
  window.location = "/";
}

//------------------CREATE CHANNEL-------------------------

// When user clicks Create Channel button, ask for channel name.
createChannelButton.addEventListener('click', createChannel, false);

function createChannel() {
  // Remove button && hide text notif
  createChannelButton.setAttribute("style", "display: none;");
  channelCreatedNotif.setAttribute("style", "display: none;");
  channelCreatedNotif.innerHTML = "";
  // Show form.
  channelNameInput.removeAttribute("style"); 
  newChannelValue.focus();
}

// Store new channels
const channelStorage = localStorage.getItem('userChannel');
const userChannel = channelStorage != null ? JSON.parse(channelStorage) : [];

// Add newly created channels to Channels
userChannel.forEach(addItem);

function addItem (item) {
  document.querySelector("#channelList").insertAdjacentHTML("afterbegin",
          `<ul id="channelList" style="list-style-type:none;" class="list-group p-2">
            <li class="channel">
              <i class="fa fa-2x fa-connectdevelop fa-spin" aria-hidden="true"></i>
              ${item}
            </li>
          </ul>`); 
}

//------------Set "RETURN" key to submit-------------

typedInMsg.addEventListener("keyup", makeListener(paperPlaneButton));
newChannelValue.addEventListener("keyup", makeListener(goToChannelButton));

function makeListener(button) {
  return (event) => {
    event.preventDefault();
    if (event.keyCode === 13) {
      button.click();
    }
  }
}

//------------------SIGN OUT--------------------------------

logOffButton.onclick = () => {
  localStorage.removeItem('username');
  localStorage.removeItem('userChannel');
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
    newChannelValue.focus();
    let newChannelName = newChannelValue.value.toLowerCase();

    // To make sure the new name doesnt conflict with existing channels
    if (newChannelName == "") {
      return;
    } else if (defaultChannels.concat(userChannel).includes(newChannelName)) {
      channelNameAlert.innerText = "Channel already exists!"; 
      newChannelValue.value = ""
    } else {
      userChannel.push(newChannelName);
      localStorage.setItem('userChannel', JSON.stringify(userChannel));
      socket.emit("channel", {"newChannelName": newChannelName});
    }
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
          let container = document.querySelector(".message-box-top");
          container.scrollTop = container.scrollHeight;
      }
    });

  socket.on("create channel", data => {

    // Channel created notification
    channelNameInput.setAttribute("style", "display: none");
    createChannelButton.removeAttribute("style");
    channelCreatedNotif.removeAttribute("style");
    channelCreatedNotif.insertAdjacentHTML("beforeend", `Channel has been created.<br>You are now in channel ${data.newChannelName}!`);

    // Add new channel to side-bar
    document.querySelector("#channelList").insertAdjacentHTML("afterbegin",
    `<ul id="channelList" style="list-style-type:none;" class="list-group p-2">
    <li class="channel">
      <i class="fa fa-2x fa-connectdevelop fa-spin" aria-hidden="true"></i>
        ${data.newChannelName}
    </li>
    </ul>`
    );

    // Redirect user to the new channel
    let chatHeader = document.querySelector("#currentChannel");
    chatHeader.removeChild(chatHeader.lastChild);
    document.querySelector("#currentChannel").insertAdjacentHTML("beforeend", `&nbsp;${data.newChannelName}`);

    // Reset textarea value.
    newChannelValue.value = "";
  });
});
