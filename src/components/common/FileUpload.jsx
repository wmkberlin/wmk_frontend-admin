import React, { useCallback, useState, useEffect, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import * as Icons from "react-icons/tb";
import Button from "./Button.jsx";
import { TbZoomIn } from "react-icons/tb";

const ItemTypes = {
  IMAGE: 'image',
};

const ImagePreviewModal = ({ imageUrl, onClose }) => {
  return (
    <div className="image-preview-modal">
      <div className="modal-backdrop" onClick={onClose}></div>
      <div className="modal-content">
        <img 
          src={imageUrl} 
          alt="Full screen preview" 
          onClick={(e) => e.stopPropagation()}
        />
        <button className="close-btn" onClick={onClose}>
          <Icons.TbX />
        </button>
      </div>
    </div>
  );
};

const DraggableImage = React.memo(({ image, index, onDelete, moveImage, isExisting, onImageClick }) => {
  const ref = useRef(null);

  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.IMAGE,
    item: { index, isExisting },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: ItemTypes.IMAGE,
    hover(item, monitor) {
      if (!ref.current) return;
      if (item.isExisting !== isExisting) return;
      
      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) return;

      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;

      moveImage(dragIndex, hoverIndex, isExisting);
      item.index = hoverIndex;
    },
  });

  drag(drop(ref));

  return (
    <div
      ref={ref}
      className="uploaded-image-container"
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <div className="uploaded-image image-preview">
        <img 
          src={image.preview || image} 
          alt={`Product Image ${index + 1}`}
          loading="lazy"
          decoding="async"
          width="800"
          height="600"
          onClick={() => onImageClick(image.preview || image)}
        />
        <div className="image-actions">
          <Button
            onClick={() => onImageClick(image.preview || image)}
            icon={<TbZoomIn />}
            className="sm transparent zoomIconProduct"
            title="Zoom"
          />
          <Button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(image.id || image, isExisting);
            }}
            icon={<Icons.TbTrash />}
            className="sm transparent"
            title="Delete"
          />
        </div>
      </div>
    </div>
  );
});

const DropZone = ({ existingImages = [], onFileUpload, onImagesReorder }) => {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [existingImgs, setExistingImgs] = useState([...existingImages]);
  const [previewImage, setPreviewImage] = useState(null);
  const existingImagesRef = useRef(existingImages);
  
  // Update ref when prop changes
  useEffect(() => {
    existingImagesRef.current = existingImages;
  }, [existingImages]);

  // Only update state if existingImages prop actually changed
  useEffect(() => {
    if (JSON.stringify(existingImages) !== JSON.stringify(existingImgs)) {
      setExistingImgs([...existingImages]);
    }
  }, [existingImages]);

  const moveImage = useCallback((dragIndex, hoverIndex, isExisting) => {
    if (isExisting) {
      setExistingImgs((prevImages) => {
        const newImages = [...prevImages];
        const [removed] = newImages.splice(dragIndex, 1);
        newImages.splice(hoverIndex, 0, removed);
        onImagesReorder?.(newImages);
        return newImages;
      });
    } else {
      setUploadedFiles((prevFiles) => {
        const newFiles = [...prevFiles];
        const [removed] = newFiles.splice(dragIndex, 1);
        newFiles.splice(hoverIndex, 0, removed);
        return newFiles;
      });
    }
  }, [onImagesReorder]);

  const onDrop = useCallback((acceptedFiles) => {
    const filesWithPreview = acceptedFiles.map((file) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
        id: Date.now() + file.name,
      })
    );
    setUploadedFiles((prevFiles) => [...prevFiles, ...filesWithPreview]);
    onFileUpload?.(filesWithPreview);
  }, [onFileUpload]);

  const onDelete = useCallback((id, isExisting) => {
    if (isExisting) {
      setExistingImgs((prevImages) => {
        const newImages = prevImages.filter((img) => img !== id);
        onImagesReorder?.(newImages);
        return newImages;
      });
    } else {
      setUploadedFiles((prevFiles) => {
        const newFiles = prevFiles.filter((file) => file.id !== id);
        const deletedFile = prevFiles.find(file => file.id === id);
        if (deletedFile?.preview) {
          URL.revokeObjectURL(deletedFile.preview);
        }
        return newFiles;
      });
    }
  }, [onImagesReorder]);

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  // Clean up object URLs when component unmounts
  useEffect(() => {
    return () => {
      uploadedFiles.forEach(file => {
        if (file.preview) URL.revokeObjectURL(file.preview);
      });
    };
  }, [uploadedFiles]);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="drop-zone-container">
        {previewImage && (
          <ImagePreviewModal 
            imageUrl={previewImage} 
            onClose={() => setPreviewImage(null)} 
          />
        )}
        
        <div className="existing-images">
          {existingImgs.map((image, index) => (
            <DraggableImage
              key={image}
              image={image}
              index={index}
              onDelete={onDelete}
              moveImage={moveImage}
              isExisting={true}
              onImageClick={setPreviewImage}
            />
          ))}
        </div>
        
        <div {...getRootProps()} className="drop-zone">
          <input id='fileUpload' {...getInputProps()} />
          <p>Drag & drop files here, or click to select files</p>
        </div>
        
        <div className="uploaded-images">
          {uploadedFiles.map((file, index) => (
            <DraggableImage
              key={file.id}
              image={file}
              index={index}
              onDelete={onDelete}
              moveImage={moveImage}
              isExisting={false}
              onImageClick={setPreviewImage}
            />
          ))}
        </div>
      </div>
    </DndProvider>
  );
};

export default React.memo(DropZone);