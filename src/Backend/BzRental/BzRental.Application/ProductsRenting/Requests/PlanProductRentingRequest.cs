using BzRental.Shared.Contracts.Requests;
using System;
using System.Collections.Generic;
using System.Text;

namespace BzRental.Application.ProductsRenting.Requests
{
    public sealed class PlanProductRentingRequest : Request
    {
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }

        public string UserComments { get; set; } = string.Empty;
    }
}
