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
import type IProductRentingStatusChangeDto from "../../DAL/ProductsRenting/Dtos/IProductRentingStatusChangeDto";
import { ProductRentingStatusCell } from "../../Components/ProductRentingStatusCell";
import { InfoMessagesList } from "../../Components/InfoMessagesList";
import { ErrorMessagesList } from "../../Components/ErrorMessagesList";
import { ApiError } from "../../DAL/ApiAccess/ApiError";
import type ICheckoutRentingSummaryDto from "../../DAL/ProductsRenting/Dtos/ICheckoutRentingSummaryDto";
import { Modal } from "../../Components/Modal";
import { CheckoutRentingSummaryDialog } from "../../Components/Rentings/CheckoutRentingSummaryDialog";
import { PickUserDialog } from "../../Components/PickUserDialog";
import type IUserDto from "../../DAL/Users/Dtos/IUserDto";
import type IProductAdminDto from "../../DAL/Products/Dtos/IProductAdminDto";
import { PickProductDialog } from "../../Components/PickProductDialog";

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

    const [filtersCreatedByObject, setFiltersCreatedByObject] = useState<IUserDto | undefined>(undefined);
    const [filtersProductObject, setFiltersProductObject] = useState<IProductAdminDto | undefined>(undefined);

    const [rentings, setRentings] = useState<IPaginatedList<IProductRentingDto>>({
        pageNumber: 1,
        pageSize: 25,
        hasNextPage: false,
        items: []
    });

    const [idOfExpandedTr, setIdOfExpandedTr] = useState<number | undefined>(undefined);
    const [expandedRentingStatusChanges, setExpandedRentingStatusChanges] = useState<IProductRentingStatusChangeDto[]>([]);

    const [expandedRentingErrorMessages, setExpandedRentingErrorMessages] = useState<string[]>([]);
    
    const [infoMessages, setInfoMessages] = useState<string[]>([]);

    const [expandedRentingOperationComments, setExpandedRentingOperationComments] = useState<string>('');

    const [isCheckoutSummaryModalOpen, setIsCheckoutSummaryModalOpen] = useState<boolean>(false);
    const [checkoutSummaryModalDto, setCheckoutSummaryModalDto] = useState<ICheckoutRentingSummaryDto>({
        createdById: 0, createdBy: '', productId: 0, productName: '',
        productCategoryName: '', plannedStartDate: '', actualStartDate: '', plannedEndDate: '', actualEndDate: '',
        dailyPrice: 0, totalValue: 0
    });

    const [isPickUserModalOpen, setIsPickUserModalOpen] = useState<boolean>(false);
    const [isPickProductModalOpen, setIsPickProductModalOpen] = useState<boolean>(false);

    useEffect(() => {
        refreshData();
    }, [pagination.pageNumber, filtersOrderBy, filtersStatus])

    useEffect(() => {
        setExpandedRentingErrorMessages([]);
        setExpandedRentingOperationComments('');

        refreshRentingStatusChanges();
    }, [idOfExpandedTr])

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

    async function refreshRentingStatusChanges() {
        if (!idOfExpandedTr)
            return;

        setIsLoading(true);

        setExpandedRentingStatusChanges(await ProductsRentingService.getRentingsStatusChanges(idOfExpandedTr));

        setIsLoading(false);
    }

    async function handleRentingConfirmHandover(id: number) {
        setIsLoading(true);

        setInfoMessages([]);
        setExpandedRentingErrorMessages([]);

        try {
            await ProductsRentingService.confirmRentingPlanHandover(id, {
                comments: expandedRentingOperationComments
            });
        }
        catch (e) {
            if (e instanceof ApiError) {
                setExpandedRentingErrorMessages(e.getTranslations([
                    {
                        code: 'NotFound',
                        msg: 'Nie znaleziono najmu'
                    },
                    {
                        code: 'ProductsRenting.CantConfirmHandover.Status',
                        msg: 'Nie można potwierdzić oddania przedmiotu, ponieważ jego status na to nie pozwala'
                    },
                    {
                        code: 'ProductsRenting.CantConfirmHandover.Expired',
                        msg: 'Nie można potwierdzić oddania przedmiotu, ponieważ jego okres wypożyczenia już minął'
                    },
                    {
                        code: 'ProductsRenting.CantConfirmHandover.NotYet',
                        msg: 'Nie można potwierdzić oddania przedmiotu, ponieważ jego okres wypożyczenia jeszcze nie nastąpił'
                    }
                ]));

                return;
            }

            throw e;
        }
        finally {
            setIsLoading(false);
        }

        await refreshData();
        setInfoMessages(['Potwiedzono oddanie wybranego przedmiotu klientowi.']);
    }

    async function handleRentingTurnDown(id: number) {
        setIsLoading(true);

        setInfoMessages([]);
        setExpandedRentingErrorMessages([]);

        try {
            await ProductsRentingService.turnDownRentingPlan(id, {
                comments: expandedRentingOperationComments
            });
        }
        catch (e) {
            if (e instanceof ApiError) {
                setExpandedRentingErrorMessages(e.getTranslations([
                    {
                        code: 'NotFound',
                        msg: 'Nie znaleziono najmu'
                    },
                    {
                        code: 'ProductsRenting.CantTurnDown.Status',
                        msg: 'Nie można zgłosić, że klient nie przyszedł, ponieważ status przedmiotu na to nie pozwala'
                    },
                    {
                        code: 'ProductsRenting.CantTurnDown.NotYet',
                        msg: 'Nie można zgłosić, że klient nie przyszedł, ponieważ okres wypożyczenia przedmiotu jeszcze nie nastąpił'
                    }
                ]));

                return;
            }

            throw e;
        }
        finally {
            setIsLoading(false);
        }

        await refreshData();
        setInfoMessages(['Zgłoszono, że klient nie przyszedł po przedmiot.']);
    }

    async function handleRentingCheckout(id: number) {
        setIsLoading(true);

        setInfoMessages([]);
        setExpandedRentingErrorMessages([]);

        let dto: ICheckoutRentingSummaryDto | undefined = undefined;

        try {
            dto = await ProductsRentingService.checkoutRenting(id, {
                comments: expandedRentingOperationComments
            });
        }
        catch (e) {
            if (e instanceof ApiError) {
                setExpandedRentingErrorMessages(e.getTranslations([
                    {
                        code: 'NotFound',
                        msg: 'Nie znaleziono najmu'
                    },
                    {
                        code: 'ProductsRenting.CantCheckout.Status',
                        msg: 'Nie można potwierdzić zwrotu, ponieważ status przedmiotu na to nie pozwala'
                    }
                ]));

                return;
            }

            throw e;
        }
        finally {
            setIsLoading(false);
        }

        await refreshData();
        setInfoMessages(['Przyjęto zwrot wybranego przedmiotu.']);
        setCheckoutSummaryModalDto(dto);
        setIsCheckoutSummaryModalOpen(true);
    }

    async function handleSearchFormSubmit(e: any) {
        e.preventDefault();

        await refreshData();
    }

    function handlePickUserModalEvent(user: IUserDto) {
        setFiltersCreatedById(user.id);
        setFiltersCreatedByObject(user);
    }

    function handleRemovePickedUser() {
        setFiltersCreatedById(null);
        setFiltersCreatedByObject(undefined);
    }

    function handlePickProductModalEvent(prod: IProductAdminDto) {
        setFiltersProductId(prod.id);
        setFiltersProductObject(prod);
    }

    function handleRemovePickedProduct() {
        setFiltersProductId(null);
        setFiltersProductObject(undefined);
    }

    const today = new Date().toLocaleDateString('en-CA');

    return (
        <>
            <BzRentalNavbar
                isUserLoggedIn={isUserLoggedIn}
                handleLogout={handleLogout}/>

            <div className="container">
                <h1 className="mb-4">Zarządzanie wypożyczeniami</h1>

                <InfoMessagesList messages={infoMessages} className="mb-3"/>

                <div className="row">
                    <div className="col-md-3">
                        <div className="card shadow-sm">
                            <div className="card-header">
                                <i className="fa fa-filter"></i>
                                <span className="ms-2">Filtry</span>
                            </div>
                            <div className="card-body small">
                                <form id="search-form" onSubmit={handleSearchFormSubmit}>
                                    <div className="mb-2">
                                        Przedmiot:

                                        <div className="mt-2">
                                            <div className="input-group input-group-sm">
                                                <input type="text" name="" id="" className="form-control" readOnly
                                                    value={!filtersProductObject? '(dowolny)' : `${filtersProductObject.name} (${filtersProductObject.categoryName})`}/>
                                                <button className="btn btn-outline-secondary"
                                                    onClick={() => {
                                                        setIsPickProductModalOpen(true);
                                                    }}>
                                                    Wybierz
                                                </button>
                                                <button className="btn btn-outline-secondary"
                                                    onClick={handleRemovePickedProduct}
                                                    disabled={filtersProductId === null}>
                                                    <i className="fa fa-times"></i>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mb-2">
                                        Użytkownik:

                                        <div className="mt-2">
                                            <div className="input-group input-group-sm">
                                                <input type="text" name="" id="" className="form-control" readOnly
                                                    value={!filtersCreatedByObject ? '(dowolny)' : `${filtersCreatedByObject.firstName} ${filtersCreatedByObject.lastName}`}/>
                                                <button className="btn btn-outline-secondary"
                                                    onClick={() => {
                                                        setIsPickUserModalOpen(true);
                                                    }}>
                                                    Wybierz
                                                </button>
                                                <button className="btn btn-outline-secondary"
                                                    onClick={handleRemovePickedUser}
                                                    disabled={filtersCreatedById === null}>
                                                    <i className="fa fa-times"></i>
                                                </button>
                                            </div>
                                        </div>
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
                                    <th className="fit align-middle"></th>
                                    <th className="fit align-middle">Status</th>
                                    <th className="align-middle">Przedmiot</th>
                                    <th className="fit align-middle">Okres</th>
                                    <th className="fit align-middle">Utworzono</th>
                                    <th className="fit align-middle">Wartość</th>
                                    <th className="fit text-center">Blokuje<br/>przedmiot</th>
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
                                                    <div className="small">
                                                        {rent.createdBy}
                                                        <br />
                                                        {new Date(rent.createdAt).toLocaleDateString('pl-PL')}
                                                    </div>
                                                </td>
                                                <td className="fit align-middle">
                                                    <div className="small">
                                                        {rent.dailyPrice} zł/dzień
                                                        <br />
                                                        łącznie, szacowane: {rent.currentRentValue} zł
                                                    </div>
                                                </td>
                                                <td className="fit align-middle text-center">
                                                    {
                                                        rent.doesReserveProduct === true ? <i className="fa fa-lock text-danger"></i> : <i className="fa fa-times text-secondary"></i>
                                                    }
                                                </td>
                                            </tr>
                                            {
                                                idOfExpandedTr === rent.id &&
                                                <tr className="fade-in no-hover">
                                                    <td></td>
                                                    <td colSpan={6} className="slide-in bg-white">
                                                        <div className="border-start border-4 ps-4">
                                                            <ErrorMessagesList errors={expandedRentingErrorMessages} className="small mb-2"/>

                                                            <div className="d-flex align-items-center justify-content-between flex-row gap-2">
                                                                <div className="small flex-grow-1">
                                                                    <div className="fw-semibold">Komentarz użytkownika dot. najmu:</div>
                                                                    <div>
                                                                        {
                                                                            rent.userComments.trim() === '' ? '(brak)' : <i>{rent.userComments}</i>
                                                                        }
                                                                    </div>
                                                                </div>
                                                                <div className="flex-shrink-0">
                                                                    <div className="btn-group btn-group-sm w-100">
                                                                        {
                                                                            rent.status === ProductRentingStatus.Planned &&
                                                                            <>
                                                                                <button className="btn btn-outline-success"
                                                                                    disabled={
                                                                                        today > rent.endDate.substring(0, 10) ||
                                                                                        today < rent.startDate.substring(0, 10)
                                                                                    } onClick={() => handleRentingConfirmHandover(rent.id)}>
                                                                                    <i className="fa fa-check"></i>
                                                                                    <span className="ms-2">Potwierdź oddanie klientowi</span>
                                                                                </button>
                                                                                <button className="btn btn-outline-danger"
                                                                                    disabled={
                                                                                        today < rent.startDate.substring(0, 10)
                                                                                    } onClick={() => handleRentingTurnDown(rent.id)}>
                                                                                    <i className="fa fa-times"></i>
                                                                                    <span className="ms-2">Klient nie przyszedł</span>
                                                                                </button>
                                                                            </>
                                                                        }
                                                                        {
                                                                            rent.status === ProductRentingStatus.InProgress &&
                                                                            <>
                                                                                <button className="btn btn-outline-primary"
                                                                                    onClick={() => handleRentingCheckout(rent.id)}>
                                                                                    <i className="fa fa-sign-out"></i>
                                                                                    <span className="ms-2">Potwierdź zwrot</span>
                                                                                </button>
                                                                            </>
                                                                        }
                                                                    </div>
                                                                    {
                                                                        rent.status === ProductRentingStatus.InProgress &&
                                                                        <textarea name="expandedRentingOperationComments" id="expandedRentingOperationComments" className="form-control form-control-sm mt-2"
                                                                            maxLength={512} placeholder="Komentarze do operacji..." value={expandedRentingOperationComments} onChange={(e) => setExpandedRentingOperationComments(e.target.value)}></textarea>
                                                                    }
                                                                    {
                                                                        (
                                                                            rent.status === ProductRentingStatus.Planned &&
                                                                            !(today > rent.endDate.substring(0, 10) ||
                                                                              today < rent.startDate.substring(0, 10))
                                                                        ) &&
                                                                        <textarea name="expandedRentingOperationComments" id="expandedRentingOperationComments" className="form-control form-control-sm mt-2"
                                                                            maxLength={512} placeholder="Komentarze do operacji..." value={expandedRentingOperationComments} onChange={(e) => setExpandedRentingOperationComments(e.target.value)}></textarea>
                                                                    }
                                                                </div>
                                                            </div>
                                                            <div className="card mt-2 small">
                                                                <div className="card-header py-1 px-2">
                                                                    Zmiany statusów
                                                                </div>
                                                                <div className="card-body p-2">
                                                                    <table className="table table-hover table-sm m-0">
                                                                        <thead>
                                                                            <tr>
                                                                                <th className="fit">Status</th>
                                                                                <th>Komentarze</th>
                                                                                <th className="fit">Wywołał</th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody>
                                                                            {
                                                                                expandedRentingStatusChanges.map(his => (
                                                                                    <tr key={his.id}>
                                                                                        <td className="fit align-middle">
                                                                                            <ProductRentingStatusCell status={his.currentStatus}/>
                                                                                        </td>
                                                                                        <td className="align-middle">
                                                                                            {his.comments}
                                                                                        </td>
                                                                                        <td className="fit align-middle">
                                                                                            {his.createdBy}, {new Date(his.createdAt).toLocaleString('pl-PL')}
                                                                                        </td>
                                                                                    </tr>
                                                                                ))
                                                                            }
                                                                        </tbody>
                                                                    </table>
                                                                </div>
                                                            </div>
                                                        </div>
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

            <Modal
                isOpened={isCheckoutSummaryModalOpen}
                setIsOpened={setIsCheckoutSummaryModalOpen}
                title="Podsumowanie wypożyczenia"
                className="modal-lg"
            >
                <CheckoutRentingSummaryDialog
                    setIsOpened={setIsCheckoutSummaryModalOpen}
                    dto={checkoutSummaryModalDto}/>
            </Modal>

            <Modal
                isOpened={isPickUserModalOpen}
                setIsOpened={setIsPickUserModalOpen}
                title="Wybór użytkownika"
            >
                <PickUserDialog
                    setIsOpened={setIsPickUserModalOpen}
                    handlePick={handlePickUserModalEvent}/>
            </Modal>

            <Modal
                isOpened={isPickProductModalOpen}
                setIsOpened={setIsPickProductModalOpen}
                title="Wybór przedmiotu"
                className="modal-lg"
            >
                <PickProductDialog
                    setIsOpened={setIsPickProductModalOpen}
                    handlePick={handlePickProductModalEvent}/>
            </Modal>

            <BzRentalFooter/>
        </>
    )
}