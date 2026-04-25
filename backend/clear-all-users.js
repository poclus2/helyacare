const { Client } = require('pg');
const client = new Client('postgresql://helya_admin:helya_password@localhost:5432/helyacare_db');
client.connect().then(async () => {
  try {
    await client.query("DELETE FROM user_rbac_role;");
    await client.query("DELETE FROM \"user\";");
    await client.query("DELETE FROM provider_identity;");
    await client.query("DELETE FROM auth_identity;");
    console.log("Database cleared of all users and identities.");
  } catch (err) {
    console.error("ERROR:", err);
  } finally {
    client.end();
  }
});
