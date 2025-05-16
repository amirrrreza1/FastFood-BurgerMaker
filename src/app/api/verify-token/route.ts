// // src/app/api/check-auth/route.ts
// import { cookies } from "next/headers";
// import { verifyToken } from "@/Lib/jwt";

// export async function GET() {
//   const Cookies = await cookies();
//   const token = Cookies.get("token")?.value;

//   if (!token) {
//     return new Response(JSON.stringify({ authenticated: false }), {
//       status: 401,
//     });
//   }

//   const payload = await verifyToken(token);

//   if (!payload) {
//     return new Response(JSON.stringify({ authenticated: false }), {
//       status: 401,
//     });
//   }

//   return new Response(JSON.stringify({ authenticated: true }), { status: 200 });
// }
