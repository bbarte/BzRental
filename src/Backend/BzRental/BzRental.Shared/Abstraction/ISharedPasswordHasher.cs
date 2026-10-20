using System;
using System.Collections.Generic;
using System.Text;

namespace BzRental.Shared.Abstraction
{
    public interface ISharedPasswordHasher
    {
        string HashPassword(string password);
        bool VerifyPassword(string hashedPassword, string providedPassword);
    }
}
