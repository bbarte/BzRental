using BzRental.Application.Products.Requests;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Text;

namespace BzRental.Application.Products.Validators
{
    public sealed class AddProductCategoryFieldValidator : AbstractValidator<AddProductCategoryFieldRequest>
    {
        public AddProductCategoryFieldValidator()
        {
            RuleFor(x => x.Name)
                .NotEmpty()
                .MaximumLength(255);

            RuleFor(x => x.UnitName)
                .NotEmpty()
                .MaximumLength(50);
        }
    }
}
