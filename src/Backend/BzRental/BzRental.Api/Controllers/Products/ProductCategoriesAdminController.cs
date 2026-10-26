using BzRental.Api.Extensions;
using BzRental.Application.Products.Dtos;
using BzRental.Application.Products.Requests;
using BzRental.Application.Products.Services;
using BzRental.Application.Users;
using BzRental.Shared.Contracts.Dtos;
using BzRental.Shared.Pagination;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace BzRental.Api.Controllers.Products
{
    [Route("api/admin/product-categories")]
    [ApiController, Authorize(Roles = AuthRoles.Admin)]
    public class ProductCategoriesAdminController : ControllerBase
    {
        private readonly IProductCategoriesService _service;

        public ProductCategoriesAdminController(IProductCategoriesService operationsService)
        {
            _service = operationsService;
        }

        [HttpGet]
        public async Task<ActionResult<PaginatedList<ProductCategoryDto>>> GetProductCategories(
            [FromQuery] PaginationParameters pagination,
            [FromQuery] string? filter = null,
            [FromQuery] bool includeDeleted = false)
        {
            return (await _service.GetProductCategories(pagination, filter, includeDeleted)).ToActionResult();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ProductCategoryDto>> GetProductCategoryById(
            [FromRoute] int id)
        {
            return (await _service.GetProductCategoryById(id)).ToActionResult();
        }

        [HttpGet("{categoryId}/fields")]
        public async Task<ActionResult<PaginatedList<ProductCategoryFieldDto>>> GetProductCategoryFields(
            [FromRoute] int categoryId,
            [FromQuery] PaginationParameters pagination,
            [FromQuery] string? filter = null,
            [FromQuery] bool includeDeleted = false)
        {
            return (await _service.GetProductCategoryFields(categoryId, pagination, filter, includeDeleted)).ToActionResult();
        }

        [HttpGet("fields/{id}")]
        public async Task<ActionResult<ProductCategoryFieldDto>> GetProductCategoryFieldById(
            [FromRoute] int id)
        {
            return (await _service.GetProductCategoryFieldById(id)).ToActionResult();
        }

        [HttpGet("minimal")]
        public async Task<ActionResult<List<ProductCategoryMinimalDto>>> GetMinimalProductCategories()
        {
            return (await _service.GetMinimalProductCategories()).ToActionResult();
        }

        [HttpPost]
        public async Task<ActionResult<CreatedObjectDto<int>>> AddProductCategory(
            [FromBody] AddProductCategoryRequest request)
        {
            return (await _service.AddProductCategory(request)).ToActionResult();
        }

        [HttpPost("{categoryId}/fields")]
        public async Task<ActionResult<CreatedObjectDto<int>>> AddProductCategoryField(
            [FromRoute] int categoryId,
            [FromBody] AddProductCategoryFieldRequest request)
        {
            return (await _service.AddProductCategoryField(categoryId, request)).ToActionResult();
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProductCategory(
            [FromRoute] int id,
            [FromBody] UpdateProductCategoryRequest request)
        {
            return (await _service.UpdateProductCategory(id, request)).ToActionResult();
        }

        [HttpPut("fields/{id}")]
        public async Task<IActionResult> UpdateProductCategoryField(
            [FromRoute] int id,
            [FromBody] UpdateProductCategoryFieldRequest request)
        {
            return (await _service.UpdateProductCategoryField(id, request)).ToActionResult();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProductCategory(
            [FromRoute] int id)
        {
            return (await _service.DeleteProductCategory(id)).ToActionResult();
        }

        [HttpPost("{id}/recover")]
        public async Task<IActionResult> RecoverProductCategory(
            [FromRoute] int id)
        {
            return (await _service.RecoverProductCategory(id)).ToActionResult();
        }
        
        [HttpDelete("fields/{id}")]
        public async Task<IActionResult> DeleteProductCategoryField(
            [FromRoute] int id)
        {
            return (await _service.DeleteProductCategoryField(id)).ToActionResult();
        }

        [HttpPost("fields/{id}/recover")]
        public async Task<IActionResult> RecoverProductCategoryField(
            [FromRoute] int id)
        {
            return (await _service.RecoverProductCategoryField(id)).ToActionResult();
        }
    }
}
