const { nanoid } = require("nanoid");
const books = require("./books");

const addNewBookIntoShelf = (request, h) => {
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;

  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  const finished = pageCount === readPage;

  if (name === undefined) {
    const response = h.response({
      status: "fail",
      message: "Gagal menambahkan buku. Mohon isi nama buku",
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: "fail",
      message: "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount",
    });
    response.code(400);
    return response;
  }

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
    finished,
    insertedAt,
    updatedAt,
  };

  books.push(newBook);

  const isSuccess = books.filter((book) => book.id === id).length > 0;

  if (isSuccess) {
    const response = h.response({
      status: "success",
      message: "Buku berhasil ditambahkan",
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  }
};

const getAllBooksHandler = (request, h) => {
  const booksFiltered = [];

  const { reading, finished, name } = request.query;

  if (reading === "1") {
    books.forEach(function (book) {
      if (book.reading) {
        const bookFiltered = filteredBook(book);
        booksFiltered.push(bookFiltered);
      }
    });
  }
  if (reading === "0") {
    books.forEach(function (book) {
      if (!book.reading) {
        const bookFiltered = filteredBook(book);
        booksFiltered.push(bookFiltered);
      }
    });
  }
  if (finished === "1") {
    books.forEach(function (book) {
      if (book.finished) {
        const bookFiltered = filteredBook(book);
        booksFiltered.push(bookFiltered);
      }
    });
  }
  if (finished === "0") {
    books.forEach(function (book) {
      if (!book.finished) {
        const bookFiltered = filteredBook(book);
        booksFiltered.push(bookFiltered);
      }
    });
  }
  if (reading !== undefined) {
    books.forEach(function (book) {
      if (book.name.includes(name)) {
        const bookFiltered = filteredBook(book);
        booksFiltered.push(bookFiltered);
      }
    });
  }

  if (reading === undefined && finished === undefined && reading === undefined) {
    books.forEach(function (book) {
      const bookFiltered = filteredBook(book);
      booksFiltered.push(bookFiltered);
    });
  }

  const result = [];
  const map = new Map();
  for (const item of booksFiltered) {
    if (!map.has(item.id)) {
      map.set(item.id, true);
      result.push({
        id: item.id,
        name: item.name,
        publisher: item.publisher,
      });
    }
  }
  return {
    status: "success",
    data: {
      books: result,
    },
  };
};

function filteredBook(book) {
  const { id, name, publisher } = book;
  const bookFiltered = {
    id,
    name,
    publisher,
  };

  return bookFiltered;
}

// const getAllBooksHandler = () => {
//     const booksFiltered = [];
//     books.forEach(function (book) {
//       const { id, name, publisher } = book;
//       const bookFiltered = {
//         id,
//         name,
//         publisher,
//       };
//       booksFiltered.push(bookFiltered);
//     });
//     return {
//       status: "success",
//       data: {
//         books: booksFiltered,
//       },
//     };
//   };

const getBookByIdHandler = (request, h) => {
  const { bookId } = request.params;

  const book = books.filter((b) => b.id === bookId)[0];

  if (book !== undefined) {
    return {
      status: "success",
      data: {
        book,
      },
    };
  }

  const response = h.response({
    status: "fail",
    message: "Buku tidak ditemukan",
  });
  response.code(404);
  return response;
};

const updateBookByIdHandler = (request, h) => {
  const { bookId } = request.params;
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;

  const updatedAt = new Date().toISOString();
  const finished = pageCount === readPage;

  if (name === undefined) {
    const response = h.response({
      status: "fail",
      message: "Gagal memperbarui buku. Mohon isi nama buku",
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: "fail",
      message: "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount",
    });
    response.code(400);
    return response;
  }

  const index = books.findIndex((book) => book.id === bookId);

  if (index !== -1) {
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      finished,
      updatedAt,
    };

    const response = h.response({
      status: "success",
      message: "Buku berhasil diperbarui",
    });
    response.code(200);
    return response;
  }
  const response = h.response({
    status: "fail",
    message: "Gagal memperbarui buku. Id tidak ditemukan",
  });

  response.code(404);
  return response;
};

const deleteBookByIdHandler = (request, h) => {
  const { bookId } = request.params;

  const index = books.findIndex((book) => book.id === bookId);

  if (index !== -1) {
    books.splice(index, 1);
    const response = h.response({
      status: "success",
      message: "Buku berhasil dihapus",
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: "fail",
    message: "Buku gagal dihapus. Id tidak ditemukan",
  });
  response.code(404);
  return response;
};

module.exports = { addNewBookIntoShelf, getAllBooksHandler, getBookByIdHandler, updateBookByIdHandler, deleteBookByIdHandler };
