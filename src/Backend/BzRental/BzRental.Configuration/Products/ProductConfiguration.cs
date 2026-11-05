using BzRental.Domain.Products.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Text;

namespace BzRental.Configuration.Products
{
    public class ProductConfiguration : IEntityTypeConfiguration<Product>
    {
        public void Configure(EntityTypeBuilder<Product> builder)
        {
            builder.Property(x => x.Name)
                .HasMaxLength(512);

            builder.Property(x => x.Description)
                .HasMaxLength(2048);

            builder.HasIndex(x => x.Name);
            builder.HasIndex(x => x.HourPrice);
            builder.HasIndex(x => x.Rating);
        }
    }
}
