const fetch = require("node-fetch");
const { createClient } = require("@supabase/supabase-js");

exports.handler = async (event) => {
  try {
    const token = event.headers.authorization?.split(" ")[1];

    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_KEY
    );

    const { data: userData, error: userError } = await supabase.auth.getUser(token);

    if (userError || !userData?.user) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: "Unauthorized" })
      };
    }

    const { name, mood, theme } = JSON.parse(event.body);

    const prompt = `
    Write a ${mood} romantic love letter for ${name}.
    250 words. Emotional and unique.
    `;

    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      }
    );

    const geminiData = await geminiResponse.json();
    const letter = geminiData.candidates[0].content.parts[0].text;

    const slug = name.toLowerCase().replace(/\s/g, "-") + "-" + Date.now();

    await supabase.from("love_sites").insert([
      {
        user_id: userData.user.id,
        name,
        mood,
        theme,
        letter,
        slug
      }
    ]);

    return {
      statusCode: 200,
      body: JSON.stringify({ slug })
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal Server Error" })
    };
  }
};
