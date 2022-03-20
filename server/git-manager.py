import os
import json
from flask import Flask, request, abort, Response
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

    current_branch = ''

    path = os.path.join(repositories_prefix, repo_name)

    try:
        repository.createRepo(path)
        branches = repository.Repo.branches

        branches_list = []

        for branch in branches:
            branches_list.append(branch.name)

    except GitError:
        abort(404, description="Repository not found")

    try:
        repository.Repo.git.checkout('master')
        current_branch = 'master'
    except GitError:
        current_branch = ''

    return {
        'message': 'created with success',
        'branches': branches_list,
        'branch': current_branch
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
    files = repository.Repo.index.diff()

    return {
        'message': files
    }


@app.route('/git_commit', methods=['POST'])
def commit_change():
    data = request.get_json()
    message = data['commit_message']

    try:
        repository.Repo.git.commit('-m', message)

    except GitError:
        abort(404, description="Something went wrong. Commit not made!")

    return { "message": "Successfully commited changes" }


app.run(debug=True)
