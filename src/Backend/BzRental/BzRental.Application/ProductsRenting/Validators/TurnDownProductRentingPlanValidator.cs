using BzRental.Application.ProductsRenting.Requests;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Text;

namespace BzRental.Application.ProductsRenting.Validators
{
    public class TurnDownProductRentingPlanValidator : AbstractValidator<TurnDownProductRentingPlanRequest>
    {
        public TurnDownProductRentingPlanValidator()
        {
            RuleFor(x => x.Comments)
                .MaximumLength(512);
        }
    }
}
