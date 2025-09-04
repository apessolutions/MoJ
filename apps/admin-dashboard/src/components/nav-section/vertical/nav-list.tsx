import { useCallback, useEffect, useState } from 'react';
import { PermissionGuard } from 'src/components/guard/permission-guard';
import { usePathname } from 'src/routes/hooks';
import { useActiveLink } from 'src/routes/hooks/use-active-link';
import { isExternalLink } from 'src/routes/utils';

import { navSectionClasses } from '../classes';
import { NavCollapse, NavLi, NavUl } from '../styles';
import type { NavListProps, NavSubListProps } from '../types';

import { NavItem } from './nav-item';

// ----------------------------------------------------------------------

export function NavList({
  data,
  render,
  depth,
  slotProps,
  enabledRootRedirect,
}: NavListProps) {
  const pathname = usePathname();

  const active = useActiveLink(data.path, !!data.children);

  const [openMenu, setOpenMenu] = useState(active);

  useEffect(() => {
    if (!active) {
      handleCloseMenu();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const handleToggleMenu = useCallback(() => {
    if (data.children) {
      setOpenMenu((prev) => !prev);
    }
  }, [data.children]);

  const handleCloseMenu = useCallback(() => {
    setOpenMenu(false);
  }, []);

  const renderNavItem = (
    <NavItem
      render={render}
      // slots
      path={data.path}
      icon={data.icon}
      permission={data.permission}
      info={data.info}
      title={data.title}
      caption={data.caption}
      // state
      depth={depth}
      active={active}
      disabled={data.disabled}
      hasChild={!!data.children}
      open={data.children && openMenu}
      externalLink={isExternalLink(data.path)}
      enabledRootRedirect={enabledRootRedirect}
      // styles
      slotProps={depth === 1 ? slotProps?.rootItem : slotProps?.subItem}
      // actions
      onClick={handleToggleMenu}
    />
  );

  // Hidden item by role
  if (data.roles && slotProps?.currentRole) {
    if (!data?.roles?.includes(slotProps?.currentRole)) {
      return null;
    }
  }

  // Has children
  if (data.children) {
    return (
      <PermissionGuard requiredPermission={data.permission}>
        <NavLi
          disabled={data.disabled}
          sx={{
            [`& .${navSectionClasses.li}`]: {
              '&:first-of-type': { mt: 'var(--nav-item-gap)' },
            },
          }}
        >
          {renderNavItem}

          <NavCollapse
            data-group={data.title}
            in={openMenu}
            depth={depth}
            unmountOnExit
            mountOnEnter
          >
            <NavSubList
              data={data.children}
              render={render}
              depth={depth}
              slotProps={slotProps}
              enabledRootRedirect={enabledRootRedirect}
            />
          </NavCollapse>
        </NavLi>
      </PermissionGuard>
    );
  }

  // Default
  return (
    <PermissionGuard requiredPermission={data.permission}>
      <NavLi disabled={data.disabled}>{renderNavItem}</NavLi>
    </PermissionGuard>
  );
}

// ----------------------------------------------------------------------

function NavSubList({
  data,
  render,
  depth,
  slotProps,
  enabledRootRedirect,
}: NavSubListProps) {
  return (
    <NavUl sx={{ gap: 'var(--nav-item-gap)' }}>
      {data.map((list) => (
        <NavList
          key={list.title}
          data={list}
          render={render}
          depth={depth + 1}
          slotProps={slotProps}
          enabledRootRedirect={enabledRootRedirect}
        />
      ))}
    </NavUl>
  );
}
