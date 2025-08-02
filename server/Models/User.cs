namespace server.Models
{
    public enum UserRole { Admin, Staff }

    public class User
    {
        public int Id { get; set; }
        public string Username { get; set; } = null!;
        public UserRole Role { get; set; }
        public string PasswordHash { get; set; } = null!;
        public DateTime CreatedAt { get; set; }
        public string? Email { get; set; }
        public string? FullName { get; set; }
        public string? Phone { get; set; }

    }
}
