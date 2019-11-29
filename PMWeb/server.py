from flask import Flask, jsonify, request, render_template
import jinja2

app = Flask(__name__)

@app.route('/')
def index():
    # look inside `templates` and serve `index.html`
    return render_template('index.html')
