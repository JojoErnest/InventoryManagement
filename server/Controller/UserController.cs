using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Models;
using System.Text.Json;

namespace server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly AppDbContext _context;
        public UserController(AppDbContext context) => _context = context;

        // GET: api/user
        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetUsers()
        {
            var users = await _context.Users
                .Select(u => new
                {
                    u.Id,
                    u.Username,
                    u.Role,
                    u.CreatedAt,
                    u.Email
                })
                .ToListAsync();

            return Ok(users);
        }

        // GET: api/user/5
        [HttpGet("{id}")]
        public async Task<ActionResult<object>> GetUser(int id)
        {
            var user = await _context.Users
                .Where(u => u.Id == id)
                .Select(u => new
                {
                    u.Id,
                    u.Username,
                    u.Role,
                    u.CreatedAt,
                    u.Email
                })
                .FirstOrDefaultAsync();

            if (user == null) return NotFound();
            return Ok(user);
        }

       // DELETE: api/user/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id, [FromQuery] string? deletedBy)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return NotFound();

            _context.Users.Remove(user);

            _context.UserChangeLogs.Add(new UserChangeLog
            {
                UserId = id,
                Action = "Delete",
                OldData = JsonSerializer.Serialize(user),
                NewData = null,
                Timestamp = DateTime.UtcNow,
                ActionsBy = deletedBy ?? "Unknown"
            });

            await _context.SaveChangesAsync();
            return NoContent();
        }

    }
}
