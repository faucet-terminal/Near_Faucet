import InitializeApplication from "./app";

const host = process.env.SERVER_HOST || "0.0.0.0";
const port = parseInt(process.env.SERVER_PORT || "8080");
const app = InitializeApplication();
app.listen(port, host, () => {
  console.log(`Server is listening at http://${host}:${port}`);
});
