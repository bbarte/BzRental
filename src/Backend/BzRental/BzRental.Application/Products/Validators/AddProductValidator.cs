using BzRental.Application.Products.Requests;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Text;

namespace BzRental.Application.Products.Validators
{
    public sealed class AddProductValidator : AbstractValidator<AddProductRequest>
    {
        public AddProductValidator(IValidator<SetProductFieldValueRequest> fieldsValidator)
        {
            RuleFor(x => x.Name)
                .NotEmpty()
                .MaximumLength(512);

            RuleFor(x => x.Description)
                .MaximumLength(2048);

            RuleFor(x => x.HourPrice)
                .NotEmpty()
                .GreaterThan(0);

            RuleFor(x => x.CategoryId)
                .NotEmpty();

            RuleForEach(x => x.FieldValues)
                .SetValidator(fieldsValidator);
        }
    }
}
