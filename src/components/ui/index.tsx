// Barrel exports for the UI primitives.
// Pages should import from `@/components/ui`:
//   import { Button, Card, Input } from "@/components/ui";
//
// This barrel is .tsx because some exports include JSX-inferred types
// (forwardRef components) — using .ts loses the JSX context.

export { Button, buttonVariants, type ButtonProps } from "./button";
export { IconButton, type IconButtonProps } from "./icon-button";
export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardBody,
  CardFooter,
} from "./card";
export { Input, Textarea, Select, Checkbox, type CheckboxProps } from "./input";
export { Field, type FieldProps } from "./field";
export { Badge, type BadgeProps } from "./badge";
export { Dialog, type DialogProps } from "./dialog";
