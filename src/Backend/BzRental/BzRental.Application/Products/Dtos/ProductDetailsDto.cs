using BzRental.Shared.Contracts.Dtos;
using System;
using System.Collections.Generic;
using System.Text;

namespace BzRental.Application.Products.Dtos
{
    public sealed class ProductDetailsDto : TimestampDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal DailyPrice { get; set; } = 0m;

        public int CategoryId { get; set; }
        public string CategoryName { get; set; } = string.Empty;

        public List<string> ImageFileNames { get; set; } = new();

        public double Rating { get; set; } = 0d;
        public List<ProductFieldInfoDto> FieldValues { get; set; } = new();
    }
}
