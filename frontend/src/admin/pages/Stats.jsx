import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid,
  PieChart, Pie, Cell, Legend, LineChart, Line
} from "recharts";

const COLORS = ["#4CAF50", "#2196F3", "#FF9800", "#9C27B0", "#F44336", "#FFEB3B"];

export default function Stats() {
  const [dashboard, setDashboard] = useState({
    chart: [],
    topFood: [],
    lowStock: [],
    revenueToday: 0,
    totalOrders: 0,
    activeTables: 0
  });

  const [orderStatus, setOrderStatus] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState([]);

  const [quick, setQuick] = useState("today");
  const [range, setRange] = useState([null, null]);
  const [start, end] = range;

  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    loadDashboard();
    loadOrderStatus();
    loadPaymentMethod();
  }, []);

  const loadDashboard = async () => {
    const res = await fetch("http://localhost:5000/api/report/dashboard");
    setDashboard(await res.json());
  };

  const loadQuick = async () => {
    const res = await fetch(
      `http://localhost:5000/api/report/quick?type=${quick}`
    );
    const json = await res.json();

    setDashboard((prev) => ({
      ...prev,
      chart: json.chart,
      revenueToday: json.revenue,
      totalOrders: json.totalOrders
    }));
  };

  const loadRange = async () => {
    if (!start || !end) return;

    const from = start.toISOString().slice(0, 10);
    const to = end.toISOString().slice(0, 10);

    const res = await fetch(
      `http://localhost:5000/api/report/dashboard-range?from=${from}&to=${to}`
    );

    const json = await res.json();

    setDashboard((prev) => ({
      ...prev,
      chart: json.chart,
      revenueToday: json.revenue,
      totalOrders: json.totalOrders
    }));
  };

  const loadByDate = async (date) => {
    setSelectedDate(date);
    const d = date.toISOString().slice(0, 10);

    const res = await fetch(
      `http://localhost:5000/api/report/quick?type=day&date=${d}`
    );

    const json = await res.json();

    setDashboard((prev) => ({
      ...prev,
      chart: json.chart,
      revenueToday: json.revenue,
      totalOrders: json.totalOrders
    }));
  };

  const loadOrderStatus = async () => {
    const res = await fetch("http://localhost:5000/api/report/order-status");
    setOrderStatus(await res.json());
  };

  const loadPaymentMethod = async () => {
    const res = await fetch("http://localhost:5000/api/report/payment-method");
    setPaymentMethod(await res.json());
  };

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>📊 Dashboard</h1>

      {/* KPI */}
      <div style={styles.kpiRow}>
        <Card title="Doanh thu" value={money(dashboard.revenueToday)} />
        <Card title="Tổng đơn" value={dashboard.totalOrders} />
        <Card title="Bàn hoạt động" value={dashboard.activeTables} />
      </div>

      {/* FILTER */}
      <div style={styles.filterBar}>
        <select onChange={(e) => setQuick(e.target.value)} value={quick}>
          <option value="today">Hôm nay</option>
          <option value="week">Tuần</option>
          <option value="month">Tháng</option>
          <option value="year">Năm</option>
        </select>

        <button onClick={loadQuick}>Lọc nhanh</button>

        <DatePicker
          selectsRange
          startDate={start}
          endDate={end}
          onChange={(u) => setRange(u || [null, null])}
        />

        <button onClick={loadRange}>Lọc khoảng</button>
      </div>

      {/* CHART */}
      <div style={styles.chartGrid}>
        {/* LINE */}
        <div style={styles.box}>
          <h3>Doanh thu</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dashboard.chart}>
              <CartesianGrid />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line dataKey="revenue" stroke="#4CAF50" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* BAR */}
        <div style={styles.box}>
          <h3>Top món</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dashboard.topFood}>
              <CartesianGrid />
              <XAxis dataKey="menu_name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="total_sold" fill="#2196F3" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* PIE */}
        <div style={styles.box}>
          <h3>Trạng thái đơn</h3>
          <PieChart width={300} height={300}>
            <Pie data={orderStatus} dataKey="total" nameKey="status">
              {orderStatus.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>
      </div>

      {/* SECOND */}
      <div style={styles.chartGrid}>
        <div style={styles.box}>
          <h3>Thanh toán</h3>
          <PieChart width={300} height={300}>
            <Pie data={paymentMethod} dataKey="total">
              {paymentMethod.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </div>

        <div style={styles.box}>
          <h3>Calendar</h3>
          <Calendar onChange={loadByDate} value={selectedDate} />
        </div>
      </div>
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div style={styles.card}>
      <h4>{title}</h4>
      <h2>{value}</h2>
    </div>
  );
}

function money(n) {
  return new Intl.NumberFormat("vi-VN").format(n || 0) + " đ";
}

const styles = {
  page: {
    padding: 20,
    background: "#f4f6f8",
    minHeight: "100vh"
  },
  title: {
    marginBottom: 20
  },
  kpiRow: {
    display: "grid",
    gridTemplateColumns: "repeat(3,1fr)",
    gap: 16,
    marginBottom: 20
  },
  card: {
    background: "#fff",
    padding: 20,
    borderRadius: 10,
    textAlign: "center"
  },
  filterBar: {
    display: "flex",
    gap: 10,
    marginBottom: 20
  },
  chartGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))",
    gap: 20,
    marginBottom: 20
  },
  box: {
    background: "#fff",
    padding: 20,
    borderRadius: 10
  }
};