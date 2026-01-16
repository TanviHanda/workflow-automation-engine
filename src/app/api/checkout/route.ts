import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.redirect(
    "https://sandbox-api.polar.sh/v1/checkout-links/polar_cl_POnUW8obvZNJDUMyTZIA6CnIg3mb0eo7ZSSAl2MuCe5/redirect"
  );
}
