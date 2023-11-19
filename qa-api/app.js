import { serve } from "./deps.js";
import * as qaService from "./services/qaService.js"


const handleGetQuestions = async (request) => {
    
    const requestData = await request.json()
    
    const result = await qaService.getQuestions(requestData.ID)
    return result
}

const handleAddQuestion = async (request) => {

    console.log("Hello")
    
    const requestData = await request.json()

    await qaService.addQuestion(requestData.question, requestData.ID)

    return new Response("Done", {status: 200})
}

const handleQuestionLikes = async (request) => {
    const requestData = await request.json()

    const hasLikedBefore = await qaService.getLikes(requestData.ID, requestData.user)

    if (hasLikedBefore.length > 0) {
        await qaService.removeLike(requestData.ID, requestData.user)
        return new Response("Like removed", {status: 302})
    } 

    await qaService.addLike(requestData.ID, requestData.user)
    return new Response("Like added", {status: 301})
}

const handleGetAnswers = async (request) => {
    const requestData = await request.json()
    
    const result = await qaService.getAnswers(requestData.ID)
    return result

}

const handleAnswerLikes = async (request) => {
    const requestData = await request.json()

    const hasLikedBefore = await qaService.getAnswerLikes(requestData.ID, requestData.user)

    if (hasLikedBefore.length > 0) {
        await qaService.removeAnswerLike(requestData.ID, requestData.user)
        return new Response("Like removed", { status: 302})
    }

    await qaService.addAnswerLike(requestData.ID, requestData.user)
    return new Response("Like added", { status: 301})
}

const handleAddAnswer = async (request) => {
    const requestData = await request.json()

    await qaService.addAnswer(requestData.answer, requestData.ID)

    return new Response("Done", {status: 200})

}

const handleGenerateAnswers = async (request) => {
    const requestData = await request.json()
    const data = {
        user: requestData.user,
        question: requestData.question,
    }

    let response = await fetch("http://llm-api:7000/", {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    let result = await response.json()
    const newID = await qaService.getQuestionID(requestData.question, requestData.ID)

    await qaService.addAnswer(result[0].generated_text, newID.id)

    response = await fetch("http://llm-api:7000/", {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    result = await response.json()

    await qaService.addAnswer(result[0].generated_text, newID.id)

    response = await fetch("http://llm-api:7000/", {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    result = await response.json()

    await qaService.addAnswer(result[0].generated_text, newID.id)


    return new Response("Done", {status: 200});
}


const urlMapping = [
    {
        method: "GET",
        pattern: new URLPattern({ pathname: "/courses" }),
        fn: qaService.getCourses
    },
    {
        method: "POST",
        pattern: new URLPattern({ pathname: "/questions"}),
        fn: handleGetQuestions,
    }, 
    {
        method: "POST",
        pattern: new URLPattern({ pathname: "/questions/add"}),
        fn: handleAddQuestion
    },
    {
        method: "POST",
        pattern: new URLPattern({ pathname: "/questions/like"}),
        fn: handleQuestionLikes
    },
    {
        method: "POST",
        pattern: new URLPattern({ pathname: "/answers" }),
        fn: handleGetAnswers
    },
    {
        method: "POST",
        pattern: new URLPattern({ pathname: "/answers/like"}),
        fn: handleAnswerLikes
    },
    {
        method: "POST",
        pattern: new URLPattern({ pathname: "/answers/add"}),
        fn: handleAddAnswer
    }

]

const handleRequest = async (request) => {
    if (request.url == "http://qa-api/") {
        return await handleGenerateAnswers(request)
    }
    const mapping = urlMapping.find(
        (um) => um.method === request.method && um.pattern.test(request.url)
    );

    

    if (!mapping) {
        return new Response("Not found", { status: 404 });
    }
    const mappingResult = mapping.pattern.exec(request.url);
    try {
        const result = await mapping.fn(request, mappingResult)
        return new Response(JSON.stringify(result), {
            headers: {
                "Content-Type": "application/json",
                "Cache-Control": "no-cache"
            }
        });
    } catch (e) {
        console.log(e);
        return new Response(e.stack, { status: 500 })
    }

};

const portConfig = { port: 7777, hostname: "0.0.0.0" };
serve(handleRequest, portConfig);
