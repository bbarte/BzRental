import { Link, NavLink } from "react-router-dom";
import logo from '../../assets/bzrental_logo.png';
import { useEffect, useState } from "react";
import type ILoggedUserDto from "../../DAL/Auth/Dtos/ILoggedUserDto";
import AuthService from "../../DAL/Auth/Services/AuthService";
import { NavbarUserAvatar } from "./NavbarUserAvatar";

export type BzRentalNavbarProps = {
    isUserLoggedIn: boolean,
    handleLogout: () => Promise<void>
};

export function BzRentalNavbar({isUserLoggedIn, handleLogout}: BzRentalNavbarProps) {
    const [loggedUserInfo, setLoggedUserInfo] = useState<ILoggedUserDto | null>(null);

    useEffect(() => {
        if (isUserLoggedIn) {
            AuthService.getUserInfo()
                .then((data: ILoggedUserDto) => {
                    setLoggedUserInfo(data);
                });
        }
    }, [isUserLoggedIn]);

    async function handleAvatarLogout(): Promise<void> {
        await AuthService.logout();
        handleLogout();
    }

    return (
        <>
            <div className="navbar shadow-sm navbar-expand-lg bg-light border-bottom mb-4 sticky-top">
                <div className="container">
                    <Link to='/' className="navbar-brand">
                        <img src={logo} alt="" height="35"/>
                    </Link>

                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#nav">
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className="collapse navbar-collapse" id="nav">
                        <ul className="navbar-nav">
                            <li className="nav-item">
                                <NavLink to='/' className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                                    Strona główna
                                </NavLink>
                            </li>
                            {
                                (isUserLoggedIn && AuthService.isUserAdmin) &&
                                <li className="nav-item dropdown">
                                    <a className="nav-link dropdown-toggle" data-bs-toggle="dropdown" style={{cursor: 'pointer'}}>
                                        Administrator
                                    </a>
                                    <ul className="dropdown-menu shadow">
                                        <li>
                                            <NavLink to='/admin/users' className='dropdown-item'>Użytkownicy</NavLink>
                                        </li>
                                        <li>
                                            <hr className="dropdown-divider" />
                                        </li>
                                        <li>
                                            <NavLink to='/admin/product-categories' className='dropdown-item'>Kategorie przedmiotów</NavLink>
                                        </li>
                                    </ul>
                                </li>
                            }
                        </ul>

                        <div className="ms-auto">
                            {
                                !isUserLoggedIn ?
                                <Link to='/login' className="btn btn-outline-secondary">
                                    <div className="fa fa-sign-in"></div>
                                    <span className="ms-2">Zaloguj się</span>
                                </Link> :
                                <NavbarUserAvatar
                                    userInfo={loggedUserInfo}
                                    handleLogout={handleAvatarLogout}/>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}