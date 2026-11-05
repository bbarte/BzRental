using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Text;

namespace BzRental.Application.ProductsRenting
{
    public static class ServiceExtensions
    {
        public static IServiceCollection AddProductsRentingServices(this IServiceCollection services)
        {
            return services;
        }
    }
}
