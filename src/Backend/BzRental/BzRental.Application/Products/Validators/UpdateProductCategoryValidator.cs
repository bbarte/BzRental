using BzRental.Application.Products.Requests;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Text;

namespace BzRental.Application.Products.Validators
{
    public sealed class UpdateProductCategoryValidator : AbstractValidator<UpdateProductCategoryRequest>
    {
        public UpdateProductCategoryValidator()
        {
            RuleFor(x => x.Name)
                .NotEmpty()
                .MaximumLength(255);
        }
    }
}
