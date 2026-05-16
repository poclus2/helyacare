import { ExecArgs } from "@medusajs/framework/types";
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils";
import { createApiKeysWorkflow, linkSalesChannelsToApiKeyWorkflow } from "@medusajs/medusa/core-flows";
import { ApiKey } from "../../.medusa/types/query-entry-points";

export default async function createPubKey({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const query = container.resolve(ContainerRegistrationKeys.QUERY);
  const salesChannelModuleService = container.resolve(Modules.SALES_CHANNEL);

  logger.info("Recherche du Sales Channel par défaut...");
  const defaultSalesChannel = await salesChannelModuleService.listSalesChannels();
  if (!defaultSalesChannel.length) {
    logger.error("Aucun Sales Channel trouvé ! Impossible de lier la clé.");
    return;
  }
  const defaultChannelId = defaultSalesChannel[0].id;

  logger.info("Création d'une nouvelle Publishable API Key...");
  
  const { result: [publishableApiKeyResult] } = await createApiKeysWorkflow(container).run({
    input: {
      api_keys: [
        {
          title: "Frontend Webshop",
          type: "publishable",
          created_by: "system",
        },
      ],
    },
  });

  const publishableApiKey = publishableApiKeyResult as ApiKey;

  logger.info(`Clé créée ! ID: ${publishableApiKey.id}`);
  logger.info("Liaison de la clé au Sales Channel...");

  await linkSalesChannelsToApiKeyWorkflow(container).run({
    input: {
      id: publishableApiKey.id,
      add: [defaultChannelId],
    },
  });

  logger.info("--------------------------------------------------");
  logger.info("🎉 SUCCESS! Voici votre Publishable API Key :");
  logger.info(publishableApiKey.token);
  logger.info("--------------------------------------------------");
  logger.info("Copiez cette clé et mettez-la dans le .env de votre frontend (NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY).");
}
