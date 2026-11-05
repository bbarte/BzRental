using BzRental.Api.Extensions;
using BzRental.Application.ProductsRenting.Requests;
using BzRental.Application.ProductsRenting.Services;
using BzRental.Shared.Contracts.Dtos;
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

        public ProductsRentingController(IProductsRentPlanningService rentPlanningService)
        {
            _rentPlanningService = rentPlanningService;
        }

        [HttpPost("{productId}/plan-renting")]
        public async Task<ActionResult<CreatedObjectDto<int>>> PlanRenting(
            [FromRoute] int productId,
            [FromBody] PlanProductRentingRequest request)
        {
            return (await _rentPlanningService.PlanRenting(productId, request)).ToActionResult();
        }

        [HttpPost("rents/{id}/cancel-renting-plan")]
        public async Task<IActionResult> CancelRentingPlan(
            [FromRoute] int id,
            [FromBody] CancelProductRentingRequest request)
        {
            return (await _rentPlanningService.CancelRentingPlan(id, request)).ToActionResult();
        }
    }
}
