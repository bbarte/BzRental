using BzRental.Shared.Contracts.Requests;
using System;
using System.Collections.Generic;
using System.Text;

namespace BzRental.Application.Products.Requests
{
    public sealed class UpdateProductCategoryRequest : Request
    {
        public string Name { get; set; } = string.Empty;
    }
}
