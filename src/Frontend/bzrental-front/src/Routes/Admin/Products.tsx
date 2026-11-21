import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthService from "../../DAL/Auth/Services/AuthService";
import { BzRentalNavbar } from "../../Components/Layout/BzRentalNavbar";
import BzRentalFooter from "../../Components/Layout/BzRentalFooter";
import type IPaginatedList from "../../DAL/Shared/Models/IPaginatedList";
import type IPaginationParameters from "../../DAL/Shared/Models/IPaginationParameters";
import type IProductAdminDto from "../../DAL/Products/Dtos/IProductAdminDto";
import ProductsAdminService from "../../DAL/Products/Services/ProductsAdminService";
import { ErrorMessagesList } from "../../Components/ErrorMessagesList";
import { InfoMessagesList } from "../../Components/InfoMessagesList";
import type IProductCategoryMinimalDto from "../../DAL/Products/Dtos/IProductCategoryMinimalDto";
import ProductsCategoriesAdminService from "../../DAL/Products/Services/ProductsCategoriesAdminService";
import Loader from "../../Components/Loader";
import { Paginator } from "../../Components/Paginator";
import { ImageFromApi } from "../../Components/ImageFromApi";
import { Modal } from "../../Components/Modal";
import { AddProduct } from "../../Components/Products/AddProduct";
import type IAddProductRequest from "../../DAL/Products/Requests/IAddProductRequest";
import { UpdateProduct } from "../../Components/Products/UpdateProduct";
import type IUpdateProductRequest from "../../DAL/Products/Requests/IUpdateProductRequest";
import { ApiError } from "../../DAL/ApiAccess/ApiError";

export default function Products() {
    const navigate = useNavigate();
    const [isUserLoggedIn, setIsUserLoggedIn] = useState<boolean>(AuthService.isLoggedIn);
    async function handleLogout(): Promise<void> { setIsUserLoggedIn(false); navigate('/'); }

    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [pagination, setPagination] = useState<IPaginationParameters>({
        pageNumber: 1,
        pageSize: 25
    });

    const [products, setProducts] = useState<IPaginatedList<IProductAdminDto>>({
        pageNumber: 1,
        pageSize: 25,
        hasNextPage: false,
        items: []
    });

    const [productsFilter, setProductsFilter] = useState<string>('');
    const [productsIncludeDeleted, setProductsIncludeDeleted] = useState<boolean>(false);
    const [productsCategoryIdFilter, setProductsCategoryIdFilter] = useState<number>(0);
    const [productsOrderBy, setProductsOrderBy] = useState<string>('');

    const [apiErrors, setApiErrors] = useState<string[]>([]);
    const [infoMessages, setInfoMessages] = useState<string[]>([]);

    useEffect(() => {
        refreshData();
    }, [pagination.pageNumber, productsOrderBy, productsCategoryIdFilter])

    const [isAddProductModalOpen, setIsAddProductModalOpen] = useState<boolean>(false);

    const [isUpdateProductModalOpen, setIsUpdateProductModalOpen] = useState<boolean>(false);
    const [updateProductModalId, setUpdateProductModalId] = useState<number>(0);

    async function refreshData() {
        setIsLoading(true);

        setProducts(await ProductsAdminService.getProducts(
            pagination,
            productsFilter,
            productsCategoryIdFilter === 0 ? null : productsCategoryIdFilter,
            productsIncludeDeleted,
            productsOrderBy
        ));

        setIsLoading(false);
    }

    const [minimalCategories, setMinimalCategories] = useState<IProductCategoryMinimalDto[]>([]);

    useEffect(() => {
        refreshMinimalCategories();
    }, []);

    async function refreshMinimalCategories() {
        const cats = await ProductsCategoriesAdminService.getMinimalCategories();

        setMinimalCategories([
            {
                id: 0,
                name: '(wszystkie kategorie)'
            },
            ...cats
        ]);
    }

    function handleSearchFormSubmit(e: any): void {
        e.preventDefault();
        refreshData();
    }

    async function handleDelete(id: any) {
        setApiErrors([]);
        setInfoMessages([]);

        if (!confirm('Czy na pewno chcesz usunąć ten przedmiot?'))
            return;
        
        setIsLoading(true);

        try {
            await ProductsAdminService.deleteProduct(id);

            setInfoMessages(['Usunięto wybrany przedmiot.']);
            await refreshData();
        }
        catch (e) {
            if (e instanceof ApiError) {
                setApiErrors(e.getTranslations([
                    {
                        code: 'Products.CantDelete',
                        msg: 'Nie można usunąć przedmiotu, ponieważ jest on w chwili obecnej wynajmowany!'
                    }
                ]));

                return;
            }

            throw e;
        }
        finally {
            setIsLoading(false);
        }
    }

    async function handleRecover(id: any) {
        setApiErrors([]);
        setInfoMessages([]);

        if (!confirm('Czy na pewno chcesz przywrócić ten przedmiot?'))
            return;
        
        setIsLoading(true);

        try {
            await ProductsAdminService.recoverProduct(id);

            setInfoMessages(['Przywrócno wybrany przedmiot.']);
            await refreshData();
        }
        finally {
            setIsLoading(false);
        }
    }

    async function handleAddProductModalSaveEvent(request: IAddProductRequest, images: FileList | File[]) {
        setApiErrors([]);
        setInfoMessages([]);

        setIsLoading(true);

        try {
            const id = (await ProductsAdminService.addProduct(request)).id;
            await ProductsAdminService.uploadProductImages(id, images);

            setInfoMessages(['Dodano przedmiot.']);
            await refreshData();
        }
        finally {
            setIsLoading(false);
        }
    }

    function handleBtnNewClick() {
        setIsAddProductModalOpen(true);
    }

    function handleEdit(id: number) {
        setUpdateProductModalId(id);
        setIsUpdateProductModalOpen(true);
    }

    async function handleUpdateProductModalSaveEvent(id: number, request: IUpdateProductRequest) {
        setApiErrors([]);
        setInfoMessages([]);

        setIsLoading(true);

        try {
            await ProductsAdminService.updateProduct(id, request);

            setInfoMessages(['Zaktualizowano przedmiot.']);
            await refreshData();
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
                <h1 className="mb-4">Przedmioty</h1>

                <div className="btn-group mb-4">
                    <button className="btn btn-outline-success" onClick={handleBtnNewClick}>
                        <i className="fa fa-plus"></i>
                        <span className="ms-2">Nowy</span>
                    </button>
                </div>

                <ErrorMessagesList errors={apiErrors} className="mb-3"/>
                <InfoMessagesList messages={infoMessages} className="mb-3"/>

                <div className="row">
                    <div className="col-md-4">
                        <div className="card shadow-sm">
                            <div className="card-header">
                                <i className="fa fa-filter"></i>
                                <span className="ms-2">Filtry</span>
                            </div>
                            <div className="card-body">
                                <form id="search-form" onSubmit={handleSearchFormSubmit}>
                                    <div className="mb-2">
                                        <input
                                            type="text" name="filter" id="filter" className="form-control" placeholder="Szukaj..."
                                            value={productsFilter} onChange={(e) => setProductsFilter(e.target.value)}/>
                                    </div>
                                    <div className="mb-2">
                                        <div className="input-group">
                                            <div className="input-group-text text-center" style={{width: '45px'}}>
                                                <i className="fa fa-cubes"></i>
                                            </div>
                                            <select
                                                name="categoryId" id="categoryId" className="form-select"
                                                value={productsCategoryIdFilter} onChange={(e) => setProductsCategoryIdFilter(+e.target.value)}
                                            >
                                                {
                                                    minimalCategories.map(x => (
                                                        <option value={x.id} key={x.id}>{x.name}</option>
                                                    ))
                                                }
                                            </select>
                                            <div className="input-group-text">
                                                <Link to="/admin/product-categories">
                                                    <i className="fa fa-cog"></i>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mb-2">
                                        <div className="input-group">
                                            <div className="input-group-text text-center" style={{width: '45px'}}>
                                                <i className="fa fa-sort-amount-desc"></i>
                                            </div>
                                            <select
                                                name="orderBy" id="orderBy" className="form-select"
                                                value={productsOrderBy} onChange={(e) => setProductsOrderBy(e.target.value)}
                                            >
                                                <option value="">(brak sortowania)</option>
                                                <option value="asc(name)">Nazwa: rosnąco</option>
                                                <option value="desc(name)">Nazwa: malejąco</option>
                                                <option value="asc(dailyPrice)">Cena za dzień: rosnąco</option>
                                                <option value="desc(dailyPrice)">Cena za dzień: malejąco</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="form-check">
                                            <input
                                                type="checkbox" name="includeDeleted" id="includeDeleted" className="form-check-input"
                                                checked={productsIncludeDeleted} onChange={(e) => setProductsIncludeDeleted(e.target.checked)}/>
                                            <label htmlFor="includeDeleted" className="form-check-label">Pokaż usunięte</label>
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <div className="card-footer d-flex justify-content-end">
                                <button className="btn btn-primary" type="submit" form="search-form">
                                    <i className="fa fa-search"></i>
                                    <span className="ms-2">Szukaj</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-8 loader-host">
                        <div className="row mb-4 g-2">
                            {
                                products.items.length === 0 &&
                                <span>
                                    <div className="bg-warning-subtle border border-warning rounded shadow-sm p-4">
                                        Brak przedmiotów w podanym zakresie filtrów
                                    </div>
                                </span>
                            }
                            {
                                products.items.length > 0 &&
                                products.items.map(prod => (
                                    <div key={prod.id} className="col-lg-4 col-md-6">
                                        <div className="card shadow-sm h-100">
                                            <ImageFromApi fileName={prod.firstImageFileName} className="card-img-top" style={{height: '200px', objectFit: 'cover', overflowClipMargin: 'unset'}}/>
                                            <div className="card-body">
                                                <h5 className="card-title">
                                                    {prod.name}
                                                </h5>
                                                <div className="card-text">
                                                    <h6>{prod.dailyPrice} zł/dzień</h6>
                                                    <span className="badge border border-primary text-primary">{prod.categoryName}</span>
                                                    {
                                                        prod.isDeleted &&
                                                        <span className="badge bg-danger">usunięte</span>
                                                    }

                                                    <div className="mt-2">
                                                        {prod.description}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="card-footer">
                                                {
                                                    !prod.isDeleted &&
                                                    <div className="btn-group">
                                                        <button className="btn btn-outline-secondary" onClick={() => handleEdit(prod.id)}>
                                                            <div className="d-flex align-items-center">
                                                                <i className="fa fa-pencil"></i>
                                                                <span className="ms-2">Edytuj</span>
                                                            </div>
                                                        </button>
                                                        <button className="btn btn-outline-secondary dropdown-toggle dropdown-toggle-split" data-bs-toggle="dropdown"/>

                                                        <ul className="dropdown-menu shadow">
                                                            <li>
                                                                <a style={{cursor: 'pointer'}} className="dropdown-item" onClick={() => handleDelete(prod.id)}>
                                                                    <i className="fa fa-trash"></i>
                                                                    <span className="ms-2">Usuń</span>
                                                                </a>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                }
                                                {
                                                    prod.isDeleted &&
                                                    <div className="btn btn-outline-secondary" onClick={() => handleRecover(prod.id)}>
                                                        <div className="d-flex align-items-center">
                                                            <i className="fa fa-undo"></i>
                                                            <span className="ms-2">Przywróć</span>
                                                        </div>
                                                    </div>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>

                        <Paginator
                            parameters={pagination}
                            list={products}
                            setParameters={setPagination}/>
                        
                        {isLoading && <Loader/>}
                    </div>
                </div>
            </div>

            <Modal
                isOpened={isAddProductModalOpen}
                setIsOpened={setIsAddProductModalOpen}
                title="Dodawanie przedmiotu"
                className="modal-xl">

                <AddProduct
                    setIsOpened={setIsAddProductModalOpen}
                    handleSave={handleAddProductModalSaveEvent}/>
                
            </Modal>

            <Modal
                isOpened={isUpdateProductModalOpen}
                setIsOpened={setIsUpdateProductModalOpen}
                title="Edycja przedmiotu"
                className="modal-xl">

                <UpdateProduct
                    setIsOpened={setIsUpdateProductModalOpen}
                    productId={updateProductModalId}
                    handleSave={handleUpdateProductModalSaveEvent}/>

            </Modal>

            <BzRentalFooter/>
        </>
    );
}