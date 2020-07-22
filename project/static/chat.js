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
const initialChannel = document.querySelector("#initialChannel");
const currentChannelList = document.querySelectorAll(".channel");
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

//------------Set "RETURN" key to submit------------------

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

//---------------SOCKETIO - GET DATA----------------------

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
      document.querySelector(".textNotifBottom").innerHTML = `Channel has been created!<br> Redirecting to channel...`;
      socket.emit("channel", {"newChannelName": newChannelName});
    }
  }

  //---------------------------EMIT DATA----------------------
  
  // <<<<<<<< Messages >>>>>>>>
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

  // <<<<<<<< Channels >>>>>>>>
  socket.on("create channel", data => {

    // Channel created notification
    channelNameInput.setAttribute("style", "display: none");
    createChannelButton.removeAttribute("style");
    channelCreatedNotif.removeAttribute("style");

    // Redirect user to the new channel
    setTimeout(function(){
      window.location = "/chat";
      redirectUser(`${data.newChannelName}`);
    }, 2000);
    
    // Reset textarea value.
    newChannelValue.value = "";
  });

  // Highlight newly created channel
  document.querySelector(".channel").setAttribute("style", "border: 3px solid rgb(233, 54, 87); background-color: rgb(14, 49, 47);");
    
  // <<<<<<<< Clicking on a channel >>>>>>>>>>>
  currentChannelList.forEach((node) => {
    node.onclick = (e) => {
      redirectUser(`${e.target.innerText}`); // Redirect
      highlighter(`${e.target.innerText}`) // Highlight chosen channel
    }
  });

  function redirectUser(name) {
    let chatHeader = initialChannel;
    chatHeader.removeChild(chatHeader.lastChild);
    initialChannel.insertAdjacentHTML("beforeend", `${name}`);
  }

  // Hightlight the chosen channel 
  function highlighter(name) {
    currentChannelList.forEach((li) => {
      li.setAttribute("style", "background-color: rgb(24, 65, 63); border: none;");
    });
    document.querySelector(`.chosenChannel-${name.trim()}`).setAttribute("style", "border: 3px solid rgb(233, 54, 87); background-color: rgb(14, 49, 47);");
  }

  // function makeListener(button) {
  //   return (event) => {
  //     event.preventDefault();
  //     if (event.keyCode === 13) {
  //       button.click();
  //     }
  //   }
  // }






});

