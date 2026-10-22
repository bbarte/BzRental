using BzRental.Configuration.Users;
using BzRental.Shared.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using System;
using System.Collections.Generic;
using System.Text;

namespace BzRental.DbAccess.Contexts
{
    public sealed partial class BzRentalDbContext : DbContext
    {
        public BzRentalDbContext(DbContextOptions options)
            : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder
                .ConfigureUsers();

            base.OnModelCreating(modelBuilder);
        }

        protected override void ConfigureConventions(ModelConfigurationBuilder configurationBuilder)
        {
            base.ConfigureConventions(configurationBuilder);

            configurationBuilder.Properties<string>()
                .HaveColumnType("varchar")
                .HaveMaxLength(50);

            configurationBuilder.Properties<DateTime>()
                .HaveColumnType("datetime");

            configurationBuilder.Properties<decimal>()
                .HavePrecision(19, 2);
        }

        public override int SaveChanges()
        {
            ApplyModelRules();
            return base.SaveChanges();
        }

        public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            ApplyModelRules();
            return base.SaveChangesAsync(cancellationToken);
        }

        private void ApplyModelRules()
        {
            DateTime now = DateTime.Now;

            IEnumerable<EntityEntry<BaseDomainModel>> entries = ChangeTracker
                .Entries<BaseDomainModel>()
                .Where(x => x.State == EntityState.Added);

            foreach (EntityEntry<BaseDomainModel> entry in entries)
            {
                entry.Entity.CreatedAt = now;
            }
        }
    }
}
