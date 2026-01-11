namespace TasksServer.Controllers
{
    //create TestController.cs with a single GET endpoint that returns "Test successful"
    using Microsoft.AspNetCore.Mvc;
    [ApiController]
    [Route("api/[controller]")]
    public class TestController : ControllerBase
    {
        [HttpGet]
        public IActionResult Get()
        {
            return Ok("Test successful");
        }
    }
}
