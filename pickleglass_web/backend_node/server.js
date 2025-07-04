const createApp = require('./index');

const app = createApp();
const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`🚀 PickleGlass Backend running on port ${PORT}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
}); 