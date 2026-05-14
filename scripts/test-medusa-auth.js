const url = "https://api.helyacare.com/admin/customers";
const apiKey = "sk_0426ba22fb4e7312a0a67baee4e62f3a77125223159aeb45d5bcbff5ba04e528";

async function test() {
  console.log("Testing with Bearer:");
  const res1 = await fetch(url, {
    headers: {
      "Authorization": `Bearer ${apiKey}`
    }
  });
  console.log("Bearer status:", res1.status);
  console.log("Bearer response:", await res1.text());

  console.log("Testing with Basic:");
  const res2 = await fetch(url, {
    headers: {
      "Authorization": `Basic ${Buffer.from(`${apiKey}:`).toString("base64")}`
    }
  });
  console.log("Basic status:", res2.status);
  console.log("Basic response:", await res2.text());
}

test();
