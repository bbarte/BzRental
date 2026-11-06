using BzRental.Api.Extensions;
using BzRental.Application.Products.Dtos;
using BzRental.Application.Products.Services;
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
    }
}
