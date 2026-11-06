using BzRental.Application.Products.Dtos;
using BzRental.Shared.ResultPattern;
using System;
using System.Collections.Generic;
using System.Text;

namespace BzRental.Application.Products.Services
{
    public interface IProductsSelectingService
    {
        Task<Result<List<ProductCategoryDistinctFieldValuesDto>>> GetDistinctCategoryFieldValues(
            int categoryId);
    }
}
