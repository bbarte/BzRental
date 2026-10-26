using BzRental.Domain.Products.Enums;
using BzRental.Shared.Contracts.Dtos;
using System;
using System.Collections.Generic;
using System.Text;

namespace BzRental.Application.Products.Dtos
{
    public class ProductFieldInfoDto : Dto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public ProductsCategoryFieldType Type { get; set; } = ProductsCategoryFieldType.Text;
        public string? UnitName { get; set; } = string.Empty;

        public string? TextValue { get; set; }
        public double? NumberValue { get; set; }
        public bool? BoolValue { get; set; } = false;
    }
}
