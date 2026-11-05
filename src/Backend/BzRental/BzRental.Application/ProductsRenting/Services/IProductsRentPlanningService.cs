using BzRental.Application.ProductsRenting.Dtos;
using BzRental.Application.ProductsRenting.QueryParams;
using BzRental.Application.ProductsRenting.Requests;
using BzRental.Shared.Contracts.Dtos;
using BzRental.Shared.Pagination;
using BzRental.Shared.ResultPattern;
using System;
using System.Collections.Generic;
using System.Text;

namespace BzRental.Application.ProductsRenting.Services
{
    public interface IProductsRentPlanningService
    {
        Task<Result<PaginatedList<UsersProductRentingDto>>> GetUsersRentings(
            PaginationParameters pagination,
            GetRentingsStatusFilter? status = null,
            DateTime? dateFrom = null,
            DateTime? dateTo = null,
            string? orderBy = null);

        Task<Result<CreatedObjectDto<int>>> PlanRenting(int productId, PlanProductRentingRequest request);
        Task<Result> CancelRentingPlan(int id, CancelProductRentingRequest request);
    }
}
