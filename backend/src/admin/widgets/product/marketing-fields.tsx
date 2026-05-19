import { defineWidgetConfig } from "@medusajs/admin-sdk";
import { DetailWidgetProps, AdminProduct } from "@medusajs/framework/types";
import { Container, Heading, Text, Input, Button, Label, Textarea } from "@medusajs/ui";
import { useState } from "react";

const ProductMarketingWidget = ({ data }: DetailWidgetProps<AdminProduct>) => {
  const [isLoading, setIsLoading] = useState(false);
  const [metadata, setMetadata] = useState(data.metadata || {});

  const [badge, setBadge] = useState<string>((metadata.badge as string) || "");
  const [rating, setRating] = useState<string>((metadata.rating as string) || "4.8");
  const [reviewsCount, setReviewsCount] = useState<string>((metadata.reviews_count as string) || "120");
  const [saveBadge, setSaveBadge] = useState<string>((metadata.saveBadge as string) || "");
  
  const [benefitsStr, setBenefitsStr] = useState<string>(
    Array.isArray(metadata.benefits) ? metadata.benefits.join("\n") : ""
  );

  const [faqsStr, setFaqsStr] = useState<string>(
    Array.isArray(metadata.faqs) ? JSON.stringify(metadata.faqs, null, 2) : "[\n  {\n    \"q\": \"Question ?\",\n    \"a\": \"Réponse\"\n  }\n]"
  );

  const [ingredientsStr, setIngredientsStr] = useState<string>(
    Array.isArray(metadata.ingredients) ? JSON.stringify(metadata.ingredients, null, 2) : "[\n  {\n    \"title\": \"Extrait de Safran\",\n    \"description\": \"Description...\",\n    \"icon\": \"Flower2\"\n  }\n]"
  );

  const [testimonialsStr, setTestimonialsStr] = useState<string>(
    Array.isArray(metadata.testimonials) ? JSON.stringify(metadata.testimonials, null, 2) : "[\n  {\n    \"name\": \"Harry\",\n    \"quote\": \"Top !\",\n    \"image\": \"/images/...\"\n  }\n]"
  );

  const [crossSellHandle, setCrossSellHandle] = useState<string>((metadata.cross_sell_handle as string) || "");
  const [crossSellText, setCrossSellText] = useState<string>((metadata.cross_sell_text as string) || "");

  const handleSave = async () => {
    setIsLoading(true);
    try {
      let parsedFaqs = [];
      let parsedIngredients = [];
      let parsedTestimonials = [];
      
      try { parsedFaqs = JSON.parse(faqsStr); } catch(e) {}
      try { parsedIngredients = JSON.parse(ingredientsStr); } catch(e) {}
      try { parsedTestimonials = JSON.parse(testimonialsStr); } catch(e) {}

      const newMetadata = {
        ...metadata,
        badge,
        rating: parseFloat(rating),
        reviews_count: parseInt(reviewsCount),
        saveBadge,
        benefits: benefitsStr.split("\n").filter(b => b.trim() !== ""),
        faqs: parsedFaqs,
        ingredients: parsedIngredients,
        testimonials: parsedTestimonials,
        cross_sell_handle: crossSellHandle,
        cross_sell_text: crossSellText,
      };

      const response = await fetch(`/admin/products/${data.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          metadata: newMetadata
        }),
      });

      if (response.ok) {
        alert("Champs marketing mis à jour avec succès !");
      } else {
        alert("Erreur lors de la mise à jour");
      }
    } catch (e) {
      console.error(e);
      alert("Erreur interne");
    }
    setIsLoading(false);
  };

  return (
    <Container className="p-8">
      <Heading level="h2" className="mb-4">Champs Marketing (Page Produit HelyaCare)</Heading>
      <Text className="text-ui-fg-subtle mb-8">
        Gérez ici les informations dynamiques affichées sur la page du produit.
      </Text>

      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="flex flex-col gap-2">
          <Label>Badge (ex: CC-01™)</Label>
          <Input placeholder="CC-01™" value={badge} onChange={(e) => setBadge(e.target.value)} />
        </div>
        <div className="flex flex-col gap-2">
          <Label>Bulle d'économie (ex: Économisez 15%)</Label>
          <Input placeholder="Économisez 15%" value={saveBadge} onChange={(e) => setSaveBadge(e.target.value)} />
        </div>
        <div className="flex flex-col gap-2">
          <Label>Note / Rating (ex: 4.8)</Label>
          <Input type="number" step="0.1" value={rating} onChange={(e) => setRating(e.target.value)} />
        </div>
        <div className="flex flex-col gap-2">
          <Label>Nombre d'avis (ex: 12233)</Label>
          <Input type="number" value={reviewsCount} onChange={(e) => setReviewsCount(e.target.value)} />
        </div>
      </div>

      <div className="mb-8">
        <Label>Bienfaits (1 par ligne)</Label>
        <Textarea 
          placeholder="Réduit l'envie de sucre en 1 semaine&#10;Améliore la concentration..."
          value={benefitsStr} 
          onChange={(e) => setBenefitsStr(e.target.value)}
          rows={4}
          className="mt-2"
        />
      </div>

      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="flex flex-col gap-2">
          <Label>Cross-Sell Product Handle (ex: pack-bien-etre)</Label>
          <Input placeholder="crave-control" value={crossSellHandle} onChange={(e) => setCrossSellHandle(e.target.value)} />
        </div>
        <div className="flex flex-col gap-2">
          <Label>Cross-Sell Texte</Label>
          <Input placeholder="Pack + Économisez 25%" value={crossSellText} onChange={(e) => setCrossSellText(e.target.value)} />
        </div>
      </div>

      <div className="mb-8 space-y-4">
        <Label>Configuration JSON Avancée</Label>
        <Text className="text-ui-fg-subtle text-xs">Ces champs acceptent un format JSON pour les listes complexes.</Text>
        
        <div className="flex flex-col gap-2">
          <Label className="text-xs font-bold">Ingrédients Clés (Format JSON)</Label>
          <Textarea 
            value={ingredientsStr} 
            onChange={(e) => setIngredientsStr(e.target.value)}
            rows={6}
            className="font-mono text-xs"
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label className="text-xs font-bold">Témoignages (Format JSON)</Label>
          <Textarea 
            value={testimonialsStr} 
            onChange={(e) => setTestimonialsStr(e.target.value)}
            rows={6}
            className="font-mono text-xs"
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label className="text-xs font-bold">FAQs (Format JSON)</Label>
          <Textarea 
            value={faqsStr} 
            onChange={(e) => setFaqsStr(e.target.value)}
            rows={6}
            className="font-mono text-xs"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <Button variant="primary" onClick={handleSave} isLoading={isLoading}>
          Sauvegarder les métadonnées
        </Button>
      </div>
    </Container>
  );
};

export const config = defineWidgetConfig({
  zone: "product.details.after",
});

export default ProductMarketingWidget;
