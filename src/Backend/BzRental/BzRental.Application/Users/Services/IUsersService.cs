using BzRental.Application.Users.Requests;
using BzRental.Shared.Contracts.Dtos;
using BzRental.Shared.ResultPattern;
using System;
using System.Collections.Generic;
using System.Text;

namespace BzRental.Application.Users.Services
{
    public interface IUsersService
    {
        Task<Result> Register(RegisterUserRequest request);
        Task<Result> ChangePassword(ChangeUserPasswordRequest request);
    }
}
