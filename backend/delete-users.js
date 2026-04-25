const { Client } = require('pg');
const client = new Client('postgresql://helya_admin:helya_password@localhost:5432/helyacare_db');
client.connect().then(() => {
  client.query("DELETE FROM \"user\" WHERE email IN ('admin@helyacare.com', 'admin2@helyacare.com');")
    .then(res => { console.log("DELETED:", res.rowCount); client.end(); })
    .catch(err => { console.error("ERROR:", err); client.end(); });
});
