const runTest = async (payload, name) => {
  try {
    const r = await fetch("https://www.dklo.co/api/tara/paymentlinks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await r.json();
    console.log(`[${name}] Link:`, data.generalLink);
  } catch(e) {
    console.error(`[${name}] Error:`, e.message);
  }
}

const basePayload = {
  apiKey: "nwcpNGDWxWDQpWziZg7g8Tj4",
  businessId: "5AuML9WXgI",
  productName: "Commande",
  productDescription: "Test",
  productPictureUrl: "https://helyacare.com/logo-white.png",
  returnUrl: "https://helyacare.com",
  webHookUrl: "https://helyacare.com",
};

async function testAll() {
  await runTest({ ...basePayload, productPrice: 1000, productId: "test-" + Date.now() }, "Random 1");
  await runTest({ ...basePayload, productPrice: 1000, productId: "test-" + Date.now() + 1 }, "Random 2");
}
testAll();
