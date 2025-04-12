import { useState } from "react";
import axios from "axios";
import CodeMirror from "@uiw/react-codemirror";
import { json } from "@codemirror/lang-json";
import { oneDark } from "@codemirror/theme-one-dark";

const CodeBlock = () => {
  const [jsonRequest, setJsonRequest] = useState<string>(
    JSON.stringify(
      {
        question: "When was found M-Motors?",
        id: "11111111-1111-1111-1111-111111111111",
        collection: "my-vectorstore-id"
      },
      null,
      2
    )
  );
  const [response, setResponse] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleExecute = async () => {
    try {
      const parsed = JSON.parse(jsonRequest);
      const res = await axios.post("http://localhost:3000/api/rag", parsed, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      setResponse(res.data);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Erreur lors de l'exécution de la requête.");
      setResponse(null);
    }
  };

  return (
    <div className="p-6 space-y-6 bg-gray-100 dark:bg-gray-900 text-sm rounded-lg">
      <h2 className="text-xl font-bold text-gray-800 dark:text-white">
        Testeur API RAG
      </h2>

      <div>
        <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-2">
          Requête JSON
        </label>
        <CodeMirror
          value={jsonRequest}
          height="200px"
          extensions={[json()]}
          theme={oneDark} 
          onChange={(value) => setJsonRequest(value)}
        />
      </div>

      <button
        onClick={handleExecute}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        Exécuter
      </button>

      <div>
        <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">
          Réponse
        </h3>
        <CodeMirror
          value={
            error
              ? JSON.stringify({ error }, null, 2)
              : JSON.stringify(response, null, 2)
          }
          readOnly
          height="200px"
          extensions={[json()]}
          theme={oneDark}
        />
      </div>
    </div>
  );
}

export default CodeBlock