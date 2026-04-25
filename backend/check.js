const { Client } = require('pg');
const client = new Client('postgresql://helya_admin:helya_password@localhost:5432/helyacare_db');
client.connect().then(() => {
  client.query('SELECT id, email FROM "user";')
    .then(res => { console.log("USERS:", res.rows); client.end(); })
    .catch(err => { console.error("ERROR:", err); client.end(); });
});
