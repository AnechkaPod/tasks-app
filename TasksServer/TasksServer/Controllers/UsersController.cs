namespace TasksServer.Controllers
{
    //UsersController.cs with CRUD endpoints for UserDto
    using Microsoft.AspNetCore.Mvc;
    using TasksServer.Data;
    using TasksServer.DTO;
    using TasksServer.Models;

    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly TaskManagementDbContext _context;
        public UsersController(TaskManagementDbContext context)
        {
            _context = context;
        }
        [HttpGet]
        public IActionResult GetUsers()
        {
            var users = _context.Users.ToList();
            return Ok(users);
        }
        [HttpGet("{id}")]
        public IActionResult GetUser(int id)
        {
            var user = _context.Users.Find(id);
            if (user == null)
            {
                return NotFound();
            }
            return Ok(user);
        }

        [HttpPost]
        public IActionResult CreateUser([FromBody] UserDto userDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }
                var user = new UserEntity
                {
                    UserId = userDto.UserId,  
                    FullName = userDto.FullName,
                    Email = userDto.Email,
                    Telephone = userDto.Telephone
                };
                _context.Users.Add(user);
                _context.SaveChanges();
                return Ok(user);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "An unexpected error occurred:" + ex.Message);
            }

        }

        [HttpPut("{id}")]
        public IActionResult UpdateUser(string id, [FromBody] UserDto userDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }
                var existingUser = _context.Users.Find(id);
                if (existingUser == null)
                {
                    return NotFound();
                }
                existingUser.FullName = userDto.FullName;
                existingUser.Email = userDto.Email;
                existingUser.Telephone = userDto.Telephone;
                _context.SaveChanges();
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, "An unexpected error occurred:" + ex.Message);
            }
        }
        [HttpDelete("{id}")]
        public IActionResult DeleteUser(int id)
        {
            try
            {
                var user = _context.Users.Find(id);
                if (user == null)
                {
                    return NotFound();
                }
                _context.Users.Remove(user);
                _context.SaveChanges();
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, "An unexpected error occurred:" + ex.Message);
            }
        }
    }


}
