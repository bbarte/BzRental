using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;

namespace BzRental.Configuration.ProductsRenting
{
    public static class ConfigurationExtensions
    {
        public static ModelBuilder ConfigureProductRenting(this ModelBuilder builder)
        {
            builder.ApplyConfiguration(new ProductRentingConfiguration());
            builder.ApplyConfiguration(new ProductRentingStatusChangeConfiguration());

            return builder;
        }
    }
}
