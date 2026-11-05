using BzRental.Application.ProductsRenting.Requests;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Text;

namespace BzRental.Application.ProductsRenting.Validators
{
    public class CheckoutProductRentingValidator : AbstractValidator<CheckoutProductRentingRequest>
    {
        public CheckoutProductRentingValidator()
        {
            RuleFor(x => x.Comments)
                .MaximumLength(255);
        }
    }
}
