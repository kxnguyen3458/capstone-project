import useAuth from '@/hooks/useAuth'
import type { Role } from '@/types';

import { Navigate,  Outlet,  useLocation} from 'react-router-dom';

type ProtectedRouteProps =  {
    allowedRoles: Role[]
}

const ProtectedRoute = ({  allowedRoles }: ProtectedRouteProps) => {
    const { currentUser} = useAuth();
    const location = useLocation();

    

    // console.log(currentUser?.role)
    // if(currentUser){
    // console.log(allowedRoles.includes(currentUser?.role));
    // }

    return !currentUser ? (

        <Navigate to="/auth?tab=login" state={{ from: location }} replace />

    ) : !allowedRoles.includes(currentUser.role) ? (
        <Navigate to="/unauthorized" state={{ from: location }} replace />
    ) : (
        <Outlet/>
    );

}

export default ProtectedRoute