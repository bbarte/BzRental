import { Navigate, Outlet, useLocation } from "react-router-dom";
import AuthService from "../DAL/Auth/Services/AuthService";

export default function ProtectedRoute() {
    const location = useLocation();

    if (!AuthService.isLoggedIn) {
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