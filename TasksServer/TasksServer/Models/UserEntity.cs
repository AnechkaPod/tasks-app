using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using TasksServer.Attributes;

namespace TasksServer.Models
{
    [Table("Users")]
    public class UserEntity
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }        

        [Required]
        [MaxLength(50)]
        public string UserId { get; set; } = string.Empty;  

        [Required]
        [MaxLength(100)]
        public string FullName { get; set; } = string.Empty;

        [Required]
        [MaxLength(100)]
        [UniqueEmail]
        public string Email { get; set; } = string.Empty;

        [Required]
        [MaxLength(20)]
        public string Telephone { get; set; } = string.Empty;

        public bool IsDeleted { get; set; } = false;

        public ICollection<TaskEntity> Tasks { get; set; } = new List<TaskEntity>();
    }
}
