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

export default function productsHandler(
  req: NextApiRequest,
  res: NextApiResponse<Product | ResponseMessage>
) {
  const { method, query, body } = req;
  const { id } = query;

  switch (method) {
    case "GET":
      initDatabase()
        .then((db) => {
          return db.get(`SELECT * FROM produk WHERE id=${id}`);
        })
        .then((product) => {
            if (!product) {
                res.status(404).json({ message: "Product not found" });
                return;
              }
              res.status(200).json(product);
        })
        .catch((error) => {
          res.status(500).json({ message: error });
        });
      break;
    case "PUT":
      const { nama, deskripsi, harga, stok, foto, suplier_id } = body;

      if (!id || !nama || !deskripsi || !harga || !stok || !suplier_id) {
        res.status(400).json({
          message:
            "Please provide name, description, price, stock, and supplierId for the product update",
        });
        return;
      }

      initDatabase()
        .then((db) => {
          return db.run(
            `UPDATE produk SET nama = ?, deskripsi = ?, harga = ?, stok = ?, foto = ?, suplier_id = ? WHERE id = ${id}`,
            [nama, deskripsi, +harga, +stok, foto, suplier_id]
          );
        })
        .then(() => {
          res.status(200).json({ message: "Product updated successfully" });
        })
        .catch((error) => {
          res.status(500).json({ message: error });
        });
      break;
    case "DELETE":
      if (!id) {
        res
          .status(400)
          .json({ message: "Please provide the ID of the product to delete" });
        return;
      }

      initDatabase()
        .then((db) => {
          return db.run(`DELETE FROM produk WHERE id = ?`, [id]);
        })
        .then(() => {
          res.status(200).json({ message: "Product deleted successfully" });
        })
        .catch((error) => {
          res.status(500).json({ message: error });
        });
      break;
    default:
      res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
