using BzRental.Domain.ProductsRenting.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Text;

namespace BzRental.Configuration.ProductsRenting
{
    public class ProductRentingConfiguration : IEntityTypeConfiguration<ProductRenting>
    {
        public void Configure(EntityTypeBuilder<ProductRenting> builder)
        {
            builder.Property(x => x.UserComments)
                .HasMaxLength(512);

            builder
                .HasOne(x => x.CreatedBy)
                .WithMany()
                .HasForeignKey(x => x.CreatedById)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
