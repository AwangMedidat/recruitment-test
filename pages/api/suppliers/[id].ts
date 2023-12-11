import sqlite3 from "sqlite3";
import { open, Database } from "sqlite";
import { NextApiResponse, NextApiRequest } from "next";
import { Supplier, ResponseMessage } from "@/interfaces";

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

export default function suppliersHandler(
  req: NextApiRequest,
  res: NextApiResponse<Supplier | ResponseMessage>
) {
  const { method, query, body } = req;
  const { id } = query;

  switch (method) {
    case "GET":
        console.log(id, '<<<');
        
      initDatabase()
        .then((db) => {
          return db.get(`SELECT * FROM suplier WHERE id_suplier=${id}`);
        })
        .then((supplier) => {
            if (!supplier) {
                res.status(404).json({ message: "Supplier not found" });
                return;
              }
              res.status(200).json(supplier);
        })
        .catch((error) => {
          res.status(500).json({ message: error });
        });
      break;
    case "PUT":
      const { nama_suplier, alamat, email } = body;

      if (!nama_suplier || !alamat || !email) {
        res.status(400).json({
          message:
            "Please provide nama supplier, alamat, email for the product update",
        });
        return;
      }

      initDatabase()
        .then((db) => {
          return db.run(
            `UPDATE suplier SET nama_suplier = ?, alamat = ?, email = ? WHERE id_suplier = ${id}`,
            [nama_suplier, alamat, email]
          );
        })
        .then(() => {
          res.status(200).json({ message: "Supplier updated successfully" });
        })
        .catch((error) => {
          res.status(500).json({ message: error });
        });
      break;
    case "DELETE":
      if (!id) {
        res
          .status(400)
          .json({ message: "Please provide the ID of the supplier to delete" });
        return;
      }

      initDatabase()
        .then((db) => {
          return db.run(`DELETE FROM suplier WHERE id_suplier = ?`, [id]);
        })
        .then(() => {
          res.status(200).json({ message: "Supplier deleted successfully" });
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
