import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface RenderFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  imageUrl: string;
  selectedStyle: string;
}

const RenderForm = ({ open, onOpenChange, imageUrl, selectedStyle }: RenderFormProps) => {
  const [email, setEmail] = useState("");
  const [rendering, setRendering] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address",
        variant: "destructive"
      });
      return;
    }

    setRendering(true);
    try {
      const { data, error } = await supabase.functions.invoke('render-room', {
        body: {
          imageUrl,
          style: selectedStyle,
          email
        }
      });

      if (error) throw error;

      toast({
        title: "Render started!",
        description: `Your ${selectedStyle} redesign is being created. You'll receive an email with the result shortly.`
      });
      
      onOpenChange(false);
      setEmail("");
    } catch (error) {
      console.error('Render error:', error);
      toast({
        title: "Render failed",
        description: "Please try again",
        variant: "destructive"
      });
    } finally {
      setRendering(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Get Your {selectedStyle} Redesign</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
            <p className="text-sm text-muted-foreground">
              We'll send your redesigned room to this email
            </p>
          </div>

          <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
            <img
              src={imageUrl}
              alt="Your room"
              className="w-16 h-16 object-cover rounded"
            />
            <div>
              <p className="font-medium">Style: {selectedStyle}</p>
              <p className="text-sm text-muted-foreground">Ready to redesign</p>
            </div>
          </div>

          <Button
            type="submit"
            disabled={rendering}
            className="w-full"
          >
            {rendering ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Your Redesign...
              </>
            ) : (
              "Start Redesign"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RenderForm;