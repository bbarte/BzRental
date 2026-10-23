import { Link } from "react-router-dom";
import BzRentalFooter from "../Components/Layout/BzRentalFooter";
import { BzRentalNavbar } from "../Components/Layout/BzRentalNavbar";
import { useState } from "react";
import AuthService from "../DAL/Auth/Services/AuthService";

export default function NotFound() {
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
                <div className="w-50 mx-auto bg-warning-subtle p-4 my-5 rounded border border-warning shadow-sm">
                    <h1>404</h1>
                    <p>
                        Nie znaleziono takiej podstrony!
                    </p>
                    <p>
                        <Link to='/' className="btn btn-outline-dark">Wróć do strony glównej</Link>
                    </p>
                </div>
            </div>

            <BzRentalFooter/>
        </>
    )
}