using BzRental.Api.Extensions;
using BzRental.Application.Products.Requests;
using BzRental.Application.Products.Services;
using BzRental.Application.Users;
using BzRental.Shared.Contracts.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace BzRental.Api.Controllers.Products
{
    [Route("api/admin/product-categories")]
    [ApiController, Authorize(Roles = AuthRoles.Admin)]
    public class ProductCategoriesAdminController : ControllerBase
    {
        private readonly IProductCategoriesService _operationsService;

        public ProductCategoriesAdminController(IProductCategoriesService operationsService)
        {
            _operationsService = operationsService;
        }

        [HttpPost]
        public async Task<ActionResult<CreatedObjectDto<int>>> AddProductCategory(
            [FromBody] AddProductCategoryRequest request)
        {
            return (await _operationsService.AddProductCategory(request)).ToActionResult();
        }

        [HttpPost("{categoryId}/fields")]
        public async Task<ActionResult<CreatedObjectDto<int>>> AddProductCategoryField(
            [FromRoute] int categoryId,
            [FromBody] AddProductCategoryFieldRequest request)
        {
            return (await _operationsService.AddProductCategoryField(categoryId, request)).ToActionResult();
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProductCategory(
            [FromRoute] int id,
            [FromBody] UpdateProductCategoryRequest request)
        {
            return (await _operationsService.UpdateProductCategory(id, request)).ToActionResult();
        }

        [HttpPut("fields/{id}")]
        public async Task<IActionResult> UpdateProductCategoryField(
            [FromRoute] int id,
            [FromBody] UpdateProductCategoryFieldRequest request)
        {
            return (await _operationsService.UpdateProductCategoryField(id, request)).ToActionResult();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProductCategory(
            [FromRoute] int id)
        {
            return (await _operationsService.DeleteProductCategory(id)).ToActionResult();
        }

        [HttpPost("{id}/recover")]
        public async Task<IActionResult> RecoverProductCategory(
            [FromRoute] int id)
        {
            return (await _operationsService.RecoverProductCategory(id)).ToActionResult();
        }
        
        [HttpDelete("fields/{id}")]
        public async Task<IActionResult> DeleteProductCategoryField(
            [FromRoute] int id)
        {
            return (await _operationsService.DeleteProductCategoryField(id)).ToActionResult();
        }

        [HttpPost("fields/{id}/recover")]
        public async Task<IActionResult> RecoverProductCategoryField(
            [FromRoute] int id)
        {
            return (await _operationsService.RecoverProductCategoryField(id)).ToActionResult();
        }
    }
}
