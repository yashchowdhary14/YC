
'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

const mockLocations = [
    "New York, USA",
    "Paris, France",
    "Tokyo, Japan",
    "London, United Kingdom",
    "Sydney, Australia",
];

interface AddLocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  location?: string;
  setLocation: (location?: string) => void;
}

export default function AddLocationModal({ isOpen, onClose, setLocation }: AddLocationModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  
  const handleSelectLocation = (loc: string) => {
    setLocation(loc);
    onClose();
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add location</DialogTitle>
        </DialogHeader>
        <Input 
          placeholder="Search for a location"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="space-y-2">
            {mockLocations
                .filter(l => l.toLowerCase().includes(searchTerm.toLowerCase()))
                .map(loc => (
                    <button key={loc} onClick={() => handleSelectLocation(loc)} className="w-full flex items-center gap-3 p-2 rounded-md hover:bg-accent text-left">
                        <div className="p-2 bg-secondary rounded-full">
                            <MapPin className="h-5 w-5" />
                        </div>
                        <span>{loc}</span>
                    </button>
            ))}
             <Button variant="ghost" className="w-full justify-start text-destructive" onClick={() => {setLocation(undefined); onClose();}}>Remove location</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
