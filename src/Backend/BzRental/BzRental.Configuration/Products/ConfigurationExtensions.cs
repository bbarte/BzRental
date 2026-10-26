using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;

namespace BzRental.Configuration.Products
{
    public static class ConfigurationExtensions
    {
        public static ModelBuilder ConfigureProducts(this ModelBuilder builder)
        {
            builder.ApplyConfiguration(new ProductCategoryConfiguration());
            builder.ApplyConfiguration(new ProductCategoryFieldConfiguration());
            
            builder.ApplyConfiguration(new ProductConfiguration());
            builder.ApplyConfiguration(new ProductFieldValueConfiguration());
            builder.ApplyConfiguration(new ProductImageConfiguration());
            builder.ApplyConfiguration(new ProductUserReviewConfiguration());

            return builder;
        }
    }
}
