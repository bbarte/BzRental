using BzRental.Application.Products.Dtos;
using BzRental.DbAccess.Contexts;
using BzRental.Domain.Products.Enums;
using BzRental.Domain.Products.Models;
using BzRental.Shared.ResultPattern;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;

namespace BzRental.Application.Products.Services
{
    public class ProductsSelectingService : IProductsSelectingService
    {
        private class TempDistinctFieldValue
        {
            public int FieldId { get; set; }
            public string Value { get; set; } = string.Empty;
        }

        private readonly BzRentalDbContext _ctx;

        public ProductsSelectingService(BzRentalDbContext ctx)
        {
            _ctx = ctx;
        }

        public async Task<Result<List<ProductCategoryDistinctFieldValuesDto>>> GetDistinctCategoryFieldValues(int categoryId)
        {
            List<ProductsCategoryField> fieldDefinitions = await _ctx.ProductsCategoryFields
                .Where(x => x.CategoryId == categoryId)
                .Select(x => new ProductsCategoryField
                {
                    Id = x.Id,
                    Name = x.Name,
                    Type = x.Type,
                    UnitName = x.UnitName
                })
                .ToListAsync();

            IQueryable<TempDistinctFieldValue>? combinedDistinctQuery = null;

            foreach (ProductsCategoryField fieldDef in fieldDefinitions)
            {
                IQueryable<TempDistinctFieldValue>? query = null;

                if (fieldDef.Type == ProductsCategoryFieldType.Text)
                {
                    query = _ctx.ProductFieldValues
                        .Where(x => x.FieldId == fieldDef.Id)
                        .Select(x => new TempDistinctFieldValue
                        {
                            FieldId = x.FieldId,
                            Value = x.TextValue
                        });
                }
                else if (fieldDef.Type is ProductsCategoryFieldType.Integer or ProductsCategoryFieldType.Decimal)
                {
                    query = _ctx.ProductFieldValues
                        .Where(x => x.FieldId == fieldDef.Id)
                        .Select(x => new TempDistinctFieldValue
                        {
                            FieldId = x.FieldId,
                            Value = x.NumberValue.ToString()
                        });
                }

                if (query != null)
                {
                    combinedDistinctQuery = combinedDistinctQuery == null
                        ? query
                        : combinedDistinctQuery.Union(query);
                }
            }

            List<TempDistinctFieldValue> values = combinedDistinctQuery != null
                ? await combinedDistinctQuery.ToListAsync()
                : [];

            List<ProductCategoryDistinctFieldValuesDto> result = new();

            foreach (ProductsCategoryField fieldDef in fieldDefinitions)
            {
                result.Add(new ProductCategoryDistinctFieldValuesDto
                {
                    CategoryId = categoryId,
                    Id = fieldDef.Id,
                    Name = fieldDef.Name,
                    Type = fieldDef.Type,
                    UnitName = fieldDef.UnitName,
                    Items = values.Where(x => x.FieldId == fieldDef.Id)
                        .Select(x => x.Value).ToList()
                });
            }

            return result;
        }
    }
}
