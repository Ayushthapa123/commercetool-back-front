"use client";

import { submitTestFormAction } from "@/actions/submitTestFormAction";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

export default function TestPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await submitTestFormAction(formData);
      if (response.error) {
        setError(response.error);
        setSuccess(false);
      } else if (response.success) {
        setSuccess(true);
        console.log("Response:", response.data);
      }

      // Reset form
      setFormData({ name: "", email: "", message: "" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit form");
      console.error("Error submitting form:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="container mx-auto max-w-2xl p-8">
      <h1 className="mb-6 text-3xl font-bold">Test Page</h1>


      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Enter your name"
          />
        </div>

        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="Enter your email"
          />
        </div>

        <div>
          <Label htmlFor="message">Message</Label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            placeholder="Enter your message"
            className="flex min-h-[80px] w-full rounded-xs border border-neutral-200 bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none placeholder:text-neutral-500 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:border-neutral-800 dark:bg-neutral-200/30 dark:dark:bg-neutral-800/30 dark:placeholder:text-neutral-400"
            rows={4}
          />
        </div>

        {error && (
          <div className="rounded border border-red-200 bg-red-50 p-3 text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="rounded border border-green-200 bg-green-50 p-3 text-green-700">
            Form submitted successfully!
          </div>
        )}

        <Button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Submit"}
        </Button>
      </form>
    </div>
  );
}
