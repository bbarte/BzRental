using BzRental.Shared.Contracts.Requests;
using System;
using System.Collections.Generic;
using System.Text;

namespace BzRental.Application.Products.Requests
{
    public sealed class SetProductFieldValueRequest : Request
    {
        public int FieldId { get; set; }

        public string? TextValue { get; set; }
        public double? NumberValue { get; set; }
        public bool? BoolValue { get; set; }
    }
}
