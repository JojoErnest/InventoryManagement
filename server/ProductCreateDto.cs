public class ProductCreateDto
{
    public string Name { get; set; }
    public string Description { get; set; }
    public decimal Price { get; set; }
    public int QuantityInStock { get; set; }
    public string Category { get; set; }
    public IFormFile Image { get; set; }  // buat gambar
    public string CreatedBy { get; set; } // siapa yang membuat produk
}
