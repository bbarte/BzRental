using BzRental.Shared.Contracts.Dtos;
using System;
using System.Collections.Generic;
using System.Text;

namespace BzRental.Application.Products.Dtos
{
    public sealed class ProductAvailibiltyPlannedRentingDto : Dto
    {
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
    }

    public sealed class ProductAvailabilityDto : Dto
    {
        public bool IsAvailable { get; set; } = false;
        public List<ProductAvailibiltyPlannedRentingDto> PlannedRentings { get; set; } = new();
    }
}
