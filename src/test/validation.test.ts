import { describe, expect, it } from "vitest";
import { mobileSchema, nameSchema, registrationSchema, normalizeIndianMobile } from "@/lib/validation";
import { isSlotUnavailable } from "@/lib/booking";

describe("mobile numbers", () => {
  it.each([
    ["9876543210", "9876543210"],
    ["+91 98765 43210", "9876543210"],
    ["+91-9876543210", "9876543210"],
    ["09876543210", "9876543210"],
    ["919876543210", "9876543210"],
  ])("accepts %s", (input, expected) => {
    expect(mobileSchema.parse(input)).toBe(expected);
  });

  it.each(["12345", "5876543210", "98765432101", "abcdefghij", ""])("rejects %s", (input) => {
    expect(mobileSchema.safeParse(input).success).toBe(false);
  });

  it("normalises without validating", () => {
    expect(normalizeIndianMobile("(+91) 98765-43210")).toBe("9876543210");
  });
});

describe("registration numbers", () => {
  it.each([
    ["MH27AB1234", "MH27AB1234"],
    ["mh 27 ab 1234", "MH27AB1234"],
    ["MH-27-A-1234", "MH27A1234"],
    ["DL3CAB1234", "DL3CAB1234"],
    ["22BH1234AA", "22BH1234AA"],
  ])("accepts %s", (input, expected) => {
    expect(registrationSchema.parse(input)).toBe(expected);
  });

  it.each(["abc", "1234", "MH27AB123", "MHAB1234"])("rejects %s", (input) => {
    expect(registrationSchema.safeParse(input).success).toBe(false);
  });
});

describe("names", () => {
  it("accepts Indian names with spaces, dots and apostrophes", () => {
    expect(nameSchema.parse("  R. K. D'Souza ")).toBe("R. K. D'Souza");
    expect(nameSchema.safeParse("राहुल शर्मा").success).toBe(true);
  });
  it("rejects too-short or numeric names", () => {
    expect(nameSchema.safeParse("A").success).toBe(false);
    expect(nameSchema.safeParse("Rahul123").success).toBe(false);
  });
});

describe("time slots", () => {
  const now = new Date(2026, 9, 8, 10, 30); // 8 Oct 2026, 10:30
  it("blocks past and imminent slots today", () => {
    expect(isSlotUnavailable(now, 9, now)).toBe(true);
    expect(isSlotUnavailable(now, 11, now)).toBe(true);
    expect(isSlotUnavailable(now, 13, now)).toBe(false);
  });
  it("allows any slot on a future date", () => {
    expect(isSlotUnavailable(new Date(2026, 9, 9), 9, now)).toBe(false);
  });
});
