using BzRental.Domain.Users.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;

namespace BzRental.DbAccess.Contexts
{
    public sealed partial class BzRentalDbContext : DbContext
    {
        public DbSet<User> Users { get; set; }
    }
}
