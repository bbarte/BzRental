using BzRental.Shared.Contracts.Requests;
using System;
using System.Collections.Generic;
using System.Text;

namespace BzRental.Application.ProductsRenting.Requests
{
    public sealed class CancelProductRentingRequest : Request
    {
        public string Reason { get; set; } = string.Empty;
    }
}
