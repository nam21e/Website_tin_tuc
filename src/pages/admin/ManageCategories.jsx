import { useEffect, useState } from "react";
import { getCategories } from "../../services/categoryService";
import AdminLayout from "../../layouts/AdminLayout";

export default function ManageCategories() {
  const [data, setData] = useState([]);

  useEffect(() => {
    getCategories().then((res) => setData(res.data));
  }, []);

  return (
    <AdminLayout>
      <h1 className="text-xl font-bold mb-4">Danh mục</h1>

      {data.map((c) => (
        <div key={c._id} className="border p-2 mb-2">
          {c.name}
        </div>
      ))}
    </AdminLayout>
  );
}