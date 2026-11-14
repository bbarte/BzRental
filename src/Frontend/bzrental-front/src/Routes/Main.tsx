import { useEffect, useState } from "react";
import BzRentalFooter from "../Components/Layout/BzRentalFooter";
import { BzRentalNavbar } from "../Components/Layout/BzRentalNavbar";
import AuthService from "../DAL/Auth/Services/AuthService";
import logo from '../assets/bzrental_logo.png';
import { Link } from "react-router-dom";
import type IProductCategoryMinimalDto from "../DAL/Products/Dtos/IProductCategoryMinimalDto";
import ProductsSelectingService from "../DAL/Products/Services/ProductsSelectingService";

export default function Main() {
    const [isUserLoggedIn, setIsUserLoggedIn] = useState<boolean>(AuthService.isLoggedIn);
    
    async function handleLogout(): Promise<void> {
        setIsUserLoggedIn(false);
    }

    const [categories, setCategories] = useState<IProductCategoryMinimalDto[]>([]);

    useEffect(() => {
        if (!isUserLoggedIn)
            return;

        // setCategories(await )
    }, [isUserLoggedIn]);

    if (!isUserLoggedIn) {
        return (
            <>
                <BzRentalNavbar
                    isUserLoggedIn={isUserLoggedIn}
                    handleLogout={handleLogout}/>

                <div className="container">
                    <div className="text-center">
                        <img src={logo} alt="" />
                    </div>

                    <h5 className="mt-2 text-center">
                        Aby korzystać z serwisu, należy się <Link to={'/login'}>zalogować</Link>.
                    </h5>
                </div>

                <BzRentalFooter/>
            </>
        )
    }

    return (
        <>
            <BzRentalNavbar
                isUserLoggedIn={isUserLoggedIn}
                handleLogout={handleLogout}/>

            <div className="container">
                <h1>Twoje wypożyczenia</h1>
            </div>

            <BzRentalFooter/>
        </>
    )
};