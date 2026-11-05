using BzRental.Shared.Contracts.Dtos;
using System;
using System.Collections.Generic;
using System.Text;

namespace BzRental.Application.ProductsRenting.Dtos
{
    public class CheckoutRentingSummaryDto : Dto
    {
        public int CreatedById { get; set; }
        public string CreatedBy { get; set; } = string.Empty;

        public int ProductId { get; set; }
        public string ProductName { get; set; } = string.Empty;
        public string ProductCategoryName { get; set; } = string.Empty;

        public DateTime PlannedStartDate { get; set; }
        public DateTime ActualStartDate { get; set; }

        public DateTime PlannedEndDate { get; set; }
        public DateTime ActualEndDate { get; set; }

        public decimal DailyPrice { get; set; } = 0m;
        public decimal TotalValue { get; set; } = 0m;
    }
}
