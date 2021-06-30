# Hachat
##### A simple, non-registration chat app built with Python (Flask SocketIO) and Javascript.

### Features

#### Username - Local storage
- When users visit the app the first time, they are prompted to enter a username. 
- Usernames are limited to 10-character long.
- Each username is stored in the `localStorage` of the user's browser. If a user closes the app and returns later, their username is remembered.

#### Creating a channel 
- There are 7 channels displayed by default on the channel list.
- Users can create a new channel, so long as the name doesn't conflict with the existing others.
- After creating a channel, the user will be redirected to that channel.
- There is a limit of 100 custom channels. When the 101st is created, the 1st will be deleted. 

#### Selecting a channel - Join (leave) notification
- Users are able to select any channel from the list to go to chat.
- When a user enters a channel, a notification of them joining will be broadcasted.
- When a user leaves a channel, a notification will also be broadcasted.

#### Remembering selected channel and previous messages
- After entering a channel, the user can see messages that have been sent to that channel.
- Maximum of 200 newest messages are stored.
- If a user closes the app and returns, they will be redirected to the last channel they're in.

#### List of online users
- All users who are in the same channel will have their names listed on the online-user list.
- When a user joins a channel, their username is added to the list.
- When a user has left a channel, their username will be removed from the list.

#### Messages
- Users are able to send messages to others within the channel they're in.
- Every message will be sent together with the username and the timestamp.

#### Logging off
- When a user logs off permanently, their `localStorage` will be cleared.


### Quick start

#### Install requirement.txt
```
pip3 install -r requirements.txt
```

#### Run the app
```
python3 application.py
```

