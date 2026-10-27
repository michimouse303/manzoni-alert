export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Endpoint per recuperare le circolari/notizie registrate nel DB
    if (url.pathname === "/api/data") {
      try {
        const { results } = await env.DB.prepare(
          "SELECT * FROM items ORDER BY id DESC LIMIT 50"
        ).all();
        return new Response(JSON.stringify(results), {
          headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
        });
      } catch (e) {
        return new Response(JSON.stringify({ error: e.message }), { status: 500 });
      }
    }

    return new Response("Worker Manzoni Alert attivo!", { status: 200 });
  },

  // Controllo automatico ogni 15 minuti tramite Cron Trigger
  async scheduled(event, env, ctx) {
    ctx.waitUntil((async () => {
      console.log("Controllo circolari Liceo Manzoni in corso...");
      // Logica dello scraper automatico
    })());
  }
};