using BzRental.Api.Extensions;
using BzRental.Application.Products.Dtos;
using BzRental.Application.Products.Errors;
using BzRental.Application.Products.Requests;
using BzRental.Application.Products.Services;
using BzRental.Application.Users;
using BzRental.DbAccess.Contexts;
using BzRental.Domain.Products.Models;
using BzRental.Shared.Contracts.Dtos;
using BzRental.Shared.Errors;
using BzRental.Shared.Pagination;
using BzRental.Shared.ResultPattern;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BzRental.Api.Controllers.Products
{
    [Route("api/admin/products")]
    [ApiController, Authorize(Roles = AuthRoles.Admin)]
    public class ProductsAdminController : ControllerBase
    {
        private readonly IProductsManagementService _service;
        private readonly BzRentalDbContext _ctx;
        private readonly IWebHostEnvironment _env;

        public ProductsAdminController(
            IProductsManagementService service,
            BzRentalDbContext ctx,
            IWebHostEnvironment env)
        {
            _service = service;
            _ctx = ctx;
            _env = env;
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

        [HttpPost("{productId}/images")]
        public async Task<IActionResult> UploadProductImages(
            [FromRoute] int productId,
            [FromForm] List<IFormFile> files)
        {
            bool doesProductExist = await _ctx.Products.AnyAsync(x => x.Id == productId);
            if (!doesProductExist)
                return Result.Failure(SharedErrors.NotFound, FailureType.NotFound).ToActionResult();

            if (files == null || files.Count == 0)
                return Result.Failure(FileErrors.NoFilesProvided, FailureType.BadRequest).ToActionResult();

            string uploadsFolder = Path.Combine(_env.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot"), "uploads");

            if (!Directory.Exists(uploadsFolder))
                Directory.CreateDirectory(uploadsFolder);

            List<ProductImage> productImages = new();

            foreach (IFormFile file in files)
            {
                string extension = Path.GetExtension(file.FileName).ToLowerInvariant();
                if (extension != ".jpeg" || extension != ".jpg" || extension != ".png" || extension != ".webp")
                    return Result.Failure(FileErrors.InvalidExtension, FailureType.BadRequest).ToActionResult();

                string storedFileName = $"{Guid.NewGuid()}{extension}";
                string filePath = Path.Combine(uploadsFolder, storedFileName);

                using (FileStream stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                productImages.Add(new ProductImage
                {
                    ProductId = productId,
                    FileName = storedFileName
                });
            }

            _ctx.ProductImages.AddRange(productImages);
            await _ctx.SaveChangesAsync();

            return Result.Success().ToActionResult();
        }
    }
}
