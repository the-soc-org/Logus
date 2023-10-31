export const linkProjectToTeamMutation: string =`
mutation linkProjectToTeam($projectId: ID!, $teamId: ID!){
  linkProjectV2ToTeam(input: {
    projectId: $projectId,
    teamId: $teamId
  }) {
    team {
      id
    }
  }
}`;
export type LinkProjectToTeamResult = Data
// To parse this data:
//
//   import { Convert, LinkProjectToTeamRawResult } from "./file";
//
//   const linkProjectToTeamRawResult = Convert.toLinkProjectToTeamRawResult(json);

export interface LinkProjectToTeamRawResult {
    data:    Data | null;
    errors?: Error[];
}

export interface Data {
    linkProjectV2ToTeam: LinkProjectV2ToTeamPayload | null;
}

export interface LinkProjectV2ToTeamPayload {
    team: Team | null;
}

export interface Team {
    id: string;
}

export interface Error {
    message: string;
}

// Converts JSON strings to/from your types
export class Convert {
    public static toLinkProjectToTeamRawResult(json: string): LinkProjectToTeamRawResult {
        return JSON.parse(json);
    }

    public static linkProjectToTeamRawResultToJson(value: LinkProjectToTeamRawResult): string {
        return JSON.stringify(value);
    }
}
