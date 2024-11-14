import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
  const {} = useMutation({
    mutationFn: async ({ file }: { file: File }) => {
      const form = new FormData();
      form.append("contract", file);

      const response = await axios.post("/api/contracts", form);
      return response.data;
    },
  });
}