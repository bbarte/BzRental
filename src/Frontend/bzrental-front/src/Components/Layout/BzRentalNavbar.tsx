import { Link, NavLink } from "react-router-dom";
import logo from '../../assets/bzrental_logo.png';

export default function BzRentalNavbar() {
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
                    </div>
                </div>
            </div>
        </>
    );
}