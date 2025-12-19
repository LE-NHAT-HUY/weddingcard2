import { useState, useEffect, useRef } from "react";

export default function RSVPSection({ submitEndpoint = "/api/rsvp" }) {
  const [form, setForm] = useState({
    name: "",
    relation: "",
    attending: null,
    guests: 1,
    phone: "",
    message: "",
  });

  const [openFields, setOpenFields] = useState({
    name: false,
    relation: false,
    attending: false,
    guestsPhone: false,
    message: false,
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  const primaryColor = "#042b20ff";
  const successColor = "#166534";

  const onChange = (k, v) => setForm((s) => ({ ...s, [k]: v }));
  const toggleField = (field) => setOpenFields((s) => ({ ...s, [field]: !s[field] }));

  // Ref để theo dõi các field
  const fieldsRef = useRef([]);
  const [visibleFields, setVisibleFields] = useState([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = Number(entry.target.dataset.index);
          if (entry.isIntersecting) {
            setVisibleFields((prev) => {
              if (!prev.includes(index)) return [...prev, index];
              return prev;
            });
          }
        });
      },
      { threshold: 0.1 }
    );

    fieldsRef.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    setErrorMsg("");

    if (!form.name.trim()) {
      setErrorMsg("Vui lòng nhập tên của bạn.");
      setLoading(false);
      return;
    }
    if (form.attending === null) {
      setErrorMsg("Vui lòng cho biết bạn có tham dự hay không.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(submitEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Lỗi khi gửi dữ liệu");
      }

      setStatus("success");
      setForm({ name: "", relation: "", attending: null, guests: 1, phone: "", message: "" });
      setOpenFields({ name: false, relation: false, attending: false, guestsPhone: false, message: false });
    } catch (err) {
      console.error(err);
      setStatus("error");
      setErrorMsg(err.message || "Gửi thất bại");
    } finally {
      setLoading(false);
    }
  };

  const headerClass =
    "w-full sm:w-80 text-left px-4 py-2 cursor-pointer font-normal text-[#111111]  bg-[##faf8f5] border border-[#111111] rounded-full mb-2 transition-all duration-300 hover: bg-[##faf8f5] hover:shadow-sm";

  const inputClass =
    "w-full sm:w-80 border border-[#111111] rounded-full px-4 py-2 focus:outline-none focus:ring-0 transition-all duration-300";

  const radioClass =
    "w-5 h-4 border-2 border-[#111111] rounded-full cursor-pointer transition-all duration-200";

  const fields = [
    {
      label: "Tên của bạn là gì?",
      key: "name",
      type: "text",
      placeholder: "Nhập họ và tên",
    },
    {
      label: "Bạn là gì của cô dâu chú rể?",
      key: "relation",
      type: "text",
      placeholder: "Ví dụ: Bạn học, Hàng xóm, Người thân...",
    },
    {
      label: "Bạn có tham dự không?",
      key: "attending",
      type: "radio",
    },
  ];

  return (
    <section
      id="rsvp"
      className="w-full max-w-full overflow-x-hidden  bg-[##faf8f5] px-4 sm:px-8 py-8"
      style={{ fontFamily: "'Playfair Display', serif", }}
    >
      <p className="text-xs sm:text-sm text-center font-medium tracking-wide text-[#111111] mb-8">
        HÃY XÁC NHẬN SỰ CÓ MẶT CỦA QUÝ KHÁCH ĐỂ GIA ĐÌNH CHÚNG TÔI CHUẨN BỊ ĐÓN TIẾP MỘT CÁCH CHU ĐÁO NHẤT, TRÂN TRỌNG!
      </p>

      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-6">
        {fields.map((field, idx) => (
          <div
            key={field.key}
            ref={(el) => (fieldsRef.current[idx] = el)}
            data-index={idx}
            className={`flex justify-center transform transition-all duration-700 ${
              visibleFields.includes(idx)
                ? "translate-y-0 opacity-100"
                : "translate-y-8 opacity-0"
            }`}
            style={{ transitionDelay: `${idx * 150}ms` }}
          >
            <div className="w-full sm:w-80">
              <div
                className={headerClass}
                onClick={() => toggleField(field.key)}
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {field.label}
              </div>
              {field.type === "text" && (
                <div
                  className={`overflow-hidden transition-all duration-500 ${
                    openFields[field.key] ? "max-h-40 opacity-100 mt-3" : "max-h-0 opacity-0"
                  }`}
                >
                  <input
                    type="text"
                    value={form[field.key]}
                    onChange={(e) => onChange(field.key, e.target.value)}
                    placeholder={field.placeholder}
                    className={inputClass}
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  />
                </div>
              )}
              {field.type === "radio" && (
                <div
                  className={`overflow-hidden transition-all duration-500 ${
                    openFields[field.key] ? "max-h-40 opacity-100 mt-3" : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="flex gap-6 justify-center py-2">
                    <label className="inline-flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name={field.key}
                        checked={form.attending === true}
                        onChange={() => onChange("attending", true)}
                        className={radioClass}
                        style={{
                          appearance: "none",
                          backgroundColor: form.attending === true ? primaryColor : "transparent",
                          borderColor: primaryColor,
                        }}
                      />
                      <span
                        style={{
                          fontFamily: "'Playfair Display', serif",
                          color: form.attending === true ? primaryColor : "#111111",
                        }}
                      >
                        Có
                      </span>
                    </label>
                    <label className="inline-flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name={field.key}
                        checked={form.attending === false}
                        onChange={() => onChange("attending", false)}
                        className={radioClass}
                        style={{
                          appearance: "none",
                          backgroundColor: form.attending === false ? primaryColor : "transparent",
                          borderColor: primaryColor,
                        }}
                      />
                      <span
                        style={{
                          fontFamily: "'Playfair Display', serif",
                          color: form.attending === false ? primaryColor : "#111111",
                        }}
                      >
                        Không
                      </span>
                    </label>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Submit button */}
        {/* Submit button */}
<div
  ref={(el) => (fieldsRef.current[fields.length] = el)}
  data-index={fields.length}
  className={`flex justify-center transform transition-all duration-700 ${
    visibleFields.includes(fields.length)
      ? "translate-y-0 opacity-100"
      : "translate-y-8 opacity-0"
  }`}
  style={{ transitionDelay: `${fields.length * 150}ms` }}
>
  <div className="flex flex-col sm:flex-row sm:items-center gap-4 mt-4">
    <button
      type="submit"
      disabled={loading}
      className="text-white px-31 py-2 rounded-full disabled:opacity-50 transition-all duration-300 font-medium tracking-wide shadow-sm hover:shadow-md"
      style={{
        fontFamily: "'Playfair Display', serif",
        backgroundColor: primaryColor,
        border: `2px solid ${primaryColor}`,
        opacity: loading ? 0.5 : 1,
        cursor: loading ? "not-allowed" : "pointer",
      }}
      onMouseEnter={(e) => {
        if (!loading) e.currentTarget.style.backgroundColor = "#030b20ff";
      }}
      onMouseLeave={(e) => {
        if (!loading) e.currentTarget.style.backgroundColor = primaryColor;
      }}
    >
      {loading ? "Đang gửi..." : "Xác nhận"}
    </button>

    {/* --- Thêm nhắc nhở lỗi ngay dưới nút gửi --- */}
    {errorMsg && (
      <p className="mt-2 text-red-600 text-sm font-medium text-center w-full sm:w-auto">
        {errorMsg}
      </p>
    )}
  </div>
</div>

      </form>
    </section>
  );
}
