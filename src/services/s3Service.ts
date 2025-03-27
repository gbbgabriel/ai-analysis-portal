
import { S3Client } from "@aws-sdk/client-s3";
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
    // Gerar um nome único para o arquivo
    const timestamp = new Date().getTime();
    const randomId = Math.random().toString(36).substring(2, 10);
    const fileName = `teste-vistoria-lacrada/${file.name.split('.')[0]}_${timestamp}_${randomId}.pdf`;
    
    // Configurar o upload
    const upload = new Upload({
      client: s3Client,
      params: {
        Bucket: "se7i-cautelar",
        Key: fileName,
        Body: file,
        ContentType: "application/pdf",
        ACL: "public-read", // Garante que o arquivo seja acessível publicamente
      },
    });

    // Executar o upload
    await upload.done();
    
    // Retornar a URL do arquivo
    return `https://se7i-cautelar.nyc3.digitaloceanspaces.com/${fileName}`;
  } catch (error) {
    console.error("Erro ao fazer upload para S3:", error);
    throw error;
  }
};
