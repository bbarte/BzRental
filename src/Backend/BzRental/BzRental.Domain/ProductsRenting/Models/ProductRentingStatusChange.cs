using BzRental.Domain.ProductsRenting.Enums;
using BzRental.Domain.Users.Models;
using BzRental.Shared.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace BzRental.Domain.ProductsRenting.Models
{
    public class ProductRentingStatusChange : DomainModel
    {
        public ProductRenting Renting { get; set; } = null!;
        public int RentingId { get; set; }

        public ProductRentingStatus CurrentStatus { get; set; }

        public User CreatedBy { get; set; } = null!;
        public int CreatedById { get; set; }

        public string Comments { get; set; } = string.Empty;
    }
}
