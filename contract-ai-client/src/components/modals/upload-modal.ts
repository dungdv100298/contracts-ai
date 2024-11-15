import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useContractStore } from "@/store/zustand";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

interface IUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadComplete: () => void;
}

export function UploadModal({
  isOpen,
  onClose,
  onUploadComplete,
}: IUploadModalProps) {
  const { setAnalysisResults } = useContractStore();

  const { mutate: detectContractType, isPending: isDetecting } = useMutation({
    mutationFn: async ({ file }: { file: File }) => {
      const form = new FormData();
      form.append("contract", file);

      const response = await axios.post<{ detectedType: string }>(
        "/contracts/detect-type",
        form,
        {
          headers: {
            "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    },
    onSuccess: (data) => {
      setAnalysisResults(data);
      onUploadComplete();
    },
  });

  const { mutate: analyzeContract, isPending: isAnalyzing } = useMutation({
    mutationFn: async ({ file }: { file: File }) => {
      const form = new FormData();
      form.append("contract", file);

      const response = await axios.post("/contracts/analyze", form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    },
    onSuccess: (data) => {
      setAnalysisResults(data);
      onUploadComplete();
    },
  });
}