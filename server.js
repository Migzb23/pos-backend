const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Connect to MongoDB Atlas
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("Connected to MongoDB Atlas"))
.catch(err => console.error("Connection error:", err));

// ✅ Sale schema & model
const SaleSchema = new mongoose.Schema({
  item: String,
  price: Number,
  date: { type: Date, default: Date.now }
});
const Sale = mongoose.model('Sale', SaleSchema);

// ✅ Display schema & model
const DisplaySchema = new mongoose.Schema({
  item: String,
  price: Number,
  date: { type: Date, default: Date.now }
});
const Display = mongoose.model('Display', DisplaySchema);

// ✅ Sales routes
app.post('/sales', async (req, res) => {
  try {
    const sale = new Sale(req.body);
    await sale.save();
    res.json(sale);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/sales', async (req, res) => {
  try {
    const sales = await Sale.find();
    res.json(sales);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/sales/clear', async (req, res) => {
  try {
    await Sale.deleteMany({});
    res.json({ message: "All sales cleared" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ NEW: Delete one sale by ID
app.delete('/sales/:id', async (req, res) => {
  try {
    await Sale.findByIdAndDelete(req.params.id);
    res.json({ message: "Sale removed" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Display routes
app.post('/display', async (req, res) => {
  try {
    const displayItem = new Display(req.body);
    await displayItem.save();
    res.json(displayItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/display', async (req, res) => {
  try {
    const items = await Display.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/display/clear', async (req, res) => {
  try {
    await Display.deleteMany({});
    res.json({ message: "All display items cleared" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ NEW: Delete one display item by ID
app.delete('/display/:id', async (req, res) => {
  try {
    await Display.findByIdAndDelete(req.params.id);
    res.json({ message: "Display item removed" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
