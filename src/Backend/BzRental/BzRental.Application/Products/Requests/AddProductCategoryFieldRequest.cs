using BzRental.Domain.Products.Enums;
using BzRental.Shared.Contracts.Requests;
using System;
using System.Collections.Generic;
using System.Text;

namespace BzRental.Application.Products.Requests
{
    public sealed class AddProductCategoryFieldRequest : Request
    {
        public string Name { get; set; } = string.Empty;
        public ProductsCategoryFieldType Type { get; set; } = ProductsCategoryFieldType.Text;
        public double? MinValue { get; set; }
        public double? MaxValue { get; set; }
        public string? UnitName { get; set; }
    }
}
