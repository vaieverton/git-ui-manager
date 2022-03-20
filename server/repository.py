from git import Repo

class Repository():
    def __init__(self, path) -> None:
        self.path = path,
        self.Repo = None,

    def createRepo(self, path):
        self.Repo = Repo(path)

    def commit(self, message, author, description=''):
        self.Repo.git.commit('-m', message, author=author)