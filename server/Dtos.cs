using server.Models;
namespace server.Dtos
{
    public record RegisterDto(string Username, string Password, UserRole Role);
    public record LoginDto(string Username, string Password);
}
