using System;
using System.Collections.Generic;
using System.Text;

namespace BzRental.Application.Users.Services
{
    public interface ITokenCreationService
    {
        string GenerateAccessToken(int id, string role);
    }
}
