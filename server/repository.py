from git import Repo

class Repository():
    def __init__(self, path) -> None:
        self.path = path,
        self.Repo = None,

    def createRepo(self, path):
        self.Repo = Repo(path)