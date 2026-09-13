#!/usr/bin/env node

/** Build portable signed-transcript evidence from a Technocore room export. */
export function buildTclkTranscriptEvidence({
  implementation = "flop-labs/tclk",
  revision = "unversioned-local-export",
  binding,
  room,
  generation,
  messages,
}) {
  if (!binding || typeof binding !== "object") throw new Error("binding is required");
  for (const key of ["payer", "payee", "contract"]) {
    if (typeof binding[key] !== "string" || !binding[key]) throw new Error(`binding.${key} is required`);
  }
  if (typeof room !== "string" || !/^[a-z0-9][a-z0-9_-]{0,47}$/.test(room)) throw new Error("room is invalid");
  if (!Number.isInteger(generation) || generation < 0) throw new Error("generation must be a non-negative integer");
  if (!Array.isArray(messages)) throw new Error("messages must be an array");

  const records = messages
    .filter((message) => message && typeof message === "object")
    .filter((message) => typeof message.text === "string" && message.text.startsWith("tclk1 "))
    .filter((message) => ["seq", "ts", "from", "text", "nonce", "sig"].every((field) => Object.hasOwn(message, field)))
    .map((message) => ({
      room,
      generation,
      seq: message.seq,
      ts: message.ts,
      from: message.from,
      text: message.text,
      nonce: message.nonce,
      sig: message.sig,
    }));

  return {
    implementation,
    revision,
    binding: { payer: binding.payer, payee: binding.payee, contract: binding.contract },
    requireComplete: false,
    records,
  };
}
