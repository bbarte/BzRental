using BzRental.Application.ProductsRenting.Dtos;
using BzRental.Application.ProductsRenting.Errors;
using BzRental.Application.ProductsRenting.QueryParams;
using BzRental.Application.ProductsRenting.Requests;
using BzRental.DbAccess.Contexts;
using BzRental.DbAccess.Extensions;
using BzRental.Domain.ProductsRenting.Enums;
using BzRental.Domain.ProductsRenting.Models;
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

namespace BzRental.Application.ProductsRenting.Services
{
    public class ProductRentingsManagementService : IProductRentingsManagementService
    {
        private readonly BzRentalDbContext _ctx;
        private readonly IUserProvider _userProvider;

        private readonly IValidator<ConfirmProductRentingPlanHandoverRequest> _confirmRentingPlanHandoverValidator;
        private readonly IValidator<TurnDownProductRentingPlanRequest> _turnDownRentingPlanValidator;
        private readonly IValidator<CheckoutProductRentingRequest> _checkoutRentingValidator;

        public ProductRentingsManagementService(
            BzRentalDbContext ctx,
            IUserProvider userProvider,
            IValidator<ConfirmProductRentingPlanHandoverRequest> confirmRentingPlanHandoverValidator,
            IValidator<TurnDownProductRentingPlanRequest> turnDownRentingPlanValidator,
            IValidator<CheckoutProductRentingRequest> checkoutRentingValidator)
        {
            _ctx = ctx;
            _userProvider = userProvider;
            _confirmRentingPlanHandoverValidator = confirmRentingPlanHandoverValidator;
            _turnDownRentingPlanValidator = turnDownRentingPlanValidator;
            _checkoutRentingValidator = checkoutRentingValidator;
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
                    CreatedAt = x.CreatedAt,
                    UserComments = x.UserComments
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

        public async Task<Result> ConfirmRentingPlanHandover(
            int id,
            ConfirmProductRentingPlanHandoverRequest request)
        {
            var valResult = _confirmRentingPlanHandoverValidator.ValidateToBzRentalResult(request);
            if (valResult.IsFailure) return valResult;

            var getUserResult = _userProvider.GetUser();
            if (getUserResult.IsFailure) return getUserResult;

            SharedUser loggedUser = getUserResult.Value;

            ProductRenting? renting = await _ctx.ProductRentings
                .Where(x => x.Id == id)
                .FirstOrDefaultAsync();

            if (renting == null)
                return SharedErrors.NotFound;

            if (renting.Status != ProductRentingStatus.Planned)
                return ProductsRentingErrors.CantConfirmHandoverStatus;

            if (DateTime.Now.Date > renting.EndDate.Date)
                return ProductsRentingErrors.CantConfirmHandoverExpired;

            renting.Status = ProductRentingStatus.InProgress;
            renting.DoesReserveProduct = true;

            ProductRentingStatusChange change = new ProductRentingStatusChange
            {
                RentingId = id,
                CurrentStatus = ProductRentingStatus.InProgress,
                CreatedById = loggedUser.Id,
                Comments = request.Comments
            };

            _ctx.ProductRentingStatusChanges.Add(change);

            await _ctx.SaveChangesAsync();
            return Result.Success();
        }

        public async Task<Result> TurnDownRentingPlan(
            int id,
            TurnDownProductRentingPlanRequest request)
        {
            var valResult = _turnDownRentingPlanValidator.ValidateToBzRentalResult(request);
            if (valResult.IsFailure) return valResult;

            var getUserResult = _userProvider.GetUser();
            if (getUserResult.IsFailure) return getUserResult;

            SharedUser loggedUser = getUserResult.Value;

            ProductRenting? renting = await _ctx.ProductRentings
                .Where(x => x.Id == id)
                .FirstOrDefaultAsync();

            if (renting == null)
                return SharedErrors.NotFound;

            if (renting.Status != ProductRentingStatus.Planned)
                return ProductsRentingErrors.CantTurnDownStatus;

            renting.Status = ProductRentingStatus.UserDidNotShowUp;
            renting.DoesReserveProduct = false;

            ProductRentingStatusChange change = new ProductRentingStatusChange
            {
                RentingId = id,
                CurrentStatus = ProductRentingStatus.UserDidNotShowUp,
                CreatedById = loggedUser.Id,
                Comments = request.Comments
            };

            _ctx.ProductRentingStatusChanges.Add(change);

            await _ctx.SaveChangesAsync();
            return Result.Success();
        }

        public async Task<Result<CheckoutRentingSummaryDto>> CheckoutRenting(int id, CheckoutProductRentingRequest request)
        {
            var valResult = _checkoutRentingValidator.ValidateToBzRentalResult(request);
            if (valResult.IsFailure) return valResult;

            var getUserResult = _userProvider.GetUser();
            if (getUserResult.IsFailure) return getUserResult.FailedCast<CheckoutRentingSummaryDto>();

            SharedUser loggedUser = getUserResult.Value;

            ProductRenting? renting = await _ctx.ProductRentings
                .Where(x => x.Id == id)
                .FirstOrDefaultAsync();

            if (renting == null)
                return SharedErrors.NotFound;

            if (renting.Status != ProductRentingStatus.InProgress)
                return ProductsRentingErrors.CantCheckoutStatus;

            renting.Status = ProductRentingStatus.Returned;
            renting.DoesReserveProduct = false;

            ProductRentingStatusChange change = new ProductRentingStatusChange
            {
                RentingId = id,
                CurrentStatus = ProductRentingStatus.Returned,
                CreatedById = loggedUser.Id,
                Comments = request.Comments
            };

            _ctx.ProductRentingStatusChanges.Add(change);

            await _ctx.SaveChangesAsync();

            var rentingInfo = await _ctx.ProductRentings
                .Where(x => x.Id == id)
                .Select(x => new
                {
                    CreatedBy = $"{x.CreatedBy.FirstName} {x.CreatedBy.LastName}",
                    x.CreatedById,

                    ProductName = x.Product.Name,
                    ProductCategoryName = x.Product.Category.Name,
                    x.ProductId,

                    ActualStartDate = x.StatusChanges
                        .Where(x => x.CurrentStatus == ProductRentingStatus.InProgress)
                        .Select(x => x.CreatedAt)
                        .First()
                })
                .FirstAsync();

            CheckoutRentingSummaryDto dto = new CheckoutRentingSummaryDto
            {
                CreatedById = rentingInfo.CreatedById,
                CreatedBy = rentingInfo.CreatedBy,
                ProductId = rentingInfo.ProductId,
                ProductName = rentingInfo.ProductName,
                ProductCategoryName = rentingInfo.ProductCategoryName,

                PlannedStartDate = renting.StartDate,
                ActualStartDate = rentingInfo.ActualStartDate,

                PlannedEndDate = renting.EndDate,
                ActualEndDate = DateTime.Now,

                DailyPrice = renting.DailyPrice ?? 0m
            };

            dto.TotalValue = ((dto.ActualEndDate.Date - dto.ActualStartDate.Date).Days + 1) * dto.DailyPrice;

            return dto;
        }
    }
}
