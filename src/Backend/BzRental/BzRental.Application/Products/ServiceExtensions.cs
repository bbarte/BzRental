using BzRental.Application.Products.Requests;
using BzRental.Application.Products.Services;
using BzRental.Application.Products.Validators;
using FluentValidation;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Text;

namespace BzRental.Application.Products
{
    public static class ServiceExtensions
    {
        public static IServiceCollection AddProductServices(this IServiceCollection services)
        {
            services.AddScoped<IValidator<AddProductCategoryFieldRequest>, AddProductCategoryFieldValidator>();
            services.AddScoped<IValidator<AddProductCategoryRequest>, AddProductCategoryValidator>();
            
            services.AddScoped<IValidator<UpdateProductCategoryFieldRequest>, UpdateProductCategoryFieldValidator>();
            services.AddScoped<IValidator<UpdateProductCategoryRequest>, UpdateProductCategoryValidator>();

            services.AddScoped<IValidator<SetProductFieldValueRequest>, SetProductFieldValueValidator>();
            services.AddScoped<IValidator<AddProductRequest>, AddProductValidator>();
            services.AddScoped<IValidator<UpdateProductRequest>, UpdateProductValidator>();

            services.AddScoped<IValidator<AddUpdateProductReviewRequest>, AddUpdateProductReviewValidator>();

            services.AddScoped<IProductCategoriesService, ProductCategoriesService>();
            services.AddScoped<IProductsManagementService, ProductsManagementService>();
            services.AddScoped<IProductUserReviewsService, ProductUserReviewsService>();
            services.AddScoped<IProductsSelectingService, ProductsSelectingService>();

            return services;
        }
    }
}
