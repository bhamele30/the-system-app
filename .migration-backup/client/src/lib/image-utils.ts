export const compressImage = (file: File, callback: (dataUrl: string) => void) => {
  const reader = new FileReader();
  reader.onload = (e) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      // Scale down to a max width of 600px to save localStorage space
      const MAX_WIDTH = 600;
      let scaleSize = 1;
      
      if (img.width > MAX_WIDTH) {
        scaleSize = MAX_WIDTH / img.width;
      }
      
      canvas.width = img.width * scaleSize;
      canvas.height = img.height * scaleSize;
      
      const ctx = canvas.getContext("2d");
      ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      // Compress to JPEG with 0.6 quality
      const dataUrl = canvas.toDataURL("image/jpeg", 0.6);
      callback(dataUrl);
    };
    if (e.target?.result) {
      img.src = e.target.result as string;
    }
  };
  reader.readAsDataURL(file);
};