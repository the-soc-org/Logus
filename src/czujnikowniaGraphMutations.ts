const createProjectMutation: string = `
mutation createProject($ownerId: ID!, $title: String!) { 
  createProjectV2(input: {ownerId: $ownerId, title: $title}) {
    projectV2 {
      id
    }
  }
}`;
export async function createProjectV2(context: any, title: string)
{
    const projectCreateArgs: any = {
        ownerId: context.payload.organization.node_id,
        title: title,
      };
    await context.octokit.graphql(createProjectMutation, projectCreateArgs);
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
export async function copyProjectV2(context: any, newProjectTitle: string, templateProjectNumber: Number) {
    const projectCreateArgs: any = {
        ownerId: context.payload.organization.node_id,
        title: newProjectTitle,
        projectId: templateProjectNumber
    };
    await context.octokit.graphql(copyProjectMutation, projectCreateArgs);  
}

const closeProjectV2Mutation = `
mutation closeProjectV2($projectId: ID!){
  deleteProjectV2(
    input: {
      projectId: $projectId
    }) {
    projectV2 {
      id
    }
  }
}`;
export async function closeProjectV2(context: any, projectId: string) : Promise<string>
{
  const result: any = await context.octokit.graphql(closeProjectV2Mutation, {
    projectId
  });
  return <string>result.deleteProjectV2.projectV2.id;
}

const addItemMutation = `mutation addItemMutation($projectId:ID!, $contentId:ID!) {
    addProjectV2ItemById(input: {projectId: $projectId, contentId: $contentId}) {
      item {
        id
      }
    }
  }`;
  export async function addItemToProjIfNotExist(context: any, projectId: string, contentId: string): Promise<string>
  {
    const result: any = await context.octokit.graphql(addItemMutation, {
      projectId,
      contentId,
    });
    return <string>result.addProjectV2ItemById.item.id;
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
  export async function updateItemDateField(context: any, projectId: string, itemId: string, fieldId: string, date: any): Promise<string>
  {
    const result: any = await context.octokit.graphql(updateItemDateFieldMutation, {
      projectId,
      itemId,
      fieldId,
      date,
    });
    return <string>result.updateProjectV2ItemFieldValue.projectV2Item.id;
  }