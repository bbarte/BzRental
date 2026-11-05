using BzRental.Application.Products.Services;
using BzRental.Application.ProductsRenting.Requests;
using BzRental.Application.ProductsRenting.Services;
using BzRental.Application.ProductsRenting.Validators;
using FluentValidation;
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
            services.AddScoped<IValidator<PlanProductRentingRequest>, PlanProductRentingValidator>();
            services.AddScoped<IValidator<CancelProductRentingRequest>, CancelProductRentingValidator>();

            services.AddScoped<IValidator<ConfirmProductRentingPlanHandoverRequest>, ConfirmProductRentingPlanHandoverValidator>();
            services.AddScoped<IValidator<TurnDownProductRentingPlanRequest>, TurnDownProductRentingPlanValidator>();

            services.AddScoped<IProductsRentPlanningService, ProductsRentPlanningService>();
            services.AddScoped<IProductsManagementService, ProductsManagementService>();

            return services;
        }
    }
}
