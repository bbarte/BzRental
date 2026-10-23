import { Link, NavLink } from "react-router-dom";
import logo from '../../assets/bzrental_logo.png';
import { useEffect, useState } from "react";
import type ILoggedUserDto from "../../DAL/Auth/Dtos/ILoggedUserDto";
import AuthService from "../../DAL/Auth/Services/AuthService";

export type BzRentalNavbarProps = {
    isUserLoggedIn: boolean
};

export function BzRentalNavbar({isUserLoggedIn}: BzRentalNavbarProps) {
    const [loggedUserInfo, setLoggedUserInfo] = useState<ILoggedUserDto>({
        username: '',
        firstName: '',
        lastName: ''
    });

    useEffect(() => {
        if (isUserLoggedIn) {
            AuthService.getUserInfo()
                .then((data: ILoggedUserDto) => {
                    setLoggedUserInfo(data);
                });
        }
    }, [isUserLoggedIn]);

    return (
        <>
            <div className="navbar navbar-expand-lg bg-light border-bottom mb-4 sticky-top">
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
                        </ul>

                        <div className="ms-auto">
                            {
                                !isUserLoggedIn ?
                                <Link to='/login'>Zaloguj się</Link> :
                                <p>
                                    {loggedUserInfo.firstName} {loggedUserInfo.lastName} ({loggedUserInfo.username})
                                </p>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}