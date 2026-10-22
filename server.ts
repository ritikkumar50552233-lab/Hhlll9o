import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT) || 3000;

async function startServer() {
  const app = express();
  app.use(express.json());

  // Initialize Gemini AI SDK if API key is present
  const apiKey = process.env.GEMINI_API_KEY;
  const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

  // API Routes
  app.post('/api/ai-analysis', async (req, res) => {
    try {
      const { prompt, contextData } = req.body;
      if (!ai) {
        return res.status(503).json({
          error: 'Gemini API is not configured. Please provide GEMINI_API_KEY in environment secrets.',
          analysis: 'Mock AI Analysis: Based on retrieved signals in this region, tectonic and public infrastructure indicators show elevated monitoring status. (Configure GEMINI_API_KEY for live generative intelligence synthesis).'
        });
      }

      const fullPrompt = `You are Worldveil Intelligence AI, an expert geospatial intelligence and OSINT analyst founded by Ayush Yadav. Analyze the following intelligence data and context provide professional, structured assessment:\n\nUser Request: ${prompt}\n\nContext Data:\n${JSON.stringify(contextData, null, 2)}\n\nProvide a rigorous intelligence briefing including: Executive Summary, Key Signal Correlations, Potential Risks, and Source Confidence Assessment.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: fullPrompt,
      });

      res.json({ analysis: response.text });
    } catch (error: any) {
      console.error('Gemini API Error:', error);
      res.status(500).json({ error: error.message || 'Failed to generate AI intelligence analysis.' });
    }
  });

  app.get('/api/health', (req, res) => {
    res.json({
      status: 'operational',
      system: 'Worldveil Intelligence OSINT Node',
      version: '2.4.0',
      owner: 'Ayush Yadav',
      geminiConfigured: !!apiKey,
      timestamp: new Date().toISOString()
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Worldveil Intelligence backend running on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
