import React, { useEffect, useState } from "react";
import "./ImageUpload.css";

export const ImageUpload = ({ label, onFileChange, defaultPreview = null }) => {
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (defaultPreview) {
      setPreview(defaultPreview);
    }
  }, [defaultPreview]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && (file.type === "image/png" || file.type === "image/jpeg")) {
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result);
      reader.readAsDataURL(file);
      onFileChange(file);
      console.log(file);
    } else {
      alert("Please upload a valid PNG or JPG image.");
    }
  };

  return (
    <div className="imageupload__container">
      <label className="imageupload__label">{label}</label>
      <input
        type="file"
        accept="image/png, image/jpeg"
        onChange={handleFileChange}
        className="imageupload__input"
      />
      {preview && (
        <a href={preview} target="_blank" rel="noopener noreferrer">
          <img src={preview} alt="Preview" className="imageupload__preview" />
        </a>
      )}
    </div>
  );
};
