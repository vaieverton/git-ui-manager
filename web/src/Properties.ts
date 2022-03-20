export interface PageProps {
    repositoryPath: string;
    branches: string[];
    connectedToRepo: boolean;
    author: string;
}

export interface SnackProps {
    open: boolean;
    message: string;
}