console.log("Internal Service Started on - :: 3000");
Bun.serve({
  port: 3000, // defaults to $BUN_PORT, $PORT, $NODE_PORT otherwise 3000
  hostname: '::', // defaults to "0.0.0.0"
  fetch(req) {
    return new Response("Hello Bun :)");
  },
  error(error) {
    console.error(error);
    return new Response("Internal Service Error :(");
  }
});
