const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required." });
    }

    const userExists = users.some(user => user.username === username);

    if (userExists) {
        return res.status(400).json({ message: "Username already exists." });
    }

    users.push({ username, password });
    return res.status(200).json({ message: "User registered successfully." });
});


public_users.get('/', function (req, res) {
    res.status(200).send(JSON.stringify(books, null, 2));
});


public_users.get('/isbn/:isbn', function (req, res) {
    const { isbn } = req.params;

    const book = books[isbn];
    if (book) {
        return res.status(200).json(book);
    } else {
        return res.status(404).json({ message: "Book not found." });
    }
});


public_users.get('/author/:author', function (req, res) {
    const { author } = req.params;

    const filteredBooks = Object.values(books).filter(book => book.author === author);
    if (filteredBooks.length > 0) {
        return res.status(200).json(filteredBooks);
    } else {
        return res.status(404).json({ message: "No books found by this author." });
    }
});


public_users.get('/title/:title', function (req, res) {
    const { title } = req.params;

    const filteredBooks = Object.values(books).filter(book => book.title === title);
    if (filteredBooks.length > 0) {
        return res.status(200).json(filteredBooks);
    } else {
        return res.status(404).json({ message: "No books found with this title." });
    }
});


public_users.get('/review/:isbn', function (req, res) {
    const { isbn } = req.params;

    const book = books[isbn];
    if (book && book.reviews) {
        return res.status(200).json(book.reviews);
    } else {
        return res.status(404).json({ message: "Reviews not found for this book." });
    }
});

module.exports.general = public_users;
