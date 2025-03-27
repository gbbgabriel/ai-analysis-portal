
interface AnalysisResponse {
  n_laudo: string;
  status_laudo: string;
  numero_laudo: string;
  placa: string;
  placa_veiculo_imagem_do_pdf: string;
  chassi: string;
  chassi_imagem_laudo: string;
  motor: string;
  motor_imagem_laudo: string;
  marca_modelo: string;
  marca_modelo_imagem_laudo: string;
  categoria_veiculo: string;
  cor_veiculo: string;
  cor_veiculo_imagem_laudo: string;
  nome_proprietario: string;
  municipio_proprietario: string;
  uf_proprietario: string;
  data_laudo: string;
  hora_laudo: string;
  observacoes_ia: string;
}

export const processPDF = async (pdfUrl: string): Promise<AnalysisResponse> => {
  try {
    const response = await fetch("https://curly-groups-end.loca.lt/inteligencia-artificial/process-pdf", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ pdfUrl }),
    });

    if (!response.ok) {
      throw new Error(`Erro na requisição: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Erro ao processar PDF:", error);
    throw error;
  }
};

export const formatAnalysisToResults = (analysis: AnalysisResponse) => {
  // Format date if it exists
  let formattedDate = "";
  try {
    if (analysis.data_laudo) {
      formattedDate = new Date(analysis.data_laudo).toLocaleDateString('pt-BR');
    }
  } catch (error) {
    console.error("Erro ao formatar data:", error);
    formattedDate = analysis.data_laudo || "";
  }
  
  // Create status info string
  const statusInfo = `Status do Laudo: ${analysis.status_laudo}. Proprietário: ${analysis.nome_proprietario}, ${analysis.municipio_proprietario}/${analysis.uf_proprietario}. Data: ${formattedDate}.`;
  
  return {
    results: [
      { 
        field: "Nº Laudo:", 
        textValue: analysis.numero_laudo, 
        imageValue: analysis.n_laudo, 
        match: analysis.numero_laudo === analysis.n_laudo 
      },
      { 
        field: "Placa:", 
        textValue: analysis.placa, 
        imageValue: analysis.placa_veiculo_imagem_do_pdf, 
        match: analysis.placa === analysis.placa_veiculo_imagem_do_pdf 
      },
      { 
        field: "Chassi:", 
        textValue: analysis.chassi, 
        imageValue: analysis.chassi_imagem_laudo, 
        match: analysis.chassi === analysis.chassi_imagem_laudo 
      },
      { 
        field: "Motor:", 
        textValue: analysis.motor, 
        imageValue: analysis.motor_imagem_laudo, 
        match: analysis.motor === analysis.motor_imagem_laudo 
      },
      { 
        field: "Marca/Modelo:", 
        textValue: analysis.marca_modelo, 
        imageValue: analysis.marca_modelo_imagem_laudo, 
        match: analysis.marca_modelo === analysis.marca_modelo_imagem_laudo 
      },
      { 
        field: "Cor:", 
        textValue: analysis.cor_veiculo, 
        imageValue: analysis.cor_veiculo_imagem_laudo, 
        match: analysis.cor_veiculo === analysis.cor_veiculo_imagem_laudo 
      },
    ],
    observations: analysis.observacoes_ia || "",
    statusInfo: statusInfo,
    extra: {
      categoria: analysis.categoria_veiculo,
      status: analysis.status_laudo
    }
  };
};
