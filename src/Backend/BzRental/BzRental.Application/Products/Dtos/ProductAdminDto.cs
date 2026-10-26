using BzRental.Shared.Contracts.Dtos;
using System;
using System.Collections.Generic;
using System.Text;

namespace BzRental.Application.Products.Dtos
{
    public sealed class ProductAdminDto : TimestampDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal HourPrice { get; set; } = 0m;

        public int CategoryId { get; set; }
        public string CategoryName { get; set; } = string.Empty;

        public bool IsDeleted { get; set; }
    }
}
