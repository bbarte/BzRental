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
        private readonly IProductsManagementService _managementService;
        private readonly IProductCategoriesService _categoriesService;

        public ProductsSelectingController(
            IProductsSelectingService service,
            IProductsManagementService managementService,
            IProductCategoriesService categoriesService)
        {
            _service = service;
            _managementService = managementService;
            _categoriesService = categoriesService;
        }

        [HttpGet("categories")]
        public async Task<ActionResult<List<ProductCategoryMinimalDto>>> GetCategories()
        {
            return (await _categoriesService.GetMinimalProductCategories()).ToActionResult();
        }

        [HttpGet("categories/{categoryId}/fields")]
        public async Task<ActionResult<List<ProductFieldInfoDto>>> GetCategoryFields(
            int categoryId)
        {
            return (await _managementService.GetFieldsInfoForCategory(categoryId)).ToActionResult();
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

        [HttpPost("{productId}/check-availability")]
        public async Task<ActionResult<ProductAvailabilityDto>> CheckProductAvailability(
            [FromRoute] int productId,
            [FromQuery] DateTime startDate,
            [FromQuery] DateTime endDate)
        {
            return (await _service.CheckProductAvailibilty(productId, startDate, endDate)).ToActionResult();
        }

        [HttpPost("{productId}/check-if-rented-by-user-now")]
        public async Task<ActionResult<IsProductRentedByUserDto>> CheckIfProductIsRentedByUser(
            [FromRoute] int productId)
        {
            return (await _service.CheckIfProductIsRentedByUser(productId)).ToActionResult();
        }
    }
}
