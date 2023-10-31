export * from './query_listOpenedPullRequests/listOpenedPullRequest'
export * from './query_getProjectId/getProjectId'
export * from './query_listUserTeamsInOrg/listUserTeamsInOrg'
export * from './query_listOpenedProjectsInOrg/listOpenedProjectsInOrg'

export * from './mutation_addProjectItem/addProjectItem'
export * from './mutation_closeProject/closeProject'
export * from './mutation_copyProject/copyProject'
export * from './mutation_createProject/createProject'
export * from './mutation_linkProjectToTeam/linkProjectToTeam'
export * from './mutation_updateItemDate/updateItemDate'
export * from './mutation_updateItemNumber/updateItemNumber'

export type WithoutNullableKeys<Type> = {
    [Key in keyof Type]-?: WithoutNullableKeys<NonNullable<Type[Key]>>;
  };