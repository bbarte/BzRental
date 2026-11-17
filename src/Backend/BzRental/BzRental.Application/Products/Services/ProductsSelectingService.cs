using BzRental.Application.Products.Dtos;
using BzRental.Application.Products.Requests;
using BzRental.DbAccess.Contexts;
using BzRental.DbAccess.Extensions;
using BzRental.Domain.Products.Enums;
using BzRental.Domain.Products.Models;
using BzRental.Domain.ProductsRenting.Enums;
using BzRental.Shared.Abstraction;
using BzRental.Shared.Contracts.Dtos;
using BzRental.Shared.Errors;
using BzRental.Shared.Extensions;
using BzRental.Shared.Pagination;
using BzRental.Shared.ResultPattern;
using FluentValidation;
using LinqKit;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;

namespace BzRental.Application.Products.Services
{
    public class ProductsSelectingService : IProductsSelectingService
    {
        private class TempDistinctFieldValue
        {
            public int FieldId { get; set; }
            public string Value { get; set; } = string.Empty;
        }

        private class TempFieldValue
        {
            public int ProductId { get; set; }
            public int FieldId { get; set; }

            public string TextValue { get; set; } = string.Empty;
            public double NumberValue { get; set; } = 0d;
            public bool BoolValue { get; set; }
        }

        private readonly BzRentalDbContext _ctx;
        private readonly IUserProvider _userProvider;
        private readonly IValidator<SearchProductsRequest> _searchValidator;

        public ProductsSelectingService(
            BzRentalDbContext ctx,
            IUserProvider userProvider,
            IValidator<SearchProductsRequest> searchValidator)
        {
            _ctx = ctx;
            _userProvider = userProvider;
            _searchValidator = searchValidator;
        }

        public async Task<Result<List<ProductCategoryDistinctFieldValuesDto>>> GetDistinctCategoryFieldValues(int categoryId)
        {
            List<ProductsCategoryField> fieldDefinitions = await _ctx.ProductsCategoryFields
                .Where(x => x.CategoryId == categoryId)
                .Select(x => new ProductsCategoryField
                {
                    Id = x.Id,
                    Name = x.Name,
                    Type = x.Type,
                    UnitName = x.UnitName
                })
                .ToListAsync();

            IQueryable<TempDistinctFieldValue>? combinedDistinctQuery = null;

            foreach (ProductsCategoryField fieldDef in fieldDefinitions)
            {
                IQueryable<TempDistinctFieldValue>? query = null;

                if (fieldDef.Type == ProductsCategoryFieldType.Text)
                {
                    query = _ctx.ProductFieldValues
                        .Where(x =>
                            x.FieldId == fieldDef.Id &&
                            x.Product.CategoryId == categoryId
                        )
                        .Select(x => new TempDistinctFieldValue
                        {
                            FieldId = x.FieldId,
                            Value = x.TextValue
                        });
                }
                else if (fieldDef.Type is ProductsCategoryFieldType.Integer or ProductsCategoryFieldType.Decimal)
                {
                    query = _ctx.ProductFieldValues
                        .Where(x =>
                            x.FieldId == fieldDef.Id &&
                            x.Product.CategoryId == categoryId
                        )
                        .Select(x => new TempDistinctFieldValue
                        {
                            FieldId = x.FieldId,
                            Value = x.NumberValue.ToString()
                        });
                }

                if (query != null)
                {
                    combinedDistinctQuery = combinedDistinctQuery == null
                        ? query
                        : combinedDistinctQuery.Union(query);
                }
            }

            List<TempDistinctFieldValue> values = combinedDistinctQuery != null
                ? await combinedDistinctQuery.ToListAsync()
                : [];

            List<ProductCategoryDistinctFieldValuesDto> result = new();

            foreach (ProductsCategoryField fieldDef in fieldDefinitions)
            {
                result.Add(new ProductCategoryDistinctFieldValuesDto
                {
                    CategoryId = categoryId,
                    Id = fieldDef.Id,
                    Name = fieldDef.Name,
                    Type = fieldDef.Type,
                    UnitName = fieldDef.UnitName,
                    Items = values.Where(x => x.FieldId == fieldDef.Id)
                        .Select(x => x.Value).ToList()
                });
            }

            return result;
        }

        public async Task<Result<PaginatedList<ProductDto>>> SearchProducts(
            PaginationParameters pagination,
            int categoryId,
            SearchProductsRequest request,
            string? orderBy = null)
        {
            var valResult = _searchValidator.ValidateToBzRentalResult(request);
            if (valResult.IsFailure) return valResult;

            IQueryable<Product> query = _ctx.Products
                .AsNoTracking()
                .Where(x => x.CategoryId == categoryId && !x.IsDeleted);

            if (!string.IsNullOrWhiteSpace(request.Name))
            {
                foreach (string keyword in request.Name.Split(' ').Take(10))
                {
                    query = query.Where(x => x.Name.Contains(keyword));
                }
            }

            if (request.DailyPriceFrom.HasValue)
                query = query.Where(x => x.DailyPrice >= request.DailyPriceFrom);

            if (request.DailyPriceTo.HasValue)
                query = query.Where(x => x.DailyPrice <= request.DailyPriceTo);

            if (request.RatingFrom.HasValue)
                query = query.Where(x => x.Rating >= request.RatingFrom);

            if (request.RatingTo.HasValue)
                query = query.Where(x => x.Rating <= request.RatingTo);

            foreach (SearchProductsFieldValueFilter filter in request.FieldValueFilters)
            {
                if (filter.ExactBoolValue.HasValue)
                {
                    query = query.Where(x =>
                        x.FieldValues.Any(f =>
                            f.FieldId == filter.FieldId &&
                            f.BoolValue == filter.ExactBoolValue));
                }

                if (filter.ExactNumberValue.HasValue)
                {
                    query = query.Where(x =>
                        x.FieldValues.Any(f =>
                            f.FieldId == filter.FieldId &&
                            f.NumberValue == filter.ExactNumberValue));
                }

                if (filter.NumberValueFrom.HasValue)
                {
                    query = query.Where(x =>
                        x.FieldValues.Any(f =>
                            f.FieldId == filter.FieldId &&
                            f.NumberValue >= filter.NumberValueFrom));
                }
                if (filter.NumberValueTo.HasValue)
                {
                    query = query.Where(x =>
                        x.FieldValues.Any(f =>
                            f.FieldId == filter.FieldId &&
                            f.NumberValue <= filter.NumberValueTo));
                }

                if (filter.AllowedTextValues.Count > 0)
                {
                    List<string> distinctAllowedTextValues = filter.AllowedTextValues.Distinct().ToList();

                    query = query.Where(x =>
                        x.FieldValues.Any(f =>
                            f.FieldId == filter.FieldId &&
                            distinctAllowedTextValues.Contains(f.TextValue)));
                }
            }

            query = query.Where(x =>
                !x.Rentings.Any(r =>
                    r.DoesReserveProduct &&
                    r.StartDate <= request.EndDate &&
                    r.EndDate >= request.StartDate));

            IQueryable<ProductDto> dtoQuery = query
                .Select(x => new ProductDto
                {
                    Id = x.Id,
                    Name = x.Name,
                    Description = x.Description,
                    DailyPrice = x.DailyPrice,
                    CategoryId = x.CategoryId,
                    Rating = x.Rating,
                    CreatedAt = x.CreatedAt,
                    FirstImageFileName = x.Images
                        .Select(x => x.FileName)
                        .FirstOrDefault(),
                    ReviewsCount = x.UserReviews.Count()
                });

            if (!string.IsNullOrEmpty(orderBy))
            {
                switch (orderBy)
                {
                    case "asc(name)":
                        dtoQuery = dtoQuery
                            .OrderBy(x => x.Name)
                            .ThenBy(x => x.Id);
                        break;
                    case "desc(name)":
                        dtoQuery = dtoQuery
                            .OrderByDescending(x => x.Name)
                            .ThenBy(x => x.Id);
                        break;
                    case "asc(dailyPrice)":
                        dtoQuery = dtoQuery
                            .OrderBy(x => x.DailyPrice)
                            .ThenBy(x => x.Id);
                        break;
                    case "desc(dailyPrice)":
                        dtoQuery = dtoQuery
                            .OrderByDescending(x => x.DailyPrice)
                            .ThenBy(x => x.Id);
                        break;
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
                }
            }
            else
            {
                dtoQuery = dtoQuery.OrderBy(x => x.Id);
            }

            PaginatedList<ProductDto> list = await dtoQuery.ToPaginatedListAsync(pagination);

            List<int> selectedIds = list.Items.Select(x => x.Id).ToList();

            List<TempFieldValue> fieldValues = await _ctx.ProductFieldValues
                .Where(x => selectedIds.Contains(x.ProductId))
                .Select(x => new TempFieldValue
                {
                    ProductId = x.ProductId,
                    FieldId = x.FieldId,
                    TextValue = x.TextValue,
                    NumberValue = x.NumberValue,
                    BoolValue = x.BoolValue
                })
                .ToListAsync();

            foreach (ProductDto product in list.Items)
            {
                product.FieldValues = fieldValues
                    .Where(x => x.ProductId == product.Id)
                    .Select(x => new ProductFieldInfoDto
                    {
                        Id = x.FieldId,
                        TextValue = x.TextValue,
                        NumberValue = x.NumberValue,
                        BoolValue = x.BoolValue
                    })
                    .ToList();
            }

            return list;
        }

        public async Task<Result<ProductDetailsDto>> GetProductById(int id)
        {
            ProductDetailsDto? dto = await _ctx.Products
                .Where(x => x.Id == id && !x.IsDeleted)
                .Select(x => new ProductDetailsDto
                {
                    Id = x.Id,
                    Name = x.Name,
                    Description = x.Description,
                    DailyPrice = x.DailyPrice,
                    CategoryId = x.CategoryId,
                    CategoryName = x.Category.Name,
                    Rating = x.Rating,
                    ReviewsCount = x.UserReviews.Count(),
                    CreatedAt = x.CreatedAt
                })
                .FirstOrDefaultAsync();

            if (dto == null)
                return SharedErrors.NotFound;

            dto.ImageFileNames = await _ctx.ProductImages
                .Where(x => x.ProductId == id)
                .Select(x => x.FileName)
                .ToListAsync();

            dto.FieldValues = await _ctx.ProductFieldValues
                .Where(x => x.ProductId == id)
                .Select(x => new ProductFieldInfoDto
                {
                    Id = x.FieldId,
                    TextValue = x.TextValue,
                    NumberValue = x.NumberValue,
                    BoolValue = x.BoolValue
                })
                .ToListAsync();

            return dto;
        }

        public async Task<Result<ProductAvailabilityDto>> CheckProductAvailibilty(
            int productId,
            DateTime startDate,
            DateTime endDate)
        {
            bool isAvailable = !await _ctx.ProductRentings
                .Where(x =>
                    x.ProductId == productId &&
                    x.DoesReserveProduct &&
                    x.StartDate <= startDate &&
                    x.EndDate >= endDate)
                .AnyAsync();

            List<ProductAvailibiltyPlannedRentingDto> plannedRentings = await _ctx.ProductRentings
                .Where(x =>
                    x.ProductId == productId &&
                    x.DoesReserveProduct)
                .Select(x => new ProductAvailibiltyPlannedRentingDto
                {
                    StartDate = x.StartDate,
                    EndDate = x.EndDate
                })
                .OrderBy(x => x.StartDate)
                .ToListAsync();

            return new ProductAvailabilityDto
            {
                IsAvailable = isAvailable,
                PlannedRentings = plannedRentings
            };
        }

        public async Task<Result<IsProductRentedByUserDto>> CheckIfProductIsRentedByUser(int productId)
        {
            var getUserResult = _userProvider.GetUser();
            if (getUserResult.IsFailure) return getUserResult.FailedCast<IsProductRentedByUserDto>();

            SharedUser loggedUser = getUserResult.Value;

            var rentInfo = await _ctx.ProductRentings
                .Where(x =>
                    x.ProductId == productId &&
                    x.CreatedById == loggedUser.Id &&
                    (
                        x.Status == ProductRentingStatus.Planned ||
                        x.Status == ProductRentingStatus.InProgress
                    ) &&
                    x.DoesReserveProduct)
                .Select(x => new
                {
                    x.Id,
                    x.Status
                })
                .FirstOrDefaultAsync();

            if (rentInfo == null)
            {
                return new IsProductRentedByUserDto
                {
                    IsIt = false
                };
            }
            else
            {
                return new IsProductRentedByUserDto
                {
                    IsIt = true,
                    RentingId = rentInfo.Id,
                    Status = rentInfo.Status
                };
            }
        }
    }
}
