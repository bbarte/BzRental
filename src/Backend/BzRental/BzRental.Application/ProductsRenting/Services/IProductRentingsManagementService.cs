using BzRental.Application.ProductsRenting.Dtos;
using BzRental.Application.ProductsRenting.QueryParams;
using BzRental.Application.ProductsRenting.Requests;
using BzRental.Domain.ProductsRenting.Enums;
using BzRental.Shared.Contracts.Dtos;
using BzRental.Shared.Pagination;
using BzRental.Shared.ResultPattern;
using System;
using System.Collections.Generic;
using System.Text;

namespace BzRental.Application.ProductsRenting.Services
{
    public interface IProductRentingsManagementService
    {
        Task<Result<PaginatedList<ProductRentingDto>>> GetRentings(
            PaginationParameters pagination,
            int? productId = null,
            int? createdById = null,
            GetRentingsStatusFilter? status = null,
            DateTime? dateFrom = null,
            DateTime? dateTo = null,
            string? orderBy = null);

        Task<Result> ConfirmRentingPlanHandover(
            int id,
            ConfirmProductRentingPlanHandoverRequest request);

        Task<Result> TurnDownRentingPlan(
            int id,
            TurnDownProductRentingPlanRequest request);
    }
}
