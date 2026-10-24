using BzRental.Application.Products.Requests;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Text;

namespace BzRental.Application.Products.Validators
{
    public sealed class AddProductCategoryValidator : AbstractValidator<AddProductCategoryRequest>
    {
        public AddProductCategoryValidator(IValidator<AddProductCategoryFieldRequest> fieldValidator)
        {
            RuleFor(x => x.Name)
                .NotEmpty()
                .MaximumLength(255);

            RuleForEach(x => x.Fields)
                .SetValidator(fieldValidator);
        }
    }
}
