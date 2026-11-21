import { useEffect, useState } from "react";
import type IUpdateProductRequest from "../../DAL/Products/Requests/IUpdateProductRequest";
import type IProductCategoryMinimalDto from "../../DAL/Products/Dtos/IProductCategoryMinimalDto";
import ProductsCategoriesAdminService from "../../DAL/Products/Services/ProductsCategoriesAdminService";
import type IProductFieldInfoDto from "../../DAL/Products/Dtos/ProductFieldInfoDto";
import { ApiError } from "../../DAL/ApiAccess/ApiError";
import ProductsAdminService from "../../DAL/Products/Services/ProductsAdminService";
import { ProductsCategoryFieldType } from "../../DAL/Products/Dtos/IProductCategoryFieldDto";
import { ErrorMessagesList } from "../ErrorMessagesList";
import Loader from "../Loader";
import type ISetProductFieldValueRequest from "../../DAL/Products/Requests/ISetProductFieldValueRequest";
import type IProductCategoryDistinctFieldValuesDto from "../../DAL/Products/Dtos/IProductCategoryDistinctFieldValuesDto";
import ProductsSelectingService from "../../DAL/Products/Services/ProductsSelectingService";

export type UpdateProductProps = {
    productId: number,
    handleSave: (id: number, request: IUpdateProductRequest) => any,
    setIsOpened: React.Dispatch<React.SetStateAction<boolean>>
};

export function UpdateProduct({productId, handleSave, setIsOpened}: UpdateProductProps) {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [apiErrors, setApiErrors] = useState<string[]>([]);

    const [request, setRequest] = useState<IUpdateProductRequest>({
       name: '',
       description: '',
       dailyPrice: 20,
       categoryId: 0,
       fieldValues: [],
       updateFieldValues: true 
    });

    const [minimalCategories, setMinimalCategories] = useState<IProductCategoryMinimalDto[]>([]);

    const [categoryDistinctValues, setCategoryDistinctValues] = useState<IProductCategoryDistinctFieldValuesDto[]>([]);

    useEffect(() => {
        refreshMinimalCategories();
    }, []);

    useEffect(() => {
        refreshDistinctCategoryValues();
    }, [request.categoryId]);

    async function refreshDistinctCategoryValues() {
        setCategoryDistinctValues(await ProductsSelectingService.getDistinctCategoryFieldValues(request.categoryId));
    }

    async function refreshMinimalCategories() {
        setIsLoading(true);
        
        const cats = await ProductsCategoriesAdminService.getMinimalCategories();

        if (cats.length === 0) {
            setIsLoading(false);
            alert('Przed edycją produktu należy zdefiniować jego kategorie!');
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
        loadProduct();
    }, [productId]);

    async function loadProduct() {
        setIsLoading(true);
        
        try {
            const product = await ProductsAdminService.getProductById(productId);

            let fieldValues: ISetProductFieldValueRequest[] = [];

            const productsFieldsInfo = await ProductsAdminService.getAllFieldsValuesForProductById(productId);

            for (const field of productsFieldsInfo) {
                fieldValues.push({
                    fieldId: field.id,
                    textValue: field.textValue,
                    numberValue: field.numberValue,
                    boolValue: field.boolValue
                });
            }

            setRequest({
                name: product.name,
                description: product.description,
                dailyPrice: product.dailyPrice,
                categoryId: product.categoryId,
                updateFieldValues: true,
                fieldValues: fieldValues
            });
        }
        catch (e) {
            if (e instanceof ApiError) {
                if (e.hasCode('NotFound')) {
                    alert('Nie znaleziono żądanego przedmiotu!');
                    setIsOpened(false);
                    return;
                }
            }

            throw e;
        }
        finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        refreshFieldsInfo();
    }, [request.categoryId])

    async function refreshFieldsInfo() {
        setIsLoading(true);

        setFieldsInfo(await ProductsAdminService.getFieldsInfoForCategory(request.categoryId));

        setIsLoading(false);
    }

    function handleBtnSaveClick(): void {
        setApiErrors([]);

        if (request.name.trim() === '') {
            setApiErrors(['Należy podać nazwę']);
            return;
        }

        if (request.dailyPrice <= 0) {
            setApiErrors(['Cena za dzień nie może być ujemna ani zerowa']);
            return;
        }

        handleSave(productId, request);

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
                                                    <>
                                                        <input
                                                            type="text" className="form-control" maxLength={512}
                                                            list={`field-${fieldInfo.id}-datalist`}
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

                                                        <datalist id={`field-${fieldInfo.id}-datalist`}>
                                                            {
                                                                categoryDistinctValues.find(x => x.id === fieldInfo.id)?.items
                                                                .map((item, idx) => (
                                                                    <option key={idx} value={item}/>
                                                                ))
                                                            }
                                                        </datalist>
                                                    </>
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