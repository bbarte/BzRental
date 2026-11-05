using BzRental.Application.ProductsRenting.Requests;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Text;

namespace BzRental.Application.ProductsRenting.Validators
{
    public class ConfirmProductRentingPlanHandoverValidator : AbstractValidator<ConfirmProductRentingPlanHandoverRequest>
    {
        public ConfirmProductRentingPlanHandoverValidator()
        {
            RuleFor(x => x.Comments)
                .MaximumLength(512);
        }
    }
}
