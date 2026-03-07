// ===== Example 1: GET data from backend =====
async function getData() {
  const response = await fetch('/api/hello');
  const data = await response.json();
  console.log(data.message); // "Hello from backend!"
}

// ===== Example 2: POST (send) data to backend =====
async function sendData() {
  const response = await fetch('/api/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'John',
      email: 'john@example.com'
    })
  });
  const result = await response.json();
  console.log(result);
}

// ===== Example 3: Form submit to backend =====
document.getElementById('myForm').addEventListener('submit', async (e) => {
  e.preventDefault(); // stop page from refreshing

  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;

  const response = await fetch('/api/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email })
  });

  const result = await response.json();

  if (result.success) {
    alert('Data saved successfully!');
  }
})