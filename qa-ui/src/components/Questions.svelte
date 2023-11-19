<script>
    import { userUuid } from "../stores/stores.js";
    import { onMount } from "svelte";
    export let courseID;

    
    let questionPromise = [];

    const loadQuestions = async (id) => {
        const data = {
            ID: id,
        };
        const response = await fetch("/api/questions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        console.log(response);
        const result = await response.json();
        questionPromise = result
        loadQuestions(courseID)
    };

    onMount(() => {
        loadQuestions(courseID)
    })

    

    const addQuestion = async () => {
        if (newQuestion.length == 0) {
            return;
        }

        const data = {
            user: $userUuid,
            question: newQuestion,
            ID: courseID,
        };
        newQuestion = ``;
        
        await fetch("/api/questions/add", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        

        await fetch("/api/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        

    };

    const addLike = async (id) => {
        const data = {
            user: $userUuid,
            ID: id,
        };

        await fetch("/api/questions/like", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
    };
    let newQuestion = ``;
</script>
<h1>Questions</h1>
<input class="border border-black-500" type="text" bind:value={newQuestion} />
<button type="submit" class="bg-gray-600 hover:bg-gray-800 text-white font-bold p-4 rounded m-4" on:click={addQuestion}>Add new question</button>

{#await questionPromise}
    <p>Loading questions</p>
{:then questions}
    {#if questions.length === 0}
        <p>No questions available</p>
    {:else}
        <ul>
            {#each questions as question}
                <li>
                    <a id="question"
                        href="/courses/{question.courseid}/questions/{question.id}"
                        >{question.questiontext}</a
                    >
                    <p class="font-bold" >Likes: {question.likecount}</p>
                    <button class="bg-green-600 hover:bg-green-800 text-white font-bold p-1 rounded m-4" on:click={addLike(question.id)}>Like!</button>
                </li>
            {/each}
        </ul>
    {/if}
{/await}
