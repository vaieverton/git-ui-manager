import os
import json
from flask import Flask, request, Response
from repository import Repository
from git.exc import GitError
from flask_cors import CORS

repositories_prefix = '~/fake_repos/'

app = Flask(__name__)

CORS(app, support_credentials=True, resources={r"/*": {"origins": "*"}})

repository = Repository('')

@app.route('/get_repository_path', methods=['POST'])
def get_path():
    data = request.get_json()

    repo_name = data['repository']

    path = os.path.join(repositories_prefix, repo_name)

    try:
        repository.createRepo(path)
        branches = repository.Repo.branches

        branches_list = []

        for branch in branches:
            branches_list.append(branch.name)

    except GitError:
        return {
            'message': 'failed'
        }

    return {
        'message': 'created with success',
        'branches': branches_list
    }


@app.route('/git_status', methods=['GET'])
def status():
    status = repository.Repo.git.status()

    return {
        'status': status
    }


@app.route('/make_log', methods=['GET'])
def log():
    branch = request.args.get('branch')

    log_output = repository.Repo.git.log(
        "--pretty=format: %ad | %s %d [%an] *", "--date=short", branch)

    return {
        'message': log_output
    }


app.run(debug=True)
