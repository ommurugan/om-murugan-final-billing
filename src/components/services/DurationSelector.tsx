
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface DurationSelectorProps {
  estimatedTime: string;
  durationFormat: string;
  onDurationChange: (value: string) => void;
  onFormatChange: (format: string) => void;
}

const DurationSelector = ({ 
  estimatedTime, 
  durationFormat, 
  onDurationChange, 
  onFormatChange 
}: DurationSelectorProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <Label htmlFor="durationFormat" className="text-base font-medium">Duration Format</Label>
        <Select value={durationFormat} onValueChange={onFormatChange}>
          <SelectTrigger className="mt-2 h-11">
            <SelectValue placeholder="Select duration format" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="minutes">Minutes</SelectItem>
            <SelectItem value="days">Days</SelectItem>
            <SelectItem value="months">Months</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="serviceDuration" className="text-base font-medium">
          Duration ({durationFormat === "minutes" ? "minutes" : durationFormat === "days" ? "days" : "months"})
        </Label>
        <Input 
          id="serviceDuration"
          type="number"
          value={estimatedTime}
          onChange={(e) => onDurationChange(e.target.value)}
          placeholder={durationFormat === "minutes" ? "60" : durationFormat === "days" ? "1" : "1"}
          className="mt-2 h-11"
        />
      </div>
    </div>
  );
};

export default DurationSelector;
