const BASE_URL = 'http://20.244.56.144/evaluation-service';

export async function registerUser(userData) {
  // userData should include: email, name, mobileNo, githubUsername, rollNo, accessCode
  const response = await fetch(`${BASE_URL}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Registration failed: ${errorText}`);
  }
  return response.json(); // contains clientID and clientSecret
}

export async function authenticateUser(authData) {
  // authData should include: email, name, rollNo, accessCode, clientID, clientSecret
  const response = await fetch(`${BASE_URL}/auth`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(authData),
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Authentication failed: ${errorText}`);
  }
  return response.json(); // contains access_token and token type
}
