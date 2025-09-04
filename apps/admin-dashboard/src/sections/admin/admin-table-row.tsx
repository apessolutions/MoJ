/* eslint-disable @nx/enforce-module-boundaries */
// @mui
import { Stack } from '@mui/material';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
// utils
import { useRef } from 'react';
import { useAuthContext } from 'src/auth/hooks';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomPopover, usePopover } from 'src/components/custom-popover';
import { PermissionGuard } from 'src/components/guard/permission-guard';
// components
import { Iconify } from 'src/components/iconify';
import { Label } from 'src/components/label';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';

import { AdminDto } from '../../../../../libs/contract/src/lib/admin/v1/admin/admin.dto';
import { AdminPermission } from '../../../../../libs/role/src/lib/types/permission-type.type';

// types

// ----------------------------------------------------------------------

type Props = {
  row: AdminDto;
  onEditRow: VoidFunction;
  onDeleteRow: VoidFunction;
};

export default function AdminTableRow({ row, onDeleteRow, onEditRow }: Props) {
  const { id, firstName, lastName, email, role, isSuper, status } = row;
  const name = `${firstName} ${lastName}`;
  const confirmDelete = useBoolean();
  const settingRef = useRef(null);

  const { user } = useAuthContext();

  const handleDeleteAdmin = () => {
    onDeleteRow();
    confirmDelete.setValue(false);
  };

  const popover = usePopover();

  return (
    <>
      <TableRow hover>
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
            primary={name ? `${name}` : '---'}
            primaryTypographyProps={{ typography: 'body2', noWrap: true }}
            secondaryTypographyProps={{
              component: 'span',
              color: 'text.disabled',
            }}
          />
        </TableCell>
        <TableCell>
          <ListItemText
            primary={email}
            primaryTypographyProps={{ typography: 'body2', noWrap: true }}
            secondaryTypographyProps={{
              component: 'span',
              color: 'text.disabled',
            }}
          />
        </TableCell>
        <TableCell>
          <Stack direction="row" spacing={1}>
            <Label
              variant="soft"
              color="primary"
              // truncate
              sx={{
                maxWidth: 200,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {isSuper ? 'Super Admin' : role}
            </Label>
          </Stack>
        </TableCell>

        <TableCell>
          <Label variant="soft" color={status ? 'success' : 'warning'}>
            {status ? 'Active' : 'Inactive'}
          </Label>
        </TableCell>
        <TableCell align="right">
          <IconButton
            ref={settingRef}
            color={popover.open ? 'primary' : 'default'}
            onClick={popover.onOpen}
            disabled={user?.id === id}
            sx={{ opacity: user?.id === id ? 0 : 1 }}
          >
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>
      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        anchorEl={settingRef.current}
        slotProps={{ arrow: { placement: 'right-top' } }}
        sx={{ width: 140 }}
      >
        <PermissionGuard requiredPermission={AdminPermission.EDIT}>
          <MenuItem
            onClick={() => {
              onEditRow();
              popover.onClose();
            }}
          >
            <Iconify icon="solar:pen-bold" />
            Edit
          </MenuItem>
        </PermissionGuard>
        <PermissionGuard requiredPermission={AdminPermission.DELETE}>
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
        content="Are you sure want to delete admin?"
        action={
          <Button variant="contained" color="error" onClick={handleDeleteAdmin}>
            Delete
          </Button>
        }
      />
    </>
  );
}
