using BzRental.Application.ProductsRenting.Requests;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Text;

namespace BzRental.Application.ProductsRenting.Validators
{
    public class PlanProductRentingValidator : AbstractValidator<PlanProductRentingRequest>
    {
        public PlanProductRentingValidator()
        {
            RuleFor(x => x.UserComments)
                .MaximumLength(512);

            RuleFor(x => x.EndDate)
                .GreaterThan(x => x.StartDate);
        }
    }
}
