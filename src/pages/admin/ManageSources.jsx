import { useEffect, useState } from "react";
import { getSources } from "../../services/sourceService";
import AdminLayout from "../../layouts/AdminLayout";

export default function ManageSources() {
  const [data, setData] = useState([]);

  useEffect(() => {
    getSources().then((res) => setData(res.data));
  }, []);

  return (
    <AdminLayout>
      <h1 className="text-xl font-bold mb-4">Nguồn báo</h1>

      {data.map((s) => (
        <div key={s._id} className="border p-2 mb-2">
          {s.name}
        </div>
      ))}
    </AdminLayout>
  );
}