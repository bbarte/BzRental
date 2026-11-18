import type React from "react"
import type ICheckoutRentingSummaryDto from "../../DAL/ProductsRenting/Dtos/ICheckoutRentingSummaryDto"

export type CheckoutRentingSummaryDialogProps = {
    setIsOpened: React.Dispatch<React.SetStateAction<boolean>>,
    dto: ICheckoutRentingSummaryDto    
}

export function CheckoutRentingSummaryDialog({setIsOpened, dto}: CheckoutRentingSummaryDialogProps) {
    return (
        <div className="p-4">
            <h3 className="mb-4">Wypożyczenie</h3>

            <table className="mb-4">
                <tr>
                    <th>Przedmiot:&nbsp;&nbsp;</th>
                    <td>
                        {dto.productName}
                        <span className="badge border border-primary text-primary ms-2">
                            {dto.productCategoryName}
                        </span>
                    </td>
                </tr>
                <tr>
                    <th>Wypożyczający:&nbsp;&nbsp;</th>
                    <td>{dto.createdBy}</td>
                </tr>
                <tr>
                    <th>Cena za dzień:&nbsp;&nbsp;</th>
                    <td>
                        {dto.dailyPrice} zł
                    </td>
                </tr>
            </table>

            <table className="table table-bordered mb-4">
                <thead>
                    <tr>
                        <th></th>
                        <th>Planowana</th>
                        <th>Faktyczna</th>
                    </tr>
                    <tr>
                        <th>Data wypożyczenia</th>
                        <td>
                            {new Date(dto.plannedStartDate).toLocaleDateString('pl-PL')}
                        </td>
                        <td>
                            {new Date(dto.actualStartDate).toLocaleDateString('pl-PL')}
                        </td>
                    </tr>
                    <tr>
                        <th>Data oddania</th>
                        <td>
                            {new Date(dto.plannedEndDate).toLocaleDateString('pl-PL')}
                        </td>
                        <td>
                            {new Date(dto.actualEndDate).toLocaleDateString('pl-PL')}
                        </td>
                    </tr>
                </thead>
            </table>

            <hr />

            <div className="text-end fs-5">
                <b>łącznie do zapłaty:</b> {dto.dailyPrice} zł
            </div>
        </div>
    );
}