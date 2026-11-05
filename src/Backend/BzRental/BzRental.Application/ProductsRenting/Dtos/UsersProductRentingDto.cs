using BzRental.Domain.ProductsRenting.Enums;
using BzRental.Shared.Contracts.Dtos;
using System;
using System.Collections.Generic;
using System.Text;

namespace BzRental.Application.ProductsRenting.Dtos
{
    public sealed class UsersProductRentingDto : TimestampDto
    {
        public int Id { get; set; }

        public int ProductId { get; set; }
        public string ProductName { get; set; } = string.Empty;
        public string ProductCategoryName { get; set; } = string.Empty;

        public ProductRentingStatus Status { get; set; }

        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }

        public decimal DailyPrice { get; set; }
        public decimal CurrentRentValue { get; set; }

        public string UserComments { get; set; } = string.Empty;
    }
}
