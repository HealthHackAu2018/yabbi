from flask import Blueprint, render_template, request, jsonify
from yabbi.blueprints.action.logic import Logic

page = Blueprint('page', __name__, template_folder='templates')
logicReader = Logic()

@page.route('/get_info', methods=['POST'])
def get_info():
    action = request.get_json()
    data = logicReader.read_in_data()
    return jsonify(data)

@page.route('/')
def home():
    return render_template('page/home.html')
