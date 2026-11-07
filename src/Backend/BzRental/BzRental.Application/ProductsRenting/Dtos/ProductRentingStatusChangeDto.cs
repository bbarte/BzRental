using BzRental.Domain.ProductsRenting.Enums;
using BzRental.Shared.Contracts.Dtos;
using System;
using System.Collections.Generic;
using System.Text;

namespace BzRental.Application.ProductsRenting.Dtos
{
    public sealed class ProductRentingStatusChangeDto : TimestampDto
    {
        public int Id { get; set; }
        public ProductRentingStatus CurrentStatus { get; set; } = ProductRentingStatus.Planned;

        public string CreatedBy { get; set; } = string.Empty;
        public int CreatedById { get; set; }

        public string Comments { get; set; } = string.Empty;
    }
}
