import React, { memo } from "react";
import { Button } from "reactstrap";
import { useDropzone } from "react-dropzone";
import uuid from "uuid";

// ### icons
import { CameraPlusOutlineIcon } from "../../Icons";

function readFileAsync(file) {
  return new Promise((resolve, reject) => {
    let reader = new FileReader();

    reader.onload = () => {
      resolve(reader.result);
    };

    reader.onerror = reject;

    // reader.readAsDataURL(file);
    reader.readAsArrayBuffer(file);
  });
}

function mapFilesAsync(files) {
  let promises = [];
  for (let i = 0; i < files.length; i++) {
    promises.push(readFileAsync(files[i]));
  }
  return Promise.all(promises);
}

function Uploader({ onUpload, filesCount, onUploadError }) {
  const { getRootProps, getInputProps, open } = useDropzone({
    // Disable click and keydown behavior
    noClick: true,
    noKeyboard: true,
    noDrag: true,
    accept: "image/*",
    multiple: true,
    onDrop: async acceptedFiles => {
      const totalFilesCount = acceptedFiles.length + filesCount;
      if (totalFilesCount <= 8) {
        const bufferDatas = await mapFilesAsync(acceptedFiles);

        const newFiles = acceptedFiles.map((file, index) => {
          // return Object.assign(file, {
          //   preview: URL.createObjectURL(file),
          //   bufferData: {
          //     data: bufferDatas[index],
          //     type: file.type
          //   }
          // });
          return {
            data: bufferDatas[index],
            type: file.type,
            name: file.name,
            id: uuid()
          };
        });

        onUpload(newFiles);
      } else {
        onUploadError({ message: "Maximum 8 photos" });
      }
    }
  });

  return (
    <div {...getRootProps({ className: "dropzone" })}>
      <input {...getInputProps()} />
      <Button
        className="btn-icon btn-icon-only bd-r-50 btn-condition"
        color="light"
        onClick={open}
        disabled={filesCount >= 8}
      >
        <CameraPlusOutlineIcon className="btn-icon-wrapper camera-icon" />
      </Button>
    </div>
  );
}

export default memo(Uploader);
