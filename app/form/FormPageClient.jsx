"use client";

import dynamic from "next/dynamic";

const FormPage = dynamic(
  () => import("../../components/features/FormPage.jsx"),
  {
    ssr: false,
    loading: () => <div>Loading...</div>,
  }
);

export default FormPage;
