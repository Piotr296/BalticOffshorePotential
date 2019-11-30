#!flask/bin/python

from flask import Flask, render_template, request, redirect, Response, jsonify
import random, json

app = Flask(__name__)

@app.route('/')
def output():
	# serve index template
	return render_template('index.html', name="joe")

@app.route('/receiver', methods = ['GET','POST'])
def worker():
    print("Sending")
	# read json + reply
    data = request.get_json(force=True)
    print(data)
    return jsonify(data)

if __name__ == '__main__':
	# run!
	app.run()
