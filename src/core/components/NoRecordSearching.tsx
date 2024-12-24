import { Typography } from "@mui/material";
import { Box } from "@mui/system";

interface Props {
  search: string;
  entity: string;
}

export const NoRecordSearching = ({ search, entity }: Props) => {
  const pluralText = entity === 'License Class' ? 'es' : 's';
  return (
    <Box justifyContent="center" padding="20px" textAlign="center">
      {search ? (
        <Typography variant="body2">
          No records found with search term <b>{`'${search}'`}</b>. Try
          searching with another term!
        </Typography>
      ) : (
        <Typography variant="body2">No {entity}{pluralText} Found</Typography>
      )}
    </Box>
  );
};

export default NoRecordSearching;
