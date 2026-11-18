using BzRental.Domain.ProductsRenting.Enums;
using BzRental.Shared.Contracts.Dtos;
using System;
using System.Collections.Generic;
using System.Text;

namespace BzRental.Application.Products.Dtos
{
    public sealed class IsProductRentedByUserDto : Dto
    {
        public bool IsIt { get; set; } = false;
        public int RentingId { get; set; }
        public ProductRentingStatus Status { get; set; }
    }
}
