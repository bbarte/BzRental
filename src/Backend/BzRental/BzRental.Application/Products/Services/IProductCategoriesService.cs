using BzRental.Application.Products.Requests;
using BzRental.Shared.Contracts.Dtos;
using BzRental.Shared.ResultPattern;
using System;
using System.Collections.Generic;
using System.Text;

namespace BzRental.Application.Products.Services
{
    public interface IProductCategoriesService
    {
        Task<Result<CreatedObjectDto<int>>> AddProductCategory(AddProductCategoryRequest request);
        Task<Result<CreatedObjectDto<int>>> AddProductCategoryField(int productId, AddProductCategoryFieldRequest request);

        Task<Result> UpdateProductCategory(int id, UpdateProductCategoryRequest request);
        Task<Result> UpdateProductCategoryField(int id, UpdateProductCategoryFieldRequest request);

        Task<Result> DeleteProductCategory(int id);
        Task<Result> RecoverProductCategory(int id);

        Task<Result> DeleteProductCategoryField(int id);
        Task<Result> RecoverProductCategoryField(int id);
    }
}
