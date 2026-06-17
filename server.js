const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Use environment variable for MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const SaleSchema = new mongoose.Schema({
  item: String,
  price: Number,
  date: { type: Date, default: Date.now }
});
const Sale = mongoose.model('Sale', SaleSchema);

app.post('/sales', async (req, res) => {
  const sale = new Sale(req.body);
  await sale.save();
  res.send(sale);
});

app.get('/sales', async (req, res) => {
  const sales = await Sale.find();
  res.send(sales);
});

app.listen(3000, () => console.log('Server running on port 3000'));
