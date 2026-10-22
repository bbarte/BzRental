using BzRental.Application.Users.Dtos;
using BzRental.Application.Users.Requests;
using BzRental.Shared.ResultPattern;
using System;
using System.Collections.Generic;
using System.Text;

namespace BzRental.Application.Users.Services
{
    public interface IAuthService
    {
        Task<Result<AuthDto>> Login(LoginRequest request);
        Task<Result<LoggedUserDto>> GetUserInfo();
    }
}
