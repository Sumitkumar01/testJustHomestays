const Razorpay = require("razorpay");
const shortid = require("shortid");

export default async function handler(req, res) {
  const final = req.query;
  if (req.method === "GET" && final["amount"]) {
    // Initialize razorpay object
    const razorpay = new Razorpay({
      key_id: "rzp_test_F1usjsmBHLxYwv",
      key_secret: "5RPGOgAapvAqcZcgWzgF0avz",
    });

    // Create an order -> generate the OrderID -> Send it to the Front-end
    const payment_capture = 1;
    const amount = final["amount"];
    const currency = "INR";
    const options = {
      amount: (amount * 100).toString(),
      currency,
      receipt: shortid.generate(),
      payment_capture,
    };

    try {
      const response = await razorpay.orders.create(options);
      res.status(200).json({
        id: response.id,
        currency: response.currency,
        amount: response.amount,
      });
    } catch (err) {
      console.log(err);
      res.status(400).json(err);
    }
  }
}
