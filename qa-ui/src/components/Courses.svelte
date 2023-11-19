<script>

  const getCourses = async () => {
    const response = await fetch("/api/courses", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });
    console.log(response)
    const result = response.json()
    
    return await result
  }
  let coursePromise = getCourses()
  
</script>

<h1>Courses</h1>
{#await coursePromise}
    <p>Loading courses</p>
{:then courses}
    {#if courses.length === 0}
        <p>No courses available</p>
    {:else}
        <ul class="space-y-10">
            {#each courses as course}
                <li><a class="bg-blue-500 hover:bg-blue-700 text-white font-bold p-2 rounded m-20" href="/courses/{course.id}">{course.name}</a></li>
            {/each}
        </ul>
    {/if}
{/await}