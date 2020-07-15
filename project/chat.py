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
    return render_template("chat.html", defaultChannels=defaultChannels)


@socketio.on("message")
def message(data):
    message = data["message"]
    username = data["username"]
    channel = defaultChannels[0]
    timestamp = time.strftime('%b-%d %I:%M%p', time.localtime())
    emit("show message", {"message": message, "username": username, 
                        "timestamp": timestamp, "channel": channel}, broadcast=True)

