using BzRental.Application.Products.Requests;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Text;

namespace BzRental.Application.Products.Validators
{
    public class SearchProductsValidator : AbstractValidator<SearchProductsRequest>
    {
        public SearchProductsValidator(IValidator<SearchProductsFieldValueFilter> fieldValuesValidator)
        {
            RuleForEach(x => x.FieldValueFilters)
                .SetValidator(fieldValuesValidator);

            RuleFor(x => x.Name)
                .MaximumLength(512);

            RuleFor(x => x.EndDate)
                .GreaterThan(x => x.StartDate);

            //RuleFor(x => x.FieldValueFilters)
            //    .Must(list => list.Count <= 50);
        }
    }
}
