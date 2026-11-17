using BzRental.Application.Products.Dtos;
using BzRental.Application.Products.Errors;
using BzRental.Application.Products.Requests;
using BzRental.DbAccess.Contexts;
using BzRental.DbAccess.Extensions;
using BzRental.Domain.Products.Models;
using BzRental.Shared.Abstraction;
using BzRental.Shared.Contracts.Dtos;
using BzRental.Shared.Errors;
using BzRental.Shared.Extensions;
using BzRental.Shared.Pagination;
using BzRental.Shared.ResultPattern;
using FluentValidation;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;

namespace BzRental.Application.Products.Services
{
    public sealed class ProductUserReviewsService : IProductUserReviewsService
    {
        private readonly BzRentalDbContext _ctx;
        private readonly IUserProvider _userProvider;

        private readonly IValidator<AddUpdateProductReviewRequest> _addUpdateValidator;

        public ProductUserReviewsService(
            BzRentalDbContext ctx,
            IUserProvider userProvider,
            IValidator<AddUpdateProductReviewRequest> addUpdateValidator)
        {
            _ctx = ctx;
            _userProvider = userProvider;
            _addUpdateValidator = addUpdateValidator;
        }

        public async Task<Result<PaginatedList<ProductReviewDto>>> GetReviews(
            int productId,
            PaginationParameters pagination,
            string? orderBy = null)
        {
            var getUserResult = _userProvider.GetUser();
            if (getUserResult.IsFailure) return getUserResult.FailedCast<PaginatedList<ProductReviewDto>>();

            SharedUser loggedUser = getUserResult.Value;

            IQueryable<ProductUserReview> query = _ctx.ProductUserReviews;

            query = query.Where(x =>
                x.ProductId == productId &&
                x.CreatedById != loggedUser.Id);

            IQueryable<ProductReviewDto> dtoQuery = query
                .Select(x => new ProductReviewDto
                {
                    Id = x.Id,
                    CreatedBy = $"{x.CreatedBy.FirstName} {x.CreatedBy.LastName}",
                    CreatedById = x.CreatedById,
                    Rating = x.Rating,
                    Content = x.Content,
                    CreatedAt = x.CreatedAt,
                    ModifiedAt = x.ModifiedAt
                });

            if (!string.IsNullOrWhiteSpace(orderBy))
            {
                switch (orderBy)
                {
                    case "asc(rating)":
                        dtoQuery = dtoQuery
                            .OrderBy(x => x.Rating)
                            .ThenBy(x => x.Id);
                        break;
                    case "desc(rating)":
                        dtoQuery = dtoQuery
                            .OrderByDescending(x => x.Rating)
                            .ThenBy(x => x.Id);
                        break;
                    case "asc(createdAt)":
                        dtoQuery = dtoQuery
                            .OrderBy(x => x.CreatedAt)
                            .ThenBy(x => x.Id);
                        break;
                    case "desc(createdAt)":
                        dtoQuery = dtoQuery
                            .OrderByDescending(x => x.CreatedAt)
                            .ThenBy(x => x.Id);
                        break;
                }
            }
            else
            {
                dtoQuery = dtoQuery.OrderBy(x => x.Id);
            }

            return await dtoQuery.ToPaginatedListAsync(pagination);
        }

        public async Task<Result<ProductReviewDto>> GetUsersReview(int productId)
        {
            var getUserResult = _userProvider.GetUser();
            if (getUserResult.IsFailure) return getUserResult.FailedCast<ProductReviewDto>();

            SharedUser loggedUser = getUserResult.Value;

            ProductReviewDto? dto = await _ctx.ProductUserReviews
                .Where(x => x.ProductId == productId && x.CreatedById == loggedUser.Id)
                .Select(x => new ProductReviewDto
                {
                    Id = x.Id,
                    Rating = x.Rating,
                    Content = x.Content,
                    CreatedAt = x.CreatedAt,
                    ModifiedAt = x.ModifiedAt
                })
                .FirstOrDefaultAsync();

            if (dto == null)
                return SharedErrors.NotFound;

            return dto;
        }

        public async Task<Result<CreatedObjectDto<int>>> AddReview(
            int productId,
            AddUpdateProductReviewRequest request)
        {
            var valResult = _addUpdateValidator.ValidateToBzRentalResult(request);
            if (valResult.IsFailure) return valResult;

            var getUserResult = _userProvider.GetUser();
            if (getUserResult.IsFailure) return getUserResult.FailedCast<CreatedObjectDto<int>>();

            SharedUser loggedUser = getUserResult.Value;

            bool wasAlreadyReviewed = await _ctx.ProductUserReviews
                .Where(x => x.ProductId == productId && x.CreatedById == loggedUser.Id)
                .AnyAsync();

            if (wasAlreadyReviewed)
                return ProductErrors.AlreadyReviewed;

            ProductUserReview review = new ProductUserReview
            {
                ProductId = productId,
                CreatedById = loggedUser.Id,
                Content = request.Content,
                Rating = request.Rating
            };

            _ctx.ProductUserReviews.Add(review);
            await _ctx.SaveChangesAsync();

            await RecalculateProductRating(productId);

            return new CreatedObjectDto<int>(review.Id);
        }

        public async Task<Result> UpdateReview(int id, AddUpdateProductReviewRequest request)
        {
            var valResult = _addUpdateValidator.ValidateToBzRentalResult(request);
            if (valResult.IsFailure) return valResult;

            var getUserResult = _userProvider.GetUser();
            if (getUserResult.IsFailure) return getUserResult;

            SharedUser loggedUser = getUserResult.Value;

            ProductUserReview? review = await _ctx.ProductUserReviews
                .Where(x => x.Id == id && x.CreatedById == loggedUser.Id)
                .FirstOrDefaultAsync();

            if (review == null)
                return SharedErrors.NotFound;

            review.Rating = request.Rating;
            review.Content = request.Content;
            review.ModifiedAt = DateTime.Now;

            await _ctx.SaveChangesAsync();

            await RecalculateProductRating(review.ProductId);

            return Result.Success();
        }

        public async Task<Result> DeleteReview(int id)
        {
            var getUserResult = _userProvider.GetUser();
            if (getUserResult.IsFailure) return getUserResult;

            SharedUser loggedUser = getUserResult.Value;

            var reviewInfo = await _ctx.ProductUserReviews
                .Where(x => x.Id == id && x.CreatedById == loggedUser.Id)
                .Select(x => new
                {
                    x.ProductId
                })
                .FirstOrDefaultAsync();

            if (reviewInfo == null)
                return SharedErrors.NotFound;

            await _ctx.ProductUserReviews
                .Where(x => x.Id == id)
                .ExecuteDeleteAsync();

            await RecalculateProductRating(reviewInfo.ProductId);

            return Result.Success();
        }

        public async Task<Result> RecalculateProductRating(int id)
        {
            double avg = 0;

            if (await _ctx.ProductUserReviews.Where(x => x.ProductId == id).AnyAsync())
            {
                avg = await _ctx.ProductUserReviews
                    .Where(x => x.ProductId == id)
                    .AverageAsync(x => x.Rating);

                avg = Math.Round(avg, 1);
            }

            await _ctx.Products
                .Where(x => x.Id == id)
                .ExecuteUpdateAsync(setters => setters
                    .SetProperty(x => x.Rating, avg));

            return Result.Success();
        }
    }
}
