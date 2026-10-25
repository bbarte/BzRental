import { ProductsCategoryFieldType } from "../../DAL/Products/Dtos/IProductCategoryFieldDto";
import type IAddProductCategoryFieldRequest from "../../DAL/Products/Requests/IAddProductCategoryFieldRequest"

export type ProductCategoryFieldElementForAddingCatProps = {
    field: IAddProductCategoryFieldRequest,
    handleChange: (field: IAddProductCategoryFieldRequest) => void,
    handleRemove: () => void
}

export function ProductCategoryFieldElementForAddingCat({field, handleChange, handleRemove}: ProductCategoryFieldElementForAddingCatProps) {
    function updateField(key: keyof IAddProductCategoryFieldRequest, value: any) {
        handleChange({
            ...field,
            [key]: value
        });
    }

    return (
        <>
            <div className="mb-2">
                <div className="row g-2">
                    <div className="col-6">
                        <input
                            type="text" name="name" id="name" maxLength={255} className="form-control"
                            value={field.name} onChange={(e) => updateField('name', e.target.value)}
                        />
                    </div>
                    <div className="col-3">
                        <select
                            name="type" id="type" className="form-select"
                            value={field.type} onChange={(e) => updateField('type', e.target.value)}
                        >
                            <option value="Text">Tekst</option>
                            <option value="Integer">Liczba całkowita</option>
                            <option value="Decimal">Ułamek</option>
                            <option value="Boolean">Logiczna</option>
                        </select>
                    </div>
                    <div className="col-2">
                        {
                            (field.type == ProductsCategoryFieldType.Integer ||
                            field.type == ProductsCategoryFieldType.Decimal) &&
                            <>
                                <input
                                    type="text" name="unit" id="unit" maxLength={50} className="form-control"
                                    value={field.unitName} onChange={(e) => updateField('unitName', e.target.value)}
                                />
                            </>
                        }
                    </div>
                    <div className="col-1 text-end">
                        <button className="btn btn-outline-danger" onClick={handleRemove}>
                            <i className="fa fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}