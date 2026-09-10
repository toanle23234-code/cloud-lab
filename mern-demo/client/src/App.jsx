import { useEffect, useState } from "react";

function App() {
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({
    studentId: "",
    name: "",
    email: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((currentData) => ({ ...currentData, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setSubmitMessage("");

    try {
      const response = await fetch("/api/students", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Không thể thêm sinh viên");
      }

      setStudents((currentStudents) => [...currentStudents, data]);
      setFormData({ studentId: "", name: "", email: "" });
      setSubmitMessage("Thêm sinh viên thành công");
    } catch (submitError) {
      console.error(submitError);
      setSubmitMessage(submitError.message || "Lỗi khi thêm sinh viên");
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    fetch("/api/students")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Không thể lấy danh sách sinh viên");
        }
        return response.json();
      })
      .then((data) => {
        setStudents(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setError("Lỗi khi kết nối đến Backend API");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <h2>Đang tải danh sách sinh viên...</h2>;
  }

  if (error) {
    return <h2>{error}</h2>;
  }

  return (
    <div className="app-content">
      <h1>Danh sách sinh viên</h1>

      <form className="student-form" onSubmit={handleSubmit}>
        <h2>Nhập thông tin sinh viên</h2>

        <label htmlFor="studentId">MSSV</label>
        <input
          id="studentId"
          name="studentId"
          type="text"
          value={formData.studentId}
          onChange={handleChange}
          placeholder="Nhập mã số sinh viên"
          required
        />

        <label htmlFor="name">Họ tên</label>
        <input
          id="name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          placeholder="Nhập họ và tên"
          required
        />

        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Nhập địa chỉ email"
          required
        />

        <button type="submit" disabled={submitting}>
          {submitting ? "Đang gửi..." : "Nhập thông tin"}
        </button>
        {submitMessage && <p className="submit-message">{submitMessage}</p>}
      </form>

      {students.length === 0 ? (
        <p>Chưa có sinh viên</p>
      ) : (
        <table
          border="1"
          cellPadding="10"
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: "20px",
          }}
        >
          <thead>
            <tr>
              <th>MSSV</th>
              <th>Họ tên</th>
              <th>Email</th>
            </tr>
          </thead>

          <tbody>
            {students.map((student) => (
              <tr key={student._id}>
                <td>{student.studentId}</td>
                <td>{student.name}</td>
                <td>{student.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;
