"use client"

import Image from "next/image";
import Papa from "papaparse";
import "./Nav.css";

interface NavProps {
    onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  }
  
  export function Nav({ onFileUpload }: NavProps) {
    return (
      <nav className="containerNav">
        <div className="containerTitle">
          <h1>Lançamento</h1>
          <h1>de vendas</h1>
        </div>
  
        <div className="ContainerButton">
          <label htmlFor="fileInput" className="importButton">
            IMPORTAR EXTRATO
            <Image src="/importicone.svg" alt="import icone" width={18} height={18} className="imgImport" />
          </label>
  
          <input 
            id="fileInput" 
            type="file" 
            accept=".csv" 
            onChange={onFileUpload} 
            style={{ display: "none" }} 
          />
        </div>
      </nav>
    );
}

export function handleFileUpload(
    event: React.ChangeEvent<HTMLInputElement>,
    setRows: React.Dispatch<React.SetStateAction<any[]>>
  ) {
    const file = event.target.files?.[0];
    if (!file) return;
  
    const reader = new FileReader();
  
    reader.onload = () => {
      let csvData = reader.result;
      if (typeof csvData !== "string") {
        console.error("Erro: os dados do arquivo não são uma string válida.");
        return;
      }
  
      const linhas = csvData.split("\n").slice(8).join("\n");
  
    
      const parsedData = Papa.parse(linhas, {
        header: true,
        skipEmptyLines: true,
        delimiter: ",", 
        dynamicTyping: true,
      });
  
      console.log("Dados brutos:", parsedData.data);
      if (parsedData.data.length > 0) {
        console.log("Nomes das colunas:", Object.keys(parsedData.data[0] as object));
      }
  
      if (!parsedData || !parsedData.data) {
        console.error("Erro ao processar o CSV:", parsedData);
        return;
      }
  
      const processedData = parsedData.data.map((row: any) => {
        const entrada = row["Entrada(R$)"] || row[" Entrada(R$)"] || row["Entrada (R$)"] || row[" Entrada (R$)"] || "0";
        return {
          date: row["Data Lançamento"] || "Data não disponível",
          name: extrairNome(row["Título"]),
          value: formatarValor(entrada),
          type: determinarTipo(row["Título"]),
        };
      });
  
      console.log("Dados processados:", processedData);
      setRows(processedData);
    };
  
    reader.onerror = () => {
      console.error("Erro ao ler o arquivo.");
    };
  
    reader.readAsText(file);
}
  

function extrairNome(titulo: string | undefined): string {
    if (!titulo || typeof titulo !== 'string') {
        return 'Título inválido';
    }

    const match = titulo.match(/Pix recebido de ([\w\s]+)/);
    return match ? match[1].trim() : 'Nome não encontrado';
}

function determinarTipo(titulo: string | undefined): string {
    if (!titulo || typeof titulo !== 'string') {
        return 'Outro';
    }

    return titulo.toLowerCase().includes('pix') ? 'Pix' : 'Outro';
}

function formatarValor(valor: string | number | undefined): string {
    if (valor == null || valor === "" || isNaN(Number(valor))) {
      return "0.00";
    }

    const numero = parseFloat(String(valor).replace(",", ".").trim());
    return isNaN(numero) ? "0.00" : numero.toFixed(2);
}