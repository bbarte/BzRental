using BzRental.Domain.Products.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Text;

namespace BzRental.Configuration.Products
{
    public class ProductFieldValueConfiguration : IEntityTypeConfiguration<ProductFieldValue>
    {
        public void Configure(EntityTypeBuilder<ProductFieldValue> builder)
        {
            builder.Property(x => x.TextValue)
                .HasMaxLength(512);

            builder
                .HasOne(x => x.Product)
                .WithMany(x => x.FieldValues)
                .HasForeignKey(x => x.ProductId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
