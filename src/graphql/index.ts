export * from './query_getProjectId/getProjectId'
export * from './query_listTeamsInOrg/listTeamsInOrg'
export * from './query_listOpenedProjectsInOrg/listOpenedProjectsInOrg'

export * from './mutation_addProjectItem/addProjectItem'
export * from './mutation_updateItemDate/updateItemDate'
export * from './mutation_updateItemNumber/updateItemNumber'
export * from './mutation_updateItemText/updateItemText'
export * from './mutation_addAssignee/addAssignee'

export type WithoutNullableKeys<Type> = {
    [Key in keyof Type]-?: WithoutNullableKeys<NonNullable<Type[Key]>>;
  };