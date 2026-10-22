using BzRental.Application.Users.Dtos;
using BzRental.Application.Users.Errors;
using BzRental.Application.Users.Requests;
using BzRental.DbAccess.Contexts;
using BzRental.Shared.Abstraction;
using BzRental.Shared.Errors;
using BzRental.Shared.Extensions;
using BzRental.Shared.ResultPattern;
using FluentValidation;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;

namespace BzRental.Application.Users.Services
{
    public sealed class AuthService : IAuthService
    {
        private readonly BzRentalDbContext _ctx;
        private readonly ISharedPasswordHasher _hasher;
        private readonly ITokenCreationService _tokenService;
        private readonly IUserProvider _userProvider;

        private readonly IValidator<LoginRequest> _loginValidator;

        public AuthService(
            BzRentalDbContext ctx,
            ISharedPasswordHasher hasher,
            ITokenCreationService tokenService,
            IUserProvider userProvider,
            IValidator<LoginRequest> loginValidator)
        {
            _ctx = ctx;
            _hasher = hasher;
            _tokenService = tokenService;
            _userProvider = userProvider;
            _loginValidator = loginValidator;
        }

        public async Task<Result<AuthDto>> Login(LoginRequest request)
        {
            var valResult = _loginValidator.ValidateToBzRentalResult(request);
            if (valResult.IsFailure) return valResult;

            var userInfo = await _ctx.Users
                .Where(x => x.Username == request.Username && !x.IsDeleted)
                .Select(x => new
                {
                    x.Id,
                    x.IsAdmin,
                    x.IsBlocked,
                    x.PasswordHash
                })
                .FirstOrDefaultAsync();

            if (userInfo == null)
                return AuthErrors.LoginFailed;

            if (userInfo.IsBlocked)
                return AuthErrors.Blocked;

            if (!_hasher.VerifyPassword(userInfo.PasswordHash, request.Password))
                return AuthErrors.LoginFailed;

            string role = userInfo.IsAdmin
                ? AuthRoles.Admin
                : AuthRoles.NormalUser;

            string jwt = _tokenService.GenerateAccessToken(userInfo.Id, role);

            return new AuthDto
            {
                AccessToken = jwt,
                IsAdmin = userInfo.IsAdmin
            };
        }

        public async Task<Result<LoggedUserDto>> GetUserInfo()
        {
            var getUserResult = _userProvider.GetUser();
            if (getUserResult.IsFailure) return getUserResult.FailedCast<LoggedUserDto>();

            SharedUser loggedUser = getUserResult.Value;

            LoggedUserDto? dto = await _ctx.Users
                .Where(x => x.Id == loggedUser.Id)
                .Select(x => new LoggedUserDto
                {
                    FirstName = x.FirstName,
                    LastName = x.LastName,
                    Username = x.Username
                })
                .FirstOrDefaultAsync();

            if (dto == null)
                return SharedErrors.NotFound;

            return dto;
        }
    }
}
