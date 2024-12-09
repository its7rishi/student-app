import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";

function App() {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [studentData, setStudentData] = useState({
    name: "",
    major: "",
    email: "",
  });
  const [errorMsg, setErrorMsg] = useState("");

  const openPopup = () => {
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    getAllStudents();
    setStudentData({ name: "", major: "", email: "" });
    setErrorMsg("");
  };

  const getAllStudents = () => {
    axios.get("http://localhost:8000/students").then((res) => {
      setStudents(res.data);
      setFilteredStudents(res.data);
    });
  };

  const handleSearch = (e) => {
    const searchValue = e.target.value.toLowerCase();

    const filteredData = students.filter(
      (student) =>
        student.name.toLowerCase().includes(searchValue) ||
        student.major.toLowerCase().includes(searchValue) ||
        student.email.toLowerCase().includes(searchValue)
    );

    setFilteredStudents(filteredData);
  };

  const handleChange = (e) => {
    setStudentData({ ...studentData, [e.target.name]: e.target.value });
  };

  const handleUpdate = (student) => {
    setStudentData(student);
    openPopup();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let errMsg = "";

    if (!studentData.name || !studentData.major || !studentData.email) {
      errMsg = "All fields are required";
      setErrorMsg(errMsg);
    }
    if (errMsg.length == 0 && studentData.studentid) {
      axios.patch(
        `http://localhost:8000/students/${studentData.studentid}`,
        studentData
      );
    } else if (errMsg.length == 0) {
      await axios
        .post("http://localhost:8000/students", studentData)
        .then((res) => {
          console.log(res.data);
        });
    }
    if (errMsg.length == 0) {
      handleClose();
    }
  };

  const handleDelete = async (studentId) => {
    const isConfirmed = window.confirm("Are you sure you want to Delete?");

    if (isConfirmed) {
      await axios
        .delete(`http://localhost:8000/students/${studentId}`)
        .then((res) => {
          console.log(res.data);
          getAllStudents();
        });
    }
  };

  useEffect(() => {
    getAllStudents();
  }, []);

  return (
    <>
      <div className="std-container">
        <h3>Fullstack App using ReactJs, NodeJs and PostgreSQL</h3>
        <div className="search-box">
          <input
            type="search"
            name="searchinput"
            id="searchinput"
            placeholder="Search Student Here"
            onChange={handleSearch}
            className="search-input"
          />
          <button className="addBtn addeditcolor" onClick={openPopup}>
            Add
          </button>
        </div>
        <div className="table-box">
          {isModalOpen && (
            <div className="addeditpopup">
              <span className="closeBtn" onClick={handleClose}>
                &times;
              </span>
              <h4>Student Details</h4>
              {errorMsg && <p className="error">{errorMsg}</p>}
              <div className="popupdiv">
                <label className="popuplabel" htmlFor="name">
                  Name
                </label>
                <input
                  className="popupinput"
                  type="text"
                  name="name"
                  id="name"
                  value={studentData.name}
                  onChange={handleChange}
                />
              </div>
              <br />
              <div className="popupdiv">
                <label className="popuplabel" htmlFor="major">
                  Major
                </label>
                <input
                  className="popupinput"
                  type="text"
                  name="major"
                  id="major"
                  value={studentData.major}
                  onChange={handleChange}
                />
              </div>
              <br />
              <div className="popupdiv">
                <label className="popuplabel" htmlFor="email">
                  Email
                </label>
                <input
                  className="popupinput"
                  type="text"
                  name="email"
                  id="email"
                  value={studentData.email}
                  onChange={handleChange}
                />
              </div>
              <button
                className="addstudentBtn addeditcolor"
                onClick={handleSubmit}
              >
                {studentData.studentid ? "Update Student" : "Add Student"}
              </button>
            </div>
          )}
          <table className="table">
            <thead>
              <tr>
                <th>StudentId</th>
                <th>Name</th>
                <th>Major</th>
                <th>Email</th>
                <th>Edit</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents &&
                filteredStudents.map((student) => {
                  return (
                    <tr key={student.studentid}>
                      <td>{student.studentid}</td>
                      <td>{student.name}</td>
                      <td>{student.major}</td>
                      <td>{student.email}</td>
                      <td>
                        <button
                          className="editBtn addeditcolor"
                          onClick={() => handleUpdate(student)}
                        >
                          Edit
                        </button>
                      </td>
                      <td>
                        <button
                          className="delBtn deletecolor"
                          onClick={() => handleDelete(student.studentid)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default App;
