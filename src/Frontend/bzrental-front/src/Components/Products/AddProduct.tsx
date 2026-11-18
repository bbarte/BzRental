import { useEffect, useState } from "react"
import type IAddProductRequest from "../../DAL/Products/Requests/IAddProductRequest"
import { ErrorMessagesList } from "../ErrorMessagesList";
import Loader from "../Loader";
import type IProductCategoryMinimalDto from "../../DAL/Products/Dtos/IProductCategoryMinimalDto";
import ProductsCategoriesAdminService from "../../DAL/Products/Services/ProductsCategoriesAdminService";
import type IProductFieldInfoDto from "../../DAL/Products/Dtos/ProductFieldInfoDto";
import ProductsAdminService from "../../DAL/Products/Services/ProductsAdminService";
import { ProductsCategoryFieldType } from "../../DAL/Products/Dtos/IProductCategoryFieldDto";

export type AddProductProps = {
    handleSave: (request: IAddProductRequest, images: File[] | FileList) => any,
    setIsOpened: React.Dispatch<React.SetStateAction<boolean>>
}

export function AddProduct({handleSave, setIsOpened}: AddProductProps) {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [apiErrors, setApiErrors] = useState<string[]>([]);
    
    const [request, setRequest] = useState<IAddProductRequest>({
        name: '',
        description: '',
        dailyPrice: 20,
        categoryId: 0,
        fieldValues: []
    });

    const [files, setFiles] = useState<File[]>([]);

    const [minimalCategories, setMinimalCategories] = useState<IProductCategoryMinimalDto[]>([]);

    useEffect(() => {
        refreshMinimalCategories();
    }, []);

    async function refreshMinimalCategories() {
        setIsLoading(true);

        const cats = await ProductsCategoriesAdminService.getMinimalCategories();

        if (cats.length === 0) {
            setIsLoading(false);
            alert('Przed dodaniem produktu należy zdefiniować jego kategorie!');
            setIsOpened(false);
            return;
        }

        setMinimalCategories(cats);
        setRequest({
            ...request,
            categoryId: cats[0].id
        });

        setIsLoading(false);
    }

    const [fieldsInfo, setFieldsInfo] = useState<IProductFieldInfoDto[]>([]);
    
    useEffect(() => {
        refreshFieldsInfo();
    }, [request.categoryId]);

    async function refreshFieldsInfo() {
        setIsLoading(true);

        setFieldsInfo(await ProductsAdminService.getFieldsInfoForCategory(request.categoryId));
        
        setIsLoading(false);
    }

    function handleBtnSaveClick() {
        setApiErrors([]);

        if (request.name.trim() === '') {
            setApiErrors(['Należy podać nazwę']);
            return;
        }

        if (request.dailyPrice <= 0) {
            setApiErrors(['Cena za dzień nie może być ujemna ani zerowa']);
            return;
        }

        if (files.length === 0) {
            setApiErrors(['Należy dodać przynajmniej jedno zdjęcie przedmiotu!']);
            return;
        }

        handleSave(request, files);

        setIsOpened(false);
    }

    return (
        <>
            <div className="loader-host">
                <ErrorMessagesList errors={apiErrors} className={"mb-3"}/>

                <div className="mb-3">
                    <div className="row mb-2">
                        <label htmlFor="name" className="col-sm-2 col-form-label">Nazwa:</label>
                        <div className="col-sm-10">
                            <input
                                type="text" name="name" id="name" className="form-control" maxLength={512}
                                value={request.name} onChange={(e) => setRequest({
                                    ...request,
                                    name: e.target.value
                                })}/>
                        </div>
                    </div>
                    <div className="row mb-2">
                        <label htmlFor="description" className="col-sm-2 col-form-label">Opis:</label>
                        <div className="col-sm-10">
                            <textarea
                                name="description" id="description" className="form-control" maxLength={2048}
                                value={request.description} onChange={(e) => setRequest({
                                    ...request,
                                    description: e.target.value
                                })}/>
                        </div>
                    </div>
                    <div className="row mb-2">
                        <label htmlFor="hourPrice" className="col-sm-2 col-form-label">Cena za dzień:</label>
                        <div className="col-sm-10">
                            <div className="input-group">
                                <input
                                    type="number" name="hourPrice" id="hourPrice" className="form-control"
                                    step={0.01} value={request.dailyPrice} onChange={(e) => setRequest({
                                        ...request,
                                        dailyPrice: +e.target.value
                                    })}/>
                                <div className="input-group-text">zł</div>
                            </div>
                        </div>
                    </div>
                    <div className="row mb-2">
                        <label htmlFor="categoryId" className="col-sm-2 col-form-label">Kategoria:</label>
                        <div className="col-sm-10">
                            <select
                                name="categoryId" id="categoryId" className="form-select"
                                value={request.categoryId} onChange={(e) => setRequest({
                                    ...request,
                                    categoryId: +e.target.value
                                })}
                            >
                                {
                                    minimalCategories.map(x => (
                                        <option value={x.id} key={x.id}>{x.name}</option>
                                    ))
                                }
                            </select>
                        </div>
                    </div>
                    <div className="row mb-2">
                        <label htmlFor="files" className="col-sm-2 col-form-label">Zdjęcia:</label>
                        <div className="col-sm-10">
                            <input
                                type="file" name="files" id="files" className="form-control" multiple accept=".jpeg,.jpg,.png,.webp"
                                onChange={(e) => {
                                    const selectedFiles = e.target.files;

                                    if (selectedFiles) {
                                        setFiles(Array.from(selectedFiles));
                                    }
                                }}/>
                        </div>
                    </div>
                    <div className="row g-2 p-3">
                        {
                            files.map((file, idx) => (
                                <div className="col-4" key={idx}>
                                    <div className="card shadow-sm">
                                        <img src={URL.createObjectURL(file)} alt="" className="card-img-top"/>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </div>

                <div className="card">
                    <div className="card-header">
                        Pola kategorii
                    </div>
                    <div className="card-body">
                        {
                            fieldsInfo.length === 0 &&
                            <>
                                Wybrana kategoria nie posiada żadnych pól.
                            </>
                        }
                        {
                            fieldsInfo.length > 0 &&
                            fieldsInfo.map(fieldInfo => (
                                <div key={fieldInfo.id} className="row mb-2">
                                    <div className="col-2">
                                        <label className="form-label">{fieldInfo.name}</label>
                                    </div>
                                    <div className="col-10">
                                        <div className="input-group">
                                            {
                                                fieldInfo.type === ProductsCategoryFieldType.Text &&
                                                <input
                                                    type="text" className="form-control" maxLength={512}
                                                    value={
                                                        request.fieldValues.some(x => x.fieldId === fieldInfo.id)
                                                            ? request.fieldValues.find(x => x.fieldId === fieldInfo.id)?.textValue ?? ''
                                                            : ''
                                                    }
                                                    onChange={(e) => {
                                                        const val = request.fieldValues.find(x => x.fieldId === fieldInfo.id);

                                                        if (val !== undefined) {
                                                            setRequest({
                                                                ...request,
                                                                fieldValues: request.fieldValues.map(x =>
                                                                    x.fieldId === fieldInfo.id
                                                                        ? { ...x, textValue: e.target.value }
                                                                        : x
                                                                )
                                                            });
                                                        } else {
                                                            setRequest({
                                                                ...request,
                                                                fieldValues: [
                                                                    ...request.fieldValues,
                                                                    {
                                                                        fieldId: fieldInfo.id,
                                                                        textValue: e.target.value
                                                                    }
                                                                ]
                                                            });
                                                        }
                                                    }}/>
                                            }
                                            {
                                                (fieldInfo.type === ProductsCategoryFieldType.Integer || fieldInfo.type === ProductsCategoryFieldType.Decimal) &&
                                                <input
                                                    type="number" className="form-control" maxLength={512}
                                                    value={
                                                        request.fieldValues.some(x => x.fieldId === fieldInfo.id)
                                                            ? request.fieldValues.find(x => x.fieldId === fieldInfo.id)?.numberValue ?? ''
                                                            : ''
                                                    }
                                                    step={fieldInfo.type === ProductsCategoryFieldType.Integer ? 1 : 0.01}
                                                    onChange={(e) => {
                                                        const val = request.fieldValues.find(x => x.fieldId === fieldInfo.id);

                                                        if (val !== undefined) {
                                                            setRequest({
                                                                ...request,
                                                                fieldValues: request.fieldValues.map(x =>
                                                                    x.fieldId === fieldInfo.id
                                                                        ? { ...x, numberValue: +e.target.value }
                                                                        : x
                                                                )
                                                            });
                                                        } else {
                                                            setRequest({
                                                                ...request,
                                                                fieldValues: [
                                                                    ...request.fieldValues,
                                                                    {
                                                                        fieldId: fieldInfo.id,
                                                                        numberValue: +e.target.value
                                                                    }
                                                                ]
                                                            });
                                                        }
                                                    }}/>
                                            }
                                            {
                                                fieldInfo.type === ProductsCategoryFieldType.Boolean &&
                                                <div className="form-check">
                                                    <input
                                                        type="checkbox" className="form-check-input"
                                                        checked={
                                                            request.fieldValues.some(x => x.fieldId === fieldInfo.id)
                                                                ? request.fieldValues.find(x => x.fieldId === fieldInfo.id)?.boolValue ?? false
                                                                : false
                                                        }
                                                        onChange={(e) => {
                                                            const val = request.fieldValues.find(x => x.fieldId === fieldInfo.id);

                                                            if (val != undefined) {
                                                                setRequest({
                                                                    ...request,
                                                                    fieldValues: request.fieldValues.map(x =>
                                                                        x.fieldId === fieldInfo.id
                                                                            ? { ...x, boolValue: e.target.checked }
                                                                            : x
                                                                    )
                                                                });
                                                            } else {
                                                                setRequest({
                                                                    ...request,
                                                                    fieldValues: [
                                                                        ...request.fieldValues,
                                                                        {
                                                                            fieldId: fieldInfo.id,
                                                                            boolValue: e.target.checked
                                                                        }
                                                                    ]
                                                                })
                                                            }
                                                        }}/>
                                                </div>
                                            }

                                            {
                                                (
                                                    fieldInfo.unitName !== null &&
                                                    (fieldInfo.type === ProductsCategoryFieldType.Decimal || fieldInfo.type === ProductsCategoryFieldType.Integer) &&
                                                    fieldInfo.unitName?.trim() !== ''
                                                ) &&
                                                <div className="input-group-text">
                                                    {fieldInfo.unitName}
                                                </div>
                                            }
                                        </div>
                                    </div>
                                </div>
                            ))
                        }
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
        </>
    )
}