using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Models;
using System.Text.Json; // untuk serialize

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
        public async Task<ActionResult<Product>> PostProduct(Product product)
        {
            product.CreatedAt = product.UpdatedAt = DateTime.UtcNow;

            _context.Products.Add(product);

            // ---- LOG add ----
            _context.ProductChangeLogs.Add(new ProductChangeLog
            {
                ProductId = 0,                      // sementara 0, di-update setelah SaveChanges
                Action    = "Add",
                NewData   = JsonSerializer.Serialize(product),
                Timestamp   = DateTime.UtcNow
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
                Action    = "Update",
                OldData   = JsonSerializer.Serialize(existing),
                NewData   = JsonSerializer.Serialize(product),
                Timestamp   = DateTime.UtcNow
            });
            // ----  end log  ----

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // DELETE api/product/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product is null) return NotFound();

            _context.Products.Remove(product);

            // ---- LOG delete ----
            _context.ProductChangeLogs.Add(new ProductChangeLog
            {
                ProductId = id,
                Action    = "Delete",
                OldData   = JsonSerializer.Serialize(product),
                NewData   = null,
                Timestamp   = DateTime.UtcNow
            });
            // ----  end log  ----

            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
