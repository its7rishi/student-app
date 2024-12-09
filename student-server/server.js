const express = require("express");
const cors = require("cors");
const postgresPool = require("pg").Pool;
const app = express();
const bodyParser = require("body-parser");
const port = process.env.PORT || 8000;

app.use(cors());

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.listen(port, (err) => {
  if (err) throw err;
  console.log(`Server is running on port: ${port}`);
});

const pool = new postgresPool({
  user: "postgres",
  password: "postgres",
  database: "student_master",
  host: "localhost",
  port: 5432,
  max: 10,
});

pool.connect((err, connection) => {
  if (err) throw err;
  console.log("Connected to database student_master successfully");
});

// Get all student records
app.get("/students", (req, res) => {
  const sql = "SELECT * from student ORDER BY studentid";
  pool.query(sql, (err, result) => {
    if (err) return res.json(err);
    return res.status(200).json(result.rows);
  });
});

// Get single student record by student id
app.get("/students/:studentId", (req, res) => {
  const stdId = Number(req.params.studentId);
  const sql = "SELECT * from student WHERE studentId=$1";
  pool.query(sql, [stdId], (err, result) => {
    if (err) return res.json(err);
    return res.status(200).json(result.rows[0]);
  });
});

// Create a new student in database
app.post("/students", (req, res) => {
  const { name, major, email } = req.body;
  const sql =
    "INSERT INTO student (name, major, email) VALUES ($1, $2, $3) RETURNING *";
  pool.query(sql, [name, major, email], (err, result) => {
    if (err) return res.json(err);
    return res.status(201).json(result.rows[0]);
  });
});

// Update student record
app.patch("/students/:studentId", (req, res) => {
  const stdId = Number(req.params.studentId);
  const { name, major, email } = req.body;
  const sql =
    "UPDATE student SET name = $1, major = $2, email = $3 WHERE studentId = $4";
  pool.query(sql, [name, major, email, stdId], (err, result) => {
    if (err) return res.json(err);
    return res
      .status(200)
      .send(`Student is updated successfully for studentId: ${stdId}`);
  });
});

// Delete student record from the database
app.delete("/students/:studentId", (req, res) => {
  const stdId = Number(req.params.studentId);
  const sql = "DELETE FROM student WHERE studentId = $1";
  pool.query(sql, [stdId], (err, result) => {
    if (err) return res.json(err);
    return res
      .status(200)
      .send(`Student record deleted successfully for studentId: ${stdId}`);
  });
});
