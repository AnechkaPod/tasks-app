using System.ComponentModel.DataAnnotations;

namespace TasksServer.DTO
{
    public class UserDto
    {
        [Required]
        [MaxLength(100)]
        public string UserId { get; set; }

        [Required]
        [MaxLength(100)]
        public string FullName { get; set; }

        [Required]
        [MaxLength(100)]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        [MaxLength(20)]
        [Phone]
        public string Telephone { get; set; }
    }
}
