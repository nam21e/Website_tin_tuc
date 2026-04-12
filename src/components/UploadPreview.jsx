import { useState } from "react";

export default function UploadPreview({ onChange }) {
  const [preview, setPreview] = useState(null);

  const handle = (e) => {
    const file = e.target.files[0];
    setPreview(URL.createObjectURL(file));
    onChange(file);
  };

  return (
    <div>
      <input type="file" onChange={handle} />
      {preview && <img src={preview} className="h-32" />}
    </div>
  );
}