using BzRental.Domain.Products.Enums;
using BzRental.Shared.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace BzRental.Domain.Products.Models
{
    public class ProductsCategoryField : DomainModel, ISoftDeletable
    {
        public ProductCategory Category { get; set; } = null!;
        public int CategoryId { get; set; }

        public string Name { get; set; } = string.Empty;
        public ProductsCategoryFieldType Type { get; set; } = ProductsCategoryFieldType.Text;

        public double? MinValue { get; set; }
        public double? MaxValue { get; set; }

        public string? UnitName { get; set; }

        public bool IsDeleted { get; set; } = false;
    }
}
