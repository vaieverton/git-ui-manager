import os
import json
from flask import Flask, request, Response
from git import Repo
from git.exc import GitError
from flask_cors import CORS

repositories_prefix = '~/fake_repos/'


app = Flask(__name__)

CORS(app , support_credentials=True,resources={r"/*": {"origins": "*"}})

main_repo = Repo('')

@app.route('/get_repository_path', methods=['POST'])
def get_path():
    data = request.get_json()

    repo_name = data['repository']

    path = os.path.join(repositories_prefix, repo_name)

    try:
        main_repo = Repo(path)
        branches = main_repo.branches

        branches_list = []

        for branch in branches:
            branches_list.append(branch.name)
    
    except GitError:
        print(GitError)
        return {
            'message': 'failed'
        }

    return {
        'message': 'created with success',
        'branches': branches_list
    }

@app.route('/make_log', methods=['GET'])
def log():
    data = request.get_json()

    branch = request.args.get('branch')
    repository = request.args.get('repository')

    log_output = main_repo.git.branches()
    return {
        'message': log_output
    }

app.run(debug=True)