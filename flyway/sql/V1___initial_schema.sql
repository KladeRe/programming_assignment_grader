CREATE TABLE Courses (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL
);

CREATE TABLE Questions (
    id SERIAL PRIMARY KEY,
    questionText TEXT NOT NULL,
    courseID INTEGER REFERENCES Courses(id),
    made_in TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE QuestionLikes (
    id SERIAL PRIMARY KEY,
    user_uuid TEXT NOT NULL,
    questionID INTEGER REFERENCES Questions(id),
    made_in TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE Answers (
    id SERIAL PRIMARY KEY,
    answerText TEXT NOT NULL,
    questionID INTEGER REFERENCES Questions(id),
    made_in TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE AnswerLikes (
    ID SERIAL PRIMARY KEY,
    user_uuid TEXT NOT NULL,
    answerID INTEGER REFERENCES Answers(id),
    made_in TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX questions_course_id_idx ON Questions (courseID);
CREATE INDEX question_likes_user_question_idx ON QuestionLikes (user_uuid, questionID);
CREATE INDEX answers_question_id_idx ON Answers (questionID);
CREATE INDEX answer_likes_user_answer_idx ON AnswerLikes (user_uuid, answerID);