const express = require('express');
const multer = require('multer');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

app.use(cors());
app.use(express.json());

const SM8_TOKEN = process.env.SM8_TOKEN || 'smk-a5f784-bcf831f418766718-c61b510d0ddb07db';

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'SM8 PDF Uploader' });
});

// Upload PDF to SM8
app.post('/upload-to-sm8', upload.single('pdfFile'), async (req, res) => {
  try {
    const { jobNumber, filename } = req.body;
    const pdfFile = req.file;

    if (!jobNumber || !pdfFile) {
      return res.status(400).json({ error: 'Missing jobNumber or pdfFile' });
    }

    console.log(`Uploading PDF to SM8 job ${jobNumber}...`);

    // Clean job number (remove # if present)
    const cleanJobId = jobNumber.replace(/^#/, '');

    // Upload to SM8 API
    const sm8Response = await axios.post(
      `https://api.servicem8.com/api_1.0/job/${cleanJobId}/file.json`,
      {
        name: filename || `Quote-${new Date().toISOString().split('T')[0]}.pdf`,
        data: pdfFile.buffer.toString('base64'),
      },
      {
        headers: {
          'Authorization': `Bearer ${SM8_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log(`Successfully uploaded PDF to SM8 job ${cleanJobId}`);
    res.json({ success: true, message: `PDF uploaded to job ${cleanJobId}` });
  } catch (error) {
    console.error('SM8 upload error:', error.message);
    res.status(500).json({ 
      error: 'Failed to upload to SM8', 
      details: error.message 
    });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`SM8 PDF Uploader running on port ${PORT}`);
});
