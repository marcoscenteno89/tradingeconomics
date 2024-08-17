import { NextResponse } from "next/server";
import { get } from "@marccent/util";

const key = process.env.TE_API_KEY;
const url = `https://api.tradingeconomics.com/`;

export async function GET(req, ctx) {
  const ticker = ctx.params.ticker;
  const historical = await get(`${url}markets/historical/${ticker}?c=${key}`);
  return NextResponse.json(historical);
}
