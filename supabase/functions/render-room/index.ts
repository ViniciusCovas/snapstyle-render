import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RenderRequest {
  imageUrl: string;
  style: string;
  email?: string;
  phone?: string;
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

// Send email notification
async function sendEmailNotification(email: string, renderUrl: string): Promise<void> {
  const sendgridApiKey = Deno.env.get('SENDGRID_API_KEY');
  if (!sendgridApiKey || !email) return;

  try {
    await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${sendgridApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        personalizations: [{
          to: [{ email }],
          subject: 'Your Interior Design Render is Ready!'
        }],
        from: { email: 'noreply@interiorai.com', name: 'Interior AI' },
        content: [{
          type: 'text/html',
          value: `
            <h2>Your render is complete!</h2>
            <p>Your interior design render has been generated successfully.</p>
            <p><a href="${renderUrl}">View your render</a></p>
          `
        }]
      })
    });
  } catch (error) {
    console.error('Failed to send email:', error);
  }
}

// Send WhatsApp notification
async function sendWhatsAppNotification(phone: string, renderUrl: string): Promise<void> {
  const accountSid = Deno.env.get('TWILIO_ACCOUNT_SID');
  const authToken = Deno.env.get('TWILIO_AUTH_TOKEN');
  const whatsappNumber = Deno.env.get('TWILIO_WHATSAPP_NUMBER');
  
  if (!accountSid || !authToken || !whatsappNumber || !phone) return;

  try {
    const credentials = btoa(`${accountSid}:${authToken}`);
    
    await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        From: `whatsapp:${whatsappNumber}`,
        To: `whatsapp:${phone}`,
        Body: `Your interior design render is ready! View it here: ${renderUrl}`
      })
    });
  } catch (error) {
    console.error('Failed to send WhatsApp message:', error);
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
    const { imageUrl, style, email, phone }: RenderRequest = await req.json();
    
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

    // Send notifications in background
    EdgeRuntime.waitUntil(Promise.all([
      sendEmailNotification(email || '', renderUrl),
      sendWhatsAppNotification(phone || '', renderUrl)
    ]));

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