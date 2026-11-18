import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../../DAL/Auth/Services/AuthService";
import type IPaginatedList from "../../DAL/Shared/Models/IPaginatedList";
import type IPaginationParameters from "../../DAL/Shared/Models/IPaginationParameters";
import BzRentalFooter from "../../Components/Layout/BzRentalFooter";
import { BzRentalNavbar } from "../../Components/Layout/BzRentalNavbar";
import type IProductCategoryDto from "../../DAL/Products/Dtos/IProductCategoryDto";
import ProductsCategoriesAdminService from "../../DAL/Products/Services/ProductsCategoriesAdminService";
import { ErrorMessagesList } from "../../Components/ErrorMessagesList";
import { InfoMessagesList } from "../../Components/InfoMessagesList";
import { Paginator } from "../../Components/Paginator";
import Loader from "../../Components/Loader";
import { ApiError } from "../../DAL/ApiAccess/ApiError";
import { Modal } from "../../Components/Modal";
import { AddProductCategory } from "../../Components/Products/AddProductCategory";
import type IAddProductCategoryRequest from "../../DAL/Products/Requests/IAddProductCategoryRequest";
import { UpdateProductCategory } from "../../Components/Products/UpdateProductCategory";
import type IUpdateProductCategoryRequest from "../../DAL/Products/Requests/IUpdateProductCategoryRequest";

export default function ProductCategories() {
    const navigate = useNavigate();
    const [isUserLoggedIn, setIsUserLoggedIn] = useState<boolean>(AuthService.isLoggedIn);
    async function handleLogout(): Promise<void> { setIsUserLoggedIn(false); navigate('/'); }

    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [pagination, setPagination] = useState<IPaginationParameters>({
        pageNumber: 1,
        pageSize: 25
    });

    const [categories, setCategories] = useState<IPaginatedList<IProductCategoryDto>>({
        pageNumber: 1,
        pageSize: 25,
        hasNextPage: false,
        items: []
    });

    const [categoriesFilter, setCategoriesFilter] = useState<string>('');
    const [categoriesIncludeDeleted, setCategoriesIncludeDeleted] = useState<boolean>(false);

    const [apiErrors, setApiErrors] = useState<string[]>([]);
    const [infoMessages, setInfoMessages] = useState<string[]>([]);

    useEffect(() => {
        refreshData();
    }, [pagination.pageNumber]);

    const [isAddCatModalOpen, setIsAddCatModalOpen] = useState<boolean>(false);

    const [isEditCatModalOpen, setIsEditCatModalOpen] = useState<boolean>(false);
    const [editCatModalId, setEditCatModalId] = useState<number>(0);

    async function refreshData() {
        setIsLoading(true);

        setCategories(await ProductsCategoriesAdminService.getCategories(pagination, categoriesFilter, categoriesIncludeDeleted));

        setIsLoading(false);
    }

    function handleSearchFormSubmit(e: any): void {
        e.preventDefault();
        refreshData();
    }

    async function handleDelete(id: number) {
        setApiErrors([]);
        setInfoMessages([]);

        if (!confirm('Czy na pewno chcesz usunąć tę kategorię?'))
            return;
        
        setIsLoading(true);

        try {
            await ProductsCategoriesAdminService.deleteCategory(id);

            setInfoMessages(['Usunięto wybraną kategorię.']);
            await refreshData();
        }
        finally {
            setIsLoading(false);
        }
    }

    async function handleRecover(id: number) {
        setApiErrors([]);
        setInfoMessages([]);

        if (!confirm('Czy na pewno chcesz przywrócić tę kategorię?'))
            return;
        
        setIsLoading(true);

        try {
            await ProductsCategoriesAdminService.recoverCategory(id);

            setInfoMessages(['Przywrócono wybraną kategorię.']);
            await refreshData();
        }
        finally {
            setIsLoading(false);
        }
    }

    function handleBtnNewClick(): void {
        setIsAddCatModalOpen(true);
    }

    async function handleAddCatModalSaveEvent(request: IAddProductCategoryRequest) {
        setApiErrors([]);
        setInfoMessages([]);
        
        setIsLoading(true);
        
        try {
            await ProductsCategoriesAdminService.addCategory(request);

            setInfoMessages(['Dodano kategorię.']);
            await refreshData();
        }
        finally {
            setIsLoading(false);
        }
    }

    async function handleEditCatModalSaveEvent(id: number, request: IUpdateProductCategoryRequest) {
        setApiErrors([]);
        setInfoMessages([]);
        
        setIsLoading(true);
        
        try {
            await ProductsCategoriesAdminService.updateCategory(id, request);

            setInfoMessages(['Zaktualizowano kategorię.']);
            await refreshData();
        }
        finally {
            setIsLoading(false);
        }
    }

    function handleEdit(id: number): void {
        setEditCatModalId(id);
        setIsEditCatModalOpen(true);
    }

    return (
        <>
            <BzRentalNavbar
                isUserLoggedIn={isUserLoggedIn}
                handleLogout={handleLogout}/>

            <div className="container">
                <h1 className="mb-4">Kategorie przedmiotów</h1>

                <div className="btn-group mb-4">
                    <button className="btn btn-outline-success" onClick={handleBtnNewClick}>
                        <i className="fa fa-plus"></i>
                        <span className="ms-2">Nowa</span>
                    </button>
                </div>

                <ErrorMessagesList errors={apiErrors} className="mb-3"/>
                <InfoMessagesList messages={infoMessages} className="mb-3"/>

                <div className="row">
                    <div className="col-md-4">
                        <div className="card shadow-sm">
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
                                                value={categoriesFilter} onChange={(e) => setCategoriesFilter(e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <div className="form-check">
                                                <input
                                                    type="checkbox" name="includeDeleted" id="includeDeleted" className="form-check-input"
                                                    checked={categoriesIncludeDeleted} onChange={(e) => setCategoriesIncludeDeleted(e.target.checked)}
                                                />
                                                <label htmlFor="includeDeleted" className="form-check-label">Pokaż usunięte</label>
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
                                    <th>Nazwa</th>
                                    <th>Data utworzenia</th>
                                    <th className="fit"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {categories.items.map(cat => (
                                    <tr key={cat.id}>
                                        <td className="align-middle">
                                            {cat.name}

                                            {
                                                cat.isDeleted &&
                                                <span className="badge bg-danger ms-2">Usunięta</span>
                                            }
                                        </td>
                                        <td className="align-middle">
                                            {new Date(cat.createdAt).toLocaleString('pl-PL')}
                                        </td>
                                        <td className="text-center align-middle">
                                            {
                                                !cat.isDeleted &&
                                                <div className="btn-group">
                                                    <button className="btn btn-outline-secondary" onClick={() => handleEdit(cat.id)}>
                                                        <div className="d-flex align-items-center">
                                                            <i className="fa fa-pencil"></i>
                                                            <span className="ms-2">Edytuj</span>
                                                        </div>
                                                    </button>
                                                    <button className="btn btn-outline-secondary dropdown-toggle dropdown-toggle-split" data-bs-toggle="dropdown"/>

                                                    <ul className="dropdown-menu shadow">
                                                        <li>
                                                            <a style={{cursor: 'pointer'}} className="dropdown-item" onClick={() => handleDelete(cat.id)}>
                                                                <i className="fa fa-trash"></i>
                                                                <span className="ms-2">Usuń</span>
                                                            </a>
                                                        </li>
                                                    </ul>
                                                </div>
                                            }
                                            {
                                                cat.isDeleted &&
                                                <div className="btn btn-outline-secondary" onClick={() => handleRecover(cat.id)}>
                                                    <div className="d-flex align-items-center">
                                                        <i className="fa fa-undo"></i>
                                                        <span className="ms-2">Przywróć</span>
                                                    </div>
                                                </div>
                                            }
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <Paginator
                            parameters={pagination}
                            list={categories}
                            setParameters={setPagination}/>

                        {isLoading && <Loader/>}
                    </div>
                </div>
            </div>

            <Modal
                isOpened={isAddCatModalOpen}
                setIsOpened={setIsAddCatModalOpen}
                title="Dodawanie kategorii przedmiotów"
                className="modal-lg"
            >
                <AddProductCategory
                    setIsOpened={setIsAddCatModalOpen}
                    handleSave={handleAddCatModalSaveEvent}/>
            </Modal>

            <Modal
                isOpened={isEditCatModalOpen}
                setIsOpened={setIsEditCatModalOpen}
                title="Edycja kategorii przedmiotów"
                className="modal-xl"
            >
                <UpdateProductCategory
                    setIsOpened={setIsEditCatModalOpen}
                    handleSave={handleEditCatModalSaveEvent}
                    categoryId={editCatModalId}/>
            </Modal>

            <BzRentalFooter/>
        </>
    )
}