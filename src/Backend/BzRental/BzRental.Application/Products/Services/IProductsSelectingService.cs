using BzRental.Application.Products.Dtos;
using BzRental.Application.Products.Requests;
using BzRental.Shared.Contracts.Dtos;
using BzRental.Shared.Pagination;
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

        Task<Result<PaginatedList<ProductDto>>> SearchProducts(
            PaginationParameters pagination,
            int categoryId,
            SearchProductsRequest request,
            string? orderBy = null);

        Task<Result<ProductDetailsDto>> GetProductById(int id);

        Task<Result<ProductAvailabilityDto>> CheckProductAvailibilty(
            int productId,
            DateTime startDate,
            DateTime endDate);
    }
}
