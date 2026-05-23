const runTest = async (payload, name) => {
  try {
    const r = await fetch("https://www.dklo.co/api/tara/paymentlinks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await r.json();
    console.log(`[${name}] Response:`, JSON.stringify(data));
  } catch(e) {
    console.error(`[${name}] Error:`, e.message);
  }
}

const basePayload = {
  apiKey: "nwcpNGDWxWDQpWziZg7g8Tj4",
  businessId: "5AuML9WXgI",
  productId: "test-123",
  productName: "Commande",
  productDescription: "Test",
  productPictureUrl: "https://helyacare.com/logo-white.png",
  returnUrl: "https://helyacare.com",
  webHookUrl: "https://helyacare.com",
};

async function testAll() {
  await runTest({ ...basePayload, productPrice: 1000, businessId: "wrong" }, "Wrong businessId");
  await runTest({ ...basePayload, productPrice: 1000, apiKey: "wrong" }, "Wrong apiKey");
  await runTest({ ...basePayload, productPrice: 5000 }, "Price 5000");
}
testAll();
