import MainLayout from "../../layouts/MainLayout";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Pie } from "react-chartjs-2";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

// Dummy data for Bar Chart
const barData = {
  labels: ["January", "February", "March", "April"],
  datasets: [
    {
      label: "Student Enrollments",
      data: [120, 190, 300, 250],
      backgroundColor: "rgba(54, 162, 235, 0.6)",
      borderColor: "rgba(54, 162, 235, 1)",
      borderWidth: 1,
    },
  ],
};

// Dummy data for Pie Chart
const pieData = {
  labels: ["Male", "Female"],
  datasets: [
    {
      label: "Gender Distribution",
      data: [700, 530],
      backgroundColor: ["#0d6efd", "#dc3545"],
      borderColor: ["#0a58ca", "#bb2d3b"],
      borderWidth: 1,
    },
  ],
};

const Dashboard = () => {
  const content = (
    <div className="container py-4">
      {/* Page Header */}
      <div className="mb-4">
        <h1 className="h3">Dashboard</h1>
        <p className="text-muted">Overview of your system</p>
      </div>

      {/* Summary Cards */}
      <div className="row g-4 mb-4">
        {/* Card 1 */}
        <div className="col-md-6 col-xl-3">
          <div className="card shadow-sm border-0">
            <div className="card-body d-flex align-items-center">
              <div className="me-3">
                <i className="bi bi-people-fill fs-2 text-primary"></i>
              </div>
              <div>
                <h6 className="card-title mb-0">Students</h6>
                <small className="text-muted">1,230</small>
              </div>
            </div>
          </div>
        </div>
        {/* Card 2 */}
        <div className="col-md-6 col-xl-3">
          <div className="card shadow-sm border-0">
            <div className="card-body d-flex align-items-center">
              <div className="me-3">
                <i className="bi bi-book-fill fs-2 text-success"></i>
              </div>
              <div>
                <h6 className="card-title mb-0">Subjects</h6>
                <small className="text-muted">54</small>
              </div>
            </div>
          </div>
        </div>
        {/* Card 3 */}
        <div className="col-md-6 col-xl-3">
          <div className="card shadow-sm border-0">
            <div className="card-body d-flex align-items-center">
              <div className="me-3">
                <i className="bi bi-mortarboard-fill fs-2 text-warning"></i>
              </div>
              <div>
                <h6 className="card-title mb-0">Teachers</h6>
                <small className="text-muted">67</small>
              </div>
            </div>
          </div>
        </div>
        {/* Card 4 */}
        <div className="col-md-6 col-xl-3">
          <div className="card shadow-sm border-0">
            <div className="card-body d-flex align-items-center">
              <div className="me-3">
                <i className="bi bi-bar-chart-fill fs-2 text-danger"></i>
              </div>
              <div>
                <h6 className="card-title mb-0">Reports</h6>
                <small className="text-muted">128</small>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="row g-4">
        {/* Bar Chart */}
        <div className="col-lg-8">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h5 className="card-title">Monthly Enrollments</h5>
              <div className="chart-container" style={{ height: "350px" }}>
                <Bar data={barData} options={{ responsive: true, maintainAspectRatio: false }} />
              </div>
            </div>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="col-lg-4">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h5 className="card-title">Gender Distribution</h5>
              <div className="chart-container" style={{ height: "350px" }}>
                <Pie data={pieData} options={{ responsive: true, maintainAspectRatio: false }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return <MainLayout content={content} />;
};

export default Dashboard;