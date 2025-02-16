import "./Row.css";
import Image from "next/image";

interface RowProps {
  name: string;
  type: string;
  value: string;
  date: string;
}

export function Row({ name, type, value, date }: RowProps) {
  return (
    <div className="containerROw">
      <div className="name">
        <p>{name}</p>
      </div>

      <div className="type">
        <p>
          {type}
          {type === "Pix" && (
            <Image src="/iconePix.svg" alt="Icone pix" width={20} height={20} className="imgPix" />
          )}
        </p>
      </div>

      <div className="value">
        <p>R$: {value}</p>
      </div>

      <div className="date">
        <p>{date}</p>
      </div>
    </div>
  );
}
