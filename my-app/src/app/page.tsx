"use client"

import { useState } from "react";
import "./page.css";
import { Nav } from "@/components/Nav/Nav";
import { Row } from "@/components/Row/Row";
import { handleFileUpload } from "@/components/Nav/Nav";
import Image from "next/image";

export default function Home() {
  const [rows, setRows] = useState<any[]>([]);

  return (
    <div className="containerPage">
      <header>
        <Nav onFileUpload={(e) => handleFileUpload(e, setRows)} />
      </header>

      <main className="mainPage">
        <div className="sectionButtonFilter">
          <button>
            FILTRAR DATA
            <Image src="/Calendar.svg" alt="Icone calendario" width={20} height={20} />
          </button>
        </div>

        <div className="rows">
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

        <div className="sectionTotal">
          <p>Total = {rows.reduce((acc, row) => acc + parseFloat(row.value || 0), 0).toFixed(2)}</p>
          <button>
            Salvar
            <Image src="/ArrowIcon.svg" alt="Icone salvar" width={25} height={25} className="imgArrow" />
          </button>
        </div>
      </main>
    </div>
  );
}
