import { ProductRentingStatus } from "../DAL/ProductsRenting/Dtos/IProductRentingDto"

export type ProductRentingStatusCellProps = {
    status: string
}

export function ProductRentingStatusCell({status}: ProductRentingStatusCellProps) {
    return (
        <div className="">
            {
                status === ProductRentingStatus.Planned &&
                <span>
                    <i className="fa fa-lock"></i>&nbsp;Zaplanowane
                </span>
            }
            {
                status === ProductRentingStatus.InProgress &&
                <span>
                    <i className="fa fa-clock-o"></i>&nbsp;W trakcie
                </span>
            }
            {
                status === ProductRentingStatus.Returned &&
                <span>
                    <i className="fa fa-check"></i>&nbsp;Zwrócono
                </span>
            }
            {
                status === ProductRentingStatus.Canceled &&
                <span>
                    <i className="fa fa-times"></i>&nbsp;Anulowano
                </span>
            }
            {
                status === ProductRentingStatus.UserDidNotShowUp &&
                <span>
                    <i className="fa fa-times"></i>&nbsp;Klient nie przyszedł
                </span>
            }
        </div>
    )
}