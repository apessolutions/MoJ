import { Card, Link, ListItemText, Stack } from '@mui/material';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomPopover, usePopover } from 'src/components/custom-popover';
import { PermissionGuard } from 'src/components/guard/permission-guard';
import { Iconify } from 'src/components/iconify';
import { Image } from 'src/components/image';
import { useBoolean } from 'src/hooks/use-boolean';
import { IBanner } from 'src/types/banner';
import { fDateTime } from 'src/utils/format-time';
import { BannerPermission } from '../../../../../libs/role/src/lib/types/permission-type.type';
import { CSSProperties } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// ----------------------------------------------------------------------

type Props = {
  row: IBanner;
  onEditRow: VoidFunction;
  onDeleteRow: VoidFunction;
};

export default function BannerCard({ row, onDeleteRow, onEditRow }: Props) {
  const { title, createdAt, media, linkValue: url } = row;
  const { mediaUrl } = media;
  const confirmDelete = useBoolean();

  const handleDeleteBanner = () => {
    onDeleteRow();
    confirmDelete.setValue(false);
  };

  const popover = usePopover();

  const renderImage = (
    <Stack flexGrow={1} sx={{ position: 'relative' }}>
      <Stack
        direction="row"
        alignItems="center"
        sx={{
          top: 9,
          left: 8,
          zIndex: 9,
          borderRadius: 1,
          position: 'absolute',
          p: '2px 6px 2px 4px',
          color: 'common.white',
          typography: 'subtitle2',
        }}
      />
      <Image
        alt={mediaUrl}
        src={mediaUrl}
        sx={{ borderRadius: 1, height: 164, width: 1 }}
      />
    </Stack>
  );

  const renderTitleAndDate = (
    <ListItemText
      sx={{
        p: (theme) => theme.spacing(2.5, 2.5, 2, 2.5),
      }}
      primary={`Posted date: ${fDateTime(createdAt)}`}
      secondary={title}
      primaryTypographyProps={{
        typography: 'caption',
        color: 'text.disabled',
      }}
      secondaryTypographyProps={{
        mt: 1,
        noWrap: true,
        component: 'span',
        color: 'text.primary',
        typography: 'subtitle1',
      }}
    />
  );

  const renderContent = (
    <Stack direction="row">
      <IconButton
        onClick={(e) => {
          e.stopPropagation();
          popover.onOpen(e);
        }}
        sx={{ position: 'absolute', bottom: 20, right: 8 }}
      >
        <Iconify icon="eva:more-vertical-fill" />
      </IconButton>
    </Stack>
  );

  const {
    isDragging,
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: row.id.toString() });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition || undefined,
  };

  const inlineStyles: CSSProperties = {
    opacity: isDragging ? '0.5' : '1',
    transformOrigin: '50% 50%',
    cursor: isDragging ? 'grabbing' : 'grab',
    ...style,
  };

  return (
    <>
      <Card
        ref={setNodeRef}
        style={inlineStyles}
        {...attributes}
        {...listeners}
        sx={{ p: 1, width: 291, height: 266 }}
      >
        {renderImage}
        {renderTitleAndDate}
        {renderContent}
      </Card>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        anchorEl={popover.anchorEl}
        sx={{ width: 140 }}
      >
        <PermissionGuard requiredPermission={BannerPermission.EDIT}>
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

        <Link target="_blank" href={url} underline="none" color="inherit">
          <MenuItem disabled={!url}>
            <Iconify icon="fe:link-external" />
            Link
          </MenuItem>
        </Link>
        <PermissionGuard requiredPermission={BannerPermission.DELETE}>
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
        content="Are you sure want to delete?"
        action={
          <Button
            variant="contained"
            color="error"
            onClick={handleDeleteBanner}
          >
            Delete
          </Button>
        }
      />
    </>
  );
}
