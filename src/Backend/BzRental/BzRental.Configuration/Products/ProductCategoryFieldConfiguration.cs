using BzRental.Domain.Products.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Text;

namespace BzRental.Configuration.Products
{
    public class ProductCategoryFieldConfiguration : IEntityTypeConfiguration<ProductsCategoryField>
    {
        public void Configure(EntityTypeBuilder<ProductsCategoryField> builder)
        {
            builder.Property(x => x.Name).HasMaxLength(255);
            builder.Property(x => x.UnitName).HasMaxLength(50);
        }
    }
}
