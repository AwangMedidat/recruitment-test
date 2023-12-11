const sqlite3 = require("sqlite3").verbose()

const db = new sqlite3.Database(
    "./test.db",
    sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
    (err) => {
        if (err) {
            return console.log(err.message)
        } else {
            console.log("Connected to the SQLite database")
        }
    }
)

db.serialize(() => {
    // Run SQL command to create table if it doesn't exist
    db.run(
      `CREATE TABLE IF NOT EXISTS suplier (
              id_suplier INTEGER PRIMARY KEY,
              nama_suplier TEXT,
              alamat TEXT,
              email TEXT
          )`,
      (err) => {
        // Error handling for table creation
        if (err) {
          return console.error(err.message);
        }
        console.log("Created suplier table");
  
        // Run SQL command to delete items in todo table
        db.run(`DELETE FROM suplier`, (err) => {
          // Error handling for deletion
          if (err) {
            return console.error(err.message);
          }
          console.log("Deleted items in suplier table");
  
          // Sample values for insertion
          const value1 = ["Buy groceries","jl.angin","jalan@mail.com"];
          const value2 = ["Walk Sam","jl.angin","jalan@mail.com"];
          const value3 = ["Fold laundry","jl.angin","jalan@mail.com"];
          const value4 = ["Workout","jl.angin","jalan@mail.com"];
  
          // SQL command for insertion
          const insertSql = `INSERT INTO suplier (nama_suplier,alamat,email) VALUES (?)`;
  
          // Execute insert commands for each value
          db.run(insertSql, value1, (err) => {
            if (err) {
              return console.error(err.message);
            }
            const id = this.lastID;
            console.log(`Added suplier item with id ${id}`);
          });
  
          db.run(insertSql, value2, (err) => {
            if (err) {
              return console.error(err.message);
            }
            const id = this.lastID;
            console.log(`Added suplier item with id ${id}`);
          });
          db.run(insertSql, value3, (err) => {
            if (err) {
              return console.error(err.message);
            }
            const id = this.lastID;
            console.log(`Added suplier item with id ${id}`);
          });
          db.run(insertSql, value4, (err) => {
            if (err) {
              return console.error(err.message);
            }
            const id = this.lastID;
            console.log(`Added suplier item with id ${id}`);
          });
  
          // Close the database connection
          db.close((err) => {
            if (err) {
              return console.error(err.message);
            }
            console.log("Closed the database connection.");
          });
        });
      }
    );
  });