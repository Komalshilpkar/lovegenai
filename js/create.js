console.log("Generate clicked");

async function createPage() {
  const { data } = await client.auth.getSession();

  if (!data.session) {
    alert("Please login first!");
    return;
  }

  const name = document.getElementById("name").value;
  const mood = document.getElementById("mood").value;
  const theme = document.getElementById("theme").value;

  const response = await fetch(
    "https://wqdkvdnxxaqgynypwnee.supabase.co/functions/v1/generate-love",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${data.session.access_token}`
      },
      body: JSON.stringify({ name, mood, theme })
    }
  );

  const result = await response.json();

  console.log("Function response:", result);

  if (!result.slug) {
    alert("Error generating page");
    return;
  }

  window.location.href = `/p/${result.slug}`;
}
