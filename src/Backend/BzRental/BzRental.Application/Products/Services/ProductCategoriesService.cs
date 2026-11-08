using BzRental.Application.Products.Dtos;
using BzRental.Application.Products.Requests;
using BzRental.DbAccess.Contexts;
using BzRental.DbAccess.Extensions;
using BzRental.Domain.Products.Models;
using BzRental.Shared.Contracts.Dtos;
using BzRental.Shared.Errors;
using BzRental.Shared.Extensions;
using BzRental.Shared.Pagination;
using BzRental.Shared.ResultPattern;
using FluentValidation;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;

namespace BzRental.Application.Products.Services
{
    public class ProductCategoriesService : IProductCategoriesService
    {
        private readonly BzRentalDbContext _ctx;
        private readonly IValidator<AddProductCategoryRequest> _addCatValidator;
        private readonly IValidator<UpdateProductCategoryRequest> _updateCatValidator;
        private readonly IValidator<AddProductCategoryFieldRequest> _addCatFieldValidator;
        private readonly IValidator<UpdateProductCategoryFieldRequest> _updateCatFieldValidator;

        public ProductCategoriesService(
            BzRentalDbContext ctx,
            IValidator<AddProductCategoryRequest> addCatValidator,
            IValidator<UpdateProductCategoryRequest> updateCatValidator,
            IValidator<AddProductCategoryFieldRequest> addCatFieldValidator,
            IValidator<UpdateProductCategoryFieldRequest> updateCatFieldValidator)
        {
            _ctx = ctx;
            _addCatValidator = addCatValidator;
            _updateCatValidator = updateCatValidator;
            _addCatFieldValidator = addCatFieldValidator;
            _updateCatFieldValidator = updateCatFieldValidator;
        }

        public async Task<Result<PaginatedList<ProductCategoryDto>>> GetProductCategories(
            PaginationParameters pagination,
            string? filter = null,
            bool includeDeleted = false)
        {
            IQueryable<ProductCategory> query = _ctx.ProductCategories;

            if (!includeDeleted)
                query = query.Where(x => !x.IsDeleted);

            if (!string.IsNullOrWhiteSpace(filter))
            {
                foreach (string keyword in filter.Split(' ').Take(10))
                {
                    query = query.Where(x => x.Name.Contains(keyword));
                }
            }

            IQueryable<ProductCategoryDto> dtoQuery = query
                .Select(x => new ProductCategoryDto
                {
                    Id = x.Id,
                    Name = x.Name,
                    CreatedAt = x.CreatedAt,
                    IsDeleted = x.IsDeleted
                })
                .OrderBy(x => x.Id);

            return await dtoQuery.ToPaginatedListAsync(pagination);
        }

        public async Task<Result<ProductCategoryDto>> GetProductCategoryById(int id)
        {
            ProductCategoryDto? dto = await _ctx.ProductCategories
                .Where(x => x.Id == id && !x.IsDeleted)
                .Select(x => new ProductCategoryDto
                {
                    Id = x.Id,
                    Name = x.Name,
                    CreatedAt = x.CreatedAt,
                    IsDeleted = x.IsDeleted
                })
                .FirstOrDefaultAsync();

            if (dto == null)
                return SharedErrors.NotFound;

            return dto;
        }

        public async Task<Result<PaginatedList<ProductCategoryFieldDto>>> GetProductCategoryFields(
            int categoryId,
            PaginationParameters pagination,
            string? filter,
            bool includeDeleted = false)
        {
            IQueryable<ProductsCategoryField> query = _ctx.ProductsCategoryFields
                .Where(x => x.CategoryId == categoryId);

            if (!includeDeleted)
                query = query.Where(x => !x.IsDeleted);

            if (!string.IsNullOrWhiteSpace(filter))
            {
                foreach (string keyword in filter.Split(' ').Take(10))
                {
                    query = query.Where(x => x.Name.Contains(keyword));
                }
            }

            IQueryable<ProductCategoryFieldDto> dtoQuery = query
                .Select(x => new ProductCategoryFieldDto
                {
                    Id = x.Id,
                    Name = x.Name,
                    Type = x.Type,
                    MinValue = x.MinValue,
                    MaxValue = x.MaxValue,
                    UnitName = x.UnitName,
                    IsDeleted = x.IsDeleted,
                    CreatedAt = x.CreatedAt
                })
                .OrderBy(x => x.Id);

            return await dtoQuery.ToPaginatedListAsync(pagination);
        }

        public async Task<Result<ProductCategoryFieldDto>> GetProductCategoryFieldById(int id)
        {
            ProductCategoryFieldDto? dto = await _ctx.ProductsCategoryFields
                .Where(x => x.Id == id && !x.IsDeleted)
                .Select(x => new ProductCategoryFieldDto
                {
                    Id = x.Id,
                    Name = x.Name,
                    Type = x.Type,
                    MinValue = x.MinValue,
                    MaxValue = x.MaxValue,
                    UnitName = x.UnitName,
                    IsDeleted = x.IsDeleted,
                    CreatedAt = x.CreatedAt
                })
                .FirstOrDefaultAsync();

            if (dto == null)
                return SharedErrors.NotFound;

            return dto;
        }

        public async Task<Result<List<ProductCategoryMinimalDto>>> GetMinimalProductCategories()
        {
            return await _ctx.ProductCategories
                .Where(x => !x.IsDeleted)
                .Select(x => new ProductCategoryMinimalDto
                {
                    Id = x.Id,
                    Name = x.Name
                })
                .OrderBy(x => x.Name)
                .ToListAsync();
        }

        public async Task<Result<CreatedObjectDto<int>>> AddProductCategory(AddProductCategoryRequest request)
        {
            var valResult = _addCatValidator.ValidateToBzRentalResult(request);
            if (valResult.IsFailure) return valResult;

            ProductCategory cat = new ProductCategory
            {
                Name = request.Name,
                Fields = request.Fields.Select(x => new ProductsCategoryField
                {
                    Name = x.Name,
                    Type = x.Type,
                    MinValue = x.MinValue,
                    MaxValue = x.MaxValue,
                    UnitName = x.UnitName
                }).ToList()
            };

            _ctx.ProductCategories.Add(cat);
            await _ctx.SaveChangesAsync();

            return new CreatedObjectDto<int>(cat.Id);
        }

        public async Task<Result<CreatedObjectDto<int>>> AddProductCategoryField(int categoryId, AddProductCategoryFieldRequest request)
        {
            var valResult = _addCatFieldValidator.ValidateToBzRentalResult(request);
            if (valResult.IsFailure) return valResult;

            ProductsCategoryField field = new ProductsCategoryField
            {
                CategoryId = categoryId,
                Name = request.Name,
                Type = request.Type,
                MinValue = request.MinValue,
                MaxValue = request.MaxValue,
                UnitName = request.UnitName
            };

            _ctx.ProductsCategoryFields.Add(field);
            await _ctx.SaveChangesAsync();

            return new CreatedObjectDto<int>(field.Id);
        }

        public async Task<Result> UpdateProductCategory(int id, UpdateProductCategoryRequest request)
        {
            var valResult = _updateCatValidator.ValidateToBzRentalResult(request);
            if (valResult.IsFailure) return valResult;

            ProductCategory? cat = await _ctx.ProductCategories
                .Where(x => x.Id == id)
                .FirstOrDefaultAsync();

            if (cat == null)
                return SharedErrors.NotFound;

            cat.Name = request.Name;

            await _ctx.SaveChangesAsync();

            return Result.Success();
        }

        public async Task<Result> UpdateProductCategoryField(int id, UpdateProductCategoryFieldRequest request)
        {
            ProductsCategoryField? field = await _ctx.ProductsCategoryFields
                .Where(x => x.Id == id)
                .FirstOrDefaultAsync();

            if (field == null)
                return SharedErrors.NotFound;

            field.Name = request.Name;
            field.MinValue = request.MinValue;
            field.MaxValue = request.MaxValue;
            field.UnitName = request.UnitName;

            await _ctx.SaveChangesAsync();

            return Result.Success();
        }

        public async Task<Result> DeleteProductCategory(int id)
        {
            await _ctx.ProductCategories
                .Where(x => x.Id == id)
                .ExecuteUpdateAsync(setters => setters
                    .SetProperty(x => x.IsDeleted, true));

            return Result.Success();
        }

        public async Task<Result> RecoverProductCategory(int id)
        {
            await _ctx.ProductCategories
                .Where(x => x.Id == id)
                .ExecuteUpdateAsync(setters => setters
                    .SetProperty(x => x.IsDeleted, false));

            return Result.Success();
        }

        public async Task<Result> DeleteProductCategoryField(int id)
        {
            await _ctx.ProductsCategoryFields
                .Where(x => x.Id == id)
                .ExecuteUpdateAsync(setters => setters
                    .SetProperty(x => x.IsDeleted, true));

            return Result.Success();
        }

        public async Task<Result> RecoverProductCategoryField(int id)
        {
            await _ctx.ProductsCategoryFields
                .Where(x => x.Id == id)
                .ExecuteUpdateAsync(setters => setters
                    .SetProperty(x => x.IsDeleted, false));

            return Result.Success();
        }
    }
}
