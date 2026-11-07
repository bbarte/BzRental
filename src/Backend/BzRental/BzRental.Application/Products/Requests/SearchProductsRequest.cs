using BzRental.Shared.Contracts.Requests;
using System;
using System.Collections.Generic;
using System.Text;

namespace BzRental.Application.Products.Requests
{
    public sealed class SearchProductsFieldValueFilter : Request
    {
        public int FieldId { get; set; }

        public List<string> AllowedTextValues { get; set; } = new();
        public bool? ExactBoolValue { get; set; } = null;

        public double? ExactNumberValue { get; set; }

        public double? NumberValueFrom { get; set; }
        public double? NumberValueTo { get; set; }
    }

    public sealed class SearchProductsRequest : Request
    {
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }

        public string Name { get; set; } = string.Empty;

        public decimal? DailyPriceFrom { get; set; }
        public decimal? DailyPriceTo { get; set; }

        public double? RatingFrom { get; set; }
        public double? RatingTo { get; set; }

        public List<SearchProductsFieldValueFilter> FieldValueFilters { get; set; } = new();
    }
}
