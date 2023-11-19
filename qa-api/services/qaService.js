import { postgres } from "../deps.js"

const sql = postgres({});

const getCourses = async () => {
    return await sql`SELECT * FROM Courses`;
}

const getQuestions = async (id) => {
    return await sql`SELECT q.*, COALESCE(ql.likeCount, 0) AS likeCount, GREATEST(q.made_in, COALESCE((SELECT MAX(made_in) FROM QuestionLikes WHERE questionID = q.id), q.made_in)) AS max_made_in FROM Questions q LEFT JOIN (SELECT questionID, COUNT(*) AS likeCount FROM QuestionLikes GROUP BY questionID) ql ON q.id = ql.questionID WHERE q.courseID = ${id} ORDER BY max_made_in DESC LIMIT 20`
}

const getQuestionID = async(text, course) => {
    const result = await sql`SELECT id FROM Questions WHERE questionText = ${text} AND courseID = ${course}`
    return result[0]
}

const getAnswers = async (id) => {
    return await sql`SELECT a.*, COALESCE(al.likeCount, 0) AS likeCount, GREATEST(a.made_in, COALESCE((SELECT MAX(made_in) FROM AnswerLikes WHERE answerID = a.id), a.made_in)) AS max_made_in 
    FROM Answers a 
    LEFT JOIN (SELECT answerID, COUNT(*) AS likeCount FROM AnswerLikes GROUP BY answerID) al 
    ON a.id = al.answerID 
    WHERE a.questionID = ${id}
    ORDER BY max_made_in DESC LIMIT 20
    `
}

const addQuestion = async (text, course) => {
    await sql`INSERT INTO Questions(questionText, courseID) VALUES (${text}, ${course})`
}

const addAnswer = async (text, question) => {
    await sql`INSERT INTO Answers(answerText, questionID) VALUES (${text}, ${question})`
}

const getLikes = async (questionId, userID) => {
    return await sql`SELECT * FROM QuestionLikes WHERE questionID = ${questionId} AND user_uuid = ${userID}`
} 

const addLike = async (questionId, userID) => {
    await sql`INSERT INTO QuestionLikes(questionID, user_uuid) VALUES (${questionId}, ${userID})`
}

const removeLike = async (questionId, userID) => {
    await sql`DELETE FROM QuestionLikes WHERE questionID = ${questionId} AND user_uuid = ${userID}`
} 

const getAnswerLikes = async (answerId, userID) => {
    return await sql`SELECT * FROM AnswerLikes WHERE answerId = ${answerId} AND user_uuid = ${userID}`
}

const addAnswerLike = async (answerId, userId) => {
    await sql`INSERT INTO AnswerLikes(answerID, user_uuid) VALUES (${answerId}, ${userId})`
}

const removeAnswerLike = async (answerId, userId) => {
    await sql`DELETE FROM AnswerLikes WHERE answerID = ${answerId} AND user_uuid = ${userId}`
}

export {getCourses, getAnswers, getQuestions, addQuestion, getLikes, addLike, removeLike, getAnswerLikes, addAnswerLike, removeAnswerLike, addAnswer, getQuestionID}