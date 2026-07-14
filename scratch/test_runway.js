
async function test() {
  const body = {
    prompt: "a majestic golden eagle flying high above mountain peaks, highly detailed fantasy, realistic",
    imageBase64: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=",
    ratio: "1024:1024"
  };

  console.log("Submitting test request to local Express server proxy...");
  try {
    const res = await fetch('http://localhost:3001/api/runway/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    console.log("Response status:", res.status);
    const data = await res.json();
    console.log("Response data:", JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("Test failed:", err);
  }
}

test();
