process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const keyId = 'rzp_live_SJ6c61Oqm7rmQV';
const keySecret = '2N96zdStP52HdWMZ0djVlcT9';

async function testRazorpay() {
  const authHeader = 'Basic ' + Buffer.from(`${keyId}:${keySecret}`).toString('base64');
  console.log('Testing Razorpay order creation with SSL workaround...');

  try {
    const response = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
      },
      body: JSON.stringify({
        amount: 250000, // 2500 INR in paise
        currency: 'INR',
        receipt: `receipt_test_${Date.now()}`,
      }),
    });

    console.log('Response Status:', response.status, response.statusText);
    const bodyText = await response.text();
    console.log('Response Body:', bodyText);
  } catch (err) {
    console.error('Error:', err);
  }
}

testRazorpay();
