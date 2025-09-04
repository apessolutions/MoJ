/* eslint-disable @nx/enforce-module-boundaries */
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  rectSortingStrategy,
  SortableContext,
} from '@dnd-kit/sortable';
import { Box } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useReorderBannerMutation } from 'src/api/hooks/banner';

import { BannerDto } from '../../../../../libs/contract/src/lib/admin/v1/banner/banner.dto';

import BannerCard from './banner-card';

export type SortableGridProps = {
  banners: BannerDto[];
  handleEditRow: (id: number) => void;
  handleDeleteRow: (id: number) => void;
};
export const SortableGrid = ({
  banners,
  handleDeleteRow,
  handleEditRow,
}: SortableGridProps) => {
  const { mutateAsync: reorderBanners, isPending } = useReorderBannerMutation();
  const [items, setItems] = useState(banners);
  const [active, setActive] = useState<BannerDto | null>(null);
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 3,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        distance: 3,
      },
    })
  );

  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      const activeBanner =
        items.find((i) => i.id.toString() === event.active.id.toString()) ||
        null;
      return setActive(activeBanner);
    },
    [items]
  );
  const handleDragEnd = useCallback(
    async (event: DragEndEvent) => {
      const { active, over } = event;

      if (!active || !over) return;

      if (active?.id !== over?.id) {
        const oldIndex = items.findIndex(
          (item) => item?.id === parseInt(active?.id?.toString())
        );
        const newIndex = items.findIndex(
          (item) => item?.id === parseInt(over?.id?.toString())
        );

        const newItems = arrayMove(items, oldIndex, newIndex);
        try {
          setItems(newItems);
          await reorderBanners({
            banners: newItems.map((item) => item.id),
          });
        } catch (error) {
          setItems(items);
          toast.error(error.message);
        }
      }

      setActive(null);
    },
    [items, reorderBanners]
  );
  const handleDragCancel = useCallback(() => {
    setActive(null);
  }, []);

  useEffect(() => {
    setItems(banners);
  }, [banners]);

  return (
    <div>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <SortableContext
          items={items}
          strategy={rectSortingStrategy}
          disabled={isPending}
        >
          <Box gap={5} display="flex" flexWrap="wrap">
            {items.map((item) => (
              <BannerCard
                row={item}
                onEditRow={() => handleEditRow(item.id)}
                key={item.id}
                onDeleteRow={() => handleDeleteRow(item.id)}
              />
            ))}
          </Box>
        </SortableContext>
        <DragOverlay adjustScale style={{ transformOrigin: '0 0 ' }}>
          {active ? (
            <Box
              gap={5}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3 , 2fr)',
              }}
            >
              <BannerCard
                row={active}
                onEditRow={() => handleEditRow(active.id)}
                onDeleteRow={() => handleDeleteRow(active.id)}
              />
            </Box>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
};
