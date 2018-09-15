from flask import Blueprint, render_template, request, jsonify
from yabbi.blueprints.action.logic import Logic

page = Blueprint('page', __name__, template_folder='templates')

@page.route('/get_info', methods=['POST'])
def get_info():
    action = request.get_json()
    print('WE ARE TRYING TO GET THE DATA :) ')
    return jsonify(result=action)

@page.route('/')
def home():
    return render_template('page/home.html')
