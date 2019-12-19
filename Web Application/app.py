import random, json
import psycopg2
from flask import Flask, render_template, request, redirect, Response, jsonify

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/about")
def about():
    return render_template("about.html")

@app.route("/statistics")
def statistics():
    return render_template("statistics.html")

@app.route("/lcoe")
def lcoe():
    return render_template("lcoe.html")

@app.route("/legislation")
def legislation():
    return render_template("legislation.html")

if __name__ == "__main__":
    app.run(debug=True)
