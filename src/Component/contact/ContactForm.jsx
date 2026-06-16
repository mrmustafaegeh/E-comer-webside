"use client";

import { useState } from "react";
import { post } from "../../services/api";
import { Loader2 } from "lucide-react";
import {
  Button,
  Input,
  Textarea,
  Alert,
  FormField,
  FormActions,
} from "../ui/primitives";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    try {
      await post("/contact", formData);
      setStatus("success");
      setFormData({ name: "", email: "", message: "" });
    } catch (err) {
      console.error(err);
      setStatus("error");
      setErrorMsg(err?.message || "Something went wrong. Please try again.");
    }
  };

  if (status === "success") {
    return (
      <Alert variant="success" className="text-center">
        <p className="font-medium">Message sent</p>
        <p className="mt-1 text-sm opacity-90">
          Thanks for reaching out. We will reply within 24 hours.
        </p>
        <Button variant="secondary" className="mt-4" onClick={() => setStatus("idle")}>
          Send another message
        </Button>
      </Alert>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {status === "error" && <Alert variant="error">{errorMsg}</Alert>}

      <FormField label="Name" htmlFor="contact-name">
        <Input
          id="contact-name"
          placeholder="Your name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </FormField>

      <FormField label="Email" htmlFor="contact-email">
        <Input
          id="contact-email"
          type="email"
          placeholder="you@example.com"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
      </FormField>

      <FormField label="Message" htmlFor="contact-message">
        <Textarea
          id="contact-message"
          placeholder="Tell us how we can help…"
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          required
          className="min-h-[140px]"
        />
      </FormField>

      <FormActions className="border-0 pt-2">
        <Button type="submit" disabled={status === "loading"} className="w-full py-3 sm:w-auto">
          {status === "loading" ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Sending…
            </>
          ) : (
            "Send message"
          )}
        </Button>
      </FormActions>
    </form>
  );
}
