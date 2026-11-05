using BzRental.Application.ProductsRenting.Requests;
using BzRental.Shared.Contracts.Dtos;
using BzRental.Shared.ResultPattern;
using System;
using System.Collections.Generic;
using System.Text;

namespace BzRental.Application.ProductsRenting.Services
{
    public interface IProductsRentPlanningService
    {
        Task<Result<CreatedObjectDto<int>>> PlanRenting(int productId, PlanProductRentingRequest request);
        Task<Result> CancelRentingPlan(int id, CancelProductRentingRequest request);
    }
}
