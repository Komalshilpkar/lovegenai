const SUPABASE_URL = "YOUR_SUPABASE_URL";
const SUPABASE_ANON_KEY = "YOUR_PUBLIC_ANON_KEY";

const client = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function signUp() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  await client.auth.signUp({ email, password });
  alert("Check your email!");
}

async function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  await client.auth.signInWithPassword({ email, password });
  alert("Logged in!");
}

function goDashboard() {
  window.location.href = "dashboard.html";
}
