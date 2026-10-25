import { useEffect, useState } from "react";
import type IUpdateProductCategoryRequest from "../../DAL/Products/Requests/IUpdateProductCategoryRequest"
import type IPaginatedList from "../../DAL/Shared/Models/IPaginatedList";
import type IPaginationParameters from "../../DAL/Shared/Models/IPaginationParameters";
import { ProductsCategoryFieldType, type IProductCategoryFieldDto } from "../../DAL/Products/Dtos/IProductCategoryFieldDto";
import { ApiError } from "../../DAL/ApiAccess/ApiError";
import ProductsCategoriesAdminService from "../../DAL/Products/Services/ProductsCategoriesAdminService";
import Loader from "../Loader";
import { ErrorMessagesList } from "../ErrorMessagesList";
import { InfoMessagesList } from "../InfoMessagesList";
import { Paginator } from "../Paginator";
import { Modal } from "../Modal";
import { AddProductCategoryField } from "./AddProductCategoryField";
import type IAddProductCategoryFieldRequest from "../../DAL/Products/Requests/IAddProductCategoryFieldRequest";
import { UpdateProductCategoryField } from "./UpdateProductCategoryField";
import type IUpdateProductCategoryFieldRequest from "../../DAL/Products/Requests/IUpdateProductCategoryFieldRequest";

export type UpdateProductCategoryProps = {
    categoryId: number,
    handleSave: (id: number, request: IUpdateProductCategoryRequest) => any,
    setIsOpened: React.Dispatch<React.SetStateAction<boolean>>,
};

export function UpdateProductCategory({categoryId, handleSave, setIsOpened}: UpdateProductCategoryProps) {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [apiErrors, setApiErrors] = useState<string[]>([]);
    const [infoMessages, setInfoMessages] = useState<string[]>([]);

    const [catName, setCatName] = useState<string>('');
    
    const [catFieldsPagination, setCatFieldsPagination] = useState<IPaginationParameters>({
        pageNumber: 1,
        pageSize: 25
    });

    const [catFields, setCatFields] = useState<IPaginatedList<IProductCategoryFieldDto>>({
        pageNumber: 1,
        pageSize: 25,
        hasNextPage: false,
        items: []
    });

    const [catFieldsFilter, setCatFieldsFilter] = useState<string>('');
    const [catFieldsIncludeDeleted, setCatFieldsIncludeDeleted] = useState<boolean>(false);

    const [isAddCatFieldModalOpen, setIsAddCatFieldModalOpen] = useState<boolean>(false);

    const [isEditCatFieldModalOpen, setIsEditCatFieldModalOpen] = useState<boolean>(false);
    const [editCatFieldModalId, setEditCatFieldModalId] = useState<number>(0);

    useEffect(() => {
        loadCat();
    }, [categoryId]);

    useEffect(() => {
        refreshCatFields();
    }, [categoryId, catFieldsPagination.pageNumber]);

    async function loadCat() {
        setIsLoading(true);

        try {
            const cat = await ProductsCategoriesAdminService.getCategoryById(categoryId);
            setCatName(cat.name);
        }
        catch (e) {
            if (e instanceof ApiError) {
                if (e.hasCode('NotFound')) {
                    alert('Nie znaleziono żądanej kategorii!');

                    setIsOpened(false);
                    return;
                }

                return;
            }

            throw e;
        }
        finally {
            setIsLoading(false);
        }
    }

    async function refreshCatFields() {
        setIsLoading(true);

        setCatFields(await ProductsCategoriesAdminService.getCategoryFields(
            categoryId,
            catFieldsPagination,
            catFieldsFilter,
            catFieldsIncludeDeleted
        ));

        setIsLoading(false);
    }

    function handleSearchFieldsFormSubmit(e: any): void {
        e.preventDefault();
        refreshCatFields();
    }

    async function handleFieldDelete(id: number) {
        setApiErrors([]);
        setInfoMessages([]);

        if (!confirm('Czy na pewno chcesz usunąć to pole?'))
            return;

        setIsLoading(true);

        try {
            await ProductsCategoriesAdminService.deleteCategoryField(id);

            setInfoMessages(['Usunięto wybrane pole.']);
            await refreshCatFields();
        }
        finally {
            setIsLoading(false);
        }
    }

    async function handleFieldRecover(id: number) {
        setApiErrors([]);
        setInfoMessages([]);

        if (!confirm('Czy na pewno chcesz przywrócić to pole?'))
            return;

        setIsLoading(true);

        try {
            await ProductsCategoriesAdminService.recoverCategoryField(id);

            setInfoMessages(['Przywrócono wybrane pole.']);
            await refreshCatFields();
        }
        finally {
            setIsLoading(false);
        }
    }

    function handleBtnSaveClick(): void {
        setApiErrors([]);

        if (catName.trim() === '') {
            setApiErrors(['Należy podać nazwę']);
            return;
        }

        handleSave(categoryId, {
            name: catName
        });

        setIsOpened(false);
    }

    async function handleAddCatFieldModalSaveEvent(field: IAddProductCategoryFieldRequest) {
        setApiErrors([]);
        setInfoMessages([]);

        setIsLoading(true);

        try {
            await ProductsCategoriesAdminService.addCategoryField(categoryId, field);

            setInfoMessages(['Dodano pole.']);
            await refreshCatFields();
        }
        finally {
            setIsLoading(false);
        }
    }

    function handleBtnAddFieldClick(): void {
        setIsAddCatFieldModalOpen(true);
    }

    async function handleEditCatFieldModalSaveEvent(id: number, field: IUpdateProductCategoryFieldRequest) {
        setApiErrors([]);
        setInfoMessages([]);

        setIsLoading(true);

        try {
            await ProductsCategoriesAdminService.updateCategoryField(id, field);

            setInfoMessages(['Zaktualizowano pole.']);
            await refreshCatFields();
        }
        finally {
            setIsLoading(false);
        }
    }

    function handleFieldEdit(id: number) {
        setEditCatFieldModalId(id);
        setIsEditCatFieldModalOpen(true);
    }

    return (
        <>
            <div className="loader-host">
                <ErrorMessagesList errors={apiErrors} className="mb-3"/>
                <InfoMessagesList messages={infoMessages} className="mb-3"/>

                <div className="row mb-4">
                    <label htmlFor="name" className="col-sm-3 col-form-label">Nazwa:</label>
                    <div className="col-sm-9">
                        <input
                            type="text" name="name" id="name" className="form-control" maxLength={255}
                            value={catName} onChange={(e) => setCatName(e.target.value)}/>
                    </div>
                </div>
                <div className="card">
                    <div className="card-header">
                        <span>Pola kategorii</span>
                    </div>
                    <div className="card-body">
                        <div className="row">
                            <div className="col-md-4">
                                <div className="card">
                                    <div className="card-header">
                                        <div className="fa fa-filter"></div>
                                        <span className="ms-2">Filtry</span>
                                    </div>
                                    <div className="card-body">
                                        <div className="card-text">
                                            <form id="search-fields-form" onSubmit={handleSearchFieldsFormSubmit}>
                                                <div className="mb-2">
                                                    <input
                                                        type="text" name="filter" id="filter" className="form-control" placeholder="Szukaj..."
                                                        value={catFieldsFilter} onChange={(e) => setCatFieldsFilter(e.target.value)}/>
                                                </div>
                                                <div>
                                                    <div className="form-check">
                                                        <input
                                                            type="checkbox" name="includeDeleted2" id="includeDeleted2" className="form-check-input"
                                                            checked={catFieldsIncludeDeleted} onChange={(e) => setCatFieldsIncludeDeleted(e.target.checked)}/>
                                                        <label htmlFor="includeDeleted2" className="form-check-label">Pokaż usunięte</label>
                                                    </div>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                    <div className="card-footer d-flex justify-content-end">
                                        <button className="btn btn-primary" type="submit" form="search-fields-form">
                                            <i className="fa fa-search"></i>
                                            <span className="ms-2">Szukaj</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-8">
                                <table className="table table-hover">
                                    <thead>
                                        <tr>
                                            <th>Nazwa</th>
                                            <th>Typ</th>
                                            <th>Jednostka</th>
                                            <th>Data utworzenia</th>
                                            <th className="fit"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            catFields.items.map(field => (
                                                <tr key={field.id}>
                                                    <td className="align-middle">
                                                        {field.name}

                                                        {
                                                            field.isDeleted &&
                                                            <span className="badge bg-danger ms-2">Usunięte</span>
                                                        }
                                                    </td>
                                                    <td className="align-middle">
                                                        {field.type === ProductsCategoryFieldType.Text && 'Tekst'}
                                                        {field.type === ProductsCategoryFieldType.Integer && 'Liczba całkowita'}
                                                        {field.type === ProductsCategoryFieldType.Decimal && 'Ułamek'}
                                                        {field.type === ProductsCategoryFieldType.Boolean && 'Logiczna'}
                                                    </td>
                                                    <td className="align-middle">
                                                        {field.unitName}
                                                    </td>
                                                    <td className="align-middle">
                                                        {new Date(field.createdAt).toLocaleString('pl-PL')}
                                                    </td>
                                                    <td className="text-center-align-middle">
                                                        {
                                                            !field.isDeleted &&
                                                            <div className="btn-group">
                                                                <button className="btn btn-outline-secondary">
                                                                    <div className="d-flex align-items-center" onClick={() => handleFieldEdit(field.id)}>
                                                                        <i className="fa fa-pencil"></i>
                                                                        <span className="ms-2">Edytuj</span>
                                                                    </div>
                                                                </button>
                                                                <button className="btn btn-outline-secondary dropdown-toggle dropdown-toggle-split" data-bs-toggle="dropdown"/>

                                                                <ul className="dropdown-menu shadow">
                                                                    <li>
                                                                        <a style={{cursor: 'pointer'}} className="dropdown-item" onClick={() => handleFieldDelete(field.id)}>
                                                                            <i className="fa fa-trash"></i>
                                                                            <span className="ms-2">Usuń</span>
                                                                        </a>
                                                                    </li>
                                                                </ul>
                                                            </div>
                                                        }
                                                        {
                                                            field.isDeleted &&
                                                            <div className="btn btn-outline-secondary" onClick={() => handleFieldRecover(field.id)}>
                                                                <div className="d-flex align-items-center">
                                                                    <i className="fa fa-undo"></i>
                                                                    <span className="ms-2">Przywróć</span>
                                                                </div>
                                                            </div>
                                                        }
                                                    </td>
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                </table>

                                <Paginator
                                    parameters={catFieldsPagination}
                                    list={catFields}
                                    setParameters={setCatFieldsPagination}/>
                            </div>
                        </div>
                    </div>
                    <div className="card-footer">
                        <button className="btn btn-outline-success" onClick={handleBtnAddFieldClick}>
                            <i className="fa fa-plus"></i>
                            <span className="ms-2">Dodaj</span>
                        </button>
                    </div>
                </div>
                <div className="d-flex justify-content-end border-top pt-2 mt-4">
                    <button className="btn btn-success" onClick={handleBtnSaveClick}>
                        <i className="fa fa-save"></i>
                        <span className="ms-2">Zapisz</span>
                    </button>
                </div>

                {isLoading && <Loader/>}
            </div>

            <Modal
                isOpened={isAddCatFieldModalOpen}
                setIsOpened={setIsAddCatFieldModalOpen}
                title="Dodawanie pola kategorii"
                className="modal-lg"
            >
                <AddProductCategoryField
                    handleSave={handleAddCatFieldModalSaveEvent}
                    setIsOpened={setIsAddCatFieldModalOpen}/>
            </Modal>

            <Modal
                isOpened={isEditCatFieldModalOpen}
                setIsOpened={setIsEditCatFieldModalOpen}
                title="Edycja pola kategorii"
                className="modal-lg"
            >
                <UpdateProductCategoryField
                    handleSave={handleEditCatFieldModalSaveEvent}
                    setIsOpened={setIsEditCatFieldModalOpen}
                    fieldId={editCatFieldModalId}/>
            </Modal>
        </>
    )
}