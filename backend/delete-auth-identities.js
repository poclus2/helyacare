const { Client } = require('pg');
const client = new Client('postgresql://helya_admin:helya_password@localhost:5432/helyacare_db');
client.connect().then(() => {
  client.query("DELETE FROM auth_identity;")
    .then(res => { console.log("DELETED AUTH IDENTITIES:", res.rowCount); client.end(); })
    .catch(err => { console.error("ERROR:", err); client.end(); });
});
