using BzRental.Application.Users.Requests;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Text;

namespace BzRental.Application.Users.Validators
{
    public class ChangeUserPasswordValidator : AbstractValidator<ChangeUserPasswordRequest>
    {
        public ChangeUserPasswordValidator()
        {
            RuleFor(x => x.CurrentPassword)
                .NotEmpty()
                .MaximumLength(255);

            RuleFor(x => x.NewPassword)
                .NotEmpty()
                .MaximumLength(255);

            RuleFor(x => x.NewPassword)
                .NotEqual(x => x.CurrentPassword)
                .WithErrorCode("NewAndCurrentPasswordsCantBeTheSame")
                .WithMessage("New and old passwords cannot be the same");
        }
    }
}
