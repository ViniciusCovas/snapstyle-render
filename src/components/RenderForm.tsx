import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Download, Mail } from "lucide-react";
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
  const [renderResult, setRenderResult] = useState<string | null>(null);
  const [emailSent, setEmailSent] = useState(false);
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
    setRenderResult(null);
    setEmailSent(false);
    
    try {
      const { data, error } = await supabase.functions.invoke('render-room', {
        body: {
          imageUrl,
          style: selectedStyle,
          email
        }
      });

      if (error) throw error;

      // Show the result directly
      if (data?.renderUrl) {
        setRenderResult(data.renderUrl);
        setEmailSent(!!data.emailSent);
        
        toast({
          title: "Redesign Complete!",
          description: data.emailSent 
            ? "Your redesign is ready and has been sent to your email."
            : "Your redesign is ready! Email delivery may have failed, but you can download it below."
        });
      }
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

  const handleDownload = () => {
    if (renderResult) {
      const link = document.createElement('a');
      link.href = renderResult;
      link.download = `${selectedStyle}-redesign.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleClose = () => {
    setRenderResult(null);
    setEmailSent(false);
    setEmail("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {renderResult ? "Your Redesign is Ready!" : `Get Your ${selectedStyle} Redesign`}
          </DialogTitle>
          <DialogDescription>
            {renderResult 
              ? "Your AI-generated room redesign is complete"
              : "Enter your email to receive your AI-generated room redesign"
            }
          </DialogDescription>
        </DialogHeader>
        
        {renderResult ? (
          <div className="space-y-4">
            <div className="relative">
              <img
                src={renderResult}
                alt="Your redesigned room"
                className="w-full rounded-lg"
              />
            </div>
            
            <div className="flex flex-col gap-2">
              <Button onClick={handleDownload} className="w-full">
                <Download className="mr-2 h-4 w-4" />
                Download Redesign
              </Button>
              
              <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                <Mail className={`h-4 w-4 ${emailSent ? 'text-green-500' : 'text-orange-500'}`} />
                <p className="text-sm">
                  {emailSent 
                    ? "Also sent to your email!" 
                    : "Email delivery failed, but you can download above"
                  }
                </p>
              </div>
              
              <Button variant="outline" onClick={handleClose} className="w-full">
                Close
              </Button>
            </div>
          </div>
        ) : (
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
        )}
      </DialogContent>
    </Dialog>
  );
};

export default RenderForm;