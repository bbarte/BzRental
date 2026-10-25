import { useState } from "react";
import type IAddProductCategoryFieldRequest from "../../DAL/Products/Requests/IAddProductCategoryFieldRequest";
import { ProductsCategoryFieldType } from "../../DAL/Products/Dtos/IProductCategoryFieldDto";
import { ErrorMessagesList } from "../ErrorMessagesList";

export type AddProductCategoryFieldProps = {
    handleSave: (field: IAddProductCategoryFieldRequest) => void,
    setIsOpened: React.Dispatch<React.SetStateAction<boolean>>
};

export function AddProductCategoryField({handleSave, setIsOpened}: AddProductCategoryFieldProps) {
    const [apiErrors, setApiErrors] = useState<string[]>([]);

    const [request, setRequest] = useState<IAddProductCategoryFieldRequest>({
        name: '',
        type: ProductsCategoryFieldType.Text,
        unitName: ''
    });
    
    function handleBtnSaveClick(): void {
        setApiErrors([]);

        if (request.name.trim() === '') {
            setApiErrors(['Należy podać nazwę pola']);
            return;
        }

        handleSave(request);
        setIsOpened(false);
    }

    return (
        <>
            <div>
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
                                value={request.type} onChange={(e) => setRequest({
                                    ...request,
                                    type: e.target.value
                                })}
                            >
                                <option value="Text">Tekst</option>
                                <option value="Integer">Liczba całkowita</option>
                                <option value="Decimal">Ułamek</option>
                                <option value="Boolean">Logiczna</option>
                            </select>
                        </div>
                        <div className="col-3">
                            {
                                (request.type === ProductsCategoryFieldType.Integer ||
                                request.type === ProductsCategoryFieldType.Decimal) &&
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
            </div>
        </>
    )
}