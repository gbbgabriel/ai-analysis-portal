
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, ArrowLeft, Play } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import FileUploader from "@/components/FileUploader";
import LoadingSpinner from "@/components/LoadingSpinner";
import ResultTable from "@/components/ResultTable";
import { toast } from "sonner";

const LaudoAnalysisPage = () => {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<any>(null);

  const handleFileSelected = (file: File) => {
    setSelectedFile(file);
    // Reset analysis state when a new file is selected
    setAnalysisComplete(false);
    setAnalysisResults(null);
  };

  const startAnalysis = () => {
    if (!selectedFile) {
      toast.error("Por favor, selecione um laudo para análise");
      return;
    }

    setIsAnalyzing(true);
    
    // Simulate analysis for demonstration purposes
    setTimeout(() => {
      // Mock analysis results based on the sample image
      const mockResults = {
        results: [
          { field: "Placa:", textValue: "DTW8216", imageValue: "DTW8216", match: true },
          { field: "Chassi:", textValue: "9BD27803A72990408", imageValue: "9BD27803A72990408", match: true },
          { field: "Motor:", textValue: "178F3011015805B", imageValue: "178F3011015805B", match: true },
          { field: "Marca/Modelo:", textValue: "STRADA FIRE FLEX", imageValue: "STRADA FIRE FLEX", match: true },
          { field: "Cor:", textValue: "PRETA", imageValue: "PRETA", match: true },
        ],
        observations: "Observação I.A.: Motor reprovado por divergência com dados da BIN (Base de Índice Nacional). Cor do veículo divergente no CRLV conforme apontamentos."
      };
      
      setAnalysisResults(mockResults);
      setIsAnalyzing(false);
      setAnalysisComplete(true);
      toast.success("Análise concluída com sucesso");
    }, 5000);
  };

  const resetAnalysis = () => {
    setSelectedFile(null);
    setAnalysisComplete(false);
    setAnalysisResults(null);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container px-4 md:px-6 py-8">
        <div className="max-w-5xl mx-auto">
          <Button 
            variant="ghost" 
            size="sm" 
            className="mb-6 text-muted-foreground" 
            onClick={() => navigate("/")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
          
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-accent/10 p-2 rounded-lg text-accent">
                <FileText className="h-5 w-5" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight">Análise de Laudo</h1>
            </div>
            <p className="text-muted-foreground">
              Faça o upload de um laudo em PDF para análise automatizada com nossa IA.
            </p>
          </motion.div>
          
          <AnimatePresence mode="wait">
            {!analysisComplete ? (
              <motion.div
                key="upload-section"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-8"
              >
                <FileUploader onFileSelected={handleFileSelected} />
                
                {selectedFile && !isAnalyzing && (
                  <div className="flex justify-center">
                    <Button 
                      onClick={startAnalysis}
                      className="bg-accent hover:bg-accent/90 text-white"
                      size="lg"
                    >
                      <Play className="mr-2 h-4 w-4" />
                      Iniciar Análise
                    </Button>
                  </div>
                )}
                
                {isAnalyzing && (
                  <motion.div 
                    className="py-10 flex flex-col items-center justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <LoadingSpinner size="lg" text="Analisando laudo com IA..." />
                  </motion.div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="results-section"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="space-y-8"
              >
                <div className="bg-muted/30 rounded-lg p-6 border">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-medium">Resultados da análise</h2>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={resetAnalysis}
                    >
                      Nova análise
                    </Button>
                  </div>
                  
                  {analysisResults && (
                    <ResultTable 
                      results={analysisResults.results} 
                      observations={analysisResults.observations}
                    />
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default LaudoAnalysisPage;
