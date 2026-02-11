const slug = window.location.pathname.split("/").pop();

const SUPABASE_URL = "YOUR_SUPABASE_URL";
const SUPABASE_ANON_KEY = "YOUR_PUBLIC_ANON_KEY";

const client = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function loadPage() {
  const { data } = await client
    .from("love_sites")
    .select("*")
    .eq("slug", slug)
    .single();

  document.body.classList.add(data.theme);

  document.getElementById("content").innerHTML = `
    <h1>For ${data.name} 💖</h1>
    <p>${data.letter}</p>
    <h2>Will you be mine forever?</h2>
    <button id="yesBtn">Yes ❤️</button>
    <button id="noBtn">No 😏</button>
  `;

  document.getElementById("yesBtn").onclick = () => {
    confetti({ particleCount: 150, spread: 100 });
  };

  document.getElementById("noBtn").onmouseover = function() {
    this.style.position = "absolute";
    this.style.left = Math.random() * window.innerWidth + "px";
    this.style.top = Math.random() * window.innerHeight + "px";
  };
}

loadPage();
