using BzRental.Shared.Contracts.Requests;
using System;
using System.Collections.Generic;
using System.Text;

namespace BzRental.Application.Products.Requests
{
    public sealed class AddUpdateProductReviewRequest : Request
    {
        public int Rating { get; set; } = 0;
        public string Content { get; set; } = string.Empty;
    }
}
