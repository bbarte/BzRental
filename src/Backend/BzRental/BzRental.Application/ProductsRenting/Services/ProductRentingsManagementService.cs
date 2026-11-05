using BzRental.Application.ProductsRenting.Dtos;
using BzRental.Application.ProductsRenting.QueryParams;
using BzRental.DbAccess.Contexts;
using BzRental.DbAccess.Extensions;
using BzRental.Domain.ProductsRenting.Enums;
using BzRental.Domain.ProductsRenting.Models;
using BzRental.Shared.Contracts.Dtos;
using BzRental.Shared.Pagination;
using BzRental.Shared.ResultPattern;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;

namespace BzRental.Application.ProductsRenting.Services
{
    public class ProductRentingsManagementService : IProductRentingsManagementService
    {
        private readonly BzRentalDbContext _ctx;

        public ProductRentingsManagementService(BzRentalDbContext ctx)
        {
            _ctx = ctx;
        }

        public async Task<Result<PaginatedList<ProductRentingDto>>> GetRentings(
            PaginationParameters pagination,
            int? productId = null,
            int? createdById = null,
            GetRentingsStatusFilter? status = null,
            DateTime? dateFrom = null,
            DateTime? dateTo = null,
            string? orderBy = null)
        {
            IQueryable<ProductRenting> query = _ctx.ProductRentings;

            if (productId.HasValue)
                query = query.Where(x => x.ProductId == productId);

            if (createdById.HasValue)
                query = query.Where(x => x.CreatedById == createdById);

            if (status.HasValue)
            {
                switch (status)
                {
                    case GetRentingsStatusFilter.Planned:
                        query = query.Where(x => x.Status == ProductRentingStatus.Planned);
                        break;
                    case GetRentingsStatusFilter.InProgress:
                        query = query.Where(x => x.Status == ProductRentingStatus.InProgress);
                        break;
                    case GetRentingsStatusFilter.Closed:
                        query = query.Where(x =>
                            x.Status == ProductRentingStatus.Returned ||
                            x.Status == ProductRentingStatus.Canceled ||
                            x.Status == ProductRentingStatus.UserDidNotShowUp);
                        break;
                }
            }

            if (dateFrom.HasValue)
                query = query.Where(x => x.StartDate >= dateFrom);

            if (dateTo.HasValue)
                query = query.Where(x => x.EndDate <= dateTo);

            IQueryable<ProductRentingDto> dtoQuery = query
                .Select(x => new ProductRentingDto
                {
                    Id = x.Id,
                    ProductId = x.ProductId,
                    ProductName = x.Product.Name,
                    ProductCategoryName = x.Product.Category.Name,
                    CreatedById = x.CreatedById,
                    CreatedBy = $"{x.CreatedBy.FirstName} {x.CreatedBy.LastName}",
                    Status = x.Status,
                    DoesReserveProduct = x.DoesReserveProduct,
                    StartDate = x.StartDate,
                    EndDate = x.EndDate,
                    DailyPrice = x.DailyPrice ?? 0m,
                    CurrentRentValue = (EF.Functions.DateDiffDay(x.StartDate, x.EndDate) + 1) * x.DailyPrice!.Value,
                    CreatedAt = x.CreatedAt
                });

            if (!string.IsNullOrWhiteSpace(orderBy))
            {
                switch (orderBy)
                {
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
                    case "asc(currentRentValue)":
                        dtoQuery = dtoQuery
                            .OrderBy(x => x.CurrentRentValue)
                            .ThenBy(x => x.Id);
                        break;
                    case "desc(currentRentValue)":
                        dtoQuery = dtoQuery
                            .OrderByDescending(x => x.CurrentRentValue)
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
    }
}
