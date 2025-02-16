require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");

const app = express();
const prisma = new PrismaClient();

app.use(cors({ origin: '*' }));
app.use(bodyParser.json());

app.post("/api/lancamentos", async (req, res) => {
    try {
      const { lancamentos } = req.body;
  
      if (!Array.isArray(lancamentos)) {
        return res.status(400).json({ error: "O formato dos dados está incorreto. Esperado um array de lançamentos." });
      }
 
      const createdLancamentos = await prisma.lancamento.createMany({
        data: lancamentos.map((lancamento) => ({
            date: formatDateToISO(lancamento.date),
            name: lancamento.name,
            value: parseFloat(lancamento.value),
            type: lancamento.type,
        })),
        skipDuplicates: true, 
      });
  
      res.status(201).json({ message: "Lançamentos salvos com sucesso!", count: createdLancamentos.count });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao salvar os lançamentos." });
    }
  });
  

app.get("/api/lancamentos", async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        const formatDateToComparable = (dateStr) => {
            if (!dateStr) return null;
            const [year, month, day] = dateStr.split("-");
            return `${day}/${month}/${year}`; 
        };

        let whereClause = {};
        if (startDate && endDate) {
            whereClause = {
                date: {
                    gte: formatDateToISO(startDate),
                    lte: formatDateToISO(endDate)
                }
        };
}

        const lancamentos = await prisma.lancamento.findMany({
            where: whereClause,
            orderBy: {
                date: "asc"
            }
        });

        res.json(lancamentos);
    } catch (error) {
        console.error("Erro ao buscar lançamentos:", error);
        res.status(500).json({ error: "Erro ao buscar os lançamentos." });
    }
});

const formatDateToISO = (dateStr) => {
    if (!dateStr) return null;
    
    const [day, month, year] = dateStr.split("/");
    
    if (!day || !month || !year) return null; 

    return `${year}-${month}-${day}`; 
};

  

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
