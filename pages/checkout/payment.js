export default function Payment(props) {
  var myHeaders = new Headers();
  const username = "rzp_test_F1usjsmBHLxYwv";
  const password = "5RPGOgAapvAqcZcgWzgF0avz";
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append('Authorization', 'Basic ' + btoa(username + ":" + password));

  var raw = JSON.stringify({
    amount: 1000000,
    currency: "INR",
    receipt: "Receipt no. 1",
    notes: {
      notes_key_1: "Tea, Earl Grey, Hot",
      notes_key_2: "Tea, Earl Grey… decaf.",
    },
  });

  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  const payment = () => {
    fetch("https://api.razorpay.com/v1/orders", requestOptions)
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.log("error", error));
  };

  return (
    <div>
      <button onClick={() => payment()} className="btn">Payment</button>
    </div>
  );
}
