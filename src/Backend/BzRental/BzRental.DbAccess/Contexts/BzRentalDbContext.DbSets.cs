using BzRental.Domain.Products.Models;
using BzRental.Domain.Users.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;

namespace BzRental.DbAccess.Contexts
{
    public sealed partial class BzRentalDbContext : DbContext
    {
        public DbSet<User> Users { get; set; }

        public DbSet<ProductCategory> ProductCategories { get; set; }
        public DbSet<ProductsCategoryField> ProductsCategoryFields { get; set; }

        public DbSet<Product> Products { get; set; }
        public DbSet<ProductFieldValue> ProductFieldValues { get; set; }
        public DbSet<ProductImage> ProductImages { get; set; }
        public DbSet<ProductUserReview> ProductUserReviews { get; set; }
    }
}
