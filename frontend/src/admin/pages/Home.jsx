import { useEffect, useState } from "react";
import axios from "axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const API = "http://localhost:5000/api/home";

export default function HomeAdmin() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    banner_url: ""
  });

  const [file, setFile] = useState(null);
  const [list, setList] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(false);

  // ================= LOAD =================
  useEffect(() => {
    loadList();

    axios.get(API).then(res => {
      const data = res.data || {};
      setForm({
        title: data.title || "",
        description: data.description || "",
        banner_url: data.banner_url || ""
      });
    });
  }, []);

  const loadList = () => {
    axios.get(`${API}/list`)
      .then(res => setList(Array.isArray(res.data) ? res.data : []))
      .catch(err => console.log(err));
  };

  // ================= SELECT =================
  const selectItem = (item) => {
    setSelectedId(item.id);
    setForm({
      title: item.title || "",
      description: item.description || "",
      banner_url: item.banner_url || ""
    });
    setFile(null);
  };

  // ================= CREATE =================
  const handleCreate = async () => {
    try {
      setLoading(true);

      const data = new FormData();
      data.append("title", form.title || "");
      data.append("description", form.description || "");
      if (file) data.append("banner", file);

      await axios.post(API, data, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      loadList();
      setForm({ title: "", description: "", banner_url: "" });
      setFile(null);

    } catch (err) {
      console.log(err);
      alert("Lỗi thêm");
    } finally {
      setLoading(false);
    }
  };

  // ================= UPDATE =================
  const handleSave = async () => {
    if (!selectedId) return alert("Chọn bài cần sửa");

    try {
      setLoading(true);

      const data = new FormData();
      data.append("title", form.title || "");
      data.append("description", form.description || "");
      if (file) data.append("banner", file);

      await axios.put(`${API}/${selectedId}`, data, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      loadList();
      setFile(null);

    } catch (err) {
      console.log(err);
      alert("Lỗi lưu dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  // ================= DELETE =================
  const handleDelete = async (id) => {
    await axios.delete(`${API}/${id}`);
    loadList();
  };

  // ================= IMAGE =================
  const previewImage = () => {
    if (file) return URL.createObjectURL(file);

    if (form.banner_url) {
      return form.banner_url.startsWith("http")
        ? form.banner_url
        : `http://localhost:5000${form.banner_url}`;
    }

    return null;
  };

  // ================= QUILL =================
  const modules = {
    toolbar: [
      ["bold", "italic", "underline", "strike"],
      [{ size: ["small", false, "large", "huge"] }],
      [{ color: [] }, { background: [] }],
      [{ align: [] }],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image"],
      ["clean"]
    ]
  };

  const formats = [
    "bold", "italic", "underline", "strike",
    "size", "color", "background",
    "align",
    "list", "bullet",
    "link", "image"
  ];

  // ================= STYLE =================
  const style = `
    body {
      margin:0;
      font-family:Segoe UI;
      background:#f5f1ea;
      color:#4b2e1e;
    }

    .wrap {
      padding:20px;
    }

    h2 {
      color:#5c4033;
    }

    button {
      padding:8px 12px;
      border:none;
      border-radius:8px;
      cursor:pointer;
      margin-right:8px;
      font-weight:500;
      transition:.2s;
    }

    button:hover { transform:scale(1.03); }

    .save { background:#a67c52; color:#fff8f0; }
    .add { background:#8b5e3c; color:#fff8f0; }

    .preview {
      margin-top:15px;
      padding:15px;
      background:#fff8f0;
      border:1px solid #d2b48c;
      border-radius:10px;
    }

    .list {
      margin-top:20px;
    }

    .item {
      background:#fff;
      border:1px solid #e0d6c8;
      padding:10px;
      margin-bottom:10px;
      border-radius:10px;
      cursor:pointer;
    }

    .item.active {
      background:#f5e9dc;
      border-left:4px solid #a67c52;
    }

    .del {
      background:#c0392b;
      color:white;
      margin-top:8px;
    }

    .img {
      width:300px;
      height:200px;
      object-fit:cover;
      margin-top:10px;
      border-radius:10px;
      border:1px solid #d2b48c;
    }
  `;

  return (
    <div className="wrap">
      <style>{style}</style>

      <h2>📄 Home CMS</h2>

      {/* TITLE */}
      <ReactQuill
        value={form.title}
        onChange={(v) => setForm({ ...form, title: v })}
        modules={modules}
        formats={formats}
      />

      <br />

      {/* DESCRIPTION */}
      <ReactQuill
        value={form.description}
        onChange={(v) => setForm({ ...form, description: v })}
        modules={modules}
        formats={formats}
      />

      <br />

      <input type="file" onChange={(e) => setFile(e.target.files[0])} />

      <br /><br />

      <button className="save" onClick={handleSave}>
        💾 Lưu
      </button>

      <button className="add" onClick={handleCreate}>
        ➕ Thêm
      </button>

      {/* PREVIEW */}
      <div className="preview">
        <div dangerouslySetInnerHTML={{ __html: form.title }} />
        <div dangerouslySetInnerHTML={{ __html: form.description }} />

        {previewImage() && (
          <img className="img" src={previewImage()} />
        )}
      </div>

      {/* LIST */}
      <div className="list">
        {list.map(item => (
          <div
            key={item.id}
            className={`item ${selectedId === item.id ? "active" : ""}`}
            onClick={() => selectItem(item)}
          >
            <div dangerouslySetInnerHTML={{ __html: item.title }} />

            <button
              className="del"
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(item.id);
              }}
            >
              Xóa
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}