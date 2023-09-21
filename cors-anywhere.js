const cors_proxy = require('cors-anywhere');

const PORT = process.env.PORT || 8080; 
cors_proxy
  .createServer({
    originWhitelist: [], 
  })
  .listen(PORT, () => {
    console.log(`CORS Anywhere proxy está ejecutándose en el puerto ${PORT}`);
  });