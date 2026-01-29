"use client";

import { useState, useEffect, useRef } from "react";

export default function RSVPSection({
  submitEndpoint = "/api/rsvp",
  wishEndpoint = "/api/wishes",
}) {
  const [form, setForm] = useState({
    name: "",
    attending: null,
    guests: 1,
    phone: "",
    message: "",
    sendWish: false,
    wishMessage: "",
  });

  const [openFields, setOpenFields] = useState({
    name: false,
    attending: false,
    guestsPhone: false,
    message: false,
    sendWish: false,
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [wishStatus, setWishStatus] = useState(null);
  const [wishError, setWishError] = useState("");

  const primaryColor = "#042b20ff";
  const successColor = "#166534";

  const onChange = (k, v) => setForm((s) => ({ ...s, [k]: v }));
  const toggleField = (field) =>
    setOpenFields((s) => ({ ...s, [field]: !s[field] }));

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
    setWishStatus(null);
    setWishError("");

    // --- VẪN GIỮ VALIDATION ĐỂ TRÔNG GIỐNG THẬT ---
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

    if (!form.wishMessage.trim()) {
      setErrorMsg("Vui lòng gửi lời chúc đến cô dâu chú rể 💖");
      setLoading(false);
      return;
    }

    // --- PHẦN GIẢ LẬP GỬI DỮ LIỆU (KHÔNG GỌI API) ---
    // Tạo độ trễ 1.5 giây để người dùng thấy loading giống thật
    setTimeout(() => {
      // 1. Giả vờ gửi RSVP thành công
      setStatus("success");

      // 2. Giả vờ gửi lời chúc thành công (nếu có nhập)
      if (form.wishMessage.trim()) {
        setWishStatus("success");
      }

      // 3. Reset form như bình thường
      setForm({
        name: "",
        attending: null,
        guests: 1,
        phone: "",
        wishMessage: "",
      });
      setOpenFields({
        name: false,
        attending: false,
        guestsPhone: false,
        message: false,
      });

      // Tắt loading
      setLoading(false);
    }, 1500); // 1500ms = 1.5 giây delay
  };

  const headerClass =
    "w-full sm:w-80 text-left px-4 py-2 cursor-pointer font-normal text-[#111111] bg-[##faf8f5] border border-[#111111] rounded-full mb-2 transition-all duration-300 hover:shadow-sm";

  const inputClass =
    "w-full sm:w-80 border border-[#111111] rounded-full px-4 py-2 focus:outline-none focus:ring-0 transition-all duration-300";

  const radioClass =
    "w-5 h-5 border-2 border-[#111111] rounded-full cursor-pointer transition-all duration-200 flex-shrink-0";

  const fields = [
    {
      label: "Tên của bạn là gì?",
      key: "name",
      type: "text",
      placeholder: "Nhập họ và tên",
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
      className="w-full max-w-full overflow-x-hidden px-4 sm:px-8 py-8"
      style={{
        fontFamily: "'Playfair Display', serif",
        color: "#1f2628ff",
        backgroundColor: "transparent",
      }}
    >
      <p className="text-2sm sm:text-2sm text-center font-medium tracking-wide mb-8">
        Đừng quên gửi xác nhận tham dự để chúng mình đón tiếp một cách chu đáo
        hơn!
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
                    openFields[field.key]
                      ? "max-h-40 opacity-100 mt-3"
                      : "max-h-0 opacity-0"
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
                    openFields[field.key]
                      ? "max-h-80 opacity-100 mt-3"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="flex flex-col gap-4 py-2 pl-6">
                    <label className="inline-flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name={field.key}
                        checked={form.attending === true}
                        onChange={() => onChange("attending", true)}
                        className={radioClass}
                        style={{
                          appearance: "none",
                          backgroundColor:
                            form.attending === true
                              ? primaryColor
                              : "transparent",
                          borderColor: primaryColor,
                        }}
                      />
                      <span
                        style={{
                          fontFamily: "'Playfair Display', serif",
                          color:
                            form.attending === true ? primaryColor : "#111111",
                        }}
                      >
                        Có, tôi sẽ tham dự
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
                          backgroundColor:
                            form.attending === false
                              ? primaryColor
                              : "transparent",
                          borderColor: primaryColor,
                        }}
                      />
                      <span
                        style={{
                          fontFamily: "'Playfair Display', serif",
                          color:
                            form.attending === false ? primaryColor : "#111111",
                        }}
                      >
                        Không, tôi bận, rất tiếc không thể tham dự
                      </span>
                    </label>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* ----- Hàng "Gửi lời chúc đến dâu rể" ----- */}
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
          <div className="w-full sm:w-80">
            {/* Tiêu đề */}
            <div
              className={headerClass}
              onClick={() => toggleField("sendWish")}
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Gửi lời chúc đến cô dâu chú rể
            </div>

            {/* Nội dung textarea */}
            <div
              className={`overflow-hidden transition-all duration-500 ${
                openFields.sendWish
                  ? "max-h-60 opacity-100 mt-3"
                  : "max-h-0 opacity-0"
              }`}
            >
              <div className="mt-3">
                <textarea
                  value={form.wishMessage}
                  onChange={(e) => onChange("wishMessage", e.target.value)}
                  placeholder="Viết lời chúc của bạn..."
                  rows={3}
                  className="w-full border border-[#111111] rounded-2xl px-4 py-3 focus:outline-none focus:ring-0 transition-all duration-300 resize-none text-base"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Submit button */}
        <div
          ref={(el) => (fieldsRef.current[fields.length + 1] = el)}
          data-index={fields.length + 1}
          className={`flex justify-center transform transition-all duration-700 ${
            visibleFields.includes(fields.length + 1)
              ? "translate-y-0 opacity-100"
              : "translate-y-8 opacity-0"
          }`}
          style={{ transitionDelay: `${(fields.length + 1) * 150}ms` }}
        >
          <div className="flex flex-col items-center gap-3 mt-4 w-full">
            <button
              type="submit"
              disabled={loading}
              className="text-white px-12 py-2 rounded-full disabled:opacity-50 transition-all duration-300 font-medium tracking-wide shadow-sm hover:shadow-md whitespace-nowrap"
              style={{
                fontFamily: "'Playfair Display', serif",
                backgroundColor: primaryColor,
                border: `2px solid ${primaryColor}`,
                opacity: loading ? 0.5 : 1,
                cursor: loading ? "not-allowed" : "pointer",
              }}
              onMouseEnter={(e) => {
                if (!loading)
                  e.currentTarget.style.backgroundColor = "#030b20ff";
              }}
              onMouseLeave={(e) => {
                if (!loading) e.currentTarget.style.backgroundColor = primaryColor;
              }}
            >
              {loading ? "Đang gửi..." : "Gửi xác nhận"}
            </button>

            {/* --- Thông báo lỗi / thành công --- */}
            <div className="min-h-[24px] flex justify-center items-center w-full px-2">
              {errorMsg && (
                <p className="text-red-600 text-sm font-medium text-center break-words w-full">
                  {errorMsg}
                </p>
              )}
              {status === "success" && (
                <p
                  className="text-sm font-medium text-center"
                  style={{ color: successColor }}
                >
                  💖 Cảm ơn bạn đã xác nhận!
                </p>
              )}
              {status === "error" && (
                <p className="text-sm font-medium text-center text-red-600">
                  ❌ Gửi thất bại.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* --- Thông báo riêng cho việc gửi lời chúc --- */}
        {wishStatus === "success" && (
          <p
            className="text-sm font-medium text-center"
            style={{ color: successColor }}
          ></p>
        )}
        {wishStatus === "error" && (
          <p className="text-sm font-medium text-center text-red-600">
            {wishError}
          </p>
        )}
      </form>
    </section>
  );
}