using BzRental.Shared.Contracts.Dtos;
using System;
using System.Collections.Generic;
using System.Text;

namespace BzRental.Application.Products.Dtos
{
    public sealed class ProductAdminDetailsDto : TimestampDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal DailyPrice { get; set; } = 0m;

        public int CategoryId { get; set; }
        public List<string> ImageFileNames { get; set; } = new();

        public bool IsDeleted { get; set; } = false;
    }
}
