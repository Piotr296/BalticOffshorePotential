# main.py

from flask import Blueprint, render_template
from flask_login import login_required, current_user

main = Blueprint('main', __name__)

@main.route('/')
def index():
    return render_template('index.html')

@main.route('/bop')
@login_required
def bop():
    return render_template('bop.html', name=current_user.name)

@main.route('/lcoe')
@login_required
def lcoe():
    return render_template('lcoe.html', name=current_user.name)

@main.route('/legislation')
@login_required
def legislation():
    return render_template('legislation.html', name=current_user.name)

@main.route('/statistics')
@login_required
def statistics():
    return render_template('statistics.html', name=current_user.name)
