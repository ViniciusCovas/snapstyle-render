import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RenderRequest {
  imageUrl: string;
  style: string;
  email: string;
}

// Style to prompt mapping
const stylePrompts = {
  modern: "modern minimalist interior design, clean lines, neutral colors, contemporary furniture",
  rustic: "rustic farmhouse interior, wooden elements, cozy atmosphere, vintage furniture",
  industrial: "industrial loft interior, exposed brick, metal fixtures, urban design",
  scandinavian: "scandinavian interior design, light wood, white walls, hygge aesthetic",
  luxury: "luxury interior design, elegant furniture, premium materials, sophisticated decor"
};

// Helper function to get MLSD map (placeholder - would need actual ML processing)
async function getMLSDMap(imageUrl: string): Promise<string> {
  try {
    // Fetch the image
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }
    
    const imageBuffer = await response.arrayBuffer();
    const base64Image = btoa(String.fromCharCode(...new Uint8Array(imageBuffer)));
    
    // For now, return the original image as base64 (in production, this would be processed through an MLSD model)
    return base64Image;
  } catch (error) {
    console.error('Error processing MLSD map:', error);
    throw error;
  }
}

// Generate UUID
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// Send email notification using SendGrid
async function sendEmailNotification(email: string, renderUrl: string): Promise<void> {
  const apiKey = Deno.env.get('SENDGRID_API_KEY');
  
  if (!apiKey) {
    console.error('Missing SendGrid API key');
    return;
  }

  try {
    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        personalizations: [{
          to: [{ email }],
          subject: '🎨 Your Interior Design Render is Ready! - InteriorSnap',
        }],
        from: { email: 'noreply@interiorsnap.com', name: 'InteriorSnap' },
        content: [{
          type: 'text/html',
          value: `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="utf-8">
              <title>Your Render is Ready</title>
            </head>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #2563eb; margin-bottom: 10px;">🎨 Your Render is Complete!</h1>
                <p style="font-size: 18px; color: #666;">Transform your space with AI-powered interior design</p>
              </div>
              
              <div style="background: #f8f9fa; padding: 25px; border-radius: 10px; margin-bottom: 25px;">
                <p style="font-size: 16px; margin-bottom: 20px;">Great news! We've successfully processed your interior design render using advanced AI technology.</p>
                
                <div style="text-align: center; margin: 25px 0;">
                  <a href="${renderUrl}" 
                     style="display: inline-block; background: linear-gradient(135deg, #2563eb, #1d4ed8); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; box-shadow: 0 4px 6px rgba(37, 99, 235, 0.3);">
                    🔍 View Your Render
                  </a>
                </div>
                
                <p style="font-size: 14px; color: #666; text-align: center; margin-top: 20px;">
                  Click the button above to see your transformed space!
                </p>
              </div>
              
              <div style="border-top: 2px solid #e5e7eb; padding-top: 20px; text-align: center; color: #666; font-size: 14px;">
                <p>Thank you for choosing <strong>InteriorSnap</strong></p>
                <p style="margin: 5px 0;">Transform any space with the power of AI</p>
              </div>
            </body>
            </html>
          `,
        }],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`SendGrid API error: ${response.status} - ${errorText}`);
    }

    console.log('Email notification sent successfully to:', email);
  } catch (error) {
    console.error('Failed to send email notification:', error);
    throw error; // Re-throw to be handled by the calling function
  }
}


serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { 
      status: 405, 
      headers: corsHeaders 
    });
  }

  try {
    // Parse request body
    const { imageUrl, style, email }: RenderRequest = await req.json();
    
    // Validate email
    if (!email || !email.includes('@')) {
      return new Response(
        JSON.stringify({ error: 'Valid email address is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    if (!imageUrl || !style) {
      return new Response(JSON.stringify({ error: 'Missing imageUrl or style' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Get MLSD map
    console.log('Generating MLSD map...');
    const mlsdMap = await getMLSDMap(imageUrl);

    // Build prompt from style
    const prompt = stylePrompts[style as keyof typeof stylePrompts] || stylePrompts.modern;

    // Call Stability AI API with timeout and retry
    const stabilityApiKey = Deno.env.get('STABILITY_AI_API_KEY');
    if (!stabilityApiKey) {
      return new Response(JSON.stringify({ error: 'Stability AI API key not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    console.log('Calling Stability AI API...');
    
    const callStabilityAPI = async (): Promise<Response> => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      try {
        const response = await fetch('https://api.stability.ai/v2beta/stable-image/generate/sdxl', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${stabilityApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            prompt,
            control_type: 'mlsd',
            control_image: mlsdMap,
            control_strength: 0.65,
            steps: 25,
            cfg_scale: 5,
            width: 1024,
            height: 768
          }),
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        return response;
      } catch (error) {
        clearTimeout(timeoutId);
        throw error;
      }
    };

    let stabilityResponse: Response;
    try {
      stabilityResponse = await callStabilityAPI();
    } catch (error) {
      // Retry once on failure
      console.log('First attempt failed, retrying...');
      try {
        stabilityResponse = await callStabilityAPI();
      } catch (retryError) {
        if (retryError.name === 'AbortError') {
          return new Response(JSON.stringify({ error: 'Rendering timed out' }), {
            status: 504,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }
        throw retryError;
      }
    }

    // Handle Stability AI response
    if (!stabilityResponse.ok) {
      const errorData = await stabilityResponse.text();
      return new Response(JSON.stringify({ error: errorData }), {
        status: 503,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const result = await stabilityResponse.json();
    const imageBase64 = result.artifacts[0].base64;
    
    // Generate UUID for file naming
    const uuid = generateUUID();
    
    // Convert base64 to buffer
    const imageBuffer = Uint8Array.from(atob(imageBase64), c => c.charCodeAt(0));
    
    // In a real implementation, you would save to a storage service
    // For now, we'll simulate the file URLs
    const renderUrl = `https://your-domain.com/renders/${uuid}.jpg`;
    
    // Save metadata
    const metadata = {
      uuid,
      style,
      prompt,
      seed: result.artifacts[0].seed || null,
      createdAt: new Date().toISOString(),
      originalImageUrl: imageUrl
    };

    console.log('Render completed successfully:', { uuid, style, renderUrl });

    // Send email notification asynchronously
    EdgeRuntime.waitUntil(sendEmailNotification(email, renderUrl));

    return new Response(JSON.stringify({ 
      renderUrl,
      metadata 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error in render-room function:', error);
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});