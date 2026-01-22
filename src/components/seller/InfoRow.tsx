export function InfoRow({ label, value }: { label: string; value?: string }) {
  if (!value) return null;

  return (
    <div className="flex justify-between gap-4">
      <span className="font-medium text-gray-800">{label}:</span>
      <span className="text-right">{value}</span>
    </div>
  );
}
