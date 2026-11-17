import { useNavigate } from "react-router-dom";
import { BzRentalNavbar } from "../../Components/Layout/BzRentalNavbar";
import { Fragment, useEffect, useState } from "react";
import AuthService from "../../DAL/Auth/Services/AuthService";
import BzRentalFooter from "../../Components/Layout/BzRentalFooter";
import Loader from "../../Components/Loader";
import type IPaginationParameters from "../../DAL/Shared/Models/IPaginationParameters";
import type IPaginatedList from "../../DAL/Shared/Models/IPaginatedList";
import { ProductRentingStatus, type IProductRentingDto } from "../../DAL/ProductsRenting/Dtos/IProductRentingDto";
import ProductsRentingService from "../../DAL/ProductsRenting/Services/ProductsRentingService";
import { GetRentingsStatusFilter } from "../../DAL/ProductsRenting/Enums/GetRentingsStatusFilter";
import { Paginator } from "../../Components/Paginator";

export default function ManageProductRentings() {
    const navigate = useNavigate();
    const [isUserLoggedIn, setIsUserLoggedIn] = useState<boolean>(AuthService.isLoggedIn);
    async function handleLogout(): Promise<void> { setIsUserLoggedIn(false); navigate('/'); }

    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [pagination, setPagination] = useState<IPaginationParameters>({
        pageNumber: 1,
        pageSize: 25
    });

    const [filtersProductId, setFiltersProductId] = useState<number | null>(null);
    const [filtersCreatedById, setFiltersCreatedById] = useState<number | null>(null);
    const [filtersStatus, setFiltersStatus] = useState<number | null>(null);
    const [filtersDateFrom, setFiltersDateFrom] = useState<string | null>(null);
    const [filtersDateTo, setFiltersDateTo] = useState<string | null>(null);
    const [filtersOrderBy, setFiltersOrderBy] = useState<string | null>(null);

    const [rentings, setRentings] = useState<IPaginatedList<IProductRentingDto>>({
        pageNumber: 1,
        pageSize: 25,
        hasNextPage: false,
        items: []
    });

    const [idOfExpandedTr, setIdOfExpandedTr] = useState<number | undefined>(undefined);

    useEffect(() => {
        refreshData();
    }, [pagination.pageNumber, filtersOrderBy, filtersStatus])

    async function refreshData() {
        setIsLoading(true);

        setIdOfExpandedTr(undefined);

        setRentings(await ProductsRentingService.getRentings(
            pagination,
            filtersProductId,
            filtersCreatedById,
            filtersStatus,
            filtersDateFrom,
            filtersDateTo,
            filtersOrderBy
        ));

        setIsLoading(false);
    }

    return (
        <>
            <BzRentalNavbar
                isUserLoggedIn={isUserLoggedIn}
                handleLogout={handleLogout}/>

            <div className="container">
                <h1 className="mb-4">Zarządzanie wypożyczeniami</h1>

                <div className="row">
                    <div className="col-md-3">
                        <div className="card shadow-sm">
                            <div className="card-header">
                                <i className="fa fa-filter"></i>
                                <span className="ms-2">Filtry</span>
                            </div>
                            <div className="card-body small">
                                <form id="search-form">
                                    <div className="mb-2">
                                        Przedmiot:
                                    </div>
                                    <div className="mb-2">
                                        Użytkownik:
                                    </div>
                                    <div className="mb-2">
                                        Zakres dat:

                                        <div className="mt-2 d-flex flex-row gap-2 align-items-center">
                                            <div className="flex-grow-1">
                                                <input type="date" name="dateFrom" id="dateFrom" className="form-control form-control-sm"
                                                    value={filtersDateFrom ?? ''} onChange={(e) => setFiltersDateFrom(
                                                        e.target.value == '' ? null : e.target.value
                                                    )} placeholder="od"/>
                                            </div>
                                            <div className="flex-shrink-0">-</div>
                                            <div className="flex-grow-1">
                                                <input type="date" name="dateTo" id="dateTo" className="form-control form-control-sm"
                                                    value={filtersDateTo ?? ''} onChange={(e) => setFiltersDateTo(
                                                        e.target.value == '' ? null : e.target.value
                                                    )} placeholder="do"/>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <div className="card-footer d-flex flex-row justify-content-end">
                                <button className="btn btn-primary" type="submit" form="search-form">
                                    <i className="fa fa-search"></i>
                                    <span className="ms-2">Szukaj</span>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-9">
                        <div className="d-flex flex-row align-items-center justify-content-between gap-3 mb-3 bg-light pt-2 ps-2 pe-2">
                            <div className="flex-grow-1">
                                <ul className="nav nav-tabs">
                                    <li className="nav-item">
                                        <a href="#" className={`nav-link ${filtersStatus === null ? 'active' : ''}`} onClick={() => setFiltersStatus(null)}>
                                            <i className="fa fa-clone"></i>
                                            <span className="ms-2">Wszystkie</span>
                                        </a>
                                    </li>
                                    <li className="nav-item">
                                        <a href="#" className={`nav-link ${filtersStatus === GetRentingsStatusFilter.Planned ? 'active' : ''}`} onClick={() => setFiltersStatus(GetRentingsStatusFilter.Planned)}>
                                            <i className="fa fa-lock"></i>
                                            <span className="ms-2">Zaplanowane</span>
                                        </a>
                                    </li>
                                    <li className="nav-item">
                                        <a href="#" className={`nav-link ${filtersStatus === GetRentingsStatusFilter.InProgress ? 'active' : ''}`} onClick={() => setFiltersStatus(GetRentingsStatusFilter.InProgress)}>
                                            <i className="fa fa-clock-o"></i>
                                            <span className="ms-2">W trakcie</span>
                                        </a>
                                    </li>
                                    <li className="nav-item">
                                        <a href="#" className={`nav-link ${filtersStatus === GetRentingsStatusFilter.Closed ? 'active' : ''}`} onClick={() => setFiltersStatus(GetRentingsStatusFilter.Closed)}>
                                            <i className="fa fa-check"></i>
                                            <span className="ms-2">Zakończone</span>
                                        </a>
                                    </li>
                                </ul>
                            </div>

                            <div className="flex-shrink-0">
                                <div className="input-group">
                                    <div className="input-group-text text-center">
                                        <i className="fa fa-sort-amount-desc"></i>
                                    </div>
                                    <select name="orderBy" id="orderBy" className="form-select"
                                        value={filtersOrderBy ?? ''} onChange={(e) => setFiltersOrderBy(e.target.value)}>
                                        
                                        <option value="">(brak sortowania)</option>
                                        <option value="asc(createdAt)">Data utworzenia: rosnąco</option>
                                        <option value="desc(createdAt)">Data utworzenia: malejąco</option>
                                        <option value="asc(dailyPrice)">Cena za godz.: rosnąco</option>
                                        <option value="desc(dailyPrice)">Cena za godz.: malejąco</option>
                                        <option value="asc(currentRentValue)">Wartość: rosnąco</option>
                                        <option value="desc(currentRentValue)">Wartość: malejąco</option>

                                    </select>
                                </div>
                            </div>
                        </div>

                        <table className="table table-hover">
                            <thead>
                                <tr>
                                    <th className="fit"></th>
                                    <th className="fit">Status</th>
                                    <th>Przedmiot</th>
                                    <th className="fit">Okres</th>
                                    <th className="fit">Utworzono</th>
                                    <th className="fit">Wartość</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    rentings.items.map(rent => (
                                        <Fragment key={rent.id}>
                                            <tr style={{cursor: 'pointer'}} onClick={() => setIdOfExpandedTr(rent.id)}
                                                className={`${idOfExpandedTr === rent.id ? 'table-active' : ''}`}>
                                                <td className="fit align-middle text-center">
                                                    <div className="small">
                                                        {
                                                            idOfExpandedTr === rent.id &&
                                                            <i className="fa fa-chevron-down"></i>
                                                        }
                                                        {
                                                            idOfExpandedTr !== rent.id &&
                                                            <i className="fa fa-chevron-up text-secondary"></i>
                                                        }
                                                    </div>
                                                </td>
                                                <td className="fit align-middle">
                                                    <div className="small">
                                                        {
                                                            rent.status === ProductRentingStatus.Planned &&
                                                            <span>
                                                                <i className="fa fa-lock"></i>&nbsp;Zaplanowane
                                                            </span>
                                                        }
                                                        {
                                                            rent.status === ProductRentingStatus.InProgress &&
                                                            <span>
                                                                <i className="fa fa-clock-o"></i>&nbsp;W trakcie
                                                            </span>
                                                        }
                                                        {
                                                            rent.status === ProductRentingStatus.Returned &&
                                                            <span>
                                                                <i className="fa fa-check"></i>&nbsp;Zwrócono
                                                            </span>
                                                        }
                                                        {
                                                            rent.status === ProductRentingStatus.Canceled &&
                                                            <span>
                                                                <i className="fa fa-times"></i>&nbsp;Anulowano
                                                            </span>
                                                        }
                                                        {
                                                            rent.status === ProductRentingStatus.UserDidNotShowUp &&
                                                            <span>
                                                                <i className="fa fa-times"></i>&nbsp;Klient nie zgłosił się
                                                            </span>
                                                        }
                                                    </div>
                                                </td>
                                                <td className="align-middle">
                                                    <span className="me-2">{rent.productName}</span>
                                                    <span className="badge border border-primary text-primary">{rent.productCategoryName}</span>
                                                </td>
                                                <td className="fit align-middle">
                                                    <div className="small">
                                                        {new Date(rent.startDate).toLocaleDateString('pl-PL')} - {new Date(rent.endDate).toLocaleDateString('pl-PL')}
                                                    </div>
                                                </td>
                                                <td className="fit align-middle">
                                                    <div className="small">
                                                        {rent.createdBy}
                                                        <br />
                                                        {new Date(rent.createdAt).toLocaleDateString('pl-PL')}
                                                    </div>
                                                </td>
                                                <td className="fit align-middle">
                                                    <div className="small">
                                                        {rent.dailyPrice} zł/godz
                                                        <br />
                                                        łącznie: {rent.currentRentValue} zł
                                                    </div>
                                                </td>
                                            </tr>
                                            {
                                                idOfExpandedTr === rent.id &&
                                                <tr className="fade-in no-hover">
                                                    <td></td>
                                                    <td colSpan={5} className="slide-in bg-white">
                                                        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Doloribus, odit? Magnam vel ipsum vero ducimus cum quidem? At, voluptatum veritatis, obcaecati omnis iusto quod enim repellendus laudantium autem quibusdam incidunt!
                                                    </td>
                                                </tr>
                                            }
                                        </Fragment>
                                    ))
                                }
                            </tbody>
                        </table>

                        <Paginator
                            parameters={pagination}
                            list={rentings}
                            setParameters={setPagination}/>
                    </div>
                </div>
            </div>

            {isLoading && <Loader/>}

            <BzRentalFooter/>
        </>
    )
}