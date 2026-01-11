using System.ComponentModel.DataAnnotations;

namespace TasksServer.DTO
{
    public class TaskDto
    {
        public int Id { get; set; }

        [Required]
        public string Title { get; set; } = string.Empty;

        public string? Description { get; set; }

        [Required]
        public DateTime DueDate { get; set; }

        public int? Priority { get; set; }

        [Required]
        public int UserId { get; set; }   
    }
}
