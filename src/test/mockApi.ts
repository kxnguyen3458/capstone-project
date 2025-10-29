// mockLogin.ts

// fake jwt token (string)
// ---> token này chứa JSON encode base64 chứ không phải sign JWT thật,
// nhưng vẫn decode bằng jwtDecode được.
function createMockToken(payload: object): string {
  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const body = btoa(JSON.stringify(payload));
  const signature = "mock-signature";

  return `${header}.${body}.${signature}`;
}

// 👉 Mock API trả token như backend
export async function mockLoginApi(data: { email: string; password: string }) {
  return new Promise<{ data: { access: string } }>((resolve) => {
    setTimeout(() => {
      const mockPayload = {
        user_id: 123,
        email: data.email,
        role: "customer",
      };

      const token = createMockToken(mockPayload);

      resolve({
        data: {
          access: token,
        },
      });
    }, 700); // delay 700ms để giả lập API call
  });
}
