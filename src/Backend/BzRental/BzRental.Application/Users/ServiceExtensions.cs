using BzRental.Application.Users.Requests;
using BzRental.Application.Users.Services;
using BzRental.Application.Users.Validators;
using FluentValidation;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Text;

namespace BzRental.Application.Users
{
    public static class ServiceExtensions
    {
        public static IServiceCollection AddUserServices(this IServiceCollection services)
        {
            services.AddScoped<IValidator<LoginRequest>, LoginValidator>();
            services.AddScoped<IValidator<RegisterUserRequest>, RegisterUserValidator>();
            services.AddScoped<IValidator<ChangeUserPasswordRequest>, ChangeUserPasswordValidator>();

            services.AddScoped<IAuthService, AuthService>();
            services.AddScoped<IUsersService, UsersService>();

            return services;
        }
    }
}
