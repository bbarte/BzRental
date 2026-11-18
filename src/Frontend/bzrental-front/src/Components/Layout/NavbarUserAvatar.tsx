import { Link } from "react-router-dom";
import type ILoggedUserDto from "../../DAL/Auth/Dtos/ILoggedUserDto";

export type NavbarUserAvatarProps = {
    userInfo: ILoggedUserDto | null,
    handleLogout: () => Promise<void>
};

export function NavbarUserAvatar({userInfo, handleLogout}: NavbarUserAvatarProps) {
    if (userInfo === null)
        return;

    return (
        <>
            <div className="dropdown">
                <button className="btn btn-warning bg-warning-subtle bg-gradient" data-bs-toggle="dropdown">
                    <i className="fa fa-user-circle"></i>
                    <span className="ms-2">{`${userInfo.firstName} ${userInfo.lastName}`}</span>
                </button>

                <ul className="dropdown-menu shadow">
                    <li>
                        <a style={{cursor: 'pointer'}} className="dropdown-item" onClick={handleLogout}>
                            <i className="fa fa-sign-out"></i>
                            <span className="ms-2">Wyloguj się</span>
                        </a>
                    </li>
                </ul>
            </div>
        </>
    )
}