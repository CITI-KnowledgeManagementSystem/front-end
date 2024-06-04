import React, { useState } from "react";
import { Button } from "../ui/button";
import { llmModels } from "@/constants";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { IoSettingsOutline } from "react-icons/io5";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

interface Props {
  selectedModel: string;
  setSelectedModel: (value: string) => void;
  isHydeChecked: boolean;
  setIsHydeChecked: (value: boolean) => void;
  isRerankingChecked: boolean;
  setIsRerankingChecked: (value: boolean) => void;
  temperature: number;
  setTemperature: (value: number) => void;
}

const ModelOptions = ({
  selectedModel,
  setSelectedModel,
  isHydeChecked,
  setIsHydeChecked,
  isRerankingChecked,
  setIsRerankingChecked,
  temperature,
  setTemperature,
}: Props) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");

  const handleModelItem = (value: string) => {
    setSelectedModel(value);
    console.log("Selected Model: ", value);
  };

  const handleHydeChange = (checked: boolean) => {
    setIsHydeChecked(checked);
  };

  const handleRerankingChecked = (checked: boolean) => {
    setIsRerankingChecked(checked);
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <IoSettingsOutline size={18} className="mr-2" />
          Model Options
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex justify-center">
            Model Options
          </DialogTitle>
          <DialogDescription className="flex justify-center items-center">
            Make changes for model options. Click save for changes.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Model Name</Label>
            <Select value={selectedModel} onValueChange={handleModelItem}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Mistral 7B" />
              </SelectTrigger>
              <SelectContent>
                {llmModels.map((item) => (
                  <SelectItem
                    value={item.name}
                    key={item.name}
                    // onClick={() => handleModelItem(item.name)}
                  >
                    {item.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Hyde</Label>
            <div className="flex items-center space-x-2">
              <Switch
                id="airplane-mode"
                checked={isHydeChecked}
                onCheckedChange={handleHydeChange}
              />
              <p>{isHydeChecked ? "ON" : "OFF"}</p>
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Reranking</Label>
            <div className="flex items-center space-x-2">
              <Switch
                id="airplane-mode"
                checked={isRerankingChecked}
                onCheckedChange={handleRerankingChecked}
              />
              <p>{isRerankingChecked ? "ON" : "OFF"}</p>
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Temperature</Label>
            <Input
              type="number"
              value={temperature}
              onChange={(e) => setTemperature(Number(e.target.value))}
              className="col-span-3"
              min="0"
              max="1"
              step="0.01"
            />
          </div>
        </div>
        <DialogFooter></DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModelOptions;
