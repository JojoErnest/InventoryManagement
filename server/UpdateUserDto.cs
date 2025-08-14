public class UpdateUserDto
{
    public int Id { get; set; }
    public string Username { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string? Phone { get; set; }
    public string? FullName { get; set; }
    public int Role { get; set; }
    public string? UpdatedBy { get; set; }  // optional, bisa null
}
