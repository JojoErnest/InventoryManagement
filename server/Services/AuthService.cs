using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using server.Models;
using server.Data;

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

        public async Task<User?> RegisterAsync(string username, string rawPwd, UserRole role)
        {
            if (_ctx.Users.Any(u => u.Username == username)) return null;

            var user = new User
            {
                Username  = username,
                Role      = role,
                CreatedAt = DateTime.UtcNow
            };
            user.PasswordHash = _hasher.HashPassword(user, rawPwd);
            _ctx.Users.Add(user);
            await _ctx.SaveChangesAsync();
            return user;
        }

        public async Task<bool> ValidateAsync(string username, string rawPwd)
        {
            var user = await _ctx.Users.FirstOrDefaultAsync(u => u.Username == username);
            if (user is null) return false;

            // 1) cek password user
            var ok = _hasher.VerifyHashedPassword(user, user.PasswordHash, rawPwd)
                     == PasswordVerificationResult.Success;
            if (ok) return true;

            // 2) fallback master password (opsional)
            var master = _cfg["MasterPassword"];
            return rawPwd == master && user.Role == UserRole.Admin;
        }
    }
}
