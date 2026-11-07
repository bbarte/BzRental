using BzRental.Domain.ProductsRenting.Models;
using BzRental.Shared.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace BzRental.Domain.Products.Models
{
    public class Product : DomainModel, ISoftDeletable
    {
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal DailyPrice { get; set; } = 0m;

        public ProductCategory Category { get; set; } = null!;
        public int CategoryId { get; set; }

        public List<ProductFieldValue> FieldValues { get; set; } = new();
        public List<ProductImage> Images { get; set; } = new();
        public List<ProductUserReview> UserReviews { get; set; } = new();
        public List<ProductRenting> Rentings { get; set; } = new();

        public double Rating { get; set; } = 0d;

        public bool IsDeleted { get; set; }
    }
}
