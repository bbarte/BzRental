using BzRental.Domain.Products.Enums;
using BzRental.Shared.Contracts.Dtos;
using System;
using System.Collections.Generic;
using System.Text;

namespace BzRental.Application.Products.Dtos
{
    public sealed class ProductCategoryDistinctFieldValuesDto : Dto
    {
        public int CategoryId { get; set; }
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public ProductsCategoryFieldType Type { get; set; } = ProductsCategoryFieldType.Text;
        public string? UnitName { get; set; } = string.Empty;
        public List<string> Items { get; set; } = new();
    }
}
