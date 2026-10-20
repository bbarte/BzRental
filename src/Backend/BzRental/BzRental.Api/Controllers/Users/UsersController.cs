using BzRental.Api.Extensions;
using BzRental.Application.Users;
using BzRental.Application.Users.Dtos;
using BzRental.Application.Users.Requests;
using BzRental.Application.Users.Services;
using BzRental.Shared.Contracts.Dtos;
using BzRental.Shared.Pagination;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace BzRental.Api.Controllers.Users
{
    [Route("api/users")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly IUsersService _service;

        public UsersController(IUsersService service)
        {
            _service = service;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(
            [FromBody] RegisterUserRequest request)
        {
            return (await _service.Register(request)).ToActionResult();
        }

        [HttpPost("change-password"), Authorize]
        public async Task<IActionResult> ChangePassword(
            [FromBody] ChangeUserPasswordRequest requset)
        {
            return (await _service.ChangePassword(requset)).ToActionResult();
        }

        [HttpGet, Authorize(Roles = AuthRoles.Admin)]
        public async Task<ActionResult<PaginatedList<UserDto>>> GetUsers(
            [FromQuery] PaginationParameters pagination,
            [FromQuery] string? filter = null,
            [FromQuery] bool includeDeleted = false)
        {
            return (await _service.GetUsers(pagination, filter, includeDeleted)).ToActionResult();
        }
    }
}
