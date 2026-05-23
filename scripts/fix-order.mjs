const url = 'http://localhost:9000/admin/customers/cus_01KRV2FY9JZK0N1SBEEPY9DZVE';
const key = 'Basic ' + Buffer.from(process.env.MEDUSA_API_KEY + ':').toString('base64');
fetch(url, { headers: { Authorization: key }})
  .then(res => res.json())
  .then(data => {
    let deps = data.customer?.metadata?.deposit_requests ? JSON.parse(data.customer.metadata.deposit_requests) : [];
    deps.push({
      id: 'HC-1779542297854-V466ME',
      reference_code: 'HC-1779542297854-V466ME',
      amount: 200,
      status: 'completed',
      method: 'tara',
      created_at: new Date().toISOString(),
      processed_at: new Date().toISOString(),
      cart_items: [{ title: 'Achat HelyaCare (Virtuel)', unit_price: 200, quantity: 1 }]
    });
    return fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: key },
      body: JSON.stringify({ metadata: { ...data.customer?.metadata, deposit_requests: JSON.stringify(deps) }})
    });
  })
  .then(res => res.json())
  .then(console.log)
  .catch(console.error);
