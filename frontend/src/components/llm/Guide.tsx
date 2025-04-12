import { FC, useRef } from "react";

const Guide: FC = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  return (
    <div className="overflow-y-auto flex flex-col gap-8" ref={scrollContainerRef}>
      <div
        className={`flex flex-col gap-4 bg-gray-900 px-2 shadow-md transition-all duration-500 ease-in-out transform pb-4`}
      >
        <h5 className="text-xl font-bold dark:text-white">Guide d’utilisation du système RAG</h5>
        <p className="text-sm text-gray-400">
          Ce guide présente les étapes essentielles pour configurer et utiliser un système de génération augmentée par récupération (RAG),
          c’est-à-dire un assistant capable de formuler des réponses à partir de documents que vous avez préalablement indexés.
        </p>
      </div>

      <div ref={listRef} className="flex flex-col gap-6 p-2">
        {[
          {
            title: "1. Installer un modèle LLM",
            description:
              "Choisissez un modèle de langage tel que Mistral, LLaMA ou tout autre compatible, puis installez-le. " +
              "Ce modèle générera les réponses. L’installation peut déclencher le téléchargement du modèle si nécessaire.",
          },
          {
            title: "2. Créer un embedder",
            description:
              "Un embedder transforme le texte brut de vos documents en vecteurs numériques exploitables. " +
              "Vous devez choisir un modèle (par exemple Sentence Transformers) qui sera utilisé pour l’indexation vectorielle.",
          },
          {
            title: "3. Créer une collection vectorielle",
            description:
              "Une collection est un espace de stockage logique pour les vecteurs générés. " +
              "Elle est liée à un embedder et servira de base de données contextuelle pour les réponses du LLM.",
          },
          {
            title: "4. Uploader un fichier",
            description:
              "Importez un ou plusieurs fichiers (PDF, DOCX, TXT...) contenant les données que vous souhaitez rendre accessibles au système. " +
              "Ces fichiers sont stockés avant d’être indexés.",
          },
          {
            title: "5. Ajouter des éléments à la collection",
            description:
              "Une fois le fichier uploadé, vous devez l’indexer. Cette opération découpe le contenu en morceaux (chunks), " +
              "les transforme en vecteurs à l’aide de l’embedder, et les enregistre dans la collection sélectionnée.",
          },
          {
            title: "6. Créer une session de chat",
            description:
              "Vous pouvez ensuite créer une session de chat liée à un modèle LLM et à une collection. " +
              "Chaque session représente un contexte conversationnel et peut être personnalisée avec une description et des options.",
          },
          {
            title: "7. Sélectionner un chat",
            description:
              "Si vous souhaitez reprendre une session existante, recherchez-la par son nom ou identifiant. " +
              "Cela permet de garder le fil d’une conversation ou de poser plusieurs questions dans un même contexte.",
          },
          {
            title: "8. Générer une réponse enrichie",
            description:
              "Enfin, posez une question. Le système utilisera la collection vectorielle liée au chat pour retrouver les documents pertinents, " +
              "et formulera une réponse enrichie avec le modèle LLM, en se basant à la fois sur vos documents et les capacités du modèle.",
          },
        ].map((step, index) => (
          <div key={index} className="border-l-4 border-blue-600 pl-4">
            <h6 className="text-lg font-semibold text-white">{step.title}</h6>
            <p className="text-sm text-gray-300 whitespace-pre-line">{step.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Guide