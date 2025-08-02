using server.Models;
namespace server.Dtos
{
    public record RegisterDto(
        string Username,
        string Password,
        UserRole Role,
        string FullName,
        string Email,
        string Phone,
        string? Actionsby
    );

    public record LoginDto(
        string Username,
        string Password
    );
}
