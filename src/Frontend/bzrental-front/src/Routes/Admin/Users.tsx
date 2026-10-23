import { useEffect, useRef, useState } from "react";
import BzRentalFooter from "../../Components/Layout/BzRentalFooter";
import { BzRentalNavbar } from "../../Components/Layout/BzRentalNavbar";
import AuthService from "../../DAL/Auth/Services/AuthService";
import { useNavigate } from "react-router-dom";
import type IPaginationParameters from "../../DAL/Shared/Models/IPaginationParameters";
import type IPaginatedList from "../../DAL/Shared/Models/IPaginatedList";
import type IUserDto from "../../DAL/Users/Dtos/IUserDto";
import { Paginator } from "../../Components/Paginator";
import Loader from "../../Components/Loader";
import UsersService from "../../DAL/Users/Services/UsersService";
import { ErrorMessagesList } from "../../Components/ErrorMessagesList";
import { InfoMessagesList } from "../../Components/InfoMessagesList";
import { ApiError } from "../../DAL/ApiAccess/ApiError";

export default function Users() {
    const navigate = useNavigate();
    const [isUserLoggedIn, setIsUserLoggedIn] = useState<boolean>(AuthService.isLoggedIn);
    async function handleLogout(): Promise<void> { setIsUserLoggedIn(false); navigate('/'); }

    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [pagination, setPagination] = useState<IPaginationParameters>({
        pageNumber: 1,
        pageSize: 25
    });

    const [users, setUsers] = useState<IPaginatedList<IUserDto>>({
        pageNumber: 1,
        pageSize: 25,
        hasNextPage: false,
        items: []
    });

    const [usersFilter, setUsersFilter] = useState<string>('');
    const [usersIncludeDeleted, setUsersIncludeDeleted] = useState<boolean>(false);

    const [apiErrors, setApiErrors] = useState<string[]>([]);
    const [infoMessages, setInfoMessages] = useState<string[]>([]);
    useEffect(() => {
        refreshData();
    }, [pagination.pageNumber]);

    async function refreshData() {
        setIsLoading(true);

        setUsers(await UsersService.getUsers(pagination, usersFilter, usersIncludeDeleted));

        setIsLoading(false);
    }

    function handleSearchFormSubmit(e: any): void {
        e.preventDefault();
        refreshData();
    }

    async function handleDelete(id: number) {
        setApiErrors([]);
        setInfoMessages([]);

        if (!confirm('Czy na pewno chcesz usunąć tego użytkownika?'))
            return;
        
        setIsLoading(true);

        try {
            await UsersService.deleteUser(id);

            setInfoMessages(['Usunięto wybranego użytkownika.']);
            await refreshData();
        }
        catch (e) {
            if (e instanceof ApiError) {
                setApiErrors(e.getTranslations([
                    {
                        code: 'Users.OperationWouldBlockAccess',
                        msg: 'Nie można usunąć użytkownika, ponieważ jest on jedynym administratorem systemu'
                    }
                ]))

                return;
            }

            throw e;
        }
        finally {
            setIsLoading(false);
        }
    }
    
    async function handleRecover(id: number) {
        setApiErrors([]);
        setInfoMessages([]);

        if (!confirm('Czy na pewno chcesz przywrócić tego użytkownika?'))
            return;
        
        setIsLoading(true);

        try {
            await UsersService.recoverUser(id);

            setInfoMessages(['Przywrócono wybranego użytkownika.']);
            await refreshData();
        }
        catch (e) {
            if (e instanceof ApiError) {
                setApiErrors(e.getTranslations([
                    {
                        code: 'Users.OperationWouldBlockAccess',
                        msg: 'Nie można usunąć użytkownika, ponieważ jest on jedynym administratorem systemu'
                    }
                ]))

                return;
            }

            throw e;
        }
        finally {
            setIsLoading(false);
        }
    }
    
    async function handleBlock(id: number) {
        setApiErrors([]);
        setInfoMessages([]);

        if (!confirm('Czy na pewno chcesz zablokować tego użytkownika?'))
            return;
        
        setIsLoading(true);

        try {
            await UsersService.blockUser(id);

            setInfoMessages(['Zablokowano wybranego użytkownika.']);
            await refreshData();
        }
        catch (e) {
            if (e instanceof ApiError) {
                setApiErrors(e.getTranslations([
                    {
                        code: 'Users.OperationWouldBlockAccess',
                        msg: 'Nie można zablokować użytkownika, ponieważ jest on jedynym administratorem systemu'
                    }
                ]))

                return;
            }

            throw e;
        }
        finally {
            setIsLoading(false);
        }
    }
    
    async function handleUnnlock(id: number) {
        setApiErrors([]);
        setInfoMessages([]);

        if (!confirm('Czy na pewno chcesz odblokować tego użytkownika?'))
            return;
        
        setIsLoading(true);

        try {
            await UsersService.unblockUser(id);

            setInfoMessages(['Odblokowano wybranego użytkownika.']);
            await refreshData();
        }
        catch (e) {
            if (e instanceof ApiError) {
                setApiErrors(e.getTranslations([
                    {
                        code: 'Users.OperationWouldBlockAccess',
                        msg: 'Nie można zablokować użytkownika, ponieważ jest on jedynym administratorem systemu'
                    }
                ]))

                return;
            }

            throw e;
        }
        finally {
            setIsLoading(false);
        }
    }
    
    async function handleGrantAdmin(id: number) {
        setApiErrors([]);
        setInfoMessages([]);

        if (!confirm('Czy na pewno chcesz przyznać temu użytkownikowi prawa administratora?'))
            return;
        
        setIsLoading(true);

        try {
            await UsersService.grantAdminForUser(id);

            setInfoMessages(['Nadano prawa administratora wybranemu użytkownikowi.']);
            await refreshData();
        }
        catch (e) {
            if (e instanceof ApiError) {
                setApiErrors(e.getTranslations([
                    {
                        code: 'Users.OperationWouldBlockAccess',
                        msg: 'Nie można zablokować użytkownika, ponieważ jest on jedynym administratorem systemu'
                    }
                ]))

                return;
            }

            throw e;
        }
        finally {
            setIsLoading(false);
        }
    }
    
    async function handleRevokeAdmin(id: number) {
        setApiErrors([]);
        setInfoMessages([]);

        if (!confirm('Czy na pewno chcesz odebrać temu użytkownikowi prawa administratora?'))
            return;
        
        setIsLoading(true);

        try {
            await UsersService.revokeAdminForUser(id);

            setInfoMessages(['Odebrano prawa administratora wybranemu użytkownikowi.']);
            await refreshData();
        }
        catch (e) {
            if (e instanceof ApiError) {
                setApiErrors(e.getTranslations([
                    {
                        code: 'Users.OperationWouldBlockAccess',
                        msg: 'Nie można odebrać praw administratora temu użytkownikowi, ponieważ jest on jedynym administratorem systemu'
                    }
                ]))

                return;
            }

            throw e;
        }
        finally {
            setIsLoading(false);
        }
    }

    return (
        <>
            <BzRentalNavbar
                isUserLoggedIn={isUserLoggedIn}
                handleLogout={handleLogout}/>

            <div className="container">
                <h1 className="mb-4">Użytkownicy</h1>

                <ErrorMessagesList errors={apiErrors} className="mb-3"/>
                <InfoMessagesList messages={infoMessages} className="mb-3"/>

                <div className="row">
                    <div className="col-md-4">
                        <div className="card">
                            <div className="card-header">
                                <span className="fa fa-filter"></span>
                                <span className="ms-2">Filtry</span>
                            </div>
                            <div className="card-body">
                                <div className="card-text">
                                    <form id="search-form" onSubmit={handleSearchFormSubmit}>
                                        <div className="mb-2">
                                            <input
                                                type="text" name="filter" id="filter" className="form-control" placeholder="Szukaj..."
                                                value={usersFilter} onChange={(e) => setUsersFilter(e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <div className="form-check">
                                                <input
                                                    type="checkbox" name="includeDeleted" id="includeDeleted" className="form-check-input"
                                                    checked={usersIncludeDeleted} onChange={(e) => setUsersIncludeDeleted(e.target.checked)}
                                                />
                                                <label htmlFor="includeDeleted" className="form-check-label">Pokaż usuniętych</label>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                            <div className="card-footer d-flex justify-content-end">
                                <button className="btn btn-primary" type="submit" form="search-form">
                                    <span className="fa fa-search"></span>
                                    <span className="ms-2">Szukaj</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-8 loader-host">
                        <table className="table table-hover">
                            <thead>
                                <tr>
                                    <th>Użytkownik</th>
                                    <th>Login</th>
                                    <th>Data rejestracji</th>
                                    <th className="fit">Operacje</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.items.map(user => (
                                    <tr key={user.id}>
                                        <td className="align-middle">
                                            {`${user.firstName} ${user.lastName}`}
                                            {
                                                user.isAdmin &&
                                                <span className="badge bg-success ms-2">Admin</span>
                                            }
                                            {
                                                user.isBlocked &&
                                                <span className="badge bg-dark ms-2">Zablokowany</span>
                                            }
                                            {
                                                user.isDeleted &&
                                                <span className="badge bg-danger ms-2">Usunięty</span>
                                            }
                                        </td>
                                        <td className="align-middle">{user.username}</td>
                                        <td className="align-middle">{new Date(user.createdAt).toLocaleString('pl-PL')}</td>
                                        <td className="text-center align-middle">
                                            <div className="dropdown">
                                                <button className="btn btn-outline-secondary" data-bs-toggle="dropdown">
                                                    <i className="fa fa-bars"></i>
                                                </button>
                                                <ul className="dropdown-menu shadow">
                                                    {
                                                        !user.isDeleted &&
                                                        <li>
                                                            <a className="dropdown-item" style={{cursor: 'pointer'}} onClick={() => handleDelete(user.id)}>
                                                                <i className="fa fa-trash"></i>
                                                                <span className="ms-2">Usuń</span>
                                                            </a>
                                                        </li>
                                                    }
                                                    {
                                                        user.isDeleted &&
                                                        <li>
                                                            <a className="dropdown-item" style={{cursor: 'pointer'}} onClick={() => handleRecover(user.id)}>
                                                                <i className="fa fa-undo"></i>
                                                                <span className="ms-2">Przywróć</span>
                                                            </a>
                                                        </li>
                                                    }
                                                    {
                                                        !user.isBlocked && !user.isDeleted &&
                                                        <li>
                                                            <a className="dropdown-item" style={{cursor: 'pointer'}} onClick={() => handleBlock(user.id)}>
                                                                <i className="fa fa-lock"></i>
                                                                <span className="ms-2">Zablokuj</span>
                                                            </a>
                                                        </li>
                                                    }
                                                    {
                                                        user.isBlocked && !user.isDeleted &&
                                                        <li>
                                                            <a className="dropdown-item" style={{cursor: 'pointer'}} onClick={() => handleUnnlock(user.id)}>
                                                                <i className="fa fa-unlock"></i>
                                                                <span className="ms-2">Odblokuj</span>
                                                            </a>
                                                        </li>
                                                    }
                                                    {
                                                        !user.isAdmin && !user.isDeleted &&
                                                        <li>
                                                            <a className="dropdown-item" style={{cursor: 'pointer'}} onClick={() => handleGrantAdmin(user.id)}>
                                                                <i className="fa fa-address-card"></i>
                                                                <span className="ms-2">Nadaj prawa administratora</span>
                                                            </a>
                                                        </li>
                                                    }
                                                    {
                                                        user.isAdmin && !user.isDeleted &&
                                                        <li>
                                                            <a className="dropdown-item" style={{cursor: 'pointer'}} onClick={() => handleRevokeAdmin(user.id)}>
                                                                <i className="fa fa-undo"></i>
                                                                <span className="ms-2">Odbierz prawa administratora</span>
                                                            </a>
                                                        </li>
                                                    }
                                                </ul>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <Paginator
                            parameters={pagination}
                            list={users}
                            setParameters={setPagination}/>

                        {isLoading && <Loader/>}
                    </div>
                </div>
            </div>

            <BzRentalFooter/>
        </>
    )
}