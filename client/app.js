const app = express();

const port = process.env.PORT || process.env.NODE_PORT || 1337;

app.listen(port, () => {
  console.log('Client PI listening on port 1337!');
});
