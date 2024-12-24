export const getDeleteDialogDescription = (entity: string) =>
  `Are you sure you want to delete this ${entity}? 
  This will delete all the data that is linked with this ${entity}. This action is irreversible!`;

export const getFailSearchDescription = (entity: string) =>
  `There has been a problem while getting ${entity} list data from the database. 
  Please contact the administration for further details.`;
