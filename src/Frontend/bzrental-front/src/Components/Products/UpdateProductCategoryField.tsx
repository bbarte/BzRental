import { useEffect, useState } from "react"
import type IUpdateProductCategoryFieldRequest from "../../DAL/Products/Requests/IUpdateProductCategoryFieldRequest"
import { type IProductCategoryFieldDto, ProductsCategoryFieldType } from "../../DAL/Products/Dtos/IProductCategoryFieldDto";
import ProductsCategoriesAdminService from "../../DAL/Products/Services/ProductsCategoriesAdminService";
import { ApiError } from "../../DAL/ApiAccess/ApiError";
import { ErrorMessagesList } from "../ErrorMessagesList";
import Loader from "../Loader";

export type UpdateProductCategoryFieldProps = {
    fieldId: number,
    handleSave: (id: number, request: IUpdateProductCategoryFieldRequest) => any,
    setIsOpened: React.Dispatch<React.SetStateAction<boolean>>
}

export function UpdateProductCategoryField({fieldId, handleSave, setIsOpened}: UpdateProductCategoryFieldProps) {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [apiErrors, setApiErrors] = useState<string[]>([]);

    const [request, setRequest] = useState<IUpdateProductCategoryFieldRequest>({
        name: '',
        unitName: ''
    });

    const [field, setField] = useState<IProductCategoryFieldDto>({
        id: 0,
        name: '',
        type: ProductsCategoryFieldType.Text,
        unitName: '',
        isDeleted: false,
        createdAt: ''
    });

    useEffect(() => {
        loadField();
    }, [fieldId]);

    async function loadField() {
        setIsLoading(true);

        try {
            const field = await ProductsCategoriesAdminService.getCategoryFieldById(fieldId);

            setField(field);
            setRequest({
                name: field.name,
                unitName: field.unitName
            });
        }
        catch (e) {
            if (e instanceof ApiError) {
                if (e.hasCode('NotFound')) {
                    alert('Nie znaleziono żądanego pola!');

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

    function handleBtnSaveClick(): void {
        setApiErrors([]);

        if (request.name.trim() === '') {
            setApiErrors(['Należy podać nazwę pola']);
            return;
        }

        handleSave(fieldId, request);
        setIsOpened(false);
    }

    return (
        <>
            <div className="loader-host">
                <ErrorMessagesList errors={apiErrors} className="mb-3"/>

                <div className="mb-2">
                    <div className="row g-2">
                        <div className="col-6">
                            <input
                                type="text" name="name" id="name" className="form-control" maxLength={255} placeholder="Nazwa"
                                value={request.name} onChange={(e) => setRequest({
                                    ...request,
                                    name: e.target.value
                                })}/>
                        </div>
                        <div className="col-3">
                            <select
                                name="type" id="typ" className="form-select"
                                value={field.type} disabled={true}
                            >
                                <option value="Text">Tekst</option>
                                <option value="Integer">Liczba całkowita</option>
                                <option value="Decimal">Ułamek</option>
                                <option value="Boolean">Logiczna</option>
                            </select>
                        </div>
                        <div className="col-3">
                            {
                                (field.type === ProductsCategoryFieldType.Integer ||
                                field.type === ProductsCategoryFieldType.Decimal) &&
                                <>
                                    <input
                                        type="text" name="unit" id="unit" className="form-control" maxLength={50} placeholder="Jednostka"
                                        value={request.unitName} onChange={(e) => setRequest({
                                            ...request,
                                            unitName: e.target.value
                                        })}/>
                                </>
                            }
                        </div>
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
