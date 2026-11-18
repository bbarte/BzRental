using BzRental.Api.Extensions;
using BzRental.Application.Products.Dtos;
using BzRental.Application.Products.Requests;
using BzRental.Application.Products.Services;
using BzRental.Shared.Contracts.Dtos;
using BzRental.Shared.Pagination;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace BzRental.Api.Controllers.Products
{
    [Route("api/products")]
    [ApiController, Authorize]
    public class ProductUserReviewsController : ControllerBase
    {
        private readonly IProductUserReviewsService _service;

        public ProductUserReviewsController(IProductUserReviewsService service)
        {
            _service = service;
        }

        [HttpGet("{productId}/reviews")]
        public async Task<ActionResult<PaginatedList<ProductReviewDto>>> GetReviews(
            [FromRoute] int productId,
            [FromQuery] PaginationParameters pagination,
            [FromQuery] string? orderBy = null)
        {
            return (await _service.GetReviews(productId, pagination, orderBy)).ToActionResult();
        }

        [HttpGet("{productId}/reviews/own")]
        public async Task<ActionResult<ProductReviewDto>> GetUsersReview(
            [FromRoute] int productId)
        {
            return (await _service.GetUsersReview(productId)).ToActionResult();
        }

        [HttpPost("{productId}/reviews")]
        public async Task<ActionResult<CreatedObjectDto<int>>> AddReview(
            [FromRoute] int productId,
            [FromBody] AddUpdateProductReviewRequest requset)
        {
            return (await _service.AddReview(productId, requset)).ToActionResult();
        }

        [HttpPut("reviews/{id}")]
        public async Task<IActionResult> UpdateReview(
            [FromRoute] int id,
            [FromBody] AddUpdateProductReviewRequest requset)
        {
            return (await _service.UpdateReview(id, requset)).ToActionResult();
        }

        [HttpDelete("reviews/{id}")]
        public async Task<IActionResult> DeleteReview(
            [FromRoute] int id)
        {
            return (await _service.DeleteReview(id)).ToActionResult();
        }
    }
}
