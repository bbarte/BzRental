using BzRental.Application.Users.Dtos;
using BzRental.Application.Users.Errors;
using BzRental.Application.Users.Requests;
using BzRental.DbAccess.Contexts;
using BzRental.DbAccess.Extensions;
using BzRental.Domain.Users.Models;
using BzRental.Shared.Abstraction;
using BzRental.Shared.Contracts.Dtos;
using BzRental.Shared.Errors;
using BzRental.Shared.Extensions;
using BzRental.Shared.Pagination;
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

        public async Task<Result<PaginatedList<UserDto>>> GetUsers(
            PaginationParameters pagination,
            string? filter = null,
            bool includeDeleted = false)
        {
            IQueryable<User> query = _ctx.Users;

            if (!includeDeleted)
                query = query.Where(x => !x.IsDeleted);

            if (!string.IsNullOrWhiteSpace(filter))
            {
                foreach (string keyword in filter.Split(' ').Take(10))
                {
                    query = query.Where(x =>
                        x.Username.Contains(keyword) ||
                        x.FirstName.Contains(keyword) ||
                        x.LastName.Contains(keyword));
                }
            }

            IQueryable<UserDto> dtoQuery = query
                .Select(x => new UserDto
                {
                    Id = x.Id,
                    FirstName = x.FirstName,
                    LastName = x.LastName,
                    Username = x.Username,
                    IsAdmin = x.IsAdmin,
                    IsDeleted = x.IsDeleted,
                    IsBlocked = x.IsBlocked,

                    CreatedAt = x.CreatedAt
                })
                .OrderBy(x => x.Id);

            return await dtoQuery.ToPaginatedListAsync(pagination);
        }

        public async Task<Result> DeleteUser(int id)
        {
            var userInfo = await _ctx.Users
                .Where(x => x.Id == id)
                .Select(x => new
                {
                    x.IsAdmin
                })
                .FirstOrDefaultAsync();

            if (userInfo == null)
                return SharedErrors.NotFound;

            bool areThereAnyOtherAdmins = !userInfo.IsAdmin
                ? true
                : await _ctx.Users.AnyAsync(x =>
                    x.IsAdmin && !x.IsDeleted && !x.IsBlocked && x.Id != id);

            if (!areThereAnyOtherAdmins)
                return UserErrors.OperationWouldBlockAccess;

            await _ctx.Users
                .Where(x => x.Id == id)
                .ExecuteUpdateAsync(setters => setters
                    .SetProperty(x => x.IsDeleted, true));

            return Result.Success();
        }

        public async Task<Result> RecoverUser(int id)
        {
            await _ctx.Users
                .Where(x => x.Id == id)
                .ExecuteUpdateAsync(setters => setters
                    .SetProperty(x => x.IsDeleted, false));

            return Result.Success();
        }

        public async Task<Result> BlockUser(int id)
        {
            var userInfo = await _ctx.Users
                .Where(x => x.Id == id)
                .Select(x => new
                {
                    x.IsAdmin
                })
                .FirstOrDefaultAsync();

            if (userInfo == null)
                return SharedErrors.NotFound;

            bool areThereAnyOtherAdmins = !userInfo.IsAdmin
                ? true
                : await _ctx.Users.AnyAsync(x =>
                    x.IsAdmin && !x.IsDeleted && !x.IsBlocked && x.Id != id);

            if (!areThereAnyOtherAdmins)
                return UserErrors.OperationWouldBlockAccess;

            await _ctx.Users
                .Where(x => x.Id == id)
                .ExecuteUpdateAsync(setters => setters
                    .SetProperty(x => x.IsBlocked, true));

            return Result.Success();
        }

        public async Task<Result> UnblockUser(int id)
        {
            await _ctx.Users
                .Where(x => x.Id == id)
                .ExecuteUpdateAsync(setters => setters
                    .SetProperty(x => x.IsBlocked, false));

            return Result.Success();
        }

        public async Task<Result> GrantAdmin(int id)
        {
            await _ctx.Users
                .Where(x => x.Id == id)
                .ExecuteUpdateAsync(setters => setters
                    .SetProperty(x => x.IsAdmin, true));

            return Result.Success();
        }

        public async Task<Result> RevokeAdmin(int id)
        {
            var userInfo = await _ctx.Users
               .Where(x => x.Id == id)
               .Select(x => new
               {
                   x.IsAdmin
               })
               .FirstOrDefaultAsync();

            if (userInfo == null || !userInfo.IsAdmin)
                return SharedErrors.NotFound;

            bool areThereAnyOtherAdmins = 
                await _ctx.Users.AnyAsync(x =>
                    x.IsAdmin && !x.IsDeleted && !x.IsBlocked && x.Id != id);

            if (!areThereAnyOtherAdmins)
                return UserErrors.OperationWouldBlockAccess;

            await _ctx.Users
                .Where(x => x.Id == id)
                .ExecuteUpdateAsync(setters => setters
                    .SetProperty(x => x.IsAdmin, false));

            return Result.Success();
        }
    }
}
