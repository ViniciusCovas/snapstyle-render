-- Create storage bucket for user photo uploads
INSERT INTO storage.buckets (id, name, public) VALUES ('room-photos', 'room-photos', true);

-- Create policies for room photos bucket
CREATE POLICY "Anyone can upload room photos" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'room-photos');

CREATE POLICY "Anyone can view room photos" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'room-photos');

CREATE POLICY "Anyone can delete room photos" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'room-photos');