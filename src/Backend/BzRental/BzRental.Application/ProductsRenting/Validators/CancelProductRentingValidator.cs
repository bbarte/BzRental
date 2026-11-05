using BzRental.Application.ProductsRenting.Requests;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Text;

namespace BzRental.Application.ProductsRenting.Validators
{
    public class CancelProductRentingValidator : AbstractValidator<CancelProductRentingRequest>
    {
        public CancelProductRentingValidator()
        {
            RuleFor(x => x.Reason)
                .NotEmpty()
                .MaximumLength(512);
        }
    }
}
