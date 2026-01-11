using System.ComponentModel.DataAnnotations;
using TasksServer.Data;
using TasksServer.Models;

namespace TasksServer.Attributes
{
    public class UniqueEmailAttribute : ValidationAttribute
    {
        protected override ValidationResult IsValid(object value, ValidationContext validationContext)
        {
            var context = (TaskManagementDbContext)validationContext.GetService(typeof(TaskManagementDbContext));
            var entity = (UserEntity)validationContext.ObjectInstance;

            var emailExists = context.Users.Any(u => u.Email == value.ToString() && u.UserId != entity.UserId);

            if (emailExists)
            {
                return new ValidationResult("Email address is already in use");
            }

            return ValidationResult.Success;
        }
    }
}
