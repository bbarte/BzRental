using BzRental.Shared.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace BzRental.Domain.Products.Models
{
    public class ProductCategory : DomainModel, ISoftDeletable
    {
        public string Name { get; set; } = string.Empty;

        public List<ProductsCategoryField> Fields { get; set; } = new();

        public bool IsDeleted { get; set; } = false;
    }
}
