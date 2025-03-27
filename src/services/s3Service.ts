import { S3Client, PutObjectCommand, ObjectCannedACL } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";

// Configuração do cliente S3 (Digital Ocean Spaces)
const s3Client = new S3Client({
  region: "nyc3",
  endpoint: "https://nyc3.digitaloceanspaces.com",
  credentials: {
    accessKeyId: "DO00324C4WRMEKMRGL9C",
    secretAccessKey: "wAujCwGwGSdPDoChy0BauKUpDWdoxwUqsv+VVwAt35k",
  },
  forcePathStyle: false // Importante para o Digital Ocean Spaces
});

export const uploadToS3 = async (file: File): Promise<string> => {
  try {
    console.log("Iniciando upload para S3:", file.name, file.type, file.size);
    
    // Gerar um nome único para o arquivo
    const timestamp = new Date().getTime();
    const randomId = Math.random().toString(36).substring(2, 10);
    const fileName = `teste-vistoria-lacrada/${file.name.split('.')[0]}_${timestamp}_${randomId}.pdf`;
    
    console.log("Nome do arquivo gerado:", fileName);
    
    // Método alternativo de upload usando PutObjectCommand
    // Isso pode ajudar a contornar alguns problemas de CORS
    const uploadParams = {
      Bucket: "se7i-cautelar",
      Key: fileName,
      Body: file,
      ContentType: "application/pdf",
      ACL: "public-read" as ObjectCannedACL, // Garante que o arquivo seja acessível publicamente
    };
    
    try {
      console.log("Tentando upload com PutObjectCommand...");
      const command = new PutObjectCommand(uploadParams);
      await s3Client.send(command);
      console.log("Upload bem-sucedido com PutObjectCommand");
    } catch (putError) {
      console.error("Erro no método PutObjectCommand:", putError);
      
      // Fallback para o método Upload
      console.log("Tentando método alternativo com Upload...");
      const upload = new Upload({
        client: s3Client,
        params: uploadParams,
      });
      
      await upload.done();
      console.log("Upload bem-sucedido com método Upload");
    }
    
    // Retornar a URL do arquivo
    const fileUrl = `https://se7i-cautelar.nyc3.digitaloceanspaces.com/${fileName}`;
    console.log("URL do arquivo gerada:", fileUrl);
    return fileUrl;
  } catch (error) {
    console.error("Erro ao fazer upload para S3:", error);
    if (error instanceof Error) {
      console.error("Detalhes do erro:", error.message);
      console.error("Stack trace:", error.stack);
    }
    throw error;
  }
};
