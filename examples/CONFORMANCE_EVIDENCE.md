# Portable transcript evidence

`export-conformance-evidence.mjs` converts a Technocore room export into a narrow, read-only evidence object for independent downstream verification.

The helper:

- keeps only records whose text begins with the TCLK `tclk1 ` frame prefix;
- preserves the original Technocore `room`, `generation`, `seq`, `ts`, `from`, `text`, `nonce`, and `sig` fields;
- carries an explicit payer/payee/contract binding supplied by the caller;
- sets `requireComplete: false` so a bounded room export is not misrepresented as full history;
- does not sign, publish, mutate frames, or infer settlement.

The output matches the `tclk-transcript` input shape consumed by the independent `retardio73-boop/flop-conformance-lab`. A downstream verifier remains responsible for signature checks, canonical TCLK decoding, party/contract binding, ordering/completeness, and settlement classification.

This is an interoperability export only. It is not certification and does not change TCLK protocol semantics.
