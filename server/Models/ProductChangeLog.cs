namespace server.Models
{
    public class ProductChangeLog
    // Model untuk menyimpan log perubahan produk
    {
        public int Id { get; set; }
        public int ProductId { get; set; }
        public string Action { get; set; }           // "Add" | "Update" | "Delete"
        public string? OldData { get; set; }         // JSON string (opsional)
        public string? NewData { get; set; }         // JSON string (opsional)
        public DateTime Timestamp { get; set; }
        public string ActionsBy { get; set; } // siapa yang melakukan perubahan
    }
}