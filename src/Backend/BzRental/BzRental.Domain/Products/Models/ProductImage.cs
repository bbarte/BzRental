using BzRental.Shared.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace BzRental.Domain.Products.Models
{
    public class ProductImage : DomainModel
    {
        public Product Product { get; set; } = null!;
        public int ProductId { get; set; }

        public string FileName { get; set; } = string.Empty;
        public string FilePath { get; set; } = string.Empty;
    }
}
