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

            return builder;
        }
    }
}
