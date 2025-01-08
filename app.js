const express = require('express');
const cors = require('cors');
const { default: mongoose } = require('mongoose');
require('dotenv').config();
const authRoutes = require('./src/routes/auth.route');
const { authorizationGuard } = require('./src/controllers/helper.controller');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/api', authorizationGuard);

const dbUri = process.env.MONGODB_URI;
if(!dbUri){
    console.error('MONGODB_URI is not defined in .env file.');
    process.exit(1);
}
const port = process.env.PORT || 3000;

mongoose.connect(dbUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('MongoDB connected...');
    app.listen(port);
})
.catch((err) => {
    console.error(err);
});

