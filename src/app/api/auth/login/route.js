import { NextResponse } from "next/server";
import { loginAction } from "../../../../lib/auth";

export async function POST(request) {
  try {
    console.error("Login attempt:", request);
    const body = await request.json();

    // Convert body to the format loginAction expects

    const result = await loginAction(null, {
      get: (key) => body[key],
    });

    if (!result.success) {
      return NextResponse.json({ error: result.message }, { status: 401 });
    }

    // createSession() is already called inside loginAction
    return NextResponse.json({
      success: true,
      user: result.user,
    });
  } catch (error) {
    console.error("Login API error:", error);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}

// import { NextResponse } from "next/server";

// export async function POST(request) {
//   try {
//     const body = await request.json();
//     const { email, password } = body;

//     console.log("Login attempt:", email);

//     // Simple test authentication
//     if (email === "test@example.com" && password === "password") {
//       return NextResponse.json({
//         success: true,
//         user: { email },
//       });
//     }

//     return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
//   } catch (error) {
//     console.error("Login API error:", error);
//     return NextResponse.json(
//       { error: "Login failed: " + error.message },
//       { status: 500 }
//     );
//   }
// }
