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
    }
}
