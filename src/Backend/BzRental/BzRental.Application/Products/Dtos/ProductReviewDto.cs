using BzRental.Shared.Contracts.Dtos;
using System;
using System.Collections.Generic;
using System.Text;

namespace BzRental.Application.Products.Dtos
{
    public sealed class ProductReviewDto : TimestampDto
    {
        public int Id { get; set; }

        public string CreatedBy { get; set; } = string.Empty;
        public int CreatedById { get; set; }

        public int Rating { get; set; }
        public string Content { get; set; } = string.Empty;

        public DateTime? ModifiedAt { get; set; }
    }
}
