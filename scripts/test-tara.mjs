const runTest = async (payload, name) => {
  try {
    const r = await fetch("https://www.dklo.co/api/tara/paymentlinks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await r.json();
    if (data.generalLink) {
      const pageR = await fetch(data.generalLink);
      const html = await pageR.text();
      const isIncorrect = html.includes("incorrect");
      console.log(`[${name}] Link: ${data.generalLink} | Price: ${data.price} | Incorrect: ${isIncorrect}`);
    } else {
      console.log(`[${name}] Error:`, data);
    }
  } catch(e) {
    console.error(`[${name}] Error:`, e.message);
  }
}

const basePayload = {
  apiKey: "nwcpNGDWxWDQpWziZg7g8Tj4",
  businessId: "5AuML9WXgI",
  productId: "test-123",
  productName: "Commande HelyaCare",
  productDescription: "Paiement Test",
  productPictureUrl: "https://helyacare.com/logo-white.png",
  returnUrl: "https://helyacare.com/commande/succes?tx_ref=test",
  webHookUrl: "https://helyacare.com/api/payment/webhook-tara?tx_ref=test",
};

async function testAll() {
  await runTest({ ...basePayload, productPrice: 1000 }, "productPrice: 1000");
  await runTest({ ...basePayload, price: 1000 }, "price: 1000");
  await runTest({ ...basePayload, amount: 1000 }, "amount: 1000");
  await runTest({ ...basePayload, productPrice: "1000" }, "productPrice: '1000'");
  await runTest({ ...basePayload, price: "1000" }, "price: '1000'");
}
testAll();
