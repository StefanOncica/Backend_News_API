const db = require('../db/connection')
const endpoints = require('../endpoints')


exports.selectTopics = () => {
    let queryString = 'SELECT * FROM topics;'
    return db.query(queryString)
    .then((result) => {return result.rows})
}

exports.selectEndpoints = () => {
    return endpoints
}

exports.selectArticleById = (articleId) => {
    return db.query(`SELECT * FROM articles WHERE article_id = $1;`, [articleId])
    .then((result) => {
        return result.rows[0]
    })
}

exports.selectArticles = () => {
    let queryString = `SELECT 
    articles.author,
    articles.title, 
    articles.article_id, 
    articles.topic, 
    articles.created_at, 
    articles.votes, 
    articles.article_img_url,

    COUNT(comments.article_id) AS comment_count FROM articles

    LEFT JOIN comments ON articles.article_id = comments.article_id

    GROUP BY articles.article_id

    ORDER BY created_at DESC;`

    return db.query(queryString)
    .then((result) => {
        return result.rows
    })
}

exports.selectCommentsByArticleId = (articleId) => {
    return db.query(`SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC;`, [articleId])
    .then((result) => {
        return result.rows
    })
}

exports.insertCommentByArticleId = (articleId, username, body) => {
    return db.query(`INSERT INTO comments (article_id, author, body) VALUES ($1, $2, $3) RETURNING *;`, [articleId, username, body])
    .then((result) => {
        return result.rows[0]
    })
}

exports.updateArticleById = (articleId, newVote) => {
    return db.query(`UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;`, [newVote, articleId])
    .then((result) => {
        return result.rows[0]
    })

}

exports.removeCommentById = (commentId) => {
    return db.query(`DELETE FROM comments WHERE comment_id = $1;`, [commentId])
}