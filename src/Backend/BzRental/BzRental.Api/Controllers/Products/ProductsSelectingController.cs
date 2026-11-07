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
    public class ProductsSelectingController : ControllerBase
    {
        private readonly IProductsSelectingService _service;

        public ProductsSelectingController(IProductsSelectingService service)
        {
            _service = service;
        }

        [HttpGet("categories/{categoryId}/distinct")]
        public async Task<ActionResult<List<ProductCategoryDistinctFieldValuesDto>>> GetDistinctCategoryFieldValues(
            [FromRoute] int categoryId)
        {
            return (await _service.GetDistinctCategoryFieldValues(categoryId)).ToActionResult();
        }

        [HttpPost("search")]
        public async Task<ActionResult<PaginatedList<ProductDto>>> SearchProducts(
            [FromQuery] int categoryId,
            [FromQuery] PaginationParameters pagination,
            [FromBody] SearchProductsRequest request,
            [FromQuery] string? orderBy = null)
        {
            return (await _service.SearchProducts(pagination, categoryId, request, orderBy)).ToActionResult();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ProductDetailsDto>> GetProductById(
            [FromRoute] int id)
        {
            return (await _service.GetProductById(id)).ToActionResult();
        }
    }
}
