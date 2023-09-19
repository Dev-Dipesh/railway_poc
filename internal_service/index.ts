const server = Bun.serve({
  hostname: "::",
  port: process.env.PORT ?? 3000,
  fetch(request) {
    return new Response("Hello Bun :)");
  },
  error(error) {
    console.error(error);
    return new Response("Internal Service Error :(");
  }
});

console.log(`Listening on http://localhost:${server.port}`);
