import { Navigate, Outlet, useLocation } from "react-router-dom";
import AuthService from "../DAL/Auth/Services/AuthService";

export default function ProtectedAdminRoute() {
    const location = useLocation();

    if (!AuthService.isLoggedIn || !AuthService.isUserAdmin) {
        return (
            <Navigate
                to='/login'
                replace
                state={{from: location}}
            />
        )
    }

    return <Outlet/>
}