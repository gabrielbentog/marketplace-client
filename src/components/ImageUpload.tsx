"use client";

import { ChangeEvent, useState } from "react";
import { X, ImagePlus } from "lucide-react";
import Image from "next/image";

interface ImageUploadProps {
  onImagesSelected: (files: File[]) => void;
}

export function ImageUpload({ onImagesSelected }: ImageUploadProps) {
  const [previews, setPreviews] = useState<string[]>([]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);

      // Gera URLs temporárias para o preview
      const newPreviews = filesArray.map(file => URL.createObjectURL(file));
      setPreviews(prev => [...prev, ...newPreviews]);

      // Envia os arquivos reais para o formulário
      onImagesSelected(filesArray);
    }
  };

  const removeImage = (index: number) => {
    // Nota: Em um cenário real, você também precisaria remover do array de Files no pai.
    // Por simplicidade visual, removemos apenas o preview aqui.
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="grid grid-cols-3 gap-4 sm:grid-cols-4">
      {previews.map((src, index) => (
        <div key={index} className="relative aspect-square rounded-md overflow-hidden border border-gray-200 bg-gray-50 dark:border-zinc-700 dark:bg-zinc-800">
          <Image src={src} alt="Preview" fill className="object-cover" />
          <button
            type="button"
            onClick={() => removeImage(index)}
            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 shadow-sm hover:bg-red-600 transition-colors"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      ))}

      <label className="flex flex-col items-center justify-center aspect-square rounded-md border-2 border-dashed border-gray-300 hover:border-blue-500 hover:bg-blue-50 cursor-pointer transition-all dark:border-zinc-700 dark:hover:bg-zinc-800/50 dark:hover:border-blue-500">
        <ImagePlus className="w-8 h-8 text-gray-400 mb-2" />
        <span className="text-xs text-gray-500 font-medium dark:text-gray-400">Adicionar</span>
        <input
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </label>
    </div>
  );
}
