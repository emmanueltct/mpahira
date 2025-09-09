import React from "react";

// Input
const FormInput = React.forwardRef<HTMLInputElement, any>(
  ({ label, error, ...props }, ref) => (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <input ref={ref} {...props} className="w-full border rounded-md p-2" />
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  )
);
FormInput.displayName = "FormInput";

// Select
const FormSelect = React.forwardRef<HTMLSelectElement, any>(
  ({ label, error, children, ...props }, ref) => (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <select ref={ref} {...props} className="w-full border rounded-md p-2">
        {children}
      </select>
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  )
);
FormSelect.displayName = "FormSelect";

// Textarea
const FormTextarea = React.forwardRef<HTMLTextAreaElement, any>(
  ({ label, error, ...props }, ref) => (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <textarea ref={ref} {...props} className="w-full border rounded-md p-2" />
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  )
);
FormTextarea.displayName = "FormTextarea";

// Checkbox
const FormCheckbox = React.forwardRef<HTMLInputElement, any>(
  ({ label, ...props }, ref) => (
    <label className="flex items-center gap-2">
      <input ref={ref} type="checkbox" {...props} />
      {label}
    </label>
  )
);
FormCheckbox.displayName = "FormCheckbox";

// File input
const FormFile = React.forwardRef<HTMLInputElement, any>(
  ({ label, ...props }, ref) => (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <input ref={ref} type="file" {...props} className="w-full border rounded-md p-2" />
    </div>
  )
);
FormFile.displayName = "FormFile";

export { FormInput, FormSelect, FormTextarea, FormCheckbox, FormFile };
