using Microsoft.AspNetCore.Mvc;
using server.Dtos;
using server.Models;
using server.Services;

namespace server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AuthService _auth;

        public AuthController(AuthService auth) => _auth = auth;

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterDto dto)
        {
            var user = await _auth.RegisterAsync(dto.Username, dto.Password, dto.Role);
            if (user is null) return Conflict("Username already exists");
            return Ok(new { user.Id, user.Username, user.Role });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto dto)
        {
            var user = await _auth.ValidateAsync(dto.Username, dto.Password);
            if (user is null) return Unauthorized("Invalid username or password");

            return Ok(new
            {
                user.Id,
                user.Username,
                Role = (int)user.Role
            });

        }
    }
}
