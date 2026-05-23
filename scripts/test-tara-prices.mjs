const runTest = async (payload, name) => {
  try {
    const r = await fetch("https://www.dklo.co/api/tara/paymentlinks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await r.json();
    console.log(`[${name}] Price: ${data.price} | Link: ${data.generalLink} | Message: ${data.message}`);
  } catch(e) {
    console.error(`[${name}] Error:`, e.message);
  }
}

const basePayload = {
  apiKey: "eO4qfliMGo6yvkSmPqDPKUoH",
  businessId: "5AuML9WXgI",
  productName: "Commande",
  productDescription: "Test",
  productPictureUrl: "https://helyacare.com/logo-white.png",
  returnUrl: "https://helyacare.com",
  webHookUrl: "https://helyacare.com",
};

async function testAll() {
  await runTest({ ...basePayload, productId: "t1", productPrice: 1000 }, "productPrice: 1000");
  await runTest({ ...basePayload, productId: "t2", productPrice: 1000.0 }, "productPrice: 1000.0");
  await runTest({ ...basePayload, productId: "t3", productPrice: "1000" }, "productPrice: '1000'");
  await runTest({ ...basePayload, productId: "t4", productPrice: "1000.00" }, "productPrice: '1000.00'");
  await runTest({ ...basePayload, productId: "t5", productprice: 1000 }, "productprice: 1000");
  await runTest({ ...basePayload, productId: "t6", ProductPrice: 1000 }, "ProductPrice: 1000");
  
  // Try adding a currency 
  await runTest({ ...basePayload, productId: "t7", productPrice: 1000, currency: "XAF" }, "with currency: XAF");
}
testAll();
