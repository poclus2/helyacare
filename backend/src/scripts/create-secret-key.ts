import { ExecArgs } from "@medusajs/framework/types";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";
import { createApiKeysWorkflow } from "@medusajs/medusa/core-flows";

export default async function createSecretKey({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);

  logger.info("Création d'une nouvelle Secret API Key (Admin)...");
  
  const { result: [secretApiKey] } = await createApiKeysWorkflow(container).run({
    input: {
      api_keys: [
        {
          title: "Admin Dashboard API Key",
          type: "secret",
          created_by: "system",
        },
      ],
    },
  });

  logger.info("--------------------------------------------------");
  logger.info("🎉 SUCCESS! Voici votre Secret API Key :");
  logger.info(secretApiKey.token);
  logger.info("--------------------------------------------------");
  logger.info("Copiez cette clé et mettez-la dans le .env de votre VPS sous le nom MEDUSA_API_KEY.");
}
