
'use client';

import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { ReactNode } from "react";

interface EffectToggleProps {
    icon: ReactNode;
    label: string;
    value: number;
    onValueChange: (value: number) => void;
}

export default function EffectToggle({ icon, label, value, onValueChange }: EffectToggleProps) {
    const isEnabled = value > 0;

    const handleCheckedChange = (checked: boolean) => {
        // If turning on, set to a default value (e.g., 0.5). If turning off, set to 0.
        onValueChange(checked ? 0.5 : 0);
    };

    return (
        <div className="space-y-2">
            <div className="flex items-center gap-2">
                {icon}
                <Label className="flex-1 text-white">{label}</Label>
                <Switch checked={isEnabled} onCheckedChange={handleCheckedChange} />
            </div>
            {isEnabled && (
                <div className="flex items-center gap-2">
                    <Slider
                        value={[value]}
                        onValueChange={(val) => onValueChange(val[0])}
                        min={0}
                        max={1}
                        step={0.01}
                    />
                    <span className="text-xs text-muted-foreground w-8 text-right">{Math.round(value * 100)}</span>
                </div>
            )}
        </div>
    );
}
