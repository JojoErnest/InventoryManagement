namespace server.Models
{
    public class ProductChangeLog
    {
        public int Id { get; set; }
        public int ProductId { get; set; }
        public string Action { get; set; }           
        public string? OldData { get; set; }        
        public string? NewData { get; set; }        
        public DateTime Timestamp { get; set; }
        public string ActionsBy { get; set; } 
    }
}