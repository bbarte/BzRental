using BzRental.Shared.Contracts.Requests;
using System;
using System.Collections.Generic;
using System.Text;

namespace BzRental.Application.ProductsRenting.Requests
{
    public sealed class TurnDownProductRentingPlanRequest : Request
    {
        public string Comments { get; set; } = string.Empty;
    }
}
