"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MessageProps } from "@/types";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  scores: MessageProps | null;
}

const EvalResultModal = ({ isOpen, onClose, scores }: Props) => {
  if (!scores) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Evaluation Results</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 py-4">
          <div className="font-semibold">Faithfulness:</div>
          <div>{scores.faithfulness?.toFixed(4) || 'N/A'}</div>

          <div className="font-semibold">Answer Relevancy:</div>
          <div>{scores.answer_relevancy?.toFixed(4) || 'N/A'}</div>

          <div className="font-semibold">Context Precision:</div>
          <div>{scores.context_precision?.toFixed(4) || 'N/A'}</div>

          <div className="font-semibold">Context Relevance:</div>
          <div>{scores.context_relevance?.toFixed(4) || 'N/A'}</div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EvalResultModal;