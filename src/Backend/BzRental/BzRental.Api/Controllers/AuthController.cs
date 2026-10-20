using BzRental.Api.Extensions;
using BzRental.Application.Users.Dtos;
using BzRental.Application.Users.Requests;
using BzRental.Application.Users.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace BzRental.Api.Controllers
{
    [Route("api/auth")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _service;

        public AuthController(IAuthService service)
        {
            _service = service;
        }

        [HttpPost("login")]
        public async Task<ActionResult<AuthDto>> Login(
            [FromBody] LoginRequest request)
        {
            return (await _service.Login(request)).ToActionResult();
        }

        [HttpGet("info"), Authorize]
        public async Task<ActionResult<LoggedUserDto>> GetUserInfo()
        {
            return (await _service.GetUserInfo()).ToActionResult();
        }
    }
}
