if (process.env.NODE_ENV === 'production') {
    module.exports = {
        mongoURI: process.env.MONGOLAB_URI,
    }
} else {
    module.exports = {
        mongoURI: 'mongodb://localhost/realeng-dev',
    }
}

