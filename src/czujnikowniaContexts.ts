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
            name: string,
        },
        pull_request: {
            node_id: string,
        }
    };
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

export interface OctokitContext {
    graphql(query: string, variables: any): Promise<any>;
    config : {
        get<T>(params: {owner: any, repo: string, path: string, defaults: any}): Promise<{config: T}>;
    },
    pulls: {
        list(params: {owner: string; repo: string; state: "open"}): Promise<any>;
    }
}

export interface PullRequestListElement {
    status: number,
        data: {
        id: number,
        node_id: string,
        title: string,
        number: number,
        created_at: string,
        updated_at: string,
        creator: {
            login: string,
            id: number,
            node_id: string,
        },
        assignee: {
            login: string,
            id: number,
            node_id: string 
        }
    }
}

export interface ScheduleContext {
    octokit: OctokitContext;
    payload: {
        repository: {
            node_id: string;
            name: string;
            open_issues: number;
            owner: {
                node_id: string;
                login: string;
            }
        }
    }
}