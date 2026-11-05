using BzRental.Shared.Contracts.Requests;
using System;
using System.Collections.Generic;
using System.Text;

namespace BzRental.Application.Products.Requests
{
    public sealed class UpdateProductRequest : Request
    {
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal DailyPrice { get; set; } = 0m;

        public int CategoryId { get; set; }

        public bool UpdateFieldValues { get; set; } = false;
        public List<SetProductFieldValueRequest>? FieldValues { get; set; }
    }
}
