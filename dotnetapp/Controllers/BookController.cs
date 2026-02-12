using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using dotnetapp.Models;
using dotnetapp.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;


namespace dotnetapp.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/books")]

    public class BookController : ControllerBase
    {
        private readonly BookService _service;

        public BookController(BookService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Book>>> GetAllBooks()
        {
            try{
var list=await _service.GetAllBooks();
            return Ok(list);
            }
            catch(Exception ex)
            {
                return StatusCode(500,new {Error=ex.Message});
            }
        }

        [HttpGet("{bookId}")]
        public async Task<ActionResult<Book>> GetBookById(int bookId)
        {
            try{
                 var objbookid = await _service.GetBookById(bookId);
                 return Ok(objbookid);
            }
            catch (BookException)
            {
return NotFound("Book not found");
            }
           catch(Exception ex)
           {
             return StatusCode(500,new {Error=ex.Message});
           }
        }

        [Authorize(Roles = UserRoles.BookRecommender)]
        [HttpPost]
        public async Task<ActionResult> AddBook([FromBody] Book book)
        {
            try
            {
                if (book == null)
                {
                    return BadRequest(new {Error="Invalid payload"});
                }
                await _service.AddBook(book);

                return CreatedAtAction(
                    nameof(AddBook),
                    new { id = book.BookId },
                    new
                    {
                        message = "Book added successfully",
                        data = book
                    }
                );

            }
            catch (BookException ex)
            {
                return StatusCode(500, new{ Error=ex.Message});
            }
            catch(Exception ex)
            {
                return StatusCode(500, new{ Error=ex.Message});
            }
        }

        [Authorize(Roles = UserRoles.BookRecommender)]
        [HttpPut("{bookId}")]
        public async Task<ActionResult> UpdateBook(int bookId, [FromBody] Book book)
        {
            try
            {
                if (bookId < 0)
                {
                    return BadRequest();
                }
                var updatedbookobj = await _service.UpdateBook(bookId, book);
                if (!updatedbookobj)
                {
                    return NotFound("Cannot find any book");
                }
                return Ok("Book updated successfully.");
            }

            catch (Exception ex)
            {
                return StatusCode(500,new {Error=ex.Message});
            }
        }


        [Authorize(Roles = UserRoles.BookRecommender)]
        [HttpDelete("{bookId}")]
        public async Task<ActionResult> DeleteBook(int bookId)
        {
            try
            {
                if (bookId < 0)
                {
                    return BadRequest();
                }
                var bookobj = await _service.DeleteBook(bookId);
                if (!bookobj)
                {
                    return NotFound("Cannot find any book");
                }
                return Ok("Book deleted successfully.");
            }

            catch (Exception ex)
            {
                return StatusCode(500,new {Error=ex.Message});
            }

        }

    }
}
