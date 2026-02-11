async function createPage() {
  const name = document.getElementById("name").value;
  const mood = document.getElementById("mood").value;
  const theme = document.getElementById("theme").value;

  const { data } = await client.auth.getSession();

  const response = await fetch("/.netlify/functions/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${data.session.access_token}`
    },
    body: JSON.stringify({ name, mood, theme })
  });

  const result = await response.json();
  window.location.href = `/p/${result.slug}`;
}
