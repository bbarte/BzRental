using BzRental.Application.Users.Dtos;
using BzRental.Application.Users.Requests;
using BzRental.Shared.Contracts.Dtos;
using BzRental.Shared.Pagination;
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
        Task<Result<PaginatedList<UserDto>>> GetUsers(PaginationParameters pagination, string? filter = null, bool includeDeleted = false);

        Task<Result> DeleteUser(int id);
        Task<Result> RecoverUser(int id);
        Task<Result> BlockUser(int id);
        Task<Result> UnblockUser(int id);

        Task<Result> GrantAdmin(int id);
        Task<Result> RevokeAdmin(int id);
    }
}
