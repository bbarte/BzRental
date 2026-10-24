using BzRental.Domain.Products.Enums;
using BzRental.Shared.Contracts.Dtos;
using System;
using System.Collections.Generic;
using System.Text;

namespace BzRental.Application.Products.Dtos
{
    public sealed class ProductCategoryFieldDto : TimestampDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public ProductsCategoryFieldType Type { get; set; } = ProductsCategoryFieldType.Text;
        public double? MinValue { get; set; }
        public double? MaxValue { get; set; }
        public string? UnitName { get; set; } = string.Empty;
        public bool IsDeleted { get; set; } = false;
    }
}
