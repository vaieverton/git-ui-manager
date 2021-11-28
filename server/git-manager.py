import os
from flask import Flask, request, Response
from git import Repo
from git.exc import GitError

repositories_prefix = '~/repositories'

app = Flask(__name__)

main_repo = None

@app.route('/get_repository_path', methods=['POST'])
def get_path():
    data = request.get_json()

    repo_name = data['repository']
    print(repo_name)

    try:
        main_repo = Repo.init(os.path.join(repositories_prefix, repo_name))
    
    except GitError:
        print(GitError)
        return {
            'message': 'failed'
        }

    return {
        'message': 'created with success'
    }

@app.route('/make_log', methods=['GET'])
def log():
    data = request.get_json()

    log_parameters = data['parameters']
    branch = data['branch']

    try:
        log_output = main_repo.git.log(log_parameters, branch)
    
    except GitError:
        print(GitError)
        return {
            'message': 'something went wrong'
        }
    return {
        'message': log_output
    }

app.run(debug=True)