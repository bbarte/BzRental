using BzRental.Application.Products.Dtos;
using BzRental.Application.Products.Requests;
using BzRental.DbAccess.Contexts;
using BzRental.Domain.Products.Enums;
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
    public class ProductsManagementService : IProductsManagementService
    {
        private readonly BzRentalDbContext _ctx;
        private readonly IValidator<AddProductRequest> _addValidator;
        private readonly IValidator<UpdateProductRequest> _updateValidator;

        public ProductsManagementService(BzRentalDbContext ctx, IValidator<AddProductRequest> addValidator, IValidator<UpdateProductRequest> updateValidator)
        {
            _ctx = ctx;
            _addValidator = addValidator;
            _updateValidator = updateValidator;
        }

        public async Task<Result<List<ProductFieldInfoDto>>> GetFieldsInfoForCategory(int id)
        {
            return await _ctx.ProductsCategoryFields
                .Where(x => x.CategoryId == id)
                .Select(x => new ProductFieldInfoDto
                {
                    Id = x.Id,
                    Name = x.Name,
                    Type = x.Type,
                    UnitName = x.UnitName
                })
                .ToListAsync();
        }

        public async Task<Result<List<ProductFieldInfoDto>>> GetFieldsInfoForProductById(int id)
        {
            int? productsCategoryId = await _ctx.Products
                .Where(x => x.Id == id)
                .Select(x => x.CategoryId)
                .FirstOrDefaultAsync();

            if (productsCategoryId == null)
                return SharedErrors.NotFound;

            return await _ctx.ProductsCategoryFields
                .Where(x => x.CategoryId == productsCategoryId)
                .Select(x => new ProductFieldInfoDto
                {
                    Id = x.Id,
                    Name = x.Name,
                    Type = x.Type,
                    UnitName = x.UnitName,

                    TextValue = _ctx.ProductFieldValues
                        .Where(y => y.ProductId == id && y.FieldId == x.Id)
                        .Select(x => x.TextValue)
                        .FirstOrDefault(),

                    NumberValue = _ctx.ProductFieldValues
                        .Where(y => y.ProductId == id && y.FieldId == x.Id)
                        .Select(x => x.NumberValue)
                        .FirstOrDefault(),

                    BoolValue = _ctx.ProductFieldValues
                        .Where(y => y.ProductId == id && y.FieldId == x.Id)
                        .Select(x => x.BoolValue)
                        .FirstOrDefault()
                })
                .ToListAsync();
        }

        public async Task<Result<CreatedObjectDto<int>>> AddProduct(AddProductRequest request)
        {
            var valResult = _addValidator.ValidateToBzRentalResult(request);
            if (valResult.IsFailure) return valResult;

            Dictionary<int, ProductsCategoryFieldType> fieldTypes = await _ctx.ProductsCategoryFields
                .Where(x => request.FieldValues.Select(x => x.FieldId).Distinct().Contains(x.Id))
                .Select(x => new
                {
                    x.Id,
                    x.Type
                })
                .ToDictionaryAsync(x => x.Id, x => x.Type);

            Product prod = new Product
            {
                Name = request.Name,
                Description = request.Description,
                HourPrice = request.HourPrice,
                CategoryId = request.CategoryId
            };

            foreach (SetProductFieldValueRequest setFieldReq in request.FieldValues.DistinctBy(x => x.FieldId))
            {
                ProductFieldValue dbField = new ProductFieldValue
                {
                    FieldId = setFieldReq.FieldId
                };

                switch (fieldTypes[setFieldReq.FieldId])
                {
                    case ProductsCategoryFieldType.Text:
                        if (string.IsNullOrWhiteSpace(setFieldReq.TextValue))
                            continue;
                        else
                            dbField.TextValue = setFieldReq.TextValue;

                        break;
                    case ProductsCategoryFieldType.Boolean:
                        if (!setFieldReq.BoolValue.HasValue)
                            continue;
                        else
                            dbField.BoolValue = setFieldReq.BoolValue.Value;

                        break;
                    case ProductsCategoryFieldType.Integer:
                    case ProductsCategoryFieldType.Decimal:
                        if (!setFieldReq.NumberValue.HasValue)
                            continue;
                        else
                            dbField.NumberValue = setFieldReq.NumberValue.Value;

                        break;
                }

                prod.FieldValues.Add(dbField);
            }

            _ctx.Products.Add(prod);
            await _ctx.SaveChangesAsync();

            return new CreatedObjectDto<int>(prod.Id);
        }

        public async Task<Result> UpdateProduct(int id, UpdateProductRequest request)
        {
            var valResult = _updateValidator.ValidateToBzRentalResult(request);
            if (valResult.IsFailure) return valResult;

            Product? prod = await _ctx.Products
                .Where(x => x.Id == id)
                .Include(x => x.FieldValues)
                .FirstOrDefaultAsync();

            if (prod == null)
                return SharedErrors.NotFound;

            prod.Name = request.Name;
            prod.Description = request.Description;
            prod.HourPrice = request.HourPrice;
            prod.CategoryId = request.CategoryId;

            if (request.UpdateFieldValues)
            {
                foreach (ProductFieldValue dbField in prod.FieldValues)
                {
                    SetProductFieldValueRequest? setRequest = request.FieldValues?
                        .FirstOrDefault(x => x.FieldId == dbField.FieldId);

                    if (setRequest == null) continue;

                    if (!string.IsNullOrWhiteSpace(setRequest.TextValue))
                        dbField.TextValue = setRequest.TextValue;

                    if (setRequest.BoolValue.HasValue)
                        dbField.BoolValue = setRequest.BoolValue.Value;

                    if (setRequest.NumberValue.HasValue)
                        dbField.NumberValue = setRequest.NumberValue.Value;
                }
            }

            await _ctx.SaveChangesAsync();

            return Result.Success();
        }

        public async Task<Result> DeleteProduct(int id)
        {
            await _ctx.Products
                .Where(x => x.Id == id)
                .ExecuteUpdateAsync(setters => setters
                    .SetProperty(x => x.IsDeleted, true));

            return Result.Success();
        }

        public async Task<Result> RecoverProduct(int id)
        {
            await _ctx.Products
                .Where(x => x.Id == id)
                .ExecuteUpdateAsync(setters => setters
                    .SetProperty(x => x.IsDeleted, false));

            return Result.Success();
        }
    }
}
