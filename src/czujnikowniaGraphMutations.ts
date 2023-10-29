import { CzujnikowniaContext } from "./czujnikowniaContexts";

const createProjectMutation: string = `
mutation createProject($ownerId: ID!, $title: String!) { 
  createProjectV2(input: {ownerId: $ownerId, title: $title}) {
    projectV2 {
      id
    }
  }
}`;
export async function createProjectV2(context: CzujnikowniaContext, title: string, log?: any)
: Promise<string>
{
  const projectCreateArgs: any = {
      ownerId: context.payload.organization.node_id,
      title: title,
    };
  const result: any = await context.octokit.graphql(createProjectMutation, projectCreateArgs);
  log?.debug(`createProjectV2 mutation result:\n${JSON.stringify(result)}`);
  return result?.createProjectV2?.projectV2?.id as string;
}

const copyProjectMutation: string = `
mutation copyProject($projectId: ID!, $ownerId: ID!, $title: String!){
  copyProjectV2(input:{projectId: $projectId, ownerId: $ownerId, title: $title}) {
    projectV2 {
      id,
      number
    }
  }
}`;
export async function copyProjectV2(context: CzujnikowniaContext, newProjectTitle: string, templateProjectNumber: Number, log?: any) 
: Promise<string> {
  const projectCreateArgs: any = {
      ownerId: context.payload.organization.node_id,
      title: newProjectTitle,
      projectId: templateProjectNumber
  };
  const result: any = await context.octokit.graphql(copyProjectMutation, projectCreateArgs);  
  log?.debug(`copyProjectV2 mutation result:\n${JSON.stringify(result)}`);
  return result.copyProjectV2.projectV2.id as string;
}

const closeProjectV2Mutation = `
mutation closeProjectV2($projectId: ID!){
  updateProjectV2(input: {
    projectId: $projectId,
    closed: true
  }) {
    projectV2 {
      id
    }
  }
}`;
export async function closeProjectV2(context: CzujnikowniaContext, projectId: string, log?: any) : Promise<string>
{
  const result: any = await context.octokit.graphql(closeProjectV2Mutation, {
    projectId
  });
  log?.debug(`closeProjectV2Mutation mutation result:\n${JSON.stringify(result)}`);
  return result.updateProjectV2.projectV2.id as string;
}

const linkProjectV2ToTeamMutation = `mutation linkProjectToTeam($projectId: ID!, $teamId: ID!){
  linkProjectV2ToTeam(input: {
    projectId: $projectId,
    teamId: $teamId
  }) {
    team {
      id
    }
  }
}`;
export async function linkProjectV2ToTeam(context: CzujnikowniaContext, projectId: string, teamId: string)
: Promise<string> {
  const result: any = await context.octokit.graphql(linkProjectV2ToTeamMutation, {
    projectId,
    teamId
  });
  return result as string;
}

const addItemMutation = `
mutation addItemMutation($projectId:ID!, $contentId:ID!, $fieldName: String!) {
    addProjectV2ItemById(input: {projectId: $projectId, contentId: $contentId}) {
      item {
        id,
        fieldValueByName(name: $fieldName) {
          ... on ProjectV2ItemFieldNumberValue {
            number
          },
          ... on ProjectV2ItemFieldDateValue {
            date
          }
        }
      }
    }
  }`;
export async function addItemToProjIfNotExist(context: CzujnikowniaContext, projectId: string, contentId: string, fieldName: string, log?: any)
: Promise<{itemId: string, fieldValue: any}>
{
  const result: any = await context.octokit.graphql(addItemMutation, {
    projectId,
    contentId,
    fieldName,
  });
  log?.debug(`addItemToProjIfNotExist mutation result:\n${JSON.stringify(result)}`);
  const item: any = result.addProjectV2ItemById.item;
  return {
    itemId: item.id as string,
    fieldValue: item.fieldValueByName?.number ?? item.fieldValueByName?.date ?? 0,
  };
}
  
const updateItemDateFieldMutation = `
mutation updateItemField($projectId: ID!, $itemId: ID!, $fieldId: ID!, $date: Date){
  updateProjectV2ItemFieldValue(
    input: {
      projectId: $projectId
      itemId: $itemId
      fieldId: $fieldId
      value: { 
        date: $date      
      }
    }
  ) {
    projectV2Item {
      id
    }
  }
}`;
export async function updateItemDateField(context: CzujnikowniaContext, projectId: string, itemId: string, fieldId: string, date: string, log?: any): Promise<string>
{
  const result: any = await context.octokit.graphql(updateItemDateFieldMutation, {
    projectId,
    itemId,
    fieldId,
    date,
  });
  log?.debug(`updateItemDateField mutation result:\n${JSON.stringify(result)}`);
  return result.updateProjectV2ItemFieldValue.projectV2Item.id as string;
}

const updateItemNumberFieldMutation = `
mutation updateItemField($projectId: ID!, $itemId: ID!, $fieldId: ID!, $number: Float){
  updateProjectV2ItemFieldValue(
    input: {
      projectId: $projectId
      itemId: $itemId
      fieldId: $fieldId
      value: { 
        number: $number      
      }
    }
  ) {
    projectV2Item {
      id
    }
  }
}`;
export async function updateItemNumberField(context: CzujnikowniaContext, projectId: string, itemId: string, fieldId: string, number: number, log?: any): Promise<string>
{
  const result: any = await context.octokit.graphql(updateItemNumberFieldMutation, {
    projectId,
    itemId,
    fieldId,
    number,
  });
  log?.debug(`updateItemNumberField mutation result:\n${JSON.stringify(result)}`);
  return result.updateProjectV2ItemFieldValue.projectV2Item.id as string;
}