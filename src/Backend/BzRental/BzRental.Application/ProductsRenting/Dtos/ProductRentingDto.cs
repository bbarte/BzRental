using BzRental.Domain.ProductsRenting.Enums;
using BzRental.Shared.Contracts.Dtos;
using System;
using System.Collections.Generic;
using System.Text;

namespace BzRental.Application.ProductsRenting.Dtos
{
    public sealed class ProductRentingDto : TimestampDto
    {
        public int Id { get; set; }

        public int ProductId { get; set; }
        public string ProductName { get; set; } = string.Empty;
        public string ProductCategoryName { get; set; } = string.Empty;

        public int CreatedById { get; set; }
        public string CreatedBy { get; set; } = string.Empty;

        public ProductRentingStatus Status { get; set; } = ProductRentingStatus.Planned;
        public bool DoesReserveProduct { get; set; } = false;

        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }

        public decimal DailyPrice { get; set; } = 0m;
        public decimal CurrentRentValue { get; set; } = 0m;

        public string UserComments { get; set; } = string.Empty;
    }
}
