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
    public interface IProductUserReviewsService
    {
        Task<Result<PaginatedList<ProductReviewDto>>> GetReviews(
            int productId,
            PaginationParameters pagination,
            string? orderBy = null);

        Task<Result<CreatedObjectDto<int>>> AddReview(int productId, AddUpdateProductReviewRequest request);
        Task<Result> UpdateReview(int id, AddUpdateProductReviewRequest request);
        Task<Result> DeleteReview(int id);

        Task<Result> RecalculateProductRating(int id);
    }
}
