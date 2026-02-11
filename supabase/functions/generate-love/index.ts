// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  // ✅ Handle CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "authorization, content-type",
        "Access-Control-Allow-Methods": "POST, OPTIONS"
      }
    });
  }

  try {
    // ===============================
    // 1️⃣ Validate Authorization
    // ===============================
    const authHeader = req.headers.get("Authorization");

    if (!authHeader) {
      throw new Error("Missing Authorization header");
    }

    const token = authHeader.replace("Bearer ", "");

    // Auth client (uses ANON key)
    const supabaseAuth = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!
    );

    const { data: userData, error: userError } =
      await supabaseAuth.auth.getUser(token);

    if (userError || !userData?.user) {
      throw new Error("Invalid JWT");
    }

    // ===============================
    // 2️⃣ Read Request Body
    // ===============================
    const { name, mood, theme } = await req.json();

    if (!name || !mood || !theme) {
      throw new Error("Missing required fields");
    }

    // ===============================
    // 3️⃣ Generate Letter via Gemini
    // ===============================
    const prompt = `
Write a ${mood} romantic love letter for ${name}.
Make it emotional, poetic and around 250 words.
`;

    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${Deno.env.get("GEMINI_API_KEY")}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      }
    );

    if (!geminiResponse.ok) {
      const text = await geminiResponse.text();
      throw new Error("Gemini API error: " + text);
    }

    const geminiData = await geminiResponse.json();

    if (
      !geminiData.candidates ||
      !geminiData.candidates.length ||
      !geminiData.candidates[0].content.parts
    ) {
      throw new Error("Invalid Gemini response");
    }

    const letter =
      geminiData.candidates[0].content.parts[0].text;

    // ===============================
    // 4️⃣ Generate Slug
    // ===============================
    const slug =
      name.toLowerCase().replace(/\s+/g, "-") +
      "-" +
      Date.now();

    // ===============================
    // 5️⃣ Insert Into Database
    // ===============================
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { error: insertError } =
      await supabaseAdmin.from("love_sites").insert([
        {
          user_id: userData.user.id,
          name,
          mood,
          theme,
          letter,
          slug
        }
      ]);

    if (insertError) {
      throw new Error("DB Insert Error: " + insertError.message);
    }

    // ===============================
    // 6️⃣ Return Slug
    // ===============================
    return new Response(JSON.stringify({ slug }), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });

  } catch (error) {
    console.error("🔥 REAL ERROR:", error);

    return new Response(
      JSON.stringify({
        error: error.message
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      }
    );
  }
});



/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/generate-love' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
