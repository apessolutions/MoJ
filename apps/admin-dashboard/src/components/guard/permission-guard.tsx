import { useEffect, useState } from 'react';
import { useAuthContext } from 'src/auth/hooks';
import { useRouter } from 'src/routes/hooks';
import { PermissionType } from '../../../../../libs/role/src/lib/types/permission-type.type';

type Props = {
  children: React.ReactNode;
  requiredPermission: PermissionType;
  isPage?: boolean;
};

export function PermissionGuard({
  children,
  requiredPermission,
  isPage,
}: Props) {
  const router = useRouter();
  const [hasPermission, setHasPermission] = useState<boolean>(true);
  const { user } = useAuthContext();

  useEffect(() => {
    const checkPermission = () => {
      if (!user) {
        setHasPermission(false);
        return;
      }

      if (user.isSuper) {
        setHasPermission(true);
      } else {
        const permissions = user.permissions.map((p) => p.permission);
        setHasPermission(permissions.includes(requiredPermission));
      }
    };

    checkPermission();
  }, [requiredPermission, user]);

  useEffect(() => {
    if (!hasPermission && isPage) {
      router.replace('/403');
    }
  }, [hasPermission, isPage, router]);

  if (!hasPermission && !isPage) {
    return null;
  }

  return children;
}
