

 import { useEffect, useState } from "react";

function useFormattedDate(dateString: string) {
  const [formatted, setFormatted] = useState("");

  useEffect(() => {
    if (!dateString) return;
    const date = new Date(dateString);
    const formattedDate = date
      .toLocaleString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
      .replace(",", "");
    setFormatted(formattedDate);
  }, [dateString]);

  return formatted;
}



export default useFormattedDate