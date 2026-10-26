using BzRental.Shared.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace BzRental.Domain.Products.Models
{
    public class ProductFieldValue : DomainModel
    {
        public Product Product { get; set; } = null!;
        public int ProductId { get; set; }

        public ProductsCategoryField Field { get; set; } = null!;
        public int FieldId { get; set; }

        public string TextValue { get; set; } = string.Empty;
        public double NumberValue { get; set; } = 0d;
        public bool BoolValue { get; set; }
    }
}
