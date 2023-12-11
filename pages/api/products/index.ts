import sqlite3 from "sqlite3";
import { open, Database } from "sqlite";
import { NextApiResponse, NextApiRequest } from "next";
import { Product, ResponseMessage } from "@/interfaces";

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
  res: NextApiResponse<Product[] | ResponseMessage>
) {
  const { method, body } = req;

  switch (method) {
    case "GET":
      initDatabase()
        .then((db) => {
          return db.all(
            `SELECT * FROM produk JOIN suplier ON produk.suplier_id = suplier.id_suplier`
          );
        })
        .then((products) => {
          res.status(200).json(products);
        })
        .catch((error) => {
          res.status(500).json({ message: error });
        });
      break;
    case "POST":
      const { nama, deskripsi, harga, stok, foto, suplier_id } = body;

      if (!nama || !deskripsi || !harga || !stok || !suplier_id) {
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
            `INSERT INTO produk (nama, deskripsi, harga, stok, foto, suplier_id) VALUES (?, ?, ?, ?, ?, ?)`,
            [nama, deskripsi, +harga, +stok, foto, suplier_id]
          );
        })
        .then(() => {
          res.status(201).json({ message: "Product added successfully" });
        })
        .catch((error) => {
          res.status(500).json({ message: error });
        });
      break;
    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
