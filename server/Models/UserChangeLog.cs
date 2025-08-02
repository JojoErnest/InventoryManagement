public class UserChangeLog
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string Action { get; set; } = "";
    public string? OldData { get; set; }
    public string? NewData { get; set; }
    public DateTime Timestamp { get; set; }
    public string ActionsBy { get; set; }

}
