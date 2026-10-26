using BzRental.Shared.Contracts.Dtos;
using System;
using System.Collections.Generic;
using System.Text;

namespace BzRental.Application.Products.Dtos
{
    public sealed class ProductCategoryMinimalDto : Dto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
    }
}
