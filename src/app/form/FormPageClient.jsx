"use client";

import dynamic from "next/dynamic";

const FormPage = dynamic(() => import("../../components/form/FormPage.jsx"), {
  ssr: false,
  loading: () => <div>Loading...</div>,
});

export default FormPage;
