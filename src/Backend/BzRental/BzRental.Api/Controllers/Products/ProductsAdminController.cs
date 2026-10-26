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
    [Route("api/admin/products")]
    [ApiController, Authorize(Roles = AuthRoles.Admin)]
    public class ProductsAdminController : ControllerBase
    {
        private readonly IProductsManagementService _service;

        public ProductsAdminController(IProductsManagementService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<PaginatedList<ProductAdminDto>>> GetProducts(
            [FromQuery] PaginationParameters pagination,
            [FromQuery] string? filter = null,
            [FromQuery] int? categoryId = null,
            [FromQuery] bool includeDeleted = false,
            [FromQuery] string? orderBy = null)
        {
            return (await _service.GetProducts(pagination, filter, categoryId, includeDeleted, orderBy)).ToActionResult();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ProductAdminDetailsDto>> GetProductById(int id)
        {
            return (await _service.GetProductById(id)).ToActionResult();
        }

        [HttpGet("fields-info/category/{id}")]
        public async Task<ActionResult<List<ProductFieldInfoDto>>> GetFieldsInfoForCategory(
            [FromRoute] int id)
        {
            return (await _service.GetFieldsInfoForCategory(id)).ToActionResult();
        }

        [HttpGet("{id}/fields-info")]
        public async Task<ActionResult<List<ProductFieldInfoDto>>> GetFieldsInfoForProductById(
            [FromRoute] int id)
        {
            return (await _service.GetFieldsInfoForProductById(id)).ToActionResult();
        }

        [HttpPost]
        public async Task<ActionResult<CreatedObjectDto<int>>> AddProduct(
            [FromBody] AddProductRequest request)
        {
            return (await _service.AddProduct(request)).ToActionResult();
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProduct(
            [FromRoute] int id,
            [FromBody] UpdateProductRequest request)
        {
            return (await _service.UpdateProduct(id, request)).ToActionResult();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProduct(
            [FromRoute] int id)
        {
            return (await _service.DeleteProduct(id)).ToActionResult();
        }

        [HttpPost("{id}/recover")]
        public async Task<IActionResult> RecoverProduct(
            [FromRoute] int id)
        {
            return (await _service.RecoverProduct(id)).ToActionResult();
        }
    }
}
