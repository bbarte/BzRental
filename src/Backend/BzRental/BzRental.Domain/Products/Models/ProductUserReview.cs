using BzRental.Domain.Users.Models;
using BzRental.Shared.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace BzRental.Domain.Products.Models
{
    public class ProductUserReview : DomainModel
    {
        public Product Product { get; set; } = null!;
        public int ProductId { get; set; }

        public User CreatedBy { get; set; } = null!;
        public int CreatedById { get; set; }

        public int Rating { get; set; } = 0;
        public string Content { get; set; } = string.Empty;

        public DateTime? ModifiedAt { get; set; }
    }
}
