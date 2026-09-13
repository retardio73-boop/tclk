import { describe, expect, it } from "vitest";
import { buildTclkTranscriptEvidence } from "../examples/export-conformance-evidence.mjs";

describe("portable transcript evidence", () => {
  it("keeps signed TCLK records, ignores inert room text, and preserves transport fields", () => {
    const payer = "did:key:z6Mkpayer";
    const payee = "did:key:z6Mkpayee";
    const evidence = buildTclkTranscriptEvidence({
      binding: { payer, payee, contract: "contract-1" },
      room: "deal-room",
      generation: 4,
      revision: "abc123",
      messages: [
        { seq: 10, ts: "2026-09-13T00:00:00Z", from: payer, text: "plain room text", nonce: "100", sig: "ignored" },
        { seq: 11, ts: "2026-09-13T00:00:01Z", from: payer, text: "tclk1 {\"type\":\"offer\"}", nonce: "101", sig: "signed-offer" },
        { seq: 12, ts: "2026-09-13T00:00:02Z", from: payee, text: "tclk1 {\"type\":\"accept\"}", nonce: "102", sig: "signed-accept" },
      ],
    });

    expect(evidence.requireComplete).toBe(false);
    expect(evidence.binding).toEqual({ payer, payee, contract: "contract-1" });
    expect(evidence.records).toHaveLength(2);
    expect(evidence.records[0]).toEqual({
      room: "deal-room", generation: 4, seq: 11, ts: "2026-09-13T00:00:01Z",
      from: payer, text: "tclk1 {\"type\":\"offer\"}", nonce: "101", sig: "signed-offer",
    });
  });
});
