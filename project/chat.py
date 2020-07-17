import time
from project import app, socketio
from flask import render_template, url_for
from flask_socketio import SocketIO, join_room, leave_room, emit

defaultChannels = ["Hobbies", "Travel", "Cooking", "Sports", "News", "Education"]

@app.route("/")
def index():
    return render_template("index.html")


@app.route("/chat")
def chat():
    initialChannel = defaultChannels[0]
    return render_template("chat.html", defaultChannels=defaultChannels, initialChannel=initialChannel)


@socketio.on("message")
def message(data):
    message = data["message"]
    username = data["username"]
    timestamp = time.strftime('%b-%d %I:%M%p', time.localtime())
    emit("show message", {"message": message, "username": username, 
                        "timestamp": timestamp}, broadcast=True)


@socketio.on("channel")
def channel(data):
    newChannelName = data["newChannelName"]
    emit("create channel", {"newChannelName": newChannelName}, broadcast=True) 

