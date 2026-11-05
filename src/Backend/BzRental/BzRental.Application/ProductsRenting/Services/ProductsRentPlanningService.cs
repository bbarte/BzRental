using BzRental.Application.ProductsRenting.Errors;
using BzRental.Application.ProductsRenting.Requests;
using BzRental.DbAccess.Contexts;
using BzRental.Domain.ProductsRenting.Enums;
using BzRental.Domain.ProductsRenting.Models;
using BzRental.Shared.Abstraction;
using BzRental.Shared.Contracts.Dtos;
using BzRental.Shared.Errors;
using BzRental.Shared.Extensions;
using BzRental.Shared.ResultPattern;
using FluentValidation;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;

namespace BzRental.Application.ProductsRenting.Services
{
    public sealed class ProductsRentPlanningService : IProductsRentPlanningService
    {
        private readonly BzRentalDbContext _ctx;
        private readonly IUserProvider _userProvider;

        private readonly IValidator<PlanProductRentingRequest> _planRentingValidator;
        private readonly IValidator<CancelProductRentingRequest> _cancelRentingValidator;

        public ProductsRentPlanningService(
            BzRentalDbContext ctx,
            IUserProvider userProvider,
            IValidator<PlanProductRentingRequest> planRentingValidator,
            IValidator<CancelProductRentingRequest> cancelRentingValidator)
        {
            _ctx = ctx;
            _userProvider = userProvider;
            _planRentingValidator = planRentingValidator;
            _cancelRentingValidator = cancelRentingValidator;
        }

        public async Task<Result<CreatedObjectDto<int>>> PlanRenting(
            int productId,
            PlanProductRentingRequest request)
        {
            var valResult = _planRentingValidator.ValidateToBzRentalResult(request);
            if (valResult.IsFailure) return valResult;

            var getUserResult = _userProvider.GetUser();
            if (getUserResult.IsFailure) return getUserResult.FailedCast<CreatedObjectDto<int>>();

            SharedUser loggedUser = getUserResult.Value;

            bool hasUserAlreadyReservedIt = await _ctx.ProductRentings
                .Where(x =>
                    x.ProductId == productId &&
                    x.CreatedById == loggedUser.Id &&
                    x.DoesReserveProduct &&
                    x.StartDate < request.EndDate &&
                    x.EndDate > request.StartDate
                )
                .AnyAsync();

            if (hasUserAlreadyReservedIt)
                return ProductsRentingErrors.AlreadyReservedByUser;

            bool isAvailable = !await _ctx.ProductRentings
                .Where(x =>
                    x.ProductId == productId &&
                    x.DoesReserveProduct &&
                    x.StartDate < request.EndDate &&
                    x.EndDate > request.StartDate
                )
                .AnyAsync();

            if (!isAvailable)
                return ProductsRentingErrors.NotAvailable;

            var productInfo = await _ctx.Products
                .Where(x => x.Id == productId && !x.IsDeleted)
                .Select(x => new
                {
                    x.DailyPrice
                })
                .FirstOrDefaultAsync();

            if (productInfo == null)
                return SharedErrors.NotFound;

            ProductRenting renting = new ProductRenting
            {
                ProductId = productId,
                CreatedById = loggedUser.Id,
                Status = ProductRentingStatus.Planned,
                DoesReserveProduct = true,
                StartDate = request.StartDate,
                EndDate = request.EndDate,
                UserComments = request.UserComments,
                DailyPrice = productInfo.DailyPrice,
                StatusChanges = new List<ProductRentingStatusChange>
                {
                    new ProductRentingStatusChange
                    {
                        CurrentStatus = ProductRentingStatus.Planned,
                        CreatedById = loggedUser.Id
                    }
                }
            };

            _ctx.ProductRentings.Add(renting);
            await _ctx.SaveChangesAsync();

            return new CreatedObjectDto<int>(renting.Id);
        }

        public async Task<Result> CancelRentingPlan(int id, CancelProductRentingRequest request)
        {
            var valResult = _cancelRentingValidator.ValidateToBzRentalResult(request);
            if (valResult.IsFailure) return valResult;

            var getUserResult = _userProvider.GetUser();
            if (getUserResult.IsFailure) return getUserResult.FailedCast<CreatedObjectDto<int>>();

            SharedUser loggedUser = getUserResult.Value;

            ProductRenting? renting = await _ctx.ProductRentings
                .Where(x => x.Id == id && x.CreatedById == loggedUser.Id)
                .FirstOrDefaultAsync();

            if (renting == null)
                return SharedErrors.NotFound;

            if (renting.Status != ProductRentingStatus.Planned)
                return ProductsRentingErrors.CantCancelRentingPlan;

            renting.Status = ProductRentingStatus.Canceled;
            renting.DoesReserveProduct = false;

            ProductRentingStatusChange change = new ProductRentingStatusChange
            {
                RentingId = id,
                CreatedById = loggedUser.Id,
                CurrentStatus = ProductRentingStatus.Canceled,
                Comments = request.Reason
            };

            _ctx.ProductRentingStatusChanges.Add(change);
            await _ctx.SaveChangesAsync();

            return Result.Success();
        }
    }
}
