using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Reflection.Emit;
using TasksServer.Models;

namespace TasksServer.Data
{
    public class TaskManagementDbContext : DbContext
    {
        public TaskManagementDbContext(DbContextOptions<TaskManagementDbContext> options)
            : base(options)
        {
        }

        public DbSet<UserEntity> Users { get; set; }
        public DbSet<TaskEntity> Tasks { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // User configuration
            modelBuilder.Entity<UserEntity>().HasIndex(u => u.Email)
                .IsUnique();


            // Task configuration
            modelBuilder.Entity<TaskEntity>()
                .HasOne(t => t.User)
                .WithMany(u => u.Tasks)
                .HasForeignKey(t => t.UserId)
                .OnDelete(DeleteBehavior.Restrict); // Prevent cascade delete

            modelBuilder.Entity<TaskEntity>()
                .HasQueryFilter(t => !t.IsDeleted); // Global filter for soft delete

            // Index for performance
            modelBuilder.Entity<TaskEntity>()
                .HasIndex(t => t.DueDate);

            modelBuilder.Entity<TaskEntity>()
                .HasIndex(t => t.Priority);

            // Seed data (optional)
            modelBuilder.Entity<UserEntity>().HasData(
                new UserEntity
                {
                    Id = 1,
                    UserId = "1234567",
                    FullName = "John Doe",
                    Email = "john@example.com",
                    Telephone = "+1234567890"
                }
            );
        }

        // Override SaveChanges to handle audit fields
        public override int SaveChanges()
        {
            HandleAuditFields();
            return base.SaveChanges();
        }

        public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            HandleAuditFields();
            return await base.SaveChangesAsync(cancellationToken);
        }

        private void HandleAuditFields()
        {
            var entries = ChangeTracker.Entries()
                .Where(e => e.Entity is TaskEntity || e.Entity is UserEntity);

            foreach (var entry in entries)
            {
                if (entry.State == EntityState.Added)
                {
                    if (entry.Entity is TaskEntity task)
                        task.CreatedAt = DateTime.UtcNow;
                }
                else if (entry.State == EntityState.Modified)
                {
                    if (entry.Entity is TaskEntity task)
                        task.UpdatedAt = DateTime.UtcNow;
                }
            }
        }
    }
}
