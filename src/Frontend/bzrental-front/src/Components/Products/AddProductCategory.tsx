import { useState } from "react"
import { useForm } from "react-hook-form";
import type IAddProductCategoryFieldRequest from "../../DAL/Products/Requests/IAddProductCategoryFieldRequest";
import { ProductsCategoryFieldType } from "../../DAL/Products/Dtos/IProductCategoryFieldDto";
import { ProductCategoryFieldElementForAddingCat } from "./ProductCategoryFieldElementForAddingCat";
import { ErrorMessagesList } from "../ErrorMessagesList";
import Loader from "../Loader";
import type IAddProductCategoryRequest from "../../DAL/Products/Requests/IAddProductCategoryRequest";

export type AddProductCategoryProps = {
    handleSave: (request: IAddProductCategoryRequest) => any,
    setIsOpened: React.Dispatch<React.SetStateAction<boolean>>
}

export function AddProductCategory({handleSave, setIsOpened}: AddProductCategoryProps) {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [apiErrors, setApiErrors] = useState<string[]>([]);

    const [catName, setCatName] = useState<string>('');

    const [catFields, setCatFields] = useState<IAddProductCategoryFieldRequest[]>([]);

    function handleBtnAddFieldClick() {
        setCatFields((prev) => [
            ...prev,
            {
                name: '',
                type: ProductsCategoryFieldType.Text,
                unitName: ''
            }
        ])
    }

    function updateField(idx: number, updatedField: IAddProductCategoryFieldRequest): void {
        setCatFields((prev) =>
            prev.map((field, i) => i === idx ? updatedField : field)
        );
    }

    function removeField(idx: number): void {
        setCatFields((prev) =>
            prev.filter((field, i) => i !== idx)
        );
    }

    function handleBtnSaveClick(): void {
        setApiErrors([]);

        if (catName.trim() === '') {
            setApiErrors(['Należy podać nazwę']);
            return;
        }

        if (catFields.length > 0 &&
            catFields.some(x => x.name.trim() === ''))
        {
            setApiErrors(['Należy podać nazwy wszystkich pól']);
            return;
        }

        handleSave({
            name: catName,
            fields: catFields
        });

        setIsOpened(false);
    }

    return (
        <>
            <div className="loader-host">
                <ErrorMessagesList errors={apiErrors} className="mb-3"/>

                <div className="row mb-4">
                    <label htmlFor="name" className="col-sm-3 col-form-label">Nazwa:</label>
                    <div className="col-sm-9">
                        <input
                            type="text" name="name" id="name" className="form-control"
                            value={catName} onChange={(e) => setCatName(e.target.value)}/>
                    </div>
                </div>
                <div className="card">
                    <div className="card-header">
                        <span>Pola kategorii</span>
                    </div>
                    <div className="card-body">
                        {
                            catFields.length === 0 &&
                            <>
                                brak.
                            </>
                        }
                        {
                            catFields.length > 0 &&

                            <>
                                <div className="row g-2 mb-3 border-bottom pb-2 fw-semibold">
                                    <div className="col-6">Nazwa</div>
                                    <div className="col-3">Typ</div>
                                    <div className="col-2">Jednostka</div>
                                    <div className="col-1"></div>
                                </div>

                                {
                                    catFields.map((field, idx) => (
                                        <ProductCategoryFieldElementForAddingCat
                                            key={idx}
                                            field={field}
                                            handleChange={(x) => updateField(idx, x)}
                                            handleRemove={() => removeField(idx)}/>
                                    ))
                                }
                            </>
                        }
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
        </>
    )
}