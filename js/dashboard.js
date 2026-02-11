async function loadPages() {
  const { data } = await client
    .from("love_sites")
    .select("*");

  const container = document.getElementById("pages");

  container.innerHTML = data.map(p =>
    `<div>
      <a href="/p/${p.slug}" target="_blank">${p.name}</a>
    </div>`
  ).join("");
}

loadPages();
