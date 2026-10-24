using BzRental.Application.Products.Requests;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Text;

namespace BzRental.Application.Products.Validators
{
    public sealed class UpdateProductCategoryFieldValidator : AbstractValidator<UpdateProductCategoryFieldRequest>
    {
        public UpdateProductCategoryFieldValidator()
        {
            RuleFor(x => x.Name)
                .NotEmpty()
                .MaximumLength(255);

            RuleFor(x => x.UnitName)
                .MaximumLength(50);
        }
    }
}
