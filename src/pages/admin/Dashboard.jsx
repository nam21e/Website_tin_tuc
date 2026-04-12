import { useEffect, useState } from "react";
import { getStats } from "../../services/dashboardService";
import { BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";
import AdminLayout from "../../layouts/AdminLayout";

export default function Dashboard() {
  const [data, setData] = useState([]);

  useEffect(() => {
    getStats().then((res) => setData(res.data));
  }, []);

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

      <BarChart width={500} height={300} data={data}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="value" />
      </BarChart>
    </AdminLayout>
  );
}