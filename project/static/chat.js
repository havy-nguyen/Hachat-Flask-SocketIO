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
const messageContainer = document.querySelector(".message-box-top");
const defaultChannels = ["lounge", "hobbies", "travel", "cooking", "sports", "news", "education"];

// ------------------------------- FUNCTIONS ---------------------------------------

// To redirect user to clicked on channel
function redirectUser(name) {
  let chatHeader = initialChannel;
  chatHeader.removeChild(chatHeader.lastChild);
  initialChannel.insertAdjacentHTML("beforeend", `${name}`);
}

// To hightlight the chosen channel 
function highlighter(name) {
  currentChannelList.forEach((li) => {
    li.setAttribute("style", "background-color: rgb(24, 65, 63); border: none;");
  });
  document.querySelector(`.chosenChannel-${name.trim().split(" ").join("-").toLowerCase()}`).setAttribute("style", "border: 3px solid rgb(233, 54, 87); background-color: rgb(14, 49, 47);");
}

// To create new channel after users submit a name
function createChannel() {
  // Remove button 
  createChannelButton.setAttribute("style", "display: none;");
  channelCreatedNotif.setAttribute("style", "display: none;");
  channelCreatedNotif.innerHTML = "";
  // Show form.
  channelNameInput.removeAttribute("style"); 
  newChannelValue.focus();
}

// To make button receive keycode 13
function makeSend(button) {
  return (event) => {
    event.preventDefault();
    if (event.keyCode === 13) {
      button.click();
    }
  }
}

// Scroll chat window to newest.
function scrollDown () {
  let container = messageContainer;
  container.scrollTop = container.scrollHeight;
}

// -------------------------------------------------------------------------------

// Redirect to index if username is not found. 
if (username == null){
  window.location = "/";
}

// Display user name on top of side-bar
document.querySelector(".main-user").insertAdjacentHTML("beforeend",`${username}`)

// Redirect user to the last channel they're in
if (localStorage.getItem('chosenChannel')) {
  let li = localStorage.getItem('chosenChannel');
  window.onload = function() {
    document.querySelector(`.chosenChannel-${li.trim().split(" ").join("-").toLowerCase()}`).click();
  }
}

//------------------CREATE CHANNEL-------------------------

createChannelButton.addEventListener('click', createChannel, false);

// Store new channels
const channelStorage = localStorage.getItem('userChannel');
const userChannel = channelStorage != null ? JSON.parse(channelStorage) : [];

// Highlight newly created channel (first top)
document.querySelector(".channel").setAttribute("style", "border: 3px solid rgb(233, 54, 87); background-color: rgb(14, 49, 47);");

//------------Set "RETURN" key to Submit------------------

typedInMsg.addEventListener("keyup", makeSend(paperPlaneButton));
newChannelValue.addEventListener("keyup", makeSend(goToChannelButton));

//------------------SIGN OUT--------------------------------

logOffButton.onclick = () => {
  localStorage.clear();
  // Go to index
  window.location = "/chat";
}

//---------------SOCKETIO - GET DATA----------------------

var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

// On CONNECT 
socket.on("connect", () => {
  paperPlaneButton.onclick = () => {
    let message = typedInMsg.value;
    socket.emit("message", {"message": message, "username": username, "channel": initialChannel.innerText});
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

// JOIN or LEAVE channel

currentChannelList.forEach((node) => {
  node.onclick = (e) => {
    document.querySelector("#online-user-box").removeAttribute("style", "display:none");
  
    let oldChannel = initialChannel.innerText;
    localStorage.setItem('chosenChannel', e.target.innerText); // Save chosen channel to local storage

    // Clear list
    if (oldChannel != e.target.innerText){
      document.querySelectorAll(".online-user-list").forEach((li) => {li.innerText = ""});
    } else {
      return;
    }

    if (e.target.innerText !== "" && initialChannel.innerText != e.target.innerText) {
      messageContainer.innerText = ""; // Clear box
      redirectUser(e.target.innerText); // Redirect to chosen channel
      highlighter(e.target.innerText); // Highlight chosen channel
    } else {
      return;
    }
    
    socket.emit("joinLeave", {"channel": e.target.innerText, "oldChannel": oldChannel, "username": username});
  }
});

//---------------------------EMIT DATA----------------------

// Emit MESSAGES 

socket.on("show message", data => {

  if (data.message.length < 1 || initialChannel.innerText != data.channel) { 
    return;
    } else {
        if (username == data.username) {
          messageContainer.insertAdjacentHTML("beforeend",
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
            messageContainer.insertAdjacentHTML("beforeend",
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
        scrollDown();
    }
  });


// Emit CHANNELS 

socket.on("create channel", data => {

  // Channel created notification
  channelNameInput.setAttribute("style", "display: none");
  createChannelButton.removeAttribute("style");
  channelCreatedNotif.removeAttribute("style");

  // Redirect user to the new channel
  setTimeout(function(){
    window.location = "/chat";
    redirectUser(data.newChannelName);
  }, 2000);
  
  // Reset textarea value.
  newChannelValue.value = "";
});


// Emit JOIN || LEAVE 

socket.on("join or leave", data => {
  
  // Load previous messages
  if (username == data.username){
    let msgList = data.messageList;
    msgList.reverse().forEach((li) => {
      if (li[0] == data.channel.trim()){
        if (li[1] != data.username) {
          messageContainer.insertAdjacentHTML("afterbegin", `<div id="bubble" class="container text-wrap">
          <div class="row">
            <div class="text-wrap message-bubble" style="background-color: #f5e6e7; border: 1px solid #018a2a;">
              <h6 class="bubble-author" style="color: #018a2a">${li[1]}</h6>
              <span class="bubble-content">${li[2]}</span>
              &nbsp;<span class="bubble-timestamp float-right navbar-fixed-bottom pt-1">${li[3]}</span>
            </div>
          </div>
        </div>`);
        } else {
          messageContainer.insertAdjacentHTML("afterbegin",
          `<div id="bubble" class="container text-wrap">
          <div class="row ml-1">
            <div class="text-wrap message-bubble ml-auto">
              <h6 class="bubble-author">${li[1]}</h6>
              <span class="bubble-content">${li[2]}</span>
              &nbsp;<span class="bubble-timestamp float-right navbar-fixed-bottom pt-1">${li[3]}</span>
            </div>
          </div>
        </div>`);
        }
      } else {
        return;
      }
    });
  } else {
      //  Display join || leave notifications
    if (initialChannel.innerText != data.channel && initialChannel.innerText != data.oldChannel) {
      return;
    } else if (initialChannel.innerText == data.oldChannel) {
      messageContainer.insertAdjacentHTML("beforeend", `<p class="join-leave">${data.leaveNotif}</p>`);
      setTimeout(function(){
        location.reload();
       }, 5000);
    } else {
      messageContainer.insertAdjacentHTML("beforeend", `<p class="join-leave">${data.joinNotif}</p>`);
    }
  };
  
  // Load online users who are in the channel
  let userList = data.users;

  for (person in userList) {
    if (userList[person] == data.channel && !document.querySelector(`.${person}`)) {
      document.querySelector(".online-user-list").insertAdjacentHTML("beforeend", 
       `<li class="${person} online-user"><i class="fa fa-lg fa-user-o" aria-hidden="true"><i class="fa fa-circle" style="font-size: 10px; color: green" aria-hidden="true"></i></i>&nbsp;${person}</li>`);
      }
    }
  
  scrollDown();
});

