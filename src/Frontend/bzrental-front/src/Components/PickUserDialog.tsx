import { useEffect, useState } from "react";
import type IPaginationParameters from "../DAL/Shared/Models/IPaginationParameters";
import type IPaginatedList from "../DAL/Shared/Models/IPaginatedList";
import type IUserDto from "../DAL/Users/Dtos/IUserDto";
import Loader from "./Loader";
import UsersService from "../DAL/Users/Services/UsersService";
import { Paginator } from "./Paginator";

export type PickUserDialogProps = {
    setIsOpened: React.Dispatch<React.SetStateAction<boolean>>,
    handlePick: (userId: IUserDto) => any
};

export function PickUserDialog({setIsOpened, handlePick}: PickUserDialogProps) {
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [pagination, setPagination] = useState<IPaginationParameters>({
        pageNumber: 1,
        pageSize: 25
    });

    const [filter, setFilter] = useState<string>('');

    const [users, setUsers] = useState<IPaginatedList<IUserDto>>({
        pageNumber: 1,
        pageSize: 25,
        hasNextPage: false,
        items: []
    });

    useEffect(() => {
        refreshData();
    }, [pagination.pageNumber]);

    async function refreshData() {
        setIsLoading(true);

        setUsers(await UsersService.getUsers(
            pagination,
            filter,
            false
        ));

        setIsLoading(false);
    }

    async function handleSearchFormSubmit(e: any) {
        e.preventDefault();
        
        await refreshData();
    }

    function handlePickBtnClick(user: IUserDto) {
        handlePick(user);
        setIsOpened(false);
    }

    return (
        <>
            <div className="loader-host">
                <form onSubmit={handleSearchFormSubmit} className="mb-3">
                    <input type="search" name="filter" id="filter" className="form-control"
                        placeholder="Szukaj..." value={filter} onChange={(e) => setFilter(e.target.value)}/>
                </form>

                <table className="table table-hover">
                    <thead>
                        <tr>
                            <th>Użytkownik</th>
                            <th className="fit"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            users.items.map(user => (
                                <tr key={user.id}>
                                    <td className="align-middle">
                                        {user.firstName} {user.lastName}
                                    </td>
                                    <td className="fit text-center align-middle">
                                        <button className="btn btn-outline-primary" onClick={() => handlePickBtnClick(user)}>
                                            <i className="fa fa-chevron-circle-right"></i>
                                            <span className="ms-2">Wybierz</span>
                                        </button>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>

                <Paginator
                    parameters={pagination}
                    list={users}
                    setParameters={setPagination}/>

                {isLoading && <Loader/>}
            </div>
        </>
    );
}