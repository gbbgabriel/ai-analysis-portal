import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, ArrowLeft, Play } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import FileUploader from "@/components/FileUploader";
import LoadingSpinner from "@/components/LoadingSpinner";
import ResultTable from "@/components/ResultTable";
import PDFViewer from "@/components/PDFViewer";
import { toast } from "sonner";
import { processPDF, formatAnalysisToResults } from "@/services/apiService";

interface AnalysisResults {
  results: Array<{
    field: string;
    textValue: string;
    imageValue: string;
    match: boolean;
    percentage?: number;
  }>;
  observations: string;
  statusInfo: string;
  extra: {
    categoria: string;
    status: string;
  };
}

const LaudoAnalysisPage = () => {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<AnalysisResults | null>(null);

  const handleFileSelected = (file: File) => {
    setSelectedFile(file);
    setAnalysisComplete(false);
    setAnalysisResults(null);
  };

  const handleFileUploaded = (url: string) => {
    setFileUrl(url);
  };

  const startAnalysis = async () => {
    if (!selectedFile || !fileUrl) {
      toast.error("Por favor, aguarde o upload do arquivo ser concluído");
      return;
    }

    setIsAnalyzing(true);
    
    try {
      const analysisResponse = await processPDF(fileUrl);
      
      const formattedResults = formatAnalysisToResults(analysisResponse);
      
      setAnalysisResults(formattedResults);
      setIsAnalyzing(false);
      setAnalysisComplete(true);
      toast.success("Análise concluída com sucesso");
    } catch (error) {
      console.error("Erro na análise:", error);
      toast.error("Erro ao analisar o laudo. Por favor, tente novamente.");
      setIsAnalyzing(false);
    }
  };

  const resetAnalysis = () => {
    setSelectedFile(null);
    setFileUrl(null);
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
                <FileUploader 
                  onFileSelected={handleFileSelected} 
                  onFileUploaded={handleFileUploaded}
                />
                
                {selectedFile && fileUrl && !isAnalyzing && (
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
                      statusInfo={analysisResults.statusInfo}
                    />
                  )}
                </div>

                {fileUrl && (
                  <div>
                    <PDFViewer fileUrl={fileUrl} />
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default LaudoAnalysisPage;
