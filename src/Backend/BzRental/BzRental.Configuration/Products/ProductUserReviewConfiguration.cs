using BzRental.Domain.Products.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Text;

namespace BzRental.Configuration.Products
{
    public class ProductUserReviewConfiguration : IEntityTypeConfiguration<ProductUserReview>
    {
        public void Configure(EntityTypeBuilder<ProductUserReview> builder)
        {
            builder.Property(x => x.Content)
                .HasMaxLength(1024);

            builder
                .HasOne(x => x.Product)
                .WithMany(x => x.UserReviews)
                .HasForeignKey(x => x.ProductId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
