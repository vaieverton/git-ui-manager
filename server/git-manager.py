import os
from flask import Flask, request, Response
from git import Repo, Git
from git.exc import GitError

repositories_prefix = '/home/vaieverton/fake_repos/'


app = Flask(__name__)

main_repo = Repo.init()

@app.route('/get_repository_path', methods=['POST'])
def get_path():
    data = request.get_json()

    repo_name = data['repository']
    print(repo_name)
    path = os.path.join(repositories_prefix, repo_name)
    try:
        # main_repo = Repo.clone_from("git@github.com:vaieverton/rock-paper-scissors-opencv-arduino.git", os.path.join('/home/repositories/clones'))
        main_repo = Repo(path)
    
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

    branch = request.args.get('branch')

    repo_nam = 'repo1'
    repo = Repo(os.path.join(repositories_prefix, repo_nam))
    log_output =repo.git.status()
    return {
        'message': log_output
    }

app.run(debug=True)