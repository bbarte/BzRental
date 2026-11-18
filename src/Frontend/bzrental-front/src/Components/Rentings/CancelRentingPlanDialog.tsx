import { useState } from "react";
import type ICancelProductRentingRequest from "../../DAL/ProductsRenting/Requests/ICancelProductRentingRequest"

export type CancelRentingPlanDialogProps = {
    rentingId: number,
    handleSave: (id: number, request: ICancelProductRentingRequest) => any,
    setIsOpened: React.Dispatch<React.SetStateAction<boolean>>
}

export function CancelRentingPlanDialog({rentingId, handleSave, setIsOpened}: CancelRentingPlanDialogProps) {
    const [request, setRequest] = useState<ICancelProductRentingRequest>({
        reason: ''
    });

    function handleBtnSaveClick() {
        handleSave(rentingId, request);
        setIsOpened(false);
    }

    return (
        <>
            <div>
                <p className="mb-2">
                    Podaj powód anulowania rezerwacji:
                </p>
                <textarea name="reason" id="reason" className="form-control" maxLength={512}
                    value={request.reason} onChange={(e) => setRequest({
                        ...request,
                        reason: e.target.value
                    })}></textarea>
            </div>

            <div className="d-flex justify-content-end border-top pt-2 mt-4">
                <button className="btn btn-danger" onClick={handleBtnSaveClick}
                    disabled={request.reason.trim() === ''}>
                    <i className="fa fa-times"></i>
                    <span className="ms-2">Anuluj rezerwację</span>
                </button>
            </div>
        </>
    );
}