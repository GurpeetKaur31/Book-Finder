
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using dotnetapp.Services;
using dotnetapp.Data;
using dotnetapp.Models;
using Microsoft.EntityFrameworkCore;
using System.Threading;


namespace dotnetapp.Services
{
    public class BookService
    {

        private readonly ApplicationDbContext _context;

        public BookService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Book>> GetAllBooks()
        {
            return await _context.Books.ToListAsync();
        }

        public async Task<Book> GetBookById(int bookId)
        {
            var book = await _context.Books.FindAsync(bookId);
            if(book == null)
                throw new BookException("Cannot find any book");

            return book;
        }

        public async Task<bool> AddBook(Book book)
        {
            var existing = await _context.Books.FirstOrDefaultAsync(b => b.Title == book.Title);

            if(existing != null)
                throw new BookException("Failed to add book");

            _context.Books.Add(book);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> UpdateBook(int bookId, Book book)
        {
            var existingBook = await _context.Books.FindAsync(bookId);
            if (existingBook == null)
            {
                return false;
            }
            existingBook.Title=book.Title;
            existingBook.Author = book.Author;
            existingBook.Genre = book.Genre;
            existingBook.PublishedDate = book.PublishedDate;
            existingBook.CoverImage = book.CoverImage;

            await _context.SaveChangesAsync();
            return true;

        }

        public async Task<bool> DeleteBook(int bookId)
        {
            var book = await _context.Books.FindAsync(bookId);
            if (book == null)
            {
                return false;
            }

            _context.Books.Remove(book);
            await _context.SaveChangesAsync();
            return true;
        }

    }
}
