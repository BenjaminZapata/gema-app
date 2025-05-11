"use client";

import React, { useState } from "react";

export default function GastosPage() {
  const [loading, setLoading] = useState(false);

  return <>{loading ? <></> : <></>}</>;
}
