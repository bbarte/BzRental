using BzRental.Shared.ResultPattern;
using System;
using System.Collections.Generic;
using System.Text;

namespace BzRental.Application.Products.Errors
{
    public static class ProductErrors
    {
        public static readonly Error AlreadyReviewed = new Error(
            "Products.AlreadyReviewed", "The requested product was already reviewed by the logged in user", FailureType.BadRequest);
    }
}
