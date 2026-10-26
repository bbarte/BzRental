using BzRental.Application.Products.Requests;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Text;

namespace BzRental.Application.Products.Validators
{
    public sealed class SetProductFieldValueValidator : AbstractValidator<SetProductFieldValueRequest>
    {
        public SetProductFieldValueValidator()
        {
            RuleFor(x => x.FieldId)
                .NotEmpty();

            RuleFor(x => x.TextValue)
                .MaximumLength(512);
        }
    }
}
