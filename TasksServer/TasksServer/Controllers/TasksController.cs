namespace TasksServer.Controllers
{
    //TaskController.cs with CRUD endpoints for TaskEntity
    using Microsoft.AspNetCore.Mvc;
    using TasksServer.Data;
    using TasksServer.DTO;
    using TasksServer.Models;

    [ApiController]
    [Route("api/[controller]")]
    public class TasksController : ControllerBase
    {
        private readonly TaskManagementDbContext _context;
        public TasksController(TaskManagementDbContext context)
        {
            _context = context;
        }
        [HttpGet]
        public IActionResult GetTasks()
        {
            var tasks = _context.Tasks.Where(t => !t.IsDeleted).ToList();

            return Ok(tasks);
        }

        [HttpGet("{id}")]
        public IActionResult GetTask(int id)
        {
            var tasks = _context.Tasks.FirstOrDefault(t => t.Id == id && !t.IsDeleted);
            if (tasks == null)
            {
                return NotFound();
            }
            return Ok(tasks);
        }

        [HttpPost]
        public IActionResult CreateTask([FromBody] TaskDto taskDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }
                var task = new Models.TaskEntity
                {
                    UserId = taskDto.UserId,
                    Title = taskDto.Title,
                    Priority = taskDto.Priority.GetValueOrDefault(),
                    DueDate = taskDto.DueDate,
                    Description = taskDto.Title,
                    IsDeleted = false
                };
                _context.Tasks.Add(task);
                _context.SaveChanges();
                return Ok(task);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "An unexpected error occurred:" + ex.Message);
            }
        }
        [HttpPut("{id}")]
        public IActionResult UpdateTask(int id, [FromBody] TaskDto task)
        {
            if (id != task.Id || !ModelState.IsValid)
            {
                return BadRequest();
            }
            var existingTask = _context.Tasks.Find(id);
            if (existingTask == null)
            {
                return NotFound();
            }
            existingTask.Title = task.Title;
            existingTask.Description = task.Description;
            existingTask.DueDate = task.DueDate;
            existingTask.Priority = task.Priority.GetValueOrDefault();
            existingTask.UserId = task.UserId;
            _context.SaveChanges();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteTask(int id)
        {
            var task = _context.Tasks.Find(id);
            if (task == null)
            {
                return NotFound();
            }

            task.IsDeleted = true;
            _context.SaveChanges();
            return NoContent();
        }
    }

}
