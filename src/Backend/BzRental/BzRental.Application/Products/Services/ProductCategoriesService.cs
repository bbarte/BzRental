using BzRental.Application.Products.Requests;
using BzRental.DbAccess.Contexts;
using BzRental.Domain.Products.Models;
using BzRental.Shared.Contracts.Dtos;
using BzRental.Shared.Errors;
using BzRental.Shared.Extensions;
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
            request.MaxValue = request.MaxValue;
            request.UnitName = request.UnitName;

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
