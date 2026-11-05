using BzRental.Domain.ProductsRenting.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Text;

namespace BzRental.Configuration.ProductsRenting
{
    public class ProductRentingStatusChangeConfiguration : IEntityTypeConfiguration<ProductRentingStatusChange>
    {
        public void Configure(EntityTypeBuilder<ProductRentingStatusChange> builder)
        {
            builder.Property(x => x.Comments)
                .HasMaxLength(512);

            builder
                .HasOne(x => x.Renting)
                .WithMany(x => x.StatusChanges)
                .HasForeignKey(x => x.RentingId)
                .OnDelete(DeleteBehavior.Restrict);

            builder
                .HasOne(x => x.CreatedBy)
                .WithMany()
                .HasForeignKey(x => x.CreatedById)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
