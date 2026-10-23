import { useState } from "react";
import BzRentalFooter from "../Components/Layout/BzRentalFooter";
import { BzRentalNavbar } from "../Components/Layout/BzRentalNavbar";
import AuthService from "../DAL/Auth/Services/AuthService";

export default function Main() {
    const [isUserLoggedIn, setIsUserLoggedIn] = useState<boolean>(AuthService.isLoggedIn);
    
    async function handleLogout(): Promise<void> {
        setIsUserLoggedIn(false);
    }

    return (
        <>
            <BzRentalNavbar
                isUserLoggedIn={isUserLoggedIn}
                handleLogout={handleLogout}/>

            <div className="container">
                <h1>Witaj, świecie!</h1>
            </div>

            <BzRentalFooter/>
        </>
    )
};