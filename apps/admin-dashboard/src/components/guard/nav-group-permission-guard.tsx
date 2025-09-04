import { useEffect, useState } from 'react';
import { useAuthContext } from 'src/auth/hooks';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
  requiredPermissions: string[];
};

export function NavGroupPermissionGuard({
  children,
  requiredPermissions,
}: Props) {
  const [hasPermission, setHasPermission] = useState<boolean>(false);
  const { user } = useAuthContext();

  useEffect(() => {
    const checkPermissions = () => {
      if (!user) {
        setHasPermission(false);
        return;
      }

      if (user.isSuper) {
        setHasPermission(true);
      } else {
        const permissions = user.permissions.map((p) => p.permission);
        const hasRequiredPermission = requiredPermissions.some((perm) =>
          permissions.includes(perm)
        );
        setHasPermission(hasRequiredPermission);
      }
    };

    checkPermissions();
  }, [requiredPermissions, user]);

  if (!hasPermission) {
    return null;
  }

  return children;
}
