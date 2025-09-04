/* eslint-disable @nx/enforce-module-boundaries */
// @mui
// utils
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import { useRef } from 'react';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomPopover, usePopover } from 'src/components/custom-popover';
import { PermissionGuard } from 'src/components/guard/permission-guard';
// components
import { Iconify } from 'src/components/iconify';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';

import { RoleDto } from '../../../../../libs/contract/src/lib/admin/v1/role/role.dto';
import { RolePermission } from '../../../../../libs/role/src/lib/types/permission-type.type';

// ----------------------------------------------------------------------

type Props = {
  row: RoleDto;
  onDeleteRow: VoidFunction;
  onEditRow: VoidFunction;
};

export default function RoleTableRow({ row, onEditRow, onDeleteRow }: Props) {
  const { id, description, title } = row;
  const confirmDelete = useBoolean();
  const settingRef = useRef(null);

  const handleDeleteRole = () => {
    onDeleteRow();
    confirmDelete.setValue(false);
  };

  const popover = usePopover();

  return (
    <>
      <TableRow hover key={id}>
        <TableCell>
          <ListItemText
            primary={id}
            primaryTypographyProps={{ typography: 'body2', noWrap: true }}
            secondaryTypographyProps={{
              component: 'span',
              color: 'text.disabled',
            }}
          />
        </TableCell>
        <TableCell>
          <ListItemText
            primary={title}
            primaryTypographyProps={{ typography: 'body2', noWrap: true }}
            secondaryTypographyProps={{
              component: 'span',
              color: 'text.disabled',
            }}
          />
        </TableCell>
        <TableCell>
          <ListItemText
            primary={description}
            primaryTypographyProps={{ typography: 'body2', noWrap: false }}
            secondaryTypographyProps={{
              component: 'span',
              color: 'text.disabled',
            }}
          />
        </TableCell>
        <TableCell align="right">
          <IconButton
            ref={settingRef}
            color={popover.open ? 'primary' : 'default'}
            onClick={popover.onOpen}
          >
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <CustomPopover
        anchorEl={settingRef.current}
        slotProps={{ arrow: { placement: 'right-top' } }}
        open={popover.open}
        onClose={popover.onClose}
        sx={{ width: 140 }}
      >
        <PermissionGuard requiredPermission={RolePermission.EDIT}>
          <MenuItem
            onClick={() => {
              onEditRow();
              popover.onClose();
            }}
            sx={{ color: 'primary' }}
          >
            <Iconify icon="solar:pen-bold" />
            Edit
          </MenuItem>
        </PermissionGuard>
        <PermissionGuard requiredPermission={RolePermission.DELETE}>
          <MenuItem
            onClick={() => {
              confirmDelete.onTrue();
              popover.onClose();
            }}
            sx={{ color: 'error.main' }}
          >
            <Iconify icon="solar:trash-bin-trash-bold" />
            Delete
          </MenuItem>
        </PermissionGuard>
      </CustomPopover>

      <ConfirmDialog
        open={confirmDelete.value}
        onClose={confirmDelete.onFalse}
        title="Delete"
        content="Are you sure you want to delete this role?"
        action={
          <Button variant="contained" color="error" onClick={handleDeleteRole}>
            Delete
          </Button>
        }
      />
    </>
  );
}
