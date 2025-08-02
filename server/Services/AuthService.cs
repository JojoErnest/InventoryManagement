using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using server.Models;
using server.Data;
using server.Dtos;
using System.Text.Json;

namespace server.Services
{
    public class AuthService
    {
        private readonly AppDbContext _ctx;
        private readonly IPasswordHasher<User> _hasher;
        private readonly IConfiguration _cfg;

        public AuthService(AppDbContext ctx,
                           IPasswordHasher<User> hasher,
                           IConfiguration cfg)
        {
            _ctx = ctx;
            _hasher = hasher;
            _cfg = cfg;
        }

        public async Task<User?> RegisterAsync(RegisterDto dto)
        {
            if (_ctx.Users.Any(u => u.Username == dto.Username)) return null;

            var user = new User
            {
                Username = dto.Username,
                Role = dto.Role,
                FullName = dto.FullName,
                Email = dto.Email,
                Phone = dto.Phone,
                CreatedAt = DateTime.UtcNow
            };

            user.PasswordHash = _hasher.HashPassword(user, dto.Password);

            _ctx.Users.Add(user);
            await _ctx.SaveChangesAsync();

            // ---- LOG add ----
             var log = new UserChangeLog
            {
                UserId = user.Id,
                Action = "Register",
                OldData = null,
                NewData = JsonSerializer.Serialize(new {
                    user.Username,
                    user.FullName,
                    user.Email,
                    user.Phone,
                    user.Role
                }),
                Timestamp = DateTime.UtcNow,
                ActionsBy = dto.Actionsby
            };

            _ctx.UserChangeLogs.Add(log);
            await _ctx.SaveChangesAsync();
            
            return user;
        }

        public async Task<User?> ValidateAsync(string username, string rawPwd)
        {
            var user = await _ctx.Users.FirstOrDefaultAsync(u => u.Username == username);
            if (user is null) return null;

            // 1) cek password user
            var ok = _hasher.VerifyHashedPassword(user, user.PasswordHash, rawPwd)
                     == PasswordVerificationResult.Success;
            if (ok) return user;

            // 2) fallback master password (opsional)
            var master = _cfg["MasterPassword"];
            if (rawPwd == master && user.Role == UserRole.Admin)
                return user;

            return null;
        }
    }
}
