using BzRental.Shared.ResultPattern;
using System;
using System.Collections.Generic;
using System.Text;

namespace BzRental.Application.ProductsRenting.Errors
{
    public static class ProductsRentingErrors
    {
        public static readonly Error AlreadyReservedByUser = new Error(
            "ProductsRenting.AlreadyReservedByUser", "The requested product is already reserved by the logged user in the provided date frames.", FailureType.BadRequest);
        
        public static readonly Error NotAvailable = new Error(
            "ProductsRenting.NotAvailable", "The requested product is not available in the provided date frames.", FailureType.BadRequest);
        
        public static readonly Error CantCancelRentingPlan = new Error(
            "ProductsRenting.CantCancelRentingPlan", "Cannot cancel this renting plan.", FailureType.BadRequest);
        
        public static readonly Error CantConfirmHandoverStatus = new Error(
            "ProductsRenting.CantConfirmHandover.Status", "Cannot handover this product, because it's not marked as planned.", FailureType.BadRequest);
        
        public static readonly Error CantConfirmHandoverExpired = new Error(
            "ProductsRenting.CantConfirmHandover.Expired", "Cannot handover this product, because its date frames are in the past.", FailureType.BadRequest);
        
        public static readonly Error CantConfirmHandoverNotYet = new Error(
            "ProductsRenting.CantConfirmHandover.NotYet", "Cannot handover this product, because its planned date is still in the future.", FailureType.BadRequest);

        public static readonly Error CantTurnDownStatus = new Error(
            "ProductsRenting.CantTurnDown.Status", "Cannot turn down this renting plan, because it's not marked as planned.", FailureType.BadRequest);
        
        public static readonly Error CantTurnDownNotYet = new Error(
            "ProductsRenting.CantTurnDown.NotYet", "Cannot turn down this renting plan, because it's planned date is still in the future.", FailureType.BadRequest);
        
        public static readonly Error CantCheckoutStatus = new Error(
            "ProductsRenting.CantCheckout.Status", "Cannot check out this renting, because it's not marked as in progress.", FailureType.BadRequest);
    }
}
