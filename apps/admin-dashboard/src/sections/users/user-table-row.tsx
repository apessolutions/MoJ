/* eslint-disable @nx/enforce-module-boundaries */

import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import { useRef } from 'react';
import { CustomPopover, usePopover } from 'src/components/custom-popover';
import { PermissionGuard } from 'src/components/guard/permission-guard';

import { Iconify } from 'src/components/iconify';

import { useBoolean } from 'src/hooks/use-boolean';

import { RolePermission } from '../../../../../libs/role/src/lib/types/permission-type.type';
import { UserDto } from '../../../../../libs/contract/src/lib/admin/v1/user/user.dto';
import { useRouter } from 'src/auth/hooks/use-router';
import { paths } from 'src/routes/paths';

type Props = {
  row: UserDto;
};

export default function RoleTableRow({ row }: Props) {
  const { id, firstName, lastName, phoneNumber, email, dateOfBirth, gender } =
    row;
  const name = `${firstName || ''} ${lastName || ''}`;
  const confirmDelete = useBoolean();
  const settingRef = useRef(null);
  const popover = usePopover();

  const router = useRouter();

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
            primary={name}
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
            primaryTypographyProps={{ typography: 'body2', noWrap: false }}
            secondaryTypographyProps={{
              component: 'span',
              color: 'text.disabled',
            }}
          />
        </TableCell>
        <TableCell>
          <ListItemText
            primary={phoneNumber}
            primaryTypographyProps={{ typography: 'body2', noWrap: false }}
            secondaryTypographyProps={{
              component: 'span',
              color: 'text.disabled',
            }}
          />
        </TableCell>
        <TableCell>
          <ListItemText
            primary={dateOfBirth}
            primaryTypographyProps={{
              typography: 'body2',
              noWrap: false,
            }}
            secondaryTypographyProps={{
              component: 'span',
              color: 'text.disabled',
            }}
          />
        </TableCell>
        <TableCell>
          <ListItemText
            primary={gender}
            primaryTypographyProps={{
              typography: 'body2',
              noWrap: false,
              textTransform: 'capitalize',
            }}
            secondaryTypographyProps={{
              component: 'span',
              color: 'text.disabled',
            }}
          />
        </TableCell>
        <TableCell align="right">
          <PermissionGuard requiredPermission={RolePermission.VIEW}>
            <IconButton
              ref={settingRef}
              color={popover.open ? 'primary' : 'default'}
              onClick={popover.onOpen}
            >
              <Iconify icon="eva:more-vertical-fill" />
            </IconButton>
          </PermissionGuard>
        </TableCell>
      </TableRow>

      <CustomPopover
        anchorEl={settingRef.current}
        slotProps={{ arrow: { placement: 'right-top' } }}
        open={popover.open}
        onClose={popover.onClose}
        sx={{ width: 140 }}
      >
        <PermissionGuard requiredPermission={RolePermission.VIEW}>
          <MenuItem
            onClick={() => {
              confirmDelete.onTrue();
              popover.onClose();
              router.push(paths.dashboard.user.profile(id));
            }}
          >
            <Iconify icon="eva:eye-fill" />
            Profile
          </MenuItem>
        </PermissionGuard>
      </CustomPopover>
    </>
  );
}
