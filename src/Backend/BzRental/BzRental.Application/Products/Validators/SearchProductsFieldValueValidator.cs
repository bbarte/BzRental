using BzRental.Application.Products.Requests;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Text;

namespace BzRental.Application.Products.Validators
{
    public class SearchProductsFieldValueValidator : AbstractValidator<SearchProductsFieldValueFilter>
    {
        public SearchProductsFieldValueValidator()
        {
            RuleFor(x => x.FieldId)
                .NotEmpty();

            RuleForEach(x => x.AllowedTextValues)
                .MaximumLength(512);

            //RuleFor(x => x.AllowedTextValues)
            //    .Must(list => list.Count <= 20);
        }
    }
}
