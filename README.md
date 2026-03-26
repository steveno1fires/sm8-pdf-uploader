# SM8 PDF Uploader Service

Simple Express backend that receives PDFs and uploads them to ServiceM8 jobs.

## Setup

1. Deploy to Railway (or any Node.js host)
2. Set environment variable: `SM8_TOKEN`
3. POST PDFs to `/upload-to-sm8`

## API

### POST /upload-to-sm8

**Body:** multipart/form-data
- `pdfFile` (file) — PDF file
- `jobNumber` (string) — SM8 job number (e.g. "1059" or "#1059")
- `filename` (string, optional) — PDF filename

**Response:**
```json
{ "success": true, "message": "PDF uploaded to job 1059" }
```

**Error:**
```json
{ "error": "Failed to upload to SM8", "details": "..." }
```

## Example

```bash
curl -X POST \
  -F "pdfFile=@quote.pdf" \
  -F "jobNumber=1059" \
  -F "filename=Quote.pdf" \
  https://your-railway-url.railway.app/upload-to-sm8
```
