const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.get('/', async function (req, res) {
    try {
        const allBooks = await new Promise((resolve) => resolve(books));
        res.status(200).json(allBooks);
    } catch (err) {
        res.status(500).json({ message: "Error fetching books." });
    }
});


public_users.get('/isbn/:isbn', async function (req, res) {
    const { isbn } = req.params;

    try {
        const book = await new Promise((resolve, reject) => {
            if (books[isbn]) resolve(books[isbn]);
            else reject("Book not found.");
        });
        res.status(200).json(book);
    } catch (err) {
        res.status(404).json({ message: err });
    }
});


public_users.get('/author/:author', async function (req, res) {
    const { author } = req.params;

    try {
        const filteredBooks = await new Promise((resolve) => {
            resolve(Object.values(books).filter(book => book.author === author));
        });

        if (filteredBooks.length > 0) {
            res.status(200).json(filteredBooks);
        } else {
            throw "No books found by this author.";
        }
    } catch (err) {
        res.status(404).json({ message: err });
    }
});


public_users.get('/title/:title', async function (req, res) {
    const { title } = req.params;

    try {
        const filteredBooks = await new Promise((resolve) => {
            resolve(Object.values(books).filter(book => book.title === title));
        });

        if (filteredBooks.length > 0) {
            res.status(200).json(filteredBooks);
        } else {
            throw "No books found with this title.";
        }
    } catch (err) {
        res.status(404).json({ message: err });
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

module.exports.general = public_users;
