using BzRental.Domain.Products.Models;
using BzRental.Domain.ProductsRenting.Enums;
using BzRental.Domain.Users.Models;
using BzRental.Shared.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace BzRental.Domain.ProductsRenting.Models
{
    public class ProductRenting : DomainModel
    {
        public Product Product { get; set; } = null!;
        public int ProductId { get; set; }

        public User CreatedBy { get; set; } = null!;
        public int CreatedById { get; set; }

        public ProductRentingStatus Status { get; set; } = ProductRentingStatus.Planned;
        public bool DoesReserveProduct { get; set; } = true;

        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }

        public decimal HourPrice { get; set; } = 0m;
        public List<ProductRentingStatusChange> StatusChanges { get; set; } = new();

        public string UserComments { get; set; } = string.Empty;
    }
}
