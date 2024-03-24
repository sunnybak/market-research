import Groq from "groq-sdk"
import csv from 'csv-parser'
import fs from 'fs'
import path from "path";

export const POST = async (request: any) => {
  const { prompt, filename } = await request.json();

  const filePath = path.join(process.cwd(), 'public/assets/' + filename);
  console.log('reading file...');
  const dataset: string[] = [];
  await new Promise<void>((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data: any) => {
        const reviewsText = data['data'];
        dataset.push(reviewsText);
      }).on('end', resolve);
  });

  const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
  });
  if (!prompt) {
    console.log('prompt is required');
    return new Response(JSON.stringify({error: "Prompt is required"}), { status: 400 })
  }

  const completion = await groq.chat.completions.create({
    messages: [
      {
        role: "user",
        content: `${prompt} \n \n ${dataset.join('\n')}`
      }
    ],
    model: "mixtral-8x7b-32768",
    stream: false,
  });
  const response = completion.choices[0]?.message?.content || "";
  return new Response(JSON.stringify({"response": response}), { status: 201 })
}