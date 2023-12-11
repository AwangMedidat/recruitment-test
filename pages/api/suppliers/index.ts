import sqlite3 from "sqlite3";
import { open, Database } from "sqlite";
import { NextApiResponse, NextApiRequest } from "next";
import { ResponseMessage, Supplier } from "@/interfaces";

let dbPromise: Promise<Database> | null = null;

function initDatabase(): Promise<Database> {
  if (!dbPromise) {
    dbPromise = open({
      filename: "./test.db",
      driver: sqlite3.Database,
    });
  }
  return dbPromise;
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Supplier[] | ResponseMessage>
) {
  const { method, body } = req

  switch (method) {
    case 'GET':
        initDatabase()
        .then((db) => {
          return db.all(
            `SELECT * FROM suplier`
          );
        })
        .then((suppliers) => {
          res.status(200).json(suppliers);
        })
        .catch((error) => {
          res.status(500).json({message: error});
        });
      break
    case 'POST':
        const { nama_suplier, alamat, email } = body;

        if (!nama_suplier || !alamat || !email) {
          res
            .status(400)
            .json({
              message:
                "Please provide name, price, and supplierId for the product",
            });
          return;
        }
  
        initDatabase()
          .then((db) => {
            return db.run(
              `INSERT INTO suplier (nama_suplier, alamat, email) VALUES (?, ?, ?)`,
              [nama_suplier, alamat, email]
            );
          })
          .then(() => {
            res.status(201).json({ message: "Supplier added successfully" });
          })
          .catch((error) => {
            res.status(500).json({ message: error });
          });
        break;
      break
    default:
      res.setHeader('Allow', ['GET', 'POST'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}
