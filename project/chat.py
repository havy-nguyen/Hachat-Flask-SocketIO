from project import app
from flask import render_template, url_for

defaultChannels = ["Hobbies", "Travel", "Cooking", "Sports", "News", "Education"]

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/chat")
def chat():
    return render_template("chat.html", defaultChannels=defaultChannels)