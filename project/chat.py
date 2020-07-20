import time
from project import app, socketio
from flask import render_template, url_for
from flask_socketio import SocketIO, join_room, leave_room, emit

defaultChannels = ["hobbies", "travel", "cooking", "sports", "news", "education"]

@app.route("/")
def index():
    return render_template("index.html")


@app.errorhandler(404)
def page_not_found(e):
    # note that we set the 404 status explicitly
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
    emit("show message", {"message": message, "username": username, 
                        "timestamp": timestamp}, broadcast=True)


@socketio.on("channel")
def channel(data):
    newChannelName = data["newChannelName"].title()
    defaultChannels.insert(0, newChannelName)
    emit("create channel", {"newChannelName": newChannelName, "defaultChannels": defaultChannels}, newChannelName=newChannelName, broadcast=True) 


# @socketio.on("join")
# def join(data):
#     username = data["username"]
#     channel = data["channel"]
#     join_room(channel)
#     emit({"join notification": username + " has joined " + channel + " room."}, channel=channel)