export default async function handler(req, res) {
  // 1. Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { text } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    // 2. Talk to Google Gemini
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `Analyze these Terms and Conditions for consumer risks. 
            Rules: Use plain text, start every line with a single dash (-) and a space. 
            Text: ${text}`
          }]
        }]
      })
    });

    const data = await response.json();
    const result = data.candidates[0].content.parts[0].text;

    // 3. Send the answer back to your extension
    res.status(200).send(result);

  } catch (error) {
    res.status(500).json({ error: 'Failed to analyze text' });
  }
}