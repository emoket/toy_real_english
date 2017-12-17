if ((process.env.NODE_ENV).trim().toLowerCase() === 'production') {
    module.exports = {
        mongoURI: process.env.MONGOLAB_URI,
    }
} else {
    module.exports = {
        mongoURI: 'mongodb://localhost/realeng-dev',
    }
}

