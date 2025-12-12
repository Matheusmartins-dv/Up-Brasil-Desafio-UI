import { redirect } from "next/navigation";
import React from "react";

export default function Home() {
  redirect("/User/SignIn");

  return null;
}
