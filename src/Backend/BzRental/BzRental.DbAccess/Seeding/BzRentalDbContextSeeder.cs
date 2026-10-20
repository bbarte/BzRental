using Microsoft.EntityFrameworkCore;
using BzRental.DbAccess.Contexts;
using BzRental.Shared.Abstraction;
using System;
using System.Collections.Generic;
using System.Text;
using BzRental.Domain.Users.Models;

namespace BzRental.DbAccess.Seeding
{
    public sealed class BzRentalDbContextSeeder
    {
        private readonly BzRentalDbContext _ctx;
        private readonly ISharedPasswordHasher _hasher;

        public BzRentalDbContextSeeder(BzRentalDbContext ctx, ISharedPasswordHasher hasher)
        {
            _ctx = ctx;
            _hasher = hasher;
        }

        public async Task Seed()
        {
            await SeedUsers();
        }

        private async Task SeedUsers()
        {
            if (!await _ctx.Users.AnyAsync())
            {
                User admin = new User
                {
                    FirstName = "Jan",
                    LastName = "Administrator",
                    Username = "admin",
                    PasswordHash = _hasher.HashPassword("admin"),
                    IsAdmin = true
                };

                _ctx.Users.Add(admin);
                await _ctx.SaveChangesAsync();
            }
        }
    }
}
