export interface OctokitContext {
    graphql(query: string, variables: any): Promise<any>;
}

export interface CzujnikowniaContext {
    octokit: OctokitContext;
    payload: {
        organization: {
            node_id: string,
            login: string,
        }
    };
}

export interface PRCzujnikowniaContext extends CzujnikowniaContext {
    payload: {
        organization: {
            node_id: string,
            login: string,
        },
        sender: {
            login: string,
        },
        repository: {
            node_id: string,
        },
        pull_request: {
            node_id: string,
        }
    };
}