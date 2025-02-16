"use client"

import { useState, useEffect } from "react";
import "./page.css";
import { Nav } from "@/components/Nav/Nav";
import { Row } from "@/components/Row/Row";
import { handleFileUpload } from "@/components/Nav/Nav";
import Image from "next/image";
import { LoadingSpinner } from "@/components/Loading/Loading";

export default function Home() {
  const [rows, setRows] = useState<any[]>([]);
  const [savedRows, setSavedRows] = useState<any[]>([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchLancamentos();
  }, []);

  const formatDateForBackend = (date: string) => {
    if (!date) return "";
    
    const [year, month, day] = date.split("-");
    
    if (!year || !month || !day) return ""; 

    return `${day}/${month}/${year}`; 
  };

  const handleFilterByDate = () => {
    if (!startDate || !endDate) {
        console.error("Datas inválidas");
        return;
    }

    const formattedStartDate = formatDateForBackend(startDate);
    const formattedEndDate = formatDateForBackend(endDate);

    console.log("Filtrando por data:", formattedStartDate, formattedEndDate);

    fetchLancamentos(formattedStartDate, formattedEndDate);
  };

  async function fetchLancamentos(start = "", end = "") {
    setIsLoading(true);
    try {
      const response = await fetch(`https://apilancamentolanchonete.onrender.com/api/lancamentos?startDate=${start}&endDate=${end}`);
      if (!response.ok) {
        throw new Error("Erro ao buscar lançamentos");
      }
      const data = await response.json();
      setSavedRows(data);
    } catch (error) {
      console.error("Erro ao buscar lançamentos:", error);
    } finally {
      setIsLoading(false);
    }
  }


  async function salvarLancamentos(lancamentos: any[]) {
    try {
      const response = await fetch("https://apilancamentolanchonete.onrender.com/api/lancamentos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lancamentos }), 
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erro ao salvar os lançamentos.");
      }
  
      console.log("Lançamentos salvos com sucesso!");
      fetchLancamentos(); 
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="containerPage">
      <header>
        <Nav onFileUpload={(e) => handleFileUpload(e, setRows)} />
      </header>

      <main className="mainPage">
        <div className="sectionButtonFilter">
          <input 
            type="date" 
            value={startDate} 
            onChange={(e) => setStartDate(e.target.value)}
          />
          <input 
            type="date" 
            value={endDate} 
            onChange={(e) => setEndDate(e.target.value)}
          />
          <button onClick={handleFilterByDate}>
            FILTRAR DATA
            <Image src="/Calendar.svg" alt="Icone calendario" width={20} height={20} />
          </button>
        </div>

        {isLoading ? (
          <div className="rows">
            <LoadingSpinner />
          </div>
        ) : (
          rows.length > 0 ? (
            <>
              <div className="rows">
                <h2>Lançamentos do CSV</h2>
                {rows.map((row, index) => (
                  <Row
                    key={index}
                    name={row.name}
                    type={row.type}
                    value={row.value}
                    date={row.date}
                  />
                ))}
              </div>
              <div className="rows">
                <h2>Lançamentos Salvos</h2>
                {savedRows.map((row, index) => (
                  <Row
                    key={index}
                    name={row.name}
                    type={row.type}
                    value={row.value}
                    date={row.date}
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="rows">
              {savedRows.map((row, index) => (
                <Row
                  key={index}
                  name={row.name}
                  type={row.type}
                  value={row.value}
                  date={row.date}
                />
              ))}
            </div>
          )
        )}

        

        <div className="sectionTotal">
          <p>Total = {savedRows.reduce((acc, row) => acc + parseFloat(row.value || 0), 0).toFixed(2)}</p>
          <button onClick={() => salvarLancamentos(rows)}>
            Salvar
            <Image src="/ArrowIcon.svg" alt="Icone salvar" width={25} height={25} className="imgArrow" />
          </button>
        </div>
      </main>
    </div>
  );
}
