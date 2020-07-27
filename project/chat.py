import time
from project import app, socketio
from flask import render_template, url_for
from flask_socketio import SocketIO, emit

defaultChannels = ["lounge", "hobbies", "travel", "cooking", "sports", "news", "education"]
users = []

@app.route("/")
def index():
    return render_template("index.html")


@app.errorhandler(404)
def page_not_found(e):
    return render_template('404.html'), 404
    

@app.route("/chat")
def chat():
    initialChannel = defaultChannels[0]
    return render_template("chat.html", defaultChannels=defaultChannels, initialChannel=initialChannel)


@socketio.on("message")
def message(data):
    message = data["message"]
    username = data["username"]
    timestamp = time.strftime('%b-%d %I:%M%p', time.localtime())
    channel = data["channel"]
    emit("show message", {"message": message, "username": username, 
                        "timestamp": timestamp, "channel": channel}, broadcast=True)


@socketio.on("channel")
def channel(data):
    newChannelName = data["newChannelName"]
    if len(defaultChannels) < 100:
        defaultChannels.insert(0, newChannelName)
    else:
        defaultChannels.insert(0, newChannelName)
        defaultChannels.remove(defaultChannels[-8])
    emit("create channel", {"newChannelName": newChannelName, "defaultChannels": defaultChannels}, broadcast=True) 


@socketio.on("joinLeave")
def joinLeave(data):
    username = data["username"]
    if username not in users:
        users.append(username)
    channel = data["channel"]
    oldChannel = data["oldChannel"]
    emit("join or leave", {"joinNotif": username + " has joined " + channel + " channel.",
                        "leaveNotif": username + " has left " + oldChannel + " channel.", 
                    "channel": channel, "username": username, "oldChannel": oldChannel, "users": users}, broadcast=True)