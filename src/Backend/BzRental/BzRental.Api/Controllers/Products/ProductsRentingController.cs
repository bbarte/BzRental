using BzRental.Api.Extensions;
using BzRental.Application.Products.Services;
using BzRental.Application.ProductsRenting.Dtos;
using BzRental.Application.ProductsRenting.QueryParams;
using BzRental.Application.ProductsRenting.Requests;
using BzRental.Application.ProductsRenting.Services;
using BzRental.Application.Users;
using BzRental.Shared.Contracts.Dtos;
using BzRental.Shared.Pagination;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace BzRental.Api.Controllers.Products
{
    [Route("api/products")]
    [ApiController, Authorize]
    public class ProductsRentingController : ControllerBase
    {
        private readonly IProductsRentPlanningService _rentPlanningService;
        private readonly IProductRentingsManagementService _rentManagementService;

        public ProductsRentingController(
            IProductsRentPlanningService rentPlanningService,
            IProductRentingsManagementService rentManagementService)
        {
            _rentPlanningService = rentPlanningService;
            _rentManagementService = rentManagementService;
        }

        [HttpPost("{productId}/plan-renting")]
        public async Task<ActionResult<CreatedObjectDto<int>>> PlanRenting(
            [FromRoute] int productId,
            [FromBody] PlanProductRentingRequest request)
        {
            return (await _rentPlanningService.PlanRenting(productId, request)).ToActionResult();
        }

        [HttpPost("rentings/{id}/cancel-renting-plan")]
        public async Task<IActionResult> CancelRentingPlan(
            [FromRoute] int id,
            [FromBody] CancelProductRentingRequest request)
        {
            return (await _rentPlanningService.CancelRentingPlan(id, request)).ToActionResult();
        }

        [HttpGet("rentings"), Authorize(Roles = AuthRoles.Admin)]
        public async Task<ActionResult<PaginatedList<ProductRentingDto>>> GetRentings(
            [FromQuery] PaginationParameters pagination,
            [FromQuery] int? productId = null,
            [FromQuery] int? createdById = null,
            [FromQuery] GetRentingsStatusFilter? status = null,
            [FromQuery] DateTime? dateFrom = null,
            [FromQuery] DateTime? dateTo = null,
            [FromQuery] string? orderBy = null)
        {
            return (await _rentManagementService.GetRentings(pagination, productId, createdById, status, dateFrom, dateTo, orderBy)).ToActionResult();
        }

        [HttpPost("rentings/{id}/confirm-renting-plan-handover"), Authorize(Roles = AuthRoles.Admin)]
        public async Task<IActionResult> ConfirmRentingPlanHandover(
            [FromRoute] int id,
            [FromBody] ConfirmProductRentingPlanHandoverRequest request)
        {
            return (await _rentManagementService.ConfirmRentingPlanHandover(id, request)).ToActionResult();
        }

        [HttpPost("rentings/{id}/turn-down-renting-plan"), Authorize(Roles = AuthRoles.Admin)]
        public async Task<IActionResult> TurnDownRentingPlan(
            [FromRoute] int id,
            [FromBody] TurnDownProductRentingPlanRequest request)
        {
            return (await _rentManagementService.TurnDownRentingPlan(id, request)).ToActionResult();
        }

        [HttpPost("rentings/{id}/checkout-renting"), Authorize(Roles = AuthRoles.Admin)]
        public async Task<ActionResult<CheckoutRentingSummaryDto>> CheckoutRenting(
            [FromRoute] int id,
            [FromBody] CheckoutProductRentingRequest requset)
        {
            return (await _rentManagementService.CheckoutRenting(id, requset)).ToActionResult();
        }
    }
}
