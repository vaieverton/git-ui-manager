import os
import json
from flask import Flask, request, abort
from repository import Repository
from git.exc import GitError
from flask_cors import CORS

repositories_prefix = '~/fake_repos/'

app = Flask(__name__)

CORS(app, support_credentials=True, resources={r"/*": {"origins": "*"}})

repository = Repository('')


@app.route('/connect_to_repo', methods=['POST'])
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
        abort(404, description="Repository not found")

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


@app.route('/get_diff', methods=['GET'])
def diff():
    # branch = request.args.get('branch')

    files = repository.Repo.index.diff()

    print(files)

    return {
        'message': files
    }


@app.route('/commit', methods=['POST'])
def commit_change():
    message: request.args.get('commit_message')
    author: request.args.get('author')


app.run(debug=True)
