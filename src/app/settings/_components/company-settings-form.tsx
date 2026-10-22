"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Building2, ImagePlus, Loader2, Lock, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { updateCompany } from "@/app/actions/payslip-actions";
import {
  CardHeader,
  MdCard,
  mdButton,
  mdInput,
  mdLabel,
} from "@/components/admin/admin-ui";

interface Company {
  id: string;
  name: string;
  logo_url: string | null;
  address: string | null;
  tax_number: string | null;
  plan: "free" | "basic" | "pro";
}

interface Props {
  company: Company;
}

export default function CompanySettingsForm({ company }: Props) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(false);
  const [logoLoading, setLogoLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [logoUrl, setLogoUrl] = useState<string | null>(company.logo_url);

  const [formData, setFormData] = useState({
    name: company.name,
    address: company.address || "",
    taxNumber: company.tax_number || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    const form = new FormData();
    form.append("name", formData.name);
    form.append("address", formData.address);
    form.append("taxNumber", formData.taxNumber);

    const result = await updateCompany(form);

    if (result.success) {
      setSuccess("Company information updated successfully");
      router.refresh();
    } else {
      setError(result.error || "An error occurred");
    }
    setLoading(false);
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file");
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setError("Image size must be less than 2MB");
      return;
    }

    setLogoLoading(true);
    setError(null);
    setSuccess(null);

    const formData = new FormData();
    formData.append("logo", file);

    try {
      const response = await fetch("/api/company/logo", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setLogoUrl(data.logoUrl);
        setSuccess("Logo uploaded successfully");
        router.refresh();
      } else {
        setError(data.error || "Failed to upload logo");
      }
    } catch {
      setError("Failed to upload logo");
    }

    setLogoLoading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleLogoDelete = async () => {
    if (!logoUrl) return;

    setLogoLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch("/api/company/logo", {
        method: "DELETE",
      });

      const data = await response.json();

      if (data.success) {
        setLogoUrl(null);
        setSuccess("Logo removed successfully");
        router.refresh();
      } else {
        setError(data.error || "Failed to remove logo");
      }
    } catch {
      setError("Failed to remove logo");
    }

    setLogoLoading(false);
  };

  const isPaidPlan = company.plan !== "free";

  const feedback = (
    <>
      {error && (
        <div
          role="alert"
          className="rounded-xl bg-md-error-container px-4 py-3 text-sm text-md-on-error-container"
        >
          {error}
        </div>
      )}
      {success && (
        <div
          role="status"
          className="rounded-xl bg-md-success-container px-4 py-3 text-sm text-md-on-success-container"
        >
          {success}
        </div>
      )}
    </>
  );

  return (
    <div className="space-y-6">
      {/* Company Info Form */}
      <MdCard>
        <CardHeader
          title="Company information"
          subtitle="Shown in the header of every payslip"
          icon={<Building2 />}
        />
        <form onSubmit={handleSubmit} className="space-y-5 px-6 pb-6 pt-4">
          <div>
            <label htmlFor="company-name" className={mdLabel}>
              Company name <span className="text-md-error">*</span>
            </label>
            <input
              id="company-name"
              type="text"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="ABC Limited"
              className={mdInput}
            />
          </div>

          <div>
            <label htmlFor="company-address" className={mdLabel}>
              Address
            </label>
            <textarea
              id="company-address"
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              placeholder="Company address"
              rows={3}
              className={cn(mdInput, "h-auto py-3")}
            />
          </div>

          <div>
            <label htmlFor="company-tax" className={mdLabel}>
              Tax number
            </label>
            <input
              id="company-tax"
              type="text"
              value={formData.taxNumber}
              onChange={(e) =>
                setFormData({ ...formData, taxNumber: e.target.value })
              }
              placeholder="MT12345678"
              className={mdInput}
            />
          </div>

          {feedback}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading || !formData.name.trim()}
              className={mdButton()}
            >
              {loading && <Loader2 className="animate-spin" />}
              {loading ? "Saving…" : "Save changes"}
            </button>
          </div>
        </form>
      </MdCard>

      {/* Logo Section */}
      <MdCard>
        <CardHeader
          title="Company logo"
          subtitle="PNG, JPG or SVG, up to 2 MB"
          icon={<ImagePlus />}
        />
        <div className="flex flex-col gap-5 px-6 pb-6 pt-4 sm:flex-row sm:items-center">
          <div className="flex size-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-dashed border-md-outline-variant bg-md-surface-container">
            {logoUrl ? (
              <Image
                src={logoUrl}
                alt="Company logo"
                width={96}
                height={96}
                className="h-full w-full bg-white object-contain p-2"
              />
            ) : (
              <Building2 className="size-8 text-md-on-surface-variant/60" />
            )}
          </div>

          <div className="flex-1">
            {isPaidPlan ? (
              <>
                <p className="mb-3 text-sm text-md-on-surface-variant">
                  Your logo replaces the Malta Calculator branding on payslips.
                </p>
                <div className="flex flex-wrap gap-2">
                  <label
                    className={cn(
                      mdButton({ variant: "tonal" }),
                      "cursor-pointer",
                      logoLoading && "pointer-events-none opacity-60",
                    )}
                  >
                    {logoLoading ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      <ImagePlus />
                    )}
                    {logoLoading
                      ? "Uploading…"
                      : logoUrl
                        ? "Change logo"
                        : "Upload logo"}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      disabled={logoLoading}
                      className="sr-only"
                    />
                  </label>
                  {logoUrl && (
                    <button
                      type="button"
                      onClick={handleLogoDelete}
                      disabled={logoLoading}
                      className={mdButton({ variant: "danger" })}
                    >
                      <Trash2 />
                      Remove
                    </button>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-start gap-3 rounded-2xl bg-md-primary-container/60 p-4 text-md-on-primary-container">
                <Lock className="mt-0.5 size-4 shrink-0" />
                <div>
                  <p className="text-sm">
                    Logo upload is available on paid plans.
                  </p>
                  <Link
                    href="/pricing"
                    className="mt-1 inline-block text-sm font-semibold hover:underline"
                  >
                    Upgrade your plan
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </MdCard>
    </div>
  );
}
