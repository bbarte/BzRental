using BzRental.Application.Users.Errors;
using BzRental.Application.Users.Requests;
using BzRental.DbAccess.Contexts;
using BzRental.Domain.Users.Models;
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
    public sealed class UsersService : IUsersService
    {
        private readonly BzRentalDbContext _ctx;
        private readonly IUserProvider _userProvider;
        private readonly ISharedPasswordHasher _hasher;

        private readonly IValidator<RegisterUserRequest> _registerValidator;
        private readonly IValidator<ChangeUserPasswordRequest> _changePasswordValidator;

        public UsersService(
            BzRentalDbContext ctx,
            IUserProvider userProvider,
            ISharedPasswordHasher hasher,
            IValidator<RegisterUserRequest> registerValidator,
            IValidator<ChangeUserPasswordRequest> changePasswordValidator)
        {
            _ctx = ctx;
            _userProvider = userProvider;
            _hasher = hasher;
            _registerValidator = registerValidator;
            _changePasswordValidator = changePasswordValidator;
        }

        public async Task<Result> Register(RegisterUserRequest request)
        {
            var valResult = _registerValidator.ValidateToBzRentalResult(request);
            if (valResult.IsFailure) return valResult;

            if (await _ctx.Users.AnyAsync(x => x.Username == request.Username))
                return UserErrors.UsernameTaken;

            User user = new User
            {
                FirstName = request.FirstName,
                LastName = request.LastName,
                Username = request.Username,
                PasswordHash = _hasher.HashPassword(request.Password)
            };

            _ctx.Users.Add(user);
            await _ctx.SaveChangesAsync();

            return Result.Success();
        }

        public async Task<Result> ChangePassword(ChangeUserPasswordRequest request)
        {
            var valResult = _changePasswordValidator.ValidateToBzRentalResult(request);
            if (valResult.IsFailure) return valResult;

            var getUserResult = _userProvider.GetUser();
            if (getUserResult.IsFailure) return getUserResult;

            SharedUser loggedUser = getUserResult.Value;

            var userInfo = await _ctx.Users
                .Where(x => x.Id == loggedUser.Id)
                .Select(x => new
                {
                    x.PasswordHash
                })
                .FirstOrDefaultAsync();

            if (userInfo == null)
                return SharedErrors.NotFound;

            if (!_hasher.VerifyPassword(userInfo.PasswordHash, request.CurrentPassword))
                return UserErrors.InvalidCurrentPassword;

            string hash = _hasher.HashPassword(request.NewPassword);

            await _ctx.Users
                .Where(x => x.Id == loggedUser.Id)
                .ExecuteUpdateAsync(setters => setters
                    .SetProperty(x => x.PasswordHash, hash));

            return Result.Success();
        }
    }
}
