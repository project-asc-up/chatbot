"use client";

import { useState } from "react";
import { Dialog } from "@/components/dialog";
import { Field, TextInput, Select, TextArea } from "@/components/admin-form";

type FacultyModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: FormData) => Promise<void>;
  initialData?: {
    id: string;
    name: string;
    code: string;
    codeStatus: string;
    lastVerified: string | null;
    officialPageUrl: string | null;
    supportPageUrl: string | null;
    sourceUrl: string | null;
    aliases: string | null;
    notes: string | null;
  };
};

export function FacultyModal({
  open,
  onOpenChange,
  onSubmit,
  initialData,
}: FacultyModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    code: initialData?.code || "",
    codeStatus: initialData?.codeStatus || "verified",
    lastVerified: initialData?.lastVerified || "",
    officialPageUrl: initialData?.officialPageUrl || "",
    supportPageUrl: initialData?.supportPageUrl || "",
    sourceUrl: initialData?.sourceUrl || "",
    aliases: initialData?.aliases || "",
    notes: initialData?.notes || "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const fd = new FormData();
      if (initialData) fd.append("id", initialData.id);
      Object.entries(formData).forEach(([key, value]) => {
        if (value) fd.append(key, value);
      });
      await onSubmit(fd);
      onOpenChange(false);
      setFormData({
        name: "",
        code: "",
        codeStatus: "verified",
        lastVerified: "",
        officialPageUrl: "",
        supportPageUrl: "",
        sourceUrl: "",
        aliases: "",
        notes: "",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title={initialData ? "Edit Faculty" : "Create Faculty"}
      description={
        initialData
          ? `Update faculty details and manage verification status.`
          : "Add a new faculty record and capture its source and verification details."
      }
      onSubmit={handleSubmit}
      submitLabel={initialData ? "Update Faculty" : "Create Faculty"}
      isLoading={isLoading}
    >
      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Faculty name">
            <TextInput
              name="name"
              placeholder="Faculty of Engineering, Built Environment and Information Technology"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </Field>
          <Field label="Faculty code">
            <TextInput
              name="code"
              placeholder="EBIT"
              value={formData.code}
              onChange={handleChange}
              required
            />
          </Field>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Code status">
            <Select
              name="codeStatus"
              value={formData.codeStatus}
              onChange={handleChange}
              required
            >
              <option value="verified">Verified</option>
              <option value="review">Needs review</option>
              <option value="draft">Draft</option>
            </Select>
          </Field>
          <Field label="Last verified" hint="YYYY-MM-DD">
            <TextInput
              name="lastVerified"
              type="date"
              value={formData.lastVerified}
              onChange={handleChange}
            />
          </Field>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Official page URL">
            <TextInput
              name="officialPageUrl"
              type="url"
              placeholder="https://www.up.ac.za/..."
              value={formData.officialPageUrl}
              onChange={handleChange}
            />
          </Field>
          <Field label="Support page URL">
            <TextInput
              name="supportPageUrl"
              type="url"
              placeholder="https://www.up.ac.za/..."
              value={formData.supportPageUrl}
              onChange={handleChange}
            />
          </Field>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Source URL">
            <TextInput
              name="sourceUrl"
              type="url"
              placeholder="https://www.up.ac.za/..."
              value={formData.sourceUrl}
              onChange={handleChange}
            />
          </Field>
          <Field label="Aliases" hint="Optional pipe- or comma-separated">
            <TextInput
              name="aliases"
              placeholder="EBIT | Engineering | Built Environment"
              value={formData.aliases}
              onChange={handleChange}
            />
          </Field>
        </div>

        <Field label="Notes">
          <TextArea
            name="notes"
            placeholder="Editorial notes or clarifications"
            value={formData.notes}
            onChange={handleChange}
          />
        </Field>
      </div>
    </Dialog>
  );
}
