// Extract transcript text from YouTube transcript panel
function getTranscriptText() {
  const transcriptContainer = document.querySelector('ytd-transcript-renderer #body');
  if (!transcriptContainer) return null;

  const lines = transcriptContainer.querySelectorAll('ytd-transcript-segment-renderer');
  let transcriptText = "";

  lines.forEach(line => {
    const textSpan = line.querySelector('#text');
    if (textSpan) transcriptText += textSpan.innerText + " ";
  });

  return transcriptText.trim();
}

async function waitForTranscript(maxRetries = 10, interval = 500) {
  for (let i = 0; i < maxRetries; i++) {
    const text = getTranscriptText();
    if (text && text.length > 0) return text;
    await new Promise(r => setTimeout(r, interval));
  }
  return null;
}

// Split transcript into chunks of maxChunkWords words each
function chunkTranscript(text, maxChunkWords = 200) {
  const words = text.split(/\s+/);
  const chunks = [];
  for (let i = 0; i < words.length; i += maxChunkWords) {
    chunks.push(words.slice(i, i + maxChunkWords).join(' '));
  }
  return chunks;
}

async function fetchTranscript(videoId) {
  const res = await fetch(`http://localhost:8000/transcript?video_id=${videoId}`);
  if (!res.ok) {
    const error = await res.text();
    throw new Error(error);
  }
  const data = await res.json();
  return data.transcript;
}

async function askQuestion() {
  const question = document.getElementById("question").value.trim();
  if (!question) {
    alert("Please enter a question!");
    return;
  }

  // You need to know the video ID here.
  // Extract from current URL or pass it to the extension when loading.
  const urlParams = new URLSearchParams(window.location.search);
  const videoId = urlParams.get("v");
  if (!videoId) {
    alert("Cannot find YouTube video ID.");
    return;
  }

  let transcript;
  try {
    transcript = await fetchTranscript(videoId);
  } catch (e) {
    alert(`Failed to fetch transcript: ${e.message}`);
    return;
  }

  // Now chunk the transcript and send to your backend AI endpoint
  const chunks = chunkTranscript(transcript, 200);
  const recentChunk = chunks[chunks.length - 1] || "";

  const resBox = document.getElementById("response");
  resBox.innerText = "Thinking...";

  try {
    const response = await fetch("http://localhost:8000/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ transcript: recentChunk, question }),
    });

    if (!response.ok) {
      resBox.innerText = `Error: ${response.statusText}`;
      return;
    }

    const data = await response.json();
    resBox.innerText = data.answer || "No answer received.";
  } catch (error) {
    resBox.innerText = "Failed to fetch answer. Check backend is running.";
    console.error(error);
  }
}

document.getElementById("ask-btn").addEventListener("click", askQuestion);

