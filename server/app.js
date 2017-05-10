const app = express();

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const router = require('./router.js');

router(app);

app.listen(port, () => {
  console.log('Server PI listening on port 3000!');
});
