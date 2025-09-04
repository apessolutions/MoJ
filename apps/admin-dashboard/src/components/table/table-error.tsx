import { Alert, TableRow, TableCell } from '@mui/material';

export type TableErrorProps = {
  errorMessage: string;
};

export const TableError = ({ errorMessage, ...props }: TableErrorProps) => (
  <TableRow {...props}>
    <TableCell colSpan={12}>
      <Alert severity="error">{errorMessage}</Alert>
    </TableCell>
  </TableRow>
);
