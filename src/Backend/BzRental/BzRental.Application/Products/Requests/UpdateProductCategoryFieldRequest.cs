using BzRental.Shared.Contracts.Requests;
using System;
using System.Collections.Generic;
using System.Text;

namespace BzRental.Application.Products.Requests
{
    public sealed class UpdateProductCategoryFieldRequest : Request
    {
        public string Name { get; set; } = string.Empty;
        public double? MinValue { get; set; }
        public double? MaxValue { get; set; }
        public string? UnitName { get; set; }
    }
}
