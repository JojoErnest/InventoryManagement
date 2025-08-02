using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Models;
using System.Text.Json; 

namespace server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductController : ControllerBase
    {
        private readonly AppDbContext _context;
        public ProductController(AppDbContext context) => _context = context;

        // GET api/product
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Product>>> GetProducts() =>
            await _context.Products.ToListAsync();

        // GET api/product/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Product>> GetProduct(int id)
        {
            var product = await _context.Products.FindAsync(id);
            return product is null ? NotFound() : product;
        }

        // POST api/product
        [HttpPost]
        [Consumes("multipart/form-data")] // untuk menerima IFormFile
        public async Task<ActionResult<Product>> PostProduct([FromForm] ProductCreateDto dto, IFormFile image)
        {
            // product.CreatedAt = product.UpdatedAt = DateTime.UtcNow;
            var username = dto.CreatedBy ?? "Anonymous";
            var product = new Product
            {
                Name = dto.Name,
                Description = dto.Description,
                Price = dto.Price,
                QuantityInStock = dto.QuantityInStock,
                Category = dto.Category,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                CreatedBy = username
            };
            if (image != null)
            {
                var filePath = Path.Combine("images", image.FileName);
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await image.CopyToAsync(stream);
                }

                product.ImagePath = $"images/{image.FileName}";
            }

            _context.Products.Add(product);

            // ---- LOG add ----
            _context.ProductChangeLogs.Add(new ProductChangeLog
            {
                ProductId = 0,                      // sementara 0, di-update setelah SaveChanges
                Action = "Add",
                NewData = JsonSerializer.Serialize(product),
                Timestamp = DateTime.UtcNow,
                ActionsBy = username
            });

            await _context.SaveChangesAsync();

            // perbarui ProductId di log (sekarang product.Id sudah punya nilai)
            var lastLog = await _context.ProductChangeLogs
                            .OrderByDescending(l => l.Id).FirstAsync();
            lastLog.ProductId = product.Id;
            await _context.SaveChangesAsync();
            // ----  end log  ----

            return CreatedAtAction(nameof(GetProduct), new { id = product.Id }, product);
        }

        // PUT api/product/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutProduct(int id, Product product)
        {
            if (id != product.Id) return BadRequest();

            var existing = await _context.Products.AsNoTracking()
                                                  .FirstOrDefaultAsync(p => p.Id == id);
            if (existing is null) return NotFound();

            // update field
            product.CreatedAt = existing.CreatedAt;
            product.UpdatedAt = DateTime.UtcNow;

            _context.Entry(product).State = EntityState.Modified;

            // ---- LOG update ----
            _context.ProductChangeLogs.Add(new ProductChangeLog
            {
                ProductId = id,
                Action = "Update",
                OldData = JsonSerializer.Serialize(existing),
                NewData = JsonSerializer.Serialize(product),
                Timestamp = DateTime.UtcNow
            });
            // ----  end log  ----

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // DELETE api/product/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProduct(int id, [FromQuery] string? deletedBy)
        {
            var product = await _context.Products.FindAsync(id);
            if (product is null) return NotFound();

            _context.Products.Remove(product);

            // ---- LOG delete ----
            _context.ProductChangeLogs.Add(new ProductChangeLog
            {
                ProductId = id,
                Action = "Delete",
                OldData = JsonSerializer.Serialize(product),
                NewData = null,
                Timestamp = DateTime.UtcNow,
                ActionsBy = deletedBy
            });
            // ----  end log  ----

            await _context.SaveChangesAsync();
            return NoContent();
        }
        
        // PATCH api/product/stock/5
        [HttpPatch("stock/{id}")]
        public async Task<IActionResult> UpdateStock(int id, [FromBody] StockUpdateDto dto)
        {
            var product = await _context.Products.FindAsync(id);
            if (product is null) return NotFound();

            var oldData = JsonSerializer.Serialize(product);

            product.QuantityInStock += dto.Delta;
            product.UpdatedAt = DateTime.UtcNow;

            _context.Entry(product).State = EntityState.Modified;

            _context.ProductChangeLogs.Add(new ProductChangeLog
            {
                ProductId = id,
                Action = dto.Delta > 0 ? "IncreaseStock" : "DecreaseStock",
                OldData = oldData,
                NewData = JsonSerializer.Serialize(product),
                Timestamp = DateTime.UtcNow,
                ActionsBy = dto.UpdatedBy ?? "Anonymous"
            });

            await _context.SaveChangesAsync();
            return NoContent();
        }

    }
}
