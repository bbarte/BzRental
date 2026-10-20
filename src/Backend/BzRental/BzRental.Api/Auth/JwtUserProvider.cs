using BzRental.Shared.Abstraction;
using BzRental.Shared.ResultPattern;
using System.Security.Claims;

namespace BzRental.Api.Auth
{
    public class JwtUserProvider : IUserProvider
    {
        private readonly IHttpContextAccessor _httpContextAccessor;

        public JwtUserProvider(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }

        private bool CheckHttpAccessor()
        {
            if (_httpContextAccessor.HttpContext == null)
                return false;

            if (_httpContextAccessor.HttpContext.User.Identity == null)
                return false;

            if (!_httpContextAccessor.HttpContext.User.Identity.IsAuthenticated)
                return false;

            return true;
        }

        public Result<SharedUser> GetUser()
        {
            if (!CheckHttpAccessor())
                return new Error("Unauthorized", "User is not logged in.", FailureType.Unauthorized);

            return new SharedUser
            {
                Id = Convert.ToInt32(_httpContextAccessor.HttpContext!.User.FindFirst(ClaimTypes.NameIdentifier)!.Value),
                Role = _httpContextAccessor.HttpContext!.User.FindFirst(ClaimTypes.Role)!.Value
            };
        }
    }
}
