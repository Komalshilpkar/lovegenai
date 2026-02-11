const slug = window.location.pathname.split("/").pop();

const SUPABASE_URL = "https://wqdkvdnxxaqgynypwnee.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndxZGt2ZG54eGFxZ3lueXB3bmVlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA3OTMxNTksImV4cCI6MjA4NjM2OTE1OX0.zTMgJCoHEbjpfrO6tvo6w4JfNTa06vw4W04EstAJ_KA";

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
