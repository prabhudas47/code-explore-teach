/**
 * RLS regression tests — run as anonymous user against the live backend.
 *
 * These tests prevent privilege regressions: they assert that an unauthenticated
 * caller can ONLY do what the public portfolio needs (read portfolio_content)
 * and is blocked from every privileged operation.
 *
 * If any of these starts passing/failing the wrong way, RLS has been weakened.
 */
import { describe, it, expect } from "vitest";
import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL as string;
const anon = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;
const anonClient = createClient(url, anon, { auth: { persistSession: false } });

describe("RLS — anonymous user", () => {
  it("CAN read portfolio_content (public site needs this)", async () => {
    const { error } = await anonClient.from("portfolio_content").select("section").limit(1);
    expect(error).toBeNull();
  });

  it("CANNOT insert into portfolio_content", async () => {
    const { error } = await anonClient
      .from("portfolio_content")
      .insert({ section: "__rls_probe__", data: {} });
    expect(error).not.toBeNull();
  });

  it("CANNOT update portfolio_content", async () => {
    const { error, data } = await anonClient
      .from("portfolio_content")
      .update({ data: { hacked: true } })
      .eq("section", "hero")
      .select();
    // RLS may return empty data with no error — both mean "not allowed to modify"
    expect(error !== null || (data ?? []).length === 0).toBe(true);
  });

  it("CANNOT delete from portfolio_content", async () => {
    const { error, data } = await anonClient
      .from("portfolio_content")
      .delete()
      .eq("section", "hero")
      .select();
    expect(error !== null || (data ?? []).length === 0).toBe(true);
  });

  it("CANNOT read user_roles (no rows visible)", async () => {
    const { data } = await anonClient.from("user_roles").select("id").limit(5);
    expect(data ?? []).toHaveLength(0);
  });

  it("CANNOT grant themselves admin", async () => {
    const { error } = await anonClient
      .from("user_roles")
      .insert({ user_id: "00000000-0000-0000-0000-000000000000", role: "admin" });
    expect(error).not.toBeNull();
  });

  it("CANNOT read security_findings", async () => {
    const { data } = await anonClient.from("security_findings").select("id").limit(1);
    expect(data ?? []).toHaveLength(0);
  });

  it("CANNOT insert security_findings", async () => {
    const { error } = await anonClient
      .from("security_findings")
      .insert({ title: "probe", severity: "low" });
    expect(error).not.toBeNull();
  });

  it("CANNOT read security_scan_runs", async () => {
    const { data } = await anonClient.from("security_scan_runs").select("id").limit(1);
    expect(data ?? []).toHaveLength(0);
  });

  it("CANNOT list portfolio-media bucket (listing disabled)", async () => {
    const { data } = await anonClient.storage.from("portfolio-media").list("uploads", { limit: 1 });
    expect(data ?? []).toHaveLength(0);
  });

  it("has_role returns false for unknown user", async () => {
    const { data, error } = await anonClient.rpc("has_role", {
      _user_id: "00000000-0000-0000-0000-000000000000",
      _role: "admin",
    });
    expect(error).toBeNull();
    expect(data).toBe(false);
  });
});
