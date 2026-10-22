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

        [HttpDelete("{id}"), Authorize(Roles = AuthRoles.Admin)]
        public async Task<IActionResult> DeleteUser(
            [FromRoute] int id)
        {
            return (await _service.DeleteUser(id)).ToActionResult();
        }
        
        [HttpPost("{id}/recover"), Authorize(Roles = AuthRoles.Admin)]
        public async Task<IActionResult> RecoverUser(
            [FromRoute] int id)
        {
            return (await _service.RecoverUser(id)).ToActionResult();
        }
        
        [HttpPost("{id}/block"), Authorize(Roles = AuthRoles.Admin)]
        public async Task<IActionResult> BlockUser(
            [FromRoute] int id)
        {
            return (await _service.BlockUser(id)).ToActionResult();
        }
        
        [HttpPost("{id}/unblock"), Authorize(Roles = AuthRoles.Admin)]
        public async Task<IActionResult> UnblockUser(
            [FromRoute] int id)
        {
            return (await _service.UnblockUser(id)).ToActionResult();
        }
        
        [HttpPost("{id}/grant-admin"), Authorize(Roles = AuthRoles.Admin)]
        public async Task<IActionResult> GrantAdmin(
            [FromRoute] int id)
        {
            return (await _service.GrantAdmin(id)).ToActionResult();
        }
        
        [HttpPost("{id}/revoke-admin"), Authorize(Roles = AuthRoles.Admin)]
        public async Task<IActionResult> RevokeAdmin(
            [FromRoute] int id)
        {
            return (await _service.RevokeAdmin(id)).ToActionResult();
        }
    }
}
