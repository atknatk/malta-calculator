import { createVerify, generateKeyPairSync } from "crypto";
import { describe, expect, it } from "vitest";
import { buildServiceAccountJwt, parseServiceAccount } from "@/lib/notify/fcm";
import { escapeHtml } from "@/lib/notify/email";
import { buildPayslipNotification } from "@/lib/notify/employee-notify";

const { privateKey, publicKey } = generateKeyPairSync("rsa", {
  modulusLength: 2048,
});
const account = {
  project_id: "malta-payslips",
  client_email: "push@malta-payslips.iam.gserviceaccount.com",
  private_key: privateKey.export({ type: "pkcs8", format: "pem" }).toString(),
};

describe("parseServiceAccount", () => {
  it("accepts raw and base64 JSON", () => {
    const raw = JSON.stringify(account);
    expect(parseServiceAccount(raw)?.project_id).toBe("malta-payslips");
    expect(
      parseServiceAccount(Buffer.from(raw).toString("base64"))?.client_email,
    ).toBe(account.client_email);
  });

  it("rejects missing or incomplete config", () => {
    expect(parseServiceAccount(undefined)).toBeNull();
    expect(parseServiceAccount("not json")).toBeNull();
    expect(parseServiceAccount(JSON.stringify({ project_id: "x" }))).toBeNull();
  });
});

describe("buildServiceAccountJwt", () => {
  it("produces an RS256 JWT verifiable with the public key", () => {
    const jwt = buildServiceAccountJwt(account, 1_800_000_000);
    const [header, claims, signature] = jwt.split(".");

    expect(JSON.parse(Buffer.from(header, "base64url").toString())).toEqual({
      alg: "RS256",
      typ: "JWT",
    });
    expect(
      JSON.parse(Buffer.from(claims, "base64url").toString()),
    ).toMatchObject({
      iss: account.client_email,
      aud: "https://oauth2.googleapis.com/token",
      exp: 1_800_003_600,
    });

    const verifier = createVerify("RSA-SHA256");
    verifier.update(`${header}.${claims}`);
    expect(
      verifier.verify(publicKey, Buffer.from(signature, "base64url")),
    ).toBe(true);
  });
});

describe("buildPayslipNotification", () => {
  it("names the period and employer without amounts", () => {
    expect(
      buildPayslipNotification("payslip_issued", "Acme Ltd", 10, 2026),
    ).toEqual({
      title: "New payslip",
      body: "Your October 2026 payslip from Acme Ltd is ready.",
    });
    expect(
      buildPayslipNotification("payslip_voided", "Acme Ltd", 2, 2026).title,
    ).toBe("Payslip withdrawn");
  });
});

describe("escapeHtml", () => {
  it("escapes markup in names", () => {
    expect(escapeHtml(`<b>"O'Neil" & co</b>`)).toBe(
      "&lt;b&gt;&quot;O&#39;Neil&quot; &amp; co&lt;/b&gt;",
    );
  });
});
