using BzRental.Application.Products.Requests;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Text;

namespace BzRental.Application.Products.Validators
{
    public sealed class AddUpdateProductReviewValidator : AbstractValidator<AddUpdateProductReviewRequest>
    {
        public AddUpdateProductReviewValidator()
        {
            RuleFor(x => x.Content)
                .NotEmpty()
                .MaximumLength(1024);

            RuleFor(x => x.Rating)
                .NotEmpty()
                .GreaterThanOrEqualTo(1)
                .LessThanOrEqualTo(5);
        }
    }
}
