<script>
    import { userUuid } from "../stores/stores.js";
    export let questionID;


    const loadAnswers = async (id) => {
        const data = {
            ID: id
        }
        const response = await fetch("/api/answers", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            
            },
            body: JSON.stringify(data),
        });

        const result = await response.json()
        
        return result

    }

    
    

    let answerPromise = loadAnswers(questionID)

    const addAnswer = async () => {
        if (newAnswer.length == 0) {
            return;
        }
        
        const data = {
            user: $userUuid,
            answer: newAnswer,
            ID: questionID,
        }
        
        await fetch("/api/answers/add", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        });
        answerPromise = loadAnswers(questionID)
        newAnswer = ``

            
    }
    const addLike = async (id) => {
        const data = {
            user: $userUuid,
            ID: id,
        }

        await fetch ("/api/answers/like", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)

        })

        answerPromise = loadAnswers(questionID)
        

    }
        
    let newAnswer = ``

</script>
<h1>Answers</h1>
<input class="border border-black-500" type="text" bind:value={newAnswer}/>
<button type="submit" class="bg-gray-600 hover:bg-gray-800 text-white font-bold p-4 rounded m-4" on:click={addAnswer}>Add new answer</button>

{#await answerPromise}
    <p>Loading answers</p>
{:then answers}
    {#if answers.length === 0}
        <p>No answers available</p>
    {:else}
        <ul>
            {#each answers as answer}
                <li>
                    <p id="answer">{answer.answertext}</p>
                    <p class="font-bold">Likes: {answer.likecount}</p>
                    <button class="bg-green-600 hover:bg-green-800 text-white font-bold p-1 rounded m-4" on:click={addLike(answer.id)}>Like!</button>
                </li>
            {/each}
        </ul>
    {/if}
{/await} 