using BzRental.Application.Products.Dtos;
using BzRental.Application.Products.Requests;
using BzRental.Shared.Contracts.Dtos;
using BzRental.Shared.ResultPattern;
using System;
using System.Collections.Generic;
using System.Text;

namespace BzRental.Application.Products.Services
{
    public interface IProductsManagementService
    {
        Task<Result<List<ProductFieldInfoDto>>> GetFieldsInfoForCategory(int id);
        Task<Result<List<ProductFieldInfoDto>>> GetFieldsInfoForProductById(int id);

        Task<Result<CreatedObjectDto<int>>> AddProduct(AddProductRequest request);
        Task<Result> UpdateProduct(int id, UpdateProductRequest request);

        Task<Result> DeleteProduct(int id);
        Task<Result> RecoverProduct(int id);
    }
}
