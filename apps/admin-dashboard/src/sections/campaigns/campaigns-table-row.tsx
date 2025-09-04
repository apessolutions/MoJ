/* eslint-disable @nx/enforce-module-boundaries */
import { Button, IconButton, MenuItem, Stack } from '@mui/material';
import ListItemText from '@mui/material/ListItemText';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import { useRef } from 'react';
import { CustomPopover, usePopover } from 'src/components/custom-popover';
import { Label } from 'src/components/label';
import { useBoolean } from 'src/hooks/use-boolean';

import { CampaignDto } from '../../../../../libs/contract/src';
import { PermissionGuard } from 'src/components/guard/permission-guard';
import {
  AdminPermission,
  CampaignPermission,
} from '../../../../../libs/role/src/lib/types/permission-type.type';
import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';

type Props = {
  row: CampaignDto;
  onDeleteRow: () => void;
};

export default function CampaignTableRow({ row, onDeleteRow }: Props) {
  const { title, message, gender, maxAge, minAge, id } = row;

  const confirmDelete = useBoolean();
  const popover = usePopover();
  const settingRef = useRef(null);

  return (
    <>
      <TableRow hover>
        <TableCell>
          <ListItemText
            primary={title ? `${title}` : '---'}
            primaryTypographyProps={{ typography: 'body2', noWrap: true }}
            secondaryTypographyProps={{
              component: 'span',
              color: 'text.disabled',
            }}
          />
        </TableCell>
        <TableCell>
          <ListItemText
            primary={message}
            primaryTypographyProps={{ typography: 'body2', noWrap: false }}
            secondaryTypographyProps={{
              component: 'span',
              color: 'text.disabled',
            }}
          />
        </TableCell>
        <TableCell>
          <Stack direction="row" spacing={1}>
            {gender.length !== 0 ? (
              gender.map((role, index) => (
                <Label
                  key={`${id}-role-${index}`}
                  variant="soft"
                  color="primary"
                >
                  {role}
                </Label>
              ))
            ) : (
              <Label key={`${id}-role-0`} variant="soft" color="error">
                No specific gender
              </Label>
            )}
          </Stack>
        </TableCell>
        <TableCell>
          <ListItemText
            primary={minAge || '---'}
            primaryTypographyProps={{ typography: 'body2', noWrap: true }}
            secondaryTypographyProps={{
              component: 'span',
              color: 'text.disabled',
            }}
          />
        </TableCell>
        <TableCell>
          <ListItemText
            primary={maxAge || '---'}
            primaryTypographyProps={{ typography: 'body2', noWrap: true }}
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
        open={popover.open}
        onClose={popover.onClose}
        anchorEl={settingRef.current}
        slotProps={{ arrow: { placement: 'right-top' } }}
        sx={{ width: 140 }}
      >
        <PermissionGuard requiredPermission={CampaignPermission.DELETE}>
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
        content={<>Are you sure want to delete this campaign?</>}
        action={
          <Button
            onClick={() => {
              onDeleteRow();
              confirmDelete.onFalse();
            }}
            variant="contained"
            color="error"
          >
            Delete
          </Button>
        }
      />
    </>
  );
}
