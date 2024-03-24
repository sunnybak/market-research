"use client"

import { Button } from "@/components/ui/button"
import { Textarea } from "./ui/textarea"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"


export function HypothesisTester({apiKey}: {apiKey: string | undefined}) {
  const [response, setResponse] = useState("");

  const [hypothesis, setHypothesis] = useState("Suggest 3 features that would address user complaints.");
  const [fileName, setFileName] = useState(null);


  return (
    <div className="w-full mx-auto my-8 h-full">
      <div className="grid grid-cols-8 gap-10">
        <div className="col-span-3">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-2">Research Question</h2>
            <div className="p-4 bg-white shadow rounded-md border border-gray-400">
              <Textarea className="h-30" value={hypothesis} onChange={(event) => {
                setHypothesis(event.target.value);
              }}>
              </Textarea>
              <Button className="mt-4" variant="default" onClick={async () => {
                setResponse(await fetch("/api/groq", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json"
                  },
                  body: JSON.stringify({ prompt: hypothesis, filename: fileName })
                })
                  .then(res => res.json())
                  .then(res => {
                    // check for errors
                    if (res.error) {
                      return res.error;
                    }
                    return res.response; // add this return statement
                  })
                );
              }}>
                Save & Run
              </Button>
            </div>
          </div>
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-2">Dataset</h2>
            <div className="p-4 bg-white shadow rounded-md border border-gray-400">
              <div className="gap-1.5">
                  <Label>Make sure your data is under the &quot;data&quot; column in your CSV file.</Label>
                  <Input id="dataset" type="file" className="bg-gray-200" onChange={(event) => {
                    if (!event.target.files) return;
                    const file = event.target.files[0];
                    const formData = new FormData();
                    formData.append("file", file);
                    
                    fetch("/api/upload", {
                      method: "POST",
                      body: formData,
                    })
                      .then(response => response.json())
                      .then(data => {setFileName(data.filename); console.log(data);})
                      .catch(error => console.error(error));
                  }} />
                </div>
            </div>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">Suggestions</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-4 bg-white shadow rounded-md border border-gray-400">
                <p className="text-sm">Suggestion 1</p>
                <Button variant="outline">Apply</Button>
              </div>
              <div className="flex items-center justify-between p-4 bg-white shadow rounded-md border border-gray-400">
                <p className="text-sm">Suggestion 2</p>
                <Button variant="outline">Apply</Button>
              </div>
              <div className="flex items-center justify-between p-4 bg-white shadow rounded-md border border-gray-400">
                <p className="text-sm">Suggestion 3</p>
                <Button variant="outline">Apply</Button>
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-5 h-full">
          <h2 className="text-2xl font-semibold mb-2">Report</h2>
          <div className="space-y-4 h-full">
            <div className="p-4 bg-white shadow rounded-md border border-gray-400 h-full">
              {response}
            </div>
            {/* <div className="p-4 bg-white shadow rounded-md border border-gray-400">
              <p className="text-sm mb-2">I would rate it a solid 7 out of 10.</p>
              <p className="text-sm font-medium">Prediction: 7</p>
            </div> */}
            <div className="flex justify-end">
              <Button variant="default">Reset</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
