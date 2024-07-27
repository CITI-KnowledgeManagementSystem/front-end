import React  from "react";
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
  SelectGroup,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

interface Props {
  selectedModel: string;
  setSelectedModel: (value: string) => void;
  isHydeChecked: boolean;
  setIsHydeChecked: (value: boolean) => void;
  isRerankingChecked: boolean;
  setIsRerankingChecked: (value: boolean) => void;
  temperatures: number;
  setTemperature: (value: number) => void;
}

const ModelOptions = ({
  selectedModel,
  setSelectedModel,
  isHydeChecked,
  setIsHydeChecked,
  isRerankingChecked,
  setIsRerankingChecked,
  temperatures,
  setTemperature,
}: Props) => {
  const handleHydeChange = (checked: boolean) => {
    setIsHydeChecked(checked);
  };

  const handleRerankingChecked = (checked: boolean) => {
    setIsRerankingChecked(checked);
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="h-fit p-2 border bg-white text-blue-700 hover:bg-white shadow-none hover:shadow-blue-200 hover:shadow">
          Options
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
            <Select onValueChange={(val) => setSelectedModel(val)}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder={selectedModel} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {llmModels.map((item) => (
                    <SelectItem value={item.name} key={item.name}>
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
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
              value={temperatures}
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
