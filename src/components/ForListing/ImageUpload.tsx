import React, { useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { FaUpload } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";

interface PreviewFile extends File {
  preview?: string;
}

const ImageUpload: React.FC<{ images: PreviewFile[]; setImages: (images: PreviewFile[]) => void }> = ({ images, setImages }) => {
  const onDrop = (acceptedFiles: File[]) => {
    const validFiles: PreviewFile[] = [];
    const invalidFiles: string[] = [];

    if (images.length + acceptedFiles.length > 15) {
      toast.error("You can upload a maximum of 15 images.");
      return;
    }

    acceptedFiles.forEach(file => {
      if (file.size <= 5 * 1024 * 1024) {
        validFiles.push(Object.assign(file, { preview: URL.createObjectURL(file) }) as PreviewFile);
      } else {
        invalidFiles.push(file.name);
      }
    });

    if (invalidFiles.length > 0) {
      toast.error(`Files not uploaded: ${invalidFiles.join(", ")} (Exceeds 5MB)`);
    }

    setImages([...images, ...validFiles]);
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop, maxFiles: 15, accept: { "image/*": [] } });

  useEffect(() => {
    return () => {
      images.forEach(image => URL.revokeObjectURL(image.preview!));
    };
  }, [images]);

  return (
    <div className="real-estate-form-section">
      <h3>Upload Images (max 15)</h3>
      <div {...getRootProps({ className: "real-estate-form-dropzone" })}>
        <input {...getInputProps()} />
        <FaUpload size={40} />
        <p>Drag & drop or click to select images</p>
      </div>
      <p className="real-estate-form-image-limit">Max 15 images, 5MB each</p>
      <div className="real-estate-form-image-preview">
        {images.map((file, index) => (
          <div key={index} className="real-estate-form-image-container">
            <img src={file.preview} alt="Preview" />
            <button type="button" className="real-estate-form-image-remove" onClick={() => removeImage(index)}>
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageUpload;
