from flask import Flask, render_template, request, redirect, Response, jsonify
import random, json

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html")

@app.route('/receiver', methods = ['POST'])
def worker():
    print("Sending POST request")
    data = request.get_json(force=True)
    print("Our Weights", data)
    return jsonify(data)

if __name__ == "__main__":
    app.run(debug=True)
