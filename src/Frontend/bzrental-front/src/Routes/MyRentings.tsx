import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../DAL/Auth/Services/AuthService";
import { BzRentalNavbar } from "../Components/Layout/BzRentalNavbar";
import BzRentalFooter from "../Components/Layout/BzRentalFooter";
import type IPaginationParameters from "../DAL/Shared/Models/IPaginationParameters";
import type IPaginatedList from "../DAL/Shared/Models/IPaginatedList";
import type IUsersProductRentingDto from "../DAL/ProductsRenting/Dtos/IUsersProductRentingDto";
import ProductsRentingService from "../DAL/ProductsRenting/Services/ProductsRentingService";
import { InfoMessagesList } from "../Components/InfoMessagesList";
import { ErrorMessagesList } from "../Components/ErrorMessagesList";
import { GetRentingsStatusFilter } from "../DAL/ProductsRenting/Enums/GetRentingsStatusFilter";
import { Paginator } from "../Components/Paginator";
import Loader from "../Components/Loader";
import { ProductRentingStatusCell } from "../Components/ProductRentingStatusCell";
import { ProductRentingStatus } from "../DAL/ProductsRenting/Dtos/IProductRentingDto";
import { ApiError } from "../DAL/ApiAccess/ApiError";
import { Modal } from "../Components/Modal";
import { CancelRentingPlanDialog } from "../Components/Rentings/CancelRentingPlanDialog";
import type ICancelProductRentingRequest from "../DAL/ProductsRenting/Requests/ICancelProductRentingRequest";

export default function MyRentings() {
    const navigate = useNavigate();
    const [isUserLoggedIn, setIsUserLoggedIn] = useState<boolean>(AuthService.isLoggedIn);
    async function handleLogout(): Promise<void> { setIsUserLoggedIn(false); navigate('/'); }

    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [pagination, setPagination] = useState<IPaginationParameters>({
        pageNumber: 1,
        pageSize: 25
    });

    const [filtersStatus, setFiltersStatus] = useState<number | null>(null);
    const [filtersDateFrom, setFiltersDateFrom] = useState<string | null>(null);
    const [filtersDateTo, setFiltersDateTo] = useState<string | null>(null);
    const [filtersOrderBy, setFiltersOrderBy] = useState<string | null>(null);

    const [rentings, setRentings] = useState<IPaginatedList<IUsersProductRentingDto>>({
        pageNumber: 1,
        pageSize: 25,
        hasNextPage: false,
        items: []
    });

    useEffect(() => {
        refreshData();
    }, [pagination.pageNumber, filtersOrderBy, filtersStatus]);

    const [infoMessages, setInfoMessages] = useState<string[]>([]);
    const [errorMessages, setErrorMessages] = useState<string[]>([]);

    const [isCancelRentingModalOpen, setIsCancelRentingModalOpen] = useState<boolean>(false);
    const [cancelRentingModalOpenId, setCancelRentingModalOpenId] = useState<number>(0);

    async function refreshData() {
        setIsLoading(true);

        setRentings(await ProductsRentingService.getUsersRentings(
            pagination,
            filtersStatus,
            filtersDateFrom,
            filtersDateTo,
            filtersOrderBy
        ));

        setIsLoading(false);
    }

    async function handleSearchFormSubmit(e: any) {
        e.preventDefault();

        await refreshData();
    }

    async function handleCancelRentingPlan(id: number) {
        setCancelRentingModalOpenId(id);
        setIsCancelRentingModalOpen(true);
    }

    async function handleCancelRentingModalEvent(id: number, request: ICancelProductRentingRequest) {
        setIsLoading(true);

        try {
            await ProductsRentingService.cancelRentingPlan(id, request);
        }
        catch (e) {
            if (e instanceof ApiError) {
                setErrorMessages(e.getTranslations([
                    {
                        code: 'NotFound',
                        msg: 'Nie znaleziono najmu.'
                    },
                    {
                        code: 'ProductsRenting.CantCancelRentingPlan',
                        msg: 'Nie można anulować rezerwacji, ponieważ jej status na to nie pozwala!'
                    }
                ]));

                return;
            }

            throw e;
        }
        finally {
            setIsLoading(false);
        }

        setInfoMessages(['Anulowano rezerwację wybranego przedmiotu.']);
        await refreshData();
    }

    return (
        <>
            <BzRentalNavbar
                isUserLoggedIn={isUserLoggedIn}
                handleLogout={handleLogout}/>

            <div className="container">
                <h1 className="mb-4">Moje wypożyczenia</h1>

                <InfoMessagesList messages={infoMessages} className="mb-3"/>
                <ErrorMessagesList errors={errorMessages} className="mb-3"/>

                <div className="row">
                    <div className="col-md-3">
                        <div className="card shadow-sm">
                            <div className="card-header">
                                <i className="fa fa-filter"></i>
                                <span className="ms-2">Filtry</span>
                            </div>
                            <div className="card-body small">
                                <form id="search-form" onSubmit={handleSearchFormSubmit}>
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
                                </form>
                            </div>
                            <div className="card-footer d-flex flex-row align-items-center justify-content-end">
                                <button className="btn btn-primary" type="submit" form="search-form">
                                    <i className="fa fa-search"></i>
                                    <span className="ms-2">Szukaj</span>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-9">
                        <div className="d-flex flex-row align-items-center justify-content-between gap-3 mb-3">
                            <div className="flex-grow-1">
                                <ul className="nav nav-tabs">
                                    <li className="nav-item">
                                        <a href="#" className={`nav-link ${filtersStatus === null ? 'active text-black fw-semibold' : 'text-secondary'}`} onClick={() => setFiltersStatus(null)}>
                                            Wszystkie
                                        </a>
                                    </li>
                                    <li className="nav-item">
                                        <a href="#" className={`nav-link ${filtersStatus === GetRentingsStatusFilter.Planned ? 'active text-black fw-semibold' : 'text-secondary'}`} onClick={() => setFiltersStatus(GetRentingsStatusFilter.Planned)}>
                                            Zaplanowane
                                        </a>
                                    </li>
                                    <li className="nav-item">
                                        <a href="#" className={`nav-link ${filtersStatus === GetRentingsStatusFilter.InProgress ? 'active text-black fw-semibold' : 'text-secondary'}`} onClick={() => setFiltersStatus(GetRentingsStatusFilter.InProgress)}>
                                            W trakcie
                                        </a>
                                    </li>
                                    <li className="nav-item">
                                        <a href="#" className={`nav-link ${filtersStatus === GetRentingsStatusFilter.Closed ? 'active text-black fw-semibold' : 'text-secondary'}`} onClick={() => setFiltersStatus(GetRentingsStatusFilter.Closed)}>
                                            Zakończone
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
                                        <option value="asc(dailyPrice)">Cena za dzień.: rosnąco</option>
                                        <option value="desc(dailyPrice)">Cena za dzień.: malejąco</option>
                                        <option value="asc(currentRentValue)">Wartość: rosnąco</option>
                                        <option value="desc(currentRentValue)">Wartość: malejąco</option>

                                    </select>
                                </div>
                            </div>
                        </div>

                        <table className="table table-hover">
                            <thead>
                                <tr>
                                    <th className="fit align-middle">Status</th>
                                    <th className="align-middle">Przedmiot</th>
                                    <th className="fit align-middle">Okres</th>
                                    <th className="fit align-middle">Cena za dzień</th>
                                    <th className="align-middle">Komentarze</th>
                                    <th className="fit align-middle"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    rentings.items.map(rent => (
                                        <tr key={rent.id}>
                                            <td className="fit align-middle">
                                                <div className="small">
                                                    <ProductRentingStatusCell status={rent.status}/>
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
                                                {rent.dailyPrice} zł
                                            </td>
                                            <td className="align-middle">
                                                <div className="small">
                                                    {rent.userComments}
                                                </div>
                                            </td>
                                            <td className="fit align-middle">
                                                {
                                                    rent.status === ProductRentingStatus.Planned &&
                                                    <>
                                                        <button className="btn btn-outline-danger btn-sm" onClick={() => handleCancelRentingPlan(rent.id)}>
                                                            <i className="fa fa-times"></i>
                                                            <span className="ms-2">Anuluj rezerwację</span>
                                                        </button>
                                                    </>
                                                }
                                            </td>
                                        </tr>
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

            <Modal
                isOpened={isCancelRentingModalOpen}
                setIsOpened={setIsCancelRentingModalOpen}
                title="Anulowanie rezerwacji"
            >
                <CancelRentingPlanDialog
                    setIsOpened={setIsCancelRentingModalOpen}
                    rentingId={cancelRentingModalOpenId}
                    handleSave={handleCancelRentingModalEvent}/>
            </Modal>

            <BzRentalFooter/>
        </>
    );
}