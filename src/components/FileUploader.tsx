
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, File, X, Check, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { uploadToS3 } from "@/services/s3Service";

interface FileUploaderProps {
  accept?: string;
  maxSize?: number;
  onFileSelected: (file: File) => void;
  onFileUploaded?: (url: string) => void;
}

const FileUploader = ({ 
  accept = ".pdf", 
  maxSize = 10, // MB
  onFileSelected,
  onFileUploaded
}: FileUploaderProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFile = e.dataTransfer.files[0];
    validateAndProcessFile(droppedFile);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      validateAndProcessFile(selectedFile);
    }
  };

  const validateAndProcessFile = (file: File) => {
    // Check file type
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      toast.error("Apenas arquivos PDF são aceitos");
      return;
    }

    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      toast.error(`O arquivo excede o tamanho máximo de ${maxSize}MB`);
      return;
    }

    setFile(file);
    onFileSelected(file);
    
    // Iniciar o upload para o S3
    handleUploadToS3(file);
  };

  const handleUploadToS3 = async (file: File) => {
    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      // Simulação de progresso enquanto faz o upload real
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          const newProgress = prev + 2;
          if (newProgress >= 95) {
            clearInterval(interval);
            return 95; // Mantém em 95% até o upload real terminar
          }
          return newProgress;
        });
      }, 100);
      
      // Upload real para o S3
      const url = await uploadToS3(file);
      
      // Upload concluído
      clearInterval(interval);
      setUploadProgress(100);
      setUploadedUrl(url);
      setIsUploading(false);
      
      toast.success("Arquivo enviado com sucesso");
      
      // Notifica o componente pai
      if (onFileUploaded) {
        onFileUploaded(url);
      }
    } catch (error) {
      console.error("Erro no upload:", error);
      toast.error("Erro ao enviar o arquivo. Tente novamente.");
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const removeFile = () => {
    setFile(null);
    setIsUploading(false);
    setUploadProgress(0);
    setUploadedUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {!file ? (
          <motion.div
            key="uploader"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`border-2 border-dashed rounded-xl p-8 transition-colors duration-300 text-center ${
              isDragging ? 'border-accent bg-accent/5' : 'border-muted-foreground/20'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input
              type="file"
              accept={accept}
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileSelect}
            />
            
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                <Upload className="h-8 w-8" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Arraste e solte o laudo</h3>
                <p className="text-sm text-muted-foreground">
                  Suporta apenas arquivos PDF até {maxSize}MB
                </p>
              </div>
              <Button 
                variant="outline" 
                onClick={() => fileInputRef.current?.click()}
                className="hover:bg-accent hover:text-white transition-colors"
              >
                Selecionar arquivo
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="file-preview"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="border rounded-xl p-6 bg-card shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-2 rounded-lg bg-accent/10 text-accent">
                  <File className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-medium text-sm truncate max-w-[200px] md:max-w-xs">
                    {file.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
              </div>
              
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-foreground"
                onClick={removeFile}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            {isUploading && (
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span>Enviando para o servidor...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="h-1" />
              </div>
            )}
            
            {!isUploading && uploadProgress === 100 && (
              <div className="mt-4 flex items-center text-sm text-green-600">
                <Check className="h-4 w-4 mr-1" />
                Arquivo pronto para análise
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FileUploader;
