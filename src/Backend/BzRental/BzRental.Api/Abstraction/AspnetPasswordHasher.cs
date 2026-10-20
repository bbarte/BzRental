using BzRental.Shared.Abstraction;
using Microsoft.AspNetCore.Identity;

namespace BzRental.Api.Abstraction
{
    public class AspnetPasswordHasher : ISharedPasswordHasher
    {
        private readonly IPasswordHasher<object> _hasher;

        public AspnetPasswordHasher(IPasswordHasher<object> hasher)
        {
            _hasher = hasher;
        }

        public string HashPassword(string password)
        {
            return _hasher.HashPassword(null!, password);
        }

        public bool VerifyPassword(string hashedPassword, string providedPassword)
        {
            return _hasher.VerifyHashedPassword(null!, hashedPassword, providedPassword) == PasswordVerificationResult.Success;
        }
    }
}
