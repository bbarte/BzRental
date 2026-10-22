using BzRental.Application.Users.Requests;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Text;

namespace BzRental.Application.Users.Validators
{
    public sealed class LoginValidator : AbstractValidator<LoginRequest>
    {
        public LoginValidator()
        {
            RuleFor(x => x.Username)
                .NotEmpty()
                .MaximumLength(25);

            RuleFor(x => x.Password)
                .NotEmpty()
                .MaximumLength(255);
        }
    }
}
