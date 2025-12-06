const server = require("./app");
const PORT = process.env.PORT || 5000;

// Listen on 0.0.0.0 so Docker can expose the port outside the container
server.listen(PORT, '0.0.0.0', (err) => {
  if (err) {
    console.error("Error starting server:", err);
    return;
  }
  console.log(`Server Started. Server listening on port ${PORT}`);
});
