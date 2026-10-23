import { useState } from "react";
import BzRentalFooter from "../Components/Layout/BzRentalFooter";
import { BzRentalNavbar } from "../Components/Layout/BzRentalNavbar";
import AuthService from "../DAL/Auth/Services/AuthService";

export default function Main() {
    const [isUserLoggedIn] = useState<boolean>(AuthService.isLoggedIn);
    
    return (
        <>
            <BzRentalNavbar isUserLoggedIn={isUserLoggedIn}/>

            <div className="container">
                <h1>Witaj, świecie!</h1>
            </div>

            <BzRentalFooter/>
        </>
    )
};